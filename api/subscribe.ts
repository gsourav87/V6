// Stores an FCM web-push token in Firestore. Web-standard handler (runtime-agnostic).
import { sha256Hex, fsSetToken } from "../src/server/google";

const CORS = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "method not allowed" }), { status: 405, headers: CORS });

  try {
    const body = await req.json().catch(() => ({} as any));
    const token = body.token as string | undefined;
    if (!token) return new Response(JSON.stringify({ error: "missing token" }), { status: 400, headers: CORS });

    const id = await sha256Hex(token);
    await fsSetToken(id, token, body.ua || "");
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: CORS });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 500, headers: CORS });
  }
}

export const config = { runtime: "edge" };
