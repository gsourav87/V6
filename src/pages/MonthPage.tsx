import { useRoute, useLocation } from "wouter";
import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Download } from "lucide-react";
import { CalendarGrid } from "@/components/CalendarGrid";
import { MonthSpecialDays } from "@/components/MonthSpecialDays";
import { ShareButton } from "@/components/ShareButton";
import { toBengaliDate, toBengaliNumerals } from "@/lib/bengali-calendar";
import { FESTIVALS } from "@/lib/festivals";
import { applyPageSEO, injectSchema, removeSchema, SITE_URL } from "@/lib/seo";

// Slug → Bengali month index (0-based)
const MONTH_INDEX: Record<string, number> = {
  boishakh: 0, jaistha: 1, ashar: 2, shraban: 3,
  bhadra: 4, ashwin: 5, kartik: 6, agrohayon: 7,
  poush: 8, magh: 9, falgun: 10, chaitra: 11,
};

// Slug → Bengali name
const MONTH_BN: Record<string, string> = {
  boishakh: "বৈশাখ", jaistha: "জ্যৈষ্ঠ", ashar: "আষাঢ়", shraban: "শ্রাবণ",
  bhadra: "ভাদ্র", ashwin: "আশ্বিন", kartik: "কার্তিক", agrohayon: "অগ্রহায়ণ",
  poush: "পৌষ", magh: "মাঘ", falgun: "ফাল্গুন", chaitra: "চৈত্র",
};

// Slug → English name
const MONTH_EN: Record<string, string> = {
  boishakh: "Boishakh", jaistha: "Jaistha", ashar: "Ashar", shraban: "Shraban",
  bhadra: "Bhadra", ashwin: "Ashwin", kartik: "Kartik", agrohayon: "Agrohayon",
  poush: "Poush", magh: "Magh", falgun: "Falgun", chaitra: "Chaitra",
};

// Convert Gregorian year + Bengali month index to approximate Bengali year.
// Months 0–8 (Boishakh–Poush, Apr–Dec) → gregYear − 593
// Months 9–11 (Magh–Chaitra, Jan–Mar)  → gregYear − 594
function toBengaliYear(gregYear: number, monthIdx: number): number {
  return monthIdx <= 8 ? gregYear - 593 : gregYear - 594;
}

