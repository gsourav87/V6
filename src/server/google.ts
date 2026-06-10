// Server-only Google helpers via REST (no firebase-admin — which breaks under
// ESM bundling on Vercel). Handles: service-account OAuth token, Firestore CRUD,
// and FCM HTTP v1 send. Pure fetch + node crypto, ESM-safe.
import crypto from "node:crypto";

interface ServiceAccount {
  client_email: string;
  private_key: string;
  project_id: string;
}

function getServiceAccount(): ServiceAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT missing");
  const json = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
  const sa = JSON.parse(json) as ServiceAccount;
  sa.private_key = sa.private_key.replace(/\\n/g, "\n"); // tolerate escaped newlines
  return sa;
}

const b64url = (b: Buffer | string) => Buffer.from(b).toString("base64url");

// ── OAuth2 access token (cached until shortly before expiry) ─────────────────
let _token: { value: string; exp: number } | null = null;

export async function getAccessToken(): Promise<string> {
  if (_token && Date.now() < _token.exp - 60_000) return _token.value;
  const sa = getServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const signed = crypto.createSign("RSA-SHA256").update(`${header}.${claims}`).sign(sa.private_key);
  const jwt = `${header}.${claims}.${b64url(signed)}`;

  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error("oauth token failed: " + JSON.stringify(data));
  _token = { value: data.access_token, exp: Date.now() + data.expires_in * 1000 };
  return _token.value;
}

export function projectId(): string {
  return getServiceAccount().project_id;
}

// ── Firestore REST (collection: pushTokens) ─────────────────────────────────
function fsBase() {
  return `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents`;
}

export async function fsSetToken(docId: string, token: string, ua: string): Promise<void> {
  const at = await getAccessToken();
  await fetch(`${fsBase()}/pushTokens/${docId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${at}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        token: { stringValue: token },
        ua: { stringValue: ua || "" },
        updatedAt: { integerValue: String(Date.now()) },
      },
    }),
  });
}

export async function fsListTokens(): Promise<Array<{ id: string; token: string }>> {
  const at = await getAccessToken();
  const out: Array<{ id: string; token: string }> = [];
  let pageToken = "";
  do {
    const url = `${fsBase()}/pushTokens?pageSize=300${pageToken ? `&pageToken=${pageToken}` : ""}`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${at}` } });
    const data = await r.json();
    for (const doc of data.documents || []) {
      const id = String(doc.name).split("/").pop()!;
      const token = doc.fields?.token?.stringValue;
      if (token) out.push({ id, token });
    }
    pageToken = data.nextPageToken || "";
  } while (pageToken);
  return out;
}

export async function fsDeleteToken(docId: string): Promise<void> {
  const at = await getAccessToken();
  await fetch(`${fsBase()}/pushTokens/${docId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${at}` },
  }).catch(() => {});
}

// ── FCM HTTP v1 send (one token per call) ───────────────────────────────────
export async function fcmSend(
  token: string,
  msg: { title: string; body: string; link: string }
): Promise<{ ok: boolean; unregistered: boolean }> {
  const at = await getAccessToken();
  const r = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId()}/messages:send`, {
    method: "POST",
    headers: { Authorization: `Bearer ${at}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: {
        token,
        data: { title: msg.title, body: msg.body, link: msg.link },
        webpush: { headers: { Urgency: "high" }, fcm_options: { link: msg.link } },
      },
    }),
  });
  if (r.ok) return { ok: true, unregistered: false };
  const err = await r.json().catch(() => ({}));
  const status = err?.error?.details?.[0]?.errorCode || err?.error?.status || "";
  const unregistered = r.status === 404 || String(status).includes("UNREGISTERED");
  return { ok: false, unregistered };
}
