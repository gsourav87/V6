// Article reader-count. Backed by Firestore (collection: articleViews),
// same service-account credential already used for push notifications.
// Web-standard handler (runtime-agnostic).
//
//   GET  /api/article-views?slugs=a,b,c   -> { a: 12, b: 0, c: 5 }
//   POST /api/article-views  { slug }     -> { count: 13 }   (increments by 1)
import { fsGetViewCounts, fsIncrementView } from "../src/server/google";

const CORS = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const slugs = (url.searchParams.get("slugs") || "").split(",").map(s => s.trim()).filter(Boolean);
      const counts = await fsGetViewCounts(slugs);
      return new Response(JSON.stringify(counts), { status: 200, headers: CORS });
    }

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({} as any));
      const slug = body.slug as string | undefined;
      if (!slug) return new Response(JSON.stringify({ error: "missing slug" }), { status: 400, headers: CORS });
      const count = await fsIncrementView(slug);
      return new Response(JSON.stringify({ count }), { status: 200, headers: CORS });
    }

    return new Response(JSON.stringify({ error: "method not allowed" }), { status: 405, headers: CORS });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 500, headers: CORS });
  }
}

export const config = { runtime: "edge" };
