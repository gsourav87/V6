import { useQuery } from "@tanstack/react-query";

/**
 * Read-only view counts for a set of article slugs (for cards/listings).
 * Fails silently to `{}` — a missing count should never break a page,
 * it just means the badge doesn't render for that card.
 */
export function useArticleViews(slugs: string[]) {
  const key = [...slugs].sort().join(",");
  const { data } = useQuery<Record<string, number>>({
    queryKey: ["article-views", key],
    queryFn: async () => {
      const r = await fetch(`/api/article-views?slugs=${encodeURIComponent(key)}`);
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    },
    enabled: slugs.length > 0,
    staleTime: 2 * 60_000,
    retry: false,
  });
  return data ?? {};
}

// Guards against React StrictMode's dev-only double effect-invocation firing
// two POSTs before the first one has a chance to write to sessionStorage.
const inFlight = new Set<string>();

/**
 * Records one view for `slug` (once per browser session) and resolves to the
 * current reader count either way. Never throws — a failed count shouldn't
 * block rendering the article.
 */
export async function registerArticleView(slug: string): Promise<number | undefined> {
  const key = `viewed:${slug}`;
  const alreadyCounted = sessionStorage.getItem(key) || inFlight.has(slug);
  inFlight.add(slug);
  try {
    if (alreadyCounted) {
      const r = await fetch(`/api/article-views?slugs=${encodeURIComponent(slug)}`);
      if (!r.ok) return undefined;
      const data = await r.json();
      return data[slug];
    }
    const r = await fetch("/api/article-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (!r.ok) return undefined;
    sessionStorage.setItem(key, "1");
    const data = await r.json();
    return data.count;
  } catch {
    return undefined;
  }
}
