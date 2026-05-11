// Vercel Edge Function — proxies multiple Bengali RSS feeds, merges and deduplicates items.
const SOURCES = [
  "https://feeds.bbci.co.uk/bengali/rss.xml",
  "https://www.anandabazar.com/rss/rss_national.xml",
];

export default async function handler(): Promise<Response> {
  const results = await Promise.allSettled(
    SOURCES.map(url =>
      fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; BengaliCalendar/1.0)" },
        signal: AbortSignal.timeout(8000),
      }).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
    )
  );

  const allItems: string[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      const items = r.value.match(/<item[\s>][\s\S]*?<\/item>/g) ?? [];
      allItems.push(...items);
    }
  }

  // Deduplicate by first 60 chars of title (case-insensitive, whitespace-normalised)
  const seen = new Set<string>();
  const unique = allItems.filter(item => {
    const raw = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1] ?? "";
    const key = raw.replace(/\s+/g, " ").trim().slice(0, 60).toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const body = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">`,
    `<channel><title>Bengali News</title>`,
    unique.join("\n"),
    `</channel></rss>`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=900, s-maxage=900",
    },
  });
}

export const config = { runtime: "edge" };
