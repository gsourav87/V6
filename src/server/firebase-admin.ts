// Server-only Firebase Admin init (used by the /api push functions).
// Not imported by any client code, so it never reaches the browser bundle.
import admin from "firebase-admin";

let _app: admin.app.App | null = null;

function getAdmin(): admin.app.App {
  if (_app) return _app;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT env var is missing");
  // Accept either raw JSON or base64-encoded JSON.
  let json: string;
  try { json = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8"); }
  catch { json = raw; }
  const serviceAccount = JSON.parse(json);
  _app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  return _app;
}

export function db() { return getAdmin().firestore(); }
export function messaging() { return getAdmin().messaging(); }
