import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import { NavBar } from "@/components/NavBar";
import { FESTIVALS, type Festival } from "@/lib/festivals";
import { getCategoryLabel } from "@/lib/festival-details";
import { toBengaliDate, toBengaliNumerals } from "@/lib/bengali-calendar";
import { applyPageSEO, injectSchema, removeSchema, SITE_URL } from "@/lib/seo";

const GREG_MONTHS_BN = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

function monthLabelBn(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return `${GREG_MONTHS_BN[m - 1]} ${y}`;
}

export default function FestivalsPage() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const year = new Date().getFullYear();

  // Next ~14 months of festivals, deduplicated by slug+date (a few dates
  // carry both a static entry and a recurring-observance entry).
  const upcoming = useMemo(() => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() + 14);
    const cutoffIso = cutoff.toISOString().slice(0, 10);
    const seen = new Set<string>();
    return FESTIVALS
      .filter(f => f.date >= today && f.date <= cutoffIso)
      .filter(f => {
        const key = `${f.date}|${f.slug ?? f.nameBn}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [today]);

  const grouped = useMemo(() => {
    const map = new Map<string, Festival[]>();
    for (const f of upcoming) {
      const key = monthKey(f.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    }
    return [...map.entries()];
  }, [upcoming]);

  const title = `বাংলা উৎসব ক্যালেন্ডার ${year} — সব পূজা ও উৎসবের তারিখ | সঠিক বাংলা ক্যালেন্ডার`;
  const description = `${year}-${year + 1} সালের সমস্ত বাংলা উৎসব, পূজা ও জাতীয় দিবসের সম্পূর্ণ তালিকা ও তারিখ — দুর্গাপূজা, কালীপূজা, সরস্বতী পূজা, পয়লা বৈশাখ থেকে শুরু করে সব প্রধান উৎসব একসাথে।`;

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "name": title,
          "description": description,
          "url": `${SITE_URL}/festivals`,
          "inLanguage": "bn",
          "isPartOf": { "@type": "WebSite", "url": SITE_URL, "name": "সঠিক বাংলা ক্যালেন্ডার" },
        },
        {
          "@type": "ItemList",
          "itemListElement": upcoming.slice(0, 30).map((f, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": f.nameBn,
            "item": f.slug ? `${SITE_URL}/festival/${f.slug}` : undefined,
          })),
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "সঠিক বাংলা ক্যালেন্ডার", "item": SITE_URL },
            { "@type": "ListItem", "position": 2, "name": "উৎসব ক্যালেন্ডার", "item": `${SITE_URL}/festivals` },
          ],
        },
      ],
    };
    applyPageSEO({ title, description, path: "/festivals", schemaId: "festivals-list-schema", schema });
    return () => removeSchema("festivals-list-schema");
  }, [title, description, upcoming]);

  return (
    <div className="min-h-screen pb-20">
      <NavBar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-6">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground font-bengali">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link href="/" className="hover:text-foreground transition-colors">হোম</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-semibold">উৎসব ক্যালেন্ডার</li>
          </ol>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 font-bengali">
          বাংলা উৎসব ক্যালেন্ডার {toBengaliNumerals(year)}
        </h1>
        <p className="text-foreground/80 font-bengali leading-relaxed mb-8 text-sm sm:text-base">
          দুর্গাপূজা, কালীপূজা, সরস্বতী পূজা, পয়লা বৈশাখ থেকে শুরু করে বাংলার সমস্ত প্রধান পূজা, উৎসব ও
          জাতীয় দিবসের সম্পূর্ণ তালিকা — আগামী ১৪ মাসের জন্য, তারিখ অনুযায়ী সাজানো। প্রতিটি উৎসবে ক্লিক
          করে বিস্তারিত ইতিহাস, তাৎপর্য ও নির্ঘণ্ট দেখুন।
        </p>

        <div className="space-y-8">
          {grouped.map(([key, fests]) => (
            <section key={key}>
              <h2 className="text-lg font-bold text-foreground font-bengali mb-3 pb-2 border-b border-border">
                {monthLabelBn(fests[0].date)}
              </h2>
              <div className="space-y-2">
                {fests.map((f, i) => {
                  const bn = toBengaliDate(new Date(f.date + "T00:00:00Z"));
                  const row = (
                    <div className="flex items-center gap-3">
                      <div className="w-14 shrink-0 text-center">
                        <div className="text-lg font-bold text-primary">{toBengaliNumerals(Number(f.date.slice(8, 10)))}</div>
                        <div className="text-[10px] text-muted-foreground font-bengali">{toBengaliNumerals(bn.day)} {bn.monthNameBn}</div>
                      </div>
                      <div className="text-xl shrink-0">{f.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bengali font-semibold text-foreground text-sm truncate">{f.nameBn}</div>
                        <div className="text-[11px] text-muted-foreground font-bengali">{getCategoryLabel(f.category)}</div>
                      </div>
                    </div>
                  );
                  return f.slug ? (
                    <Link
                      key={`${f.date}-${i}`}
                      href={`/festival/${f.slug}`}
                      className="block bg-card hover:bg-accent border border-card-border rounded-xl p-3 transition-colors"
                    >
                      {row}
                    </Link>
                  ) : (
                    <div key={`${f.date}-${i}`} className="bg-card/50 border border-border rounded-xl p-3">
                      {row}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 bg-card border border-border rounded-2xl p-5 text-sm font-bengali space-y-4 text-foreground">
          <h2 className="font-bold text-foreground text-base">প্রশ্ন ও উত্তর</h2>
          <div>
            <p className="font-semibold text-foreground">এই তালিকায় কোন কোন উৎসব আছে?</p>
            <p className="mt-1 text-muted-foreground">
              দুর্গাপূজা, কালীপূজা, সরস্বতী পূজা, লক্ষ্মী পূজা, জগদ্ধাত্রী পূজা, বিশ্বকর্মা পূজা, রথযাত্রা, দোলযাত্রা,
              পয়লা বৈশাখ সহ বাংলার সমস্ত প্রধান ধর্মীয়, সাংস্কৃতিক ও জাতীয় দিবস এই তালিকায় অন্তর্ভুক্ত।
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground">তারিখগুলো কীভাবে গণনা করা হয়েছে?</p>
            <p className="mt-1 text-muted-foreground">
              বিশুদ্ধ সিদ্ধান্ত পদ্ধতি অনুযায়ী কলকাতার স্থানীয় সূর্যোদয়ের সময় ভিত্তি করে এবং প্রকাশিত পঞ্জিকার
              সাথে যাচাই করে এই তারিখগুলো নির্ধারণ করা হয়েছে।
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm font-bengali">
          <Link href="/" className="text-primary hover:underline">📅 বাংলা ক্যালেন্ডার</Link>
          <Link href="/panjika" className="text-primary hover:underline">📖 আজকের পঞ্জিকা</Link>
          <Link href="/today-bengali-date" className="text-primary hover:underline">🗓 আজকের বাংলা তারিখ</Link>
        </div>
      </main>
    </div>
  );
}
