// Facebook Graph API poster — Web-standard (fetch only), so it runs equally
// well from the GitHub Actions cron script (Node/tsx) or, later, a Vercel
// API route if one is ever added.

const GRAPH_VERSION = "v20.0";

export interface FbPostResult {
  ok: boolean;
  id?: string;
  error?: string;
}

/** Publishes a text (optionally link-attached) post to a Facebook Page's feed. */
export async function fbPostText(
  pageId: string,
  accessToken: string,
  message: string,
  link?: string
): Promise<FbPostResult> {
  const params = new URLSearchParams({ message, access_token: accessToken });
  if (link) params.set("link", link);

  const r = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const data: any = await r.json().catch(() => ({}));
  if (!r.ok) return { ok: false, error: JSON.stringify(data?.error ?? data) };
  return { ok: true, id: data.id };
}
