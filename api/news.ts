// Vercel Edge Function — merges multiple Bengali RSS feeds.
// Sources tried in parallel; any that succeed contribute items.
const SOURCES = [
  // Google News Bengali — most reliable, no blocking
  "https://news.google.com/rss/search?q=%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE+%E0%A6%96%E0%A6%AC%E0%A6%B0&hl=bn-IN&gl=IN&ceid=IN:bn",
  // BBC Bengali
  "https://feeds.bbci.co.uk/bengali/rss.xml",
  // ABP Live Bangla
  "https://bengali.abplive.com/rss/news",
  // Anandabazar
  "https://www.anandabazar.com/rss/rss_national.xml",
];

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export default async function handler(): Promise<Response> {
  const results = await Promise.allSettled(
    SOURCES.map(url =>
      fetch(url, {
        headers: { "User-Agent": BROWSER_UA, "Accept": "application/rss+xml, application/xml, text/xml, */*" },
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
      const items = r.value.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
      allItems.push(...items);
    }
  }

  // Deduplicate by first 60 chars of title
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
      "X-Items-Count": String(unique.length),
    },
  });
}

export const config = { runtime: "edge" };
