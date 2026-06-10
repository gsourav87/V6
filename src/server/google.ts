// Server-only Google helpers via REST, written to be RUNTIME-AGNOSTIC
// (works on both Vercel Node and Edge): only Web APIs + Web Crypto, no
// node:crypto / Buffer / firebase-admin. Handles service-account OAuth,
// Firestore CRUD, and FCM HTTP v1 send.

interface ServiceAccount {
  client_email: string;
  private_key: string;
  project_id: string;
}

function getServiceAccount(): ServiceAccount {
  const raw = (globalThis as any).process?.env?.FIREBASE_SERVICE_ACCOUNT as string | undefined;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT missing");
  const json = raw.trim().startsWith("{") ? raw : atob(raw);
  const sa = JSON.parse(json) as ServiceAccount;
  sa.private_key = sa.private_key.replace(/\\n/g, "\n");
  return sa;
}

// ── base64url / bytes helpers (no Buffer) ────────────────────────────────────
function bytesToB64url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function strToB64url(s: string): string {
  return bytesToB64url(new TextEncoder().encode(s));
}
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── OAuth2 access token (cached) ─────────────────────────────────────────────
let _token: { value: string; exp: number } | null = null;

export async function getAccessToken(): Promise<string> {
  if (_token && Date.now() < _token.exp - 60_000) return _token.value;
  const sa = getServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  const header = strToB64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = strToB64url(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(`${header}.${claims}`));
  const jwt = `${header}.${claims}.${bytesToB64url(new Uint8Array(sigBuf))}`;

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

function projectId(): string { return getServiceAccount().project_id; }
function fsBase(): string {
  return `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents`;
}

// ── Firestore REST (collection: pushTokens) ─────────────────────────────────
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
  await fetch(`${fsBase()}/pushTokens/${docId}`, { method: "DELETE", headers: { Authorization: `Bearer ${at}` } }).catch(() => {});
}

// ── FCM HTTP v1 send ────────────────────────────────────────────────────────
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
  const err = await r.json().catch(() => ({} as any));
  const status = err?.error?.details?.[0]?.errorCode || err?.error?.status || "";
  return { ok: false, unregistered: r.status === 404 || String(status).includes("UNREGISTERED") };
}
