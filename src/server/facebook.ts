// Facebook Graph API poster — Web-standard (fetch only), so it runs equally
// well from the GitHub Actions cron script (Node/tsx) or, later, a Vercel
// API route if one is ever added.

const GRAPH_VERSION = "v20.0";

export interface FbPostResult {
  ok: boolean;
  id?: string;
  error?: string;
}

/**
 * Publishes a text (optionally link-attached) post to a Facebook Page's feed.
 * Retries transient failures (network errors, 5xx, or Graph API's own
 * is_transient flag) with backoff — fails fast on permanent errors (bad
 * token, permission denied) since retrying those wastes time for nothing.
 */
export async function fbPostText(
  pageId: string,
  accessToken: string,
  message: string,
  link?: string,
  attempts = 3
): Promise<FbPostResult> {
  const params = new URLSearchParams({ message, access_token: accessToken });
  if (link) params.set("link", link);

  let lastError = "unknown error";
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const r = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/feed`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
        signal: AbortSignal.timeout(15000),
      });
      const data: any = await r.json().catch(() => ({}));
      if (r.ok) return { ok: true, id: data.id };

      lastError = JSON.stringify(data?.error ?? data);
      const transient = data?.error?.is_transient === true || r.status >= 500;
      if (!transient || attempt === attempts) return { ok: false, error: lastError };
    } catch (err) {
      lastError = (err as Error).message;
      if (attempt === attempts) return { ok: false, error: lastError };
    }
    await new Promise(res => setTimeout(res, attempt * 5000)); // 5s, then 10s
  }
  return { ok: false, error: lastError };
}
