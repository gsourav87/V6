import { useMemo } from "react";
import { Link } from "wouter";
import {
  getTithiAtSunrise, getNakshatraAtSunrise,
  getYogaAtSunrise, getSunTimes, formatKolkataTime,
} from "@/lib/panjika";
import { toBengaliDate, toBengaliNumerals } from "@/lib/bengali-calendar";

export default function SeoContent() {
  const today = useMemo(() => new Date(), []);

  const bnDate    = useMemo(() => toBengaliDate(today), [today]);
  const tithi     = useMemo(() => getTithiAtSunrise(today), [today]);
  const nakshatra = useMemo(() => getNakshatraAtSunrise(today), [today]);
  const yoga      = useMemo(() => getYogaAtSunrise(today), [today]);
  const sunTimes  = useMemo(() => getSunTimes(today), [today]);

  const gregYear = today.getFullYear();

  return (
    <section className="bg-card border border-card-border rounded-2xl p-6 space-y-6 font-bengali text-sm leading-relaxed">

      {/* Today summary — primary keyword target */}
      <div>
        <h2 className="text-xl font-bold text-card-foreground mb-3">
          আজকের বাংলা তারিখ: {toBengaliNumerals(bnDate.day)} {bnDate.monthNameBn} {toBengaliNumerals(bnDate.year)} বঙ্গাব্দ
        </h2>
        <p className="text-muted-foreground">
          আজকের বাংলা তারিখ{" "}
          <strong className="text-foreground">{toBengaliNumerals(bnDate.day)} {bnDate.monthNameBn}, {toBengaliNumerals(bnDate.year)} বঙ্গাব্দ</strong>{" "}
          ({bnDate.dayNameBn})।{" "}
          আজকের তিথি <strong className="text-foreground">{tithi.nameBn}</strong> ({tithi.pakshaBn}),
          নক্ষত্র <strong className="text-foreground">{nakshatra.nameBn}</strong>,
          যোগ <strong className="text-foreground">{yoga.nameBn}</strong>।
        </p>
      </div>

      {/* Panchang table — fixes the timezone bug: uses formatKolkataTime */}
      <div>
        <h3 className="font-bold text-card-foreground mb-3">আজকের পঞ্জিকা তথ্য</h3>
        <ul className="space-y-1.5 text-muted-foreground">
          <li><span className="font-semibold text-foreground">তিথি:</span> {tithi.icon} {tithi.nameBn} ({tithi.pakshaBn})</li>
          <li><span className="font-semibold text-foreground">নক্ষত্র:</span> 🌙 {nakshatra.nameBn} ({nakshatra.nameEn})</li>
          <li><span className="font-semibold text-foreground">যোগ:</span> {yoga.nameBn} ({yoga.nameEn})</li>
          <li><span className="font-semibold text-foreground">সূর্যোদয়:</span> ☀️ {formatKolkataTime(sunTimes.sunrise)} (IST, কলকাতা)</li>
          <li><span className="font-semibold text-foreground">সূর্যাস্ত:</span> 🌅 {formatKolkataTime(sunTimes.sunset)} (IST, কলকাতা)</li>
        </ul>
      </div>

      {/* Month navigation links — internal link equity */}
      <div>
        <h3 className="font-bold text-card-foreground mb-3">বাংলা ক্যালেন্ডার ২০২৬ — মাস অনুযায়ী</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { slug: "boishakh", bn: "বৈশাখ" },
            { slug: "jaistha",  bn: "জ্যৈষ্ঠ" },
            { slug: "ashar",    bn: "আষাঢ়" },
            { slug: "shraban",  bn: "শ্রাবণ" },
            { slug: "bhadra",   bn: "ভাদ্র" },
            { slug: "ashwin",   bn: "আশ্বিন" },
            { slug: "kartik",   bn: "কার্তিক" },
            { slug: "agrohayon",bn: "অগ্রহায়ণ" },
            { slug: "poush",    bn: "পৌষ" },
            { slug: "magh",     bn: "মাঘ" },
            { slug: "falgun",   bn: "ফাল্গুন" },
            { slug: "chaitra",  bn: "চৈত্র" },
          ].map(({ slug, bn }) => (
            <Link
              key={slug}
              href={`/month/${slug}/${gregYear}`}
              className="text-xs bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-full transition-colors font-medium"
            >
              {bn} {gregYear}
            </Link>
          ))}
        </div>
      </div>

      {/* About the calendar */}
      <div className="border-t border-border pt-4 text-muted-foreground space-y-2">
        <h3 className="font-bold text-card-foreground">সঠিক বাংলা ক্যালেন্ডার সম্পর্কে</h3>
        <p>
          এই বাংলা ক্যালেন্ডার <strong className="text-foreground">বিশুদ্ধ সিদ্ধান্ত</strong> পদ্ধতি অনুযায়ী তৈরি।
          সৌর রাশিচক্রের ভিত্তিতে, লাহিড়ী অয়নাংশ ব্যবহার করে, কলকাতার সূর্যোদয়ের সময় অনুযায়ী প্রতিটি বাংলা মাসের শুরু নির্ধারিত হয়।
        </p>
        <p>
          প্রতিদিন আপডেট হওয়া এই বাংলা ক্যালেন্ডার থেকে আজকের তিথি, নক্ষত্র,
          সূর্যোদয়, সূর্যাস্ত ও শুভ মুহূর্তের সঠিক তথ্য জানতে পারবেন।
        </p>
      </div>

    </section>
  );
}
