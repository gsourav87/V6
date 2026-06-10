// Vercel Node function — stores an FCM web-push token in Firestore (REST).
import crypto from "node:crypto";
import { fsSetToken } from "../src/server/google";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const token = body.token as string | undefined;
    if (!token) return res.status(400).json({ error: "missing token" });

    const id = crypto.createHash("sha256").update(token).digest("hex");
    await fsSetToken(id, token, body.ua || "");
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
