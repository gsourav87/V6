import { useEffect, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { NavBar } from "@/components/NavBar";
import { ShareButton } from "@/components/ShareButton";
import { TelegramCTA } from "@/components/TelegramCTA";
import { applyPageSEO, injectSchema, removeSchema, SITE_URL } from "@/lib/seo";
import { getFestivalDetail, getCategoryLabel } from "@/lib/festival-details";
import { getUpcomingDatesForSlug } from "@/lib/festivals";
import { getObservanceDatesForSlug } from "@/lib/observances";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toBengaliDate, toBengaliNumerals, BN_MONTH_SLUG } from "@/lib/bengali-calendar";
import { ArrowLeft, ExternalLink, Calendar, CalendarDays } from "lucide-react";


function DateCard({ date }: { date: string }) {
  const d = new Date(date + "T00:00:00Z");
  const bn = toBengaliDate(d);
  const isUpcoming = d >= new Date(new Date().toDateString());
  const daysLeft = Math.round((d.getTime() - new Date().setHours(0,0,0,0)) / 86400000);

  return (
    <div className={cn(
      "bg-card border rounded-xl p-4 flex items-center justify-between gap-3",
      isUpcoming && daysLeft === 0
        ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
        : "border-border"
    )}>
      <div className="flex items-center gap-3">
        <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
        <div>
          <div className="font-bengali font-semibold text-foreground text-sm">
            {toBengaliNumerals(bn.day)} {bn.monthNameBn} {toBengaliNumerals(bn.year)}
          </div>
          <div className="text-xs text-muted-foreground">{format(d, "d MMMM yyyy")}</div>
        </div>
      </div>
      {daysLeft === 0 && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bengali font-semibold">আজ</span>}
      {daysLeft > 0 && <span className="text-xs text-muted-foreground font-bengali">{toBengaliNumerals(daysLeft)} দিন বাকি</span>}
    </div>
  );
}

export default function FestivalPage() {
  const [, params] = useRoute("/festival/:slug");
  const slug = params?.slug ?? "";
  const detail = getFestivalDetail(slug);

  const upcomingDates = detail
    ? [...getUpcomingDatesForSlug(slug, new Date(), 6), ...getObservanceDatesForSlug(slug, new Date(), 6)]
        .filter((f, i, arr) => arr.findIndex(x => x.date === f.date) === i) // dedupe dates
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 6)
    : [];

  // Derive unique Bengali month links from upcoming dates (up to 2)
  const monthLinks = useMemo(() => {
    const seen = new Set<string>();
    return upcomingDates
      .map(f => {
        const d = new Date(f.date + "T00:00:00Z");
        const bn = toBengaliDate(d);
        const monthSlug = BN_MONTH_SLUG[bn.monthNameBn];
        const gregYear = d.getUTCFullYear();
        if (!monthSlug) return null;
        const key = `${monthSlug}/${gregYear}`;
        if (seen.has(key)) return null;
        seen.add(key);
        return { monthSlug, gregYear, nameBn: bn.monthNameBn };
      })
      .filter(Boolean)
      .slice(0, 2) as { monthSlug: string; gregYear: number; nameBn: string }[];
  }, [upcomingDates]);

  const SCHEMA_ID = `festival-${slug}-schema`;

  useEffect(() => {
    if (!detail) return;

    applyPageSEO({
      title: `${detail.nameBn} ${new Date().getFullYear()} — তারিখ, ইতিহাস ও তাৎপর্য | সঠিক বাংলা ক্যালেন্ডার`,
      description: `${detail.tagline}। ${detail.descBn[0].slice(0, 120)}…`,
      path: `/festival/${slug}`,
      schemaId: SCHEMA_ID,
      schema: upcomingDates.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": detail.nameEn,
        "alternateName": detail.nameBn,
        "description": detail.descBn[0],
        "url": `${SITE_URL}/festival/${slug}`,
        "startDate": upcomingDates[0]?.date,
        "inLanguage": "bn",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "organizer": { "@type": "Organization", "name": "সঠিক বাংলা ক্যালেন্ডার", "url": SITE_URL },
      } : undefined,
    });

    injectSchema(`festival-${slug}-breadcrumb`, {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "সঠিক বাংলা ক্যালেন্ডার", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": detail.nameBn, "item": `${SITE_URL}/festival/${slug}` },
      ],
    });

    return () => {
      removeSchema(SCHEMA_ID);
      removeSchema(`festival-${slug}-breadcrumb`);
    };
  }, [slug, detail]);

  if (!detail) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center font-bengali">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">উৎসব পাওয়া যায়নি</h1>
          <p className="text-muted-foreground mb-6">এই উৎসবের তথ্য এখনও যোগ করা হয়নি।</p>
          <Link href="/" className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold">
            ক্যালেন্ডারে ফিরুন
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <NavBar />

      {/* Hero header */}
      <div className={cn("bg-gradient-to-br text-white py-10 px-4", detail.headerGradient)}>
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bengali">ক্যালেন্ডারে ফিরুন</span>
          </Link>

          <div className="text-6xl mb-3">{detail.icon}</div>
          <h1 className="text-3xl sm:text-4xl font-bold font-bengali leading-tight">{detail.nameBn}</h1>
          <p className="text-white/80 font-bengali mt-2 text-sm sm:text-base leading-relaxed">{detail.tagline}</p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className={cn("text-xs font-bengali font-semibold px-3 py-1 rounded-full bg-white/20")}>
              {getCategoryLabel(detail.category)}
            </span>
            <a
              href={detail.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Wikipedia
            </a>
            <ShareButton variant="compact" text={`🎉 ${detail.nameBn}\n${detail.tagline}`} />
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-8 space-y-8">

        {/* Description */}
        <section>
          <h2 className="font-bold font-bengali text-xl mb-4">পরিচয় ও তাৎপর্য</h2>
          <div className="space-y-3">
            {detail.descBn.map((para, i) => (
              <p key={i} className="font-bengali text-foreground/90 leading-relaxed text-sm sm:text-base">
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* Upcoming dates */}
        {upcomingDates.length > 0 && (
          <section>
            <h2 className="font-bold font-bengali text-xl mb-4">আসন্ন তারিখ</h2>
            <div className="space-y-2">
              {upcomingDates.map(f => (
                <DateCard key={f.date} date={f.date} />
              ))}
            </div>
          </section>
        )}

        {/* Related festivals */}
        {detail.relatedSlugs.length > 0 && (
          <section>
            <h2 className="font-bold font-bengali text-xl mb-4">সম্পর্কিত উৎসব</h2>
            <div className="flex flex-wrap gap-2">
              {detail.relatedSlugs.map(rs => {
                const r = getFestivalDetail(rs);
                if (!r) return null;
                return (
                  <Link
                    key={rs}
                    href={`/festival/${rs}`}
                    className="inline-flex items-center gap-1.5 bg-accent hover:bg-primary hover:text-primary-foreground text-accent-foreground px-4 py-2 rounded-full text-sm font-bengali font-medium transition-colors"
                  >
                    <span>{r.icon}</span>
                    <span>{r.nameBn}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Telegram channel CTA */}
        <TelegramCTA />

        {/* Internal nav */}
        <section className="border-t border-border pt-6">
          <div className="flex flex-wrap gap-3 font-bengali text-sm">
            <Link href="/" className="text-primary hover:underline">📅 ক্যালেন্ডার</Link>
            <Link href="/panjika" className="text-primary hover:underline">📖 পঞ্জিকা</Link>
            <Link href="/today-bengali-date" className="text-primary hover:underline">🗓 আজকের তারিখ</Link>
            {monthLinks.map(ml => (
              <Link
                key={`${ml.monthSlug}/${ml.gregYear}`}
                href={`/month/${ml.monthSlug}/${ml.gregYear}`}
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                {ml.nameBn} {ml.gregYear} ক্যালেন্ডার
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