export default function MonthPage() {
  const [, params] = useRoute("/month/:month/:year");
  const [, navigate] = useLocation();

  const slug     = params?.month ?? "boishakh";
  const gregYear = Number(params?.year ?? new Date().getFullYear());

  const monthIndex = MONTH_INDEX[slug] ?? 0;
  const nameBn     = MONTH_BN[slug]    ?? "বৈশাখ";
  const nameEn     = MONTH_EN[slug]    ?? "Boishakh";
  const banglaYear = toBengaliYear(gregYear, monthIndex);

  const title = `${nameBn} ${toBengaliNumerals(banglaYear)} বাংলা ক্যালেন্ডার — তিথি, নক্ষত্র ও পঞ্জিকা`;
  const description = `${nameBn} ${toBengaliNumerals(banglaYear)} বঙ্গাব্দ (${nameEn} ${gregYear}) বাংলা ক্যালেন্ডার। এই মাসের সমস্ত তিথি, নক্ষত্র, উৎসব ও পঞ্জিকা তথ্য দেখুন।`;

  useEffect(() => {
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "সঠিক বাংলা ক্যালেন্ডার", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": `${nameBn} ${banglaYear} বঙ্গাব্দ`, "item": `${SITE_URL}/month/${slug}/${gregYear}` }
      ]
    };

    applyPageSEO({ title, description, path: `/month/${slug}/${gregYear}` });
    injectSchema("month-breadcrumb-schema", breadcrumb);

    return () => removeSchema("month-breadcrumb-schema");
  }, [title, description, slug, gregYear, nameBn, banglaYear]);

  const today = useMemo(() => new Date(), []);

  // Festivals that fall in this Bengali month — deduplicated by slug
  const monthFestivals = useMemo(() => {
    const seen = new Set<string>();
    return FESTIVALS.filter(f => {
      const d = new Date(f.date + "T00:00:00Z");
      const bn = toBengaliDate(d);
      if (bn.month !== monthIndex || bn.year !== banglaYear) return false;
      const key = f.slug ?? f.nameBn;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [monthIndex, banglaYear]);

  return (
    <div className="min-h-screen text-foreground px-4 py-10">
      <main className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground font-bengali">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link href="/" className="hover:text-foreground transition-colors">হোম</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-semibold">{nameBn} {toBengaliNumerals(banglaYear)}</li>
          </ol>
        </nav>

        {/* H1 — uses proper Bengali month name */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 font-bengali">
          {nameBn} {toBengaliNumerals(banglaYear)} বঙ্গাব্দ বাংলা ক্যালেন্ডার
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-6 font-bengali">
          {nameEn} {gregYear} · তিথি, নক্ষত্র ও সম্পূর্ণ পঞ্জিকা
        </p>

        {/* Actions — hidden when printing */}
        <div className="no-print flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bengali font-semibold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-sm"
          >
            <Download className="w-4 h-4" />
            PDF ডাউনলোড করুন
          </button>
          <ShareButton
            variant="compact"
            text={`📅 ${nameBn} ${toBengaliNumerals(banglaYear)} বঙ্গাব্দ বাংলা ক্যালেন্ডার — তিথি, নক্ষত্র ও পঞ্জিকা`}
          />
        </div>

        {/* Calendar grid — wrapped as the print area so PDF = just this calendar */}
        <div className="print-area rounded-2xl overflow-hidden">
          {/* Print-only header (branding + month) */}
          <div className="hidden print:block text-center mb-3 text-black">
            <div className="text-2xl font-bold font-bengali">
              {nameBn} {toBengaliNumerals(banglaYear)} বঙ্গাব্দ — বাংলা ক্যালেন্ডার
            </div>
            <div className="text-sm font-bengali">{nameEn} {gregYear} · সঠিক বাংলা ক্যালেন্ডার · sothikbanglacalendar.live</div>
          </div>
          <CalendarGrid
            year={banglaYear}
            month={monthIndex}
            todayDate={today}
            onDateClick={(date) =>
              navigate(`/date/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`)
            }
          />
        </div>

        {/* Special days this month (not part of the printable PDF) */}
        <div className="no-print mt-6">
          <MonthSpecialDays banglaYear={banglaYear} banglaMonth={monthIndex} />
        </div>

        {/* Rich SEO content */}
        <div className="mt-8 space-y-4 text-muted-foreground text-sm font-bengali leading-relaxed">
          <h2 className="text-lg font-bold text-foreground">
            {nameBn} {toBengaliNumerals(banglaYear)} বঙ্গাব্দ পঞ্জিকা
          </h2>
          <p>
            {nameBn} মাস বাংলা বর্ষপঞ্জির {monthIndex + 1} নম্বর মাস। এই মাসে সমস্ত তিথি, নক্ষত্র,
            যোগ ও করণের বিস্তারিত তথ্য উপরের ক্যালেন্ডারে দেখানো হয়েছে।
            যেকোনো তারিখে ক্লিক করলে সেই দিনের সম্পূর্ণ পঞ্জিকা দেখতে পাবেন।
          </p>
          <p>
            বিশুদ্ধ সিদ্ধান্ত পদ্ধতি অনুযায়ী কলকাতার সূর্যোদয়ের সময় অনুসারে এই ক্যালেন্ডার তৈরি করা হয়েছে।
          </p>

          {/* Festivals this month */}
          {monthFestivals.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-foreground mb-2">{nameBn} মাসের উৎসব</h3>
              <div className="flex flex-wrap gap-2">
                {monthFestivals.map(f =>
                  f.slug ? (
                    <Link
                      key={f.slug}
                      href={`/festival/${f.slug}`}
                      className="inline-flex items-center gap-1.5 bg-card hover:bg-accent border border-border text-foreground text-xs font-bengali font-medium px-3 py-1.5 rounded-full transition-colors"
                    >
                      <span>{f.icon}</span>
                      <span>{f.nameBn}</span>
                    </Link>
                  ) : (
                    <span key={f.nameBn} className="inline-flex items-center gap-1.5 bg-card border border-border text-foreground text-xs font-bengali font-medium px-3 py-1.5 rounded-full">
                      <span>{f.icon}</span>
                      <span>{f.nameBn}</span>
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* Navigation to adjacent months */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/" className="text-primary hover:text-primary transition-colors font-semibold">
              ← পূর্ণ ক্যালেন্ডারে ফিরুন
            </Link>
            <Link href="/today-bengali-date" className="text-primary hover:text-primary transition-colors font-semibold">
              আজকের বাংলা তারিখ দেখুন →
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 bg-card border border-border rounded-2xl p-5 text-sm font-bengali space-y-4 text-foreground">
          <h3 className="font-bold text-foreground text-base">প্রশ্ন ও উত্তর</h3>

          <div>
            <p className="font-semibold text-foreground">{nameBn} {banglaYear} বঙ্গাব্দ কোন মাসে পড়ে?</p>
            <p className="mt-1 text-muted-foreground">
              {nameBn} ({nameEn}) বাংলা বর্ষের {monthIndex + 1} নম্বর মাস। গ্রেগরিয়ান ক্যালেন্ডারে এটি {gregYear} সালে পড়ে।
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground">এই মাসের তিথি ও নক্ষত্র কীভাবে দেখব?</p>
            <p className="mt-1 text-muted-foreground">
              উপরের ক্যালেন্ডারে যেকোনো তারিখে ক্লিক করুন — সেই দিনের তিথি, নক্ষত্র, যোগ, করণ ও রাহু কাল দেখতে পাবেন।
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
