import { useRoute, useLocation } from "wouter";
import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import { DayDetailsModal } from "@/components/DayDetailsModal";
import { convertToBengali, toBengaliNumerals } from "@/lib/bengali-calendar";
import { getTithiAtSunrise, getNakshatraAtSunrise } from "@/lib/panjika";
import { applyPageSEO, injectSchema, removeSchema, SITE_URL } from "@/lib/seo";

export default function DatePage() {
  const [, params] = useRoute("/date/:year/:month/:day");
  const [, navigate] = useLocation();

  const year  = Number(params?.year);
  const month = Number(params?.month);
  const day   = Number(params?.day);

  const date = useMemo(() => new Date(year, month - 1, day), [year, month, day]);

  const bnDate    = useMemo(() => convertToBengali(year, month, day), [year, month, day]);
  const tithi     = useMemo(() => getTithiAtSunrise(date), [date]);
  const nakshatra = useMemo(() => getNakshatraAtSunrise(date), [date]);

  const title = useMemo(
    () => `${toBengaliNumerals(bnDate.day)} ${bnDate.monthNameBn} ${toBengaliNumerals(bnDate.year)} — তিথি ${tithi.nameBn}, নক্ষত্র ${nakshatra.nameBn} | বাংলা পঞ্জিকা`,
    [bnDate, tithi, nakshatra]
  );

  const description = useMemo(
    () => `${toBengaliNumerals(bnDate.day)} ${bnDate.monthNameBn} ${toBengaliNumerals(bnDate.year)} বঙ্গাব্দ (${day}/${month}/${year}) — তিথি: ${tithi.nameBn} (${tithi.pakshaBn}), নক্ষত্র: ${nakshatra.nameBn}। সম্পূর্ণ পঞ্জিকা তথ্য দেখুন।`,
    [bnDate, tithi, nakshatra, day, month, year]
  );

  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `${day}/${month}/${year} তারিখের বাংলা তারিখ কী?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${day}/${month}/${year} গ্রেগরিয়ান তারিখ অনুযায়ী বাংলা তারিখ হলো ${toBengaliNumerals(bnDate.day)} ${bnDate.monthNameBn}, ${toBengaliNumerals(bnDate.year)} বঙ্গাব্দ (${bnDate.dayNameBn})।`
          }
        },
        {
          "@type": "Question",
          "name": `${toBengaliNumerals(bnDate.day)} ${bnDate.monthNameBn}-এর তিথি ও নক্ষত্র কী?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${toBengaliNumerals(bnDate.day)} ${bnDate.monthNameBn} ${toBengaliNumerals(bnDate.year)} বঙ্গাব্দে তিথি হলো ${tithi.nameBn} (${tithi.pakshaBn}) এবং নক্ষত্র হলো ${nakshatra.nameBn}।`
          }
        },
        {
          "@type": "Question",
          "name": "বাংলা পঞ্জিকা কেন গুরুত্বপূর্ণ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "বাংলা পঞ্জিকা ধর্মীয়, সাংস্কৃতিক ও শুভ কাজ নির্ধারণে গুরুত্বপূর্ণ। তিথি, নক্ষত্র, যোগ ও করণের উপর ভিত্তি করে শুভ মুহূর্ত নির্ধারণ করা হয়।"
          }
        }
      ]
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "সঠিক বাংলা ক্যালেন্ডার", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": `${bnDate.monthNameBn} ${year}`, "item": `${SITE_URL}/date/${year}/${month}/${day}` },
        { "@type": "ListItem", "position": 3, "name": `${toBengaliNumerals(bnDate.day)} ${bnDate.monthNameBn}`, "item": `${SITE_URL}/date/${year}/${month}/${day}` }
      ]
    };

    applyPageSEO({
      title,
      description,
      path: `/date/${year}/${month}/${day}`,
      schemaId: "date-faq-schema",
      schema: faqSchema,
    });
    injectSchema("date-breadcrumb-schema", breadcrumbSchema);

    return () => {
      removeSchema("date-faq-schema");
      removeSchema("date-breadcrumb-schema");
    };
  }, [title, description, year, month, day, bnDate, tithi, nakshatra]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center px-4 py-10">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="w-full max-w-2xl mb-6 text-xs text-slate-400 font-bengali">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link href="/" className="hover:text-white transition-colors">হোম</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-white font-semibold">{toBengaliNumerals(bnDate.day)} {bnDate.monthNameBn}, {toBengaliNumerals(bnDate.year)} বঙ্গাব্দ</li>
        </ol>
      </nav>

      <div className="w-full max-w-md">
        <h1 className="text-xl text-white font-bold text-center mb-5 font-bengali leading-snug">
          {toBengaliNumerals(bnDate.day)} {bnDate.monthNameBn} {toBengaliNumerals(bnDate.year)} বঙ্গাব্দ — পঞ্জিকা
        </h1>

        <DayDetailsModal date={date} onClose={() => navigate("/")} />
      </div>

      {/* SEO content with real computed data */}
      <div className="mt-8 text-slate-300 text-sm leading-relaxed text-center max-w-xl font-bengali space-y-3">
        <p>
          <strong className="text-white">{toBengaliNumerals(bnDate.day)} {bnDate.monthNameBn}, {toBengaliNumerals(bnDate.year)} বঙ্গাব্দ</strong> —
          তিথি <strong className="text-amber-300">{tithi.nameBn}</strong> ({tithi.pakshaBn}),
          নক্ষত্র <strong className="text-amber-300">{nakshatra.nameBn}</strong>।
        </p>
        <p>
          এই পেজে সম্পূর্ণ পঞ্জিকা তথ্য পাওয়া যাচ্ছে — তিথি, নক্ষত্র, যোগ, করণ, সূর্যোদয়, সূর্যাস্ত ও রাহু কাল।
        </p>
        <p className="text-xs text-slate-500">
          বিশুদ্ধ সিদ্ধান্ত পদ্ধতি ও কলকাতার স্থানীয় সময় অনুযায়ী গণনা।
        </p>
      </div>

      {/* Visible FAQ section */}
      <div className="mt-8 w-full max-w-xl bg-slate-800/60 border border-slate-700 rounded-2xl p-5 text-slate-200 text-sm font-bengali space-y-4">
        <h2 className="font-bold text-white text-base">প্রশ্ন ও উত্তর</h2>

        <div>
          <p className="font-semibold text-slate-100">{day}/{month}/{year} তারিখের বাংলা তারিখ কী?</p>
          <p className="mt-1 text-slate-400">
            {toBengaliNumerals(bnDate.day)} {bnDate.monthNameBn}, {toBengaliNumerals(bnDate.year)} বঙ্গাব্দ ({bnDate.dayNameBn})।
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-100">{toBengaliNumerals(bnDate.day)} {bnDate.monthNameBn}-এর তিথি কী?</p>
          <p className="mt-1 text-slate-400">
            তিথি: {tithi.nameBn} ({tithi.pakshaBn}), নক্ষত্র: {nakshatra.nameBn}।
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-100">বাংলা পঞ্জিকা কেন গুরুত্বপূর্ণ?</p>
          <p className="mt-1 text-slate-400">
            শুভ কাজ, পূজা ও সাংস্কৃতিক অনুষ্ঠানের তারিখ নির্ধারণে বাংলা পঞ্জিকা অপরিহার্য।
          </p>
        </div>
      </div>

      <Link href="/" className="mt-8 text-sm text-slate-400 hover:text-white transition-colors font-bengali">
        ← মূল ক্যালেন্ডারে ফিরে যান
      </Link>
    </main>
  );
}
