// Diagnostic: self-contained, no imports. Confirms the function runtime itself works.
export default async function handler(): Promise<Response> {
  return new Response(JSON.stringify({ ok: true, ts: Date.now(), where: "ping" }), {
    headers: { "Content-Type": "application/json" },
  });
}
export const config = { runtime: "edge" };
