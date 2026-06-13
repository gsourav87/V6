import { useEffect, useMemo } from "react";
import { format } from "date-fns";
import { NavBar } from "@/components/NavBar";
import { MuhurtaCalc } from "@/components/MuhurtaCalc";
import { applyPageSEO, removeSchema, SITE_URL } from "@/lib/seo";
import { toBengaliDate, toBengaliNumerals } from "@/lib/bengali-calendar";

const SCHEMA_ID = "muhurta-schema";

export default function MuhurtaPage() {
  const today  = useMemo(() => new Date(), []);
  const bnDate = useMemo(() => toBengaliDate(today), [today]);

  useEffect(() => {
    applyPageSEO({
      title: `শুভ মুহূর্ত ${format(today, "yyyy")} — বিবাহ, গৃহপ্রবেশ, যাত্রার শুভ দিন | সঠিক বাংলা ক্যালেন্ডার`,
      description:
        "আগামী ১০ দিনের শুভ মুহূর্ত — বিবাহ, গৃহপ্রবেশ, যাত্রা, ব্যবসা, নামকরণ ও অন্নপ্রাশনের শুভ দিন। তিথি, নক্ষত্র, যোগ ও করণ বিচার করে কলকাতার সূর্যোদয় অনুসারে গণনা।",
      path: "/muhurta",
      schemaId: SCHEMA_ID,
      schema: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "url": `${SITE_URL}/muhurta`,
        "inLanguage": "bn",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "শুভ মুহূর্ত কী?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "শুভ মুহূর্ত হলো কোনো গুরুত্বপূর্ণ কাজ — যেমন বিবাহ, গৃহপ্রবেশ বা যাত্রা — শুরু করার জন্য জ্যোতিষশাস্ত্র অনুসারে নির্ধারিত শুভ সময়। তিথি, নক্ষত্র, যোগ ও করণ বিচার করে এই মুহূর্ত নির্ধারণ করা হয়।",
            },
          },
          {
            "@type": "Question",
            "name": "বিবাহ বা গৃহপ্রবেশের শুভ দিন কীভাবে দেখব?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "সঠিক বাংলা ক্যালেন্ডারের শুভ মুহূর্ত পাতায় আপনার কাজ (বিবাহ, গৃহপ্রবেশ, যাত্রা প্রভৃতি) নির্বাচন করুন। আগামী ১০ দিনের প্রতিটি দিনের শুভাশুভ রেটিং দেখানো হবে, যা তিথি, নক্ষত্র, যোগ ও করণের ভিত্তিতে গণনা করা।",
            },
          },
        ],
      },
    });
    return () => removeSchema(SCHEMA_ID);
  }, [today]);

  return (
    <div className="min-h-screen pb-20">
      <NavBar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🕉️</div>
          <h1 className="text-3xl sm:text-4xl font-bold font-bengali mb-2">শুভ মুহূর্ত</h1>
          <p className="text-muted-foreground font-bengali text-sm">
            {toBengaliNumerals(bnDate.day)} {bnDate.monthNameBn} {toBengaliNumerals(bnDate.year)} বঙ্গাব্দ
            &nbsp;·&nbsp;
            {format(today, "d MMMM yyyy")}
          </p>
          <p className="text-muted-foreground font-bengali text-sm mt-3 leading-relaxed max-w-xl mx-auto">
            বিবাহ, গৃহপ্রবেশ, যাত্রা, ব্যবসা, নামকরণ ও অন্নপ্রাশনের জন্য আগামী ১০ দিনের শুভ দিন
            দেখুন। তিথি, নক্ষত্র, যোগ ও করণ বিচার করে কলকাতার সূর্যোদয় অনুসারে গণনা।
          </p>
        </div>

        <MuhurtaCalc />

        <nav aria-label="Quick links" className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-8 text-sm font-bengali font-semibold text-primary">
          <a href="/panjika">আজকের পঞ্জিকা</a>
          <a href="/">মূল ক্যালেন্ডার</a>
        </nav>
      </main>
    </div>
  );
}
