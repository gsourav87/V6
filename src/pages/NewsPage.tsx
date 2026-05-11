import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { NavBar } from "@/components/NavBar";
import { applyPageSEO, removeSchema, SITE_URL } from "@/lib/seo";
import { RefreshCw } from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  thumbnail: string;
}

function parseRSSXml(xml: string): NewsItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  if (doc.querySelector("parsererror")) return [];

  return Array.from(doc.querySelectorAll("item")).map(item => {
    const text = (sel: string) =>
      item.querySelector(sel)?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, "").trim() ?? "";

    // thumbnail: try media:thumbnail, enclosure, or first img in description
    const mediaThumb =
      item.querySelector("thumbnail")?.getAttribute("url") ??
      item.querySelector("enclosure")?.getAttribute("url") ??
      "";
    const descRaw = text("description");
    const imgMatch = descRaw.match(/<img[^>]+src=["']([^"']+)["']/i);
    const thumbnail = mediaThumb || (imgMatch ? imgMatch[1] : "");

    return {
      title:       text("title"),
      link:        text("link") || item.querySelector("link")?.getAttribute("href") || "",
      description: descRaw.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim(),
      pubDate:     text("pubDate"),
      thumbnail,
    };
  }).filter(i => i.title);
}

// Deduplicate by first 60 chars of title
function deduplicate(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = item.title.slice(0, 60).toLowerCase().replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchBengaliNews(): Promise<NewsItem[]> {
  const res = await fetch("/api/news");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  const items = parseRSSXml(xml);
  return deduplicate(items);
}

function NewsCard({ item }: { item: NewsItem }) {
  const pubDate = new Date(item.pubDate);
  const validDate = !isNaN(pubDate.getTime());

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 sm:gap-4 bg-card border border-border rounded-xl p-3 sm:p-4 hover:border-primary/40 hover:shadow-md transition-all group"
    >
      {item.thumbnail && (
        <img
          src={item.thumbnail}
          alt=""
          className="w-20 h-14 sm:w-28 sm:h-20 object-cover rounded-lg shrink-0 bg-muted"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      )}
      <div className="flex-1 min-w-0">
        <h2 className="font-bold font-bengali text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-1 text-sm sm:text-base">
          {item.title}
        </h2>
        {item.description && (
          <p className="text-xs sm:text-sm text-muted-foreground font-bengali line-clamp-2 mb-2 leading-relaxed">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-red-600 dark:text-red-400">BBC বাংলা</span>
          {validDate && (
            <>
              <span>·</span>
              <span>{format(pubDate, "d MMM, HH:mm")}</span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div className="flex gap-4 bg-card border border-border rounded-xl p-4 animate-pulse">
      <div className="w-24 h-16 bg-muted rounded-lg shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
    </div>
  );
}

export default function NewsPage() {
  const { data: items, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["bengali-news"],
    queryFn: fetchBengaliNews,
    staleTime: 1000 * 60 * 15,
    retry: 2,
  });

  const SCHEMA_ID = "news-schema";

  useEffect(() => {
    applyPageSEO({
      title: "বাংলা সংবাদ — আজকের খবর | সঠিক বাংলা ক্যালেন্ডার",
      description: "BBC বাংলা থেকে সর্বশেষ বাংলা সংবাদ। রাজনীতি, খেলাধুলা, বিনোদন ও আন্তর্জাতিক সংবাদ।",
      path: "/news",
      schemaId: SCHEMA_ID,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "url": `${SITE_URL}/news`,
        "name": "বাংলা সংবাদ — আজকের খবর",
        "description": "BBC বাংলা থেকে সর্বশেষ বাংলা সংবাদ।",
        "inLanguage": "bn",
        "isPartOf": { "@type": "WebSite", "url": SITE_URL },
      },
    });
    return () => removeSchema(SCHEMA_ID);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-bengali flex items-center gap-2">
              <span>📰</span> বাংলা সংবাদ
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide">
                BBC বাংলা
              </span>
              <span className="text-muted-foreground text-sm font-bengali">— সর্বশেষ খবর</span>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bengali hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            রিফ্রেশ
          </button>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-8 text-center font-bengali">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-destructive font-bold text-lg mb-2">সংবাদ লোড করা যায়নি</p>
            <p className="text-sm text-muted-foreground mb-4">
              ইন্টারনেট সংযোগ পরীক্ষা করুন অথবা কিছুক্ষণ পর আবার চেষ্টা করুন।
            </p>
            <button
              onClick={() => refetch()}
              className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {items && items.length > 0 && (
          <div className="space-y-3">
            {items.map((item, idx) => <NewsCard key={idx} item={item} />)}
          </div>
        )}

        {items && items.length === 0 && (
          <div className="text-center py-16 font-bengali text-muted-foreground">
            এই মুহূর্তে কোনো সংবাদ পাওয়া যাচ্ছে না।
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8 font-bengali">
          সংবাদ সূত্র: BBC বাংলা। সর্বস্বত্ব সংরক্ষিত।
        </p>
      </div>
    </div>
  );
}
