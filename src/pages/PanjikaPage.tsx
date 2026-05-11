import { useEffect, useMemo, useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { applyPageSEO, removeSchema } from "@/lib/seo";
import {
  getTithiAtSunrise, getNakshatraAtSunrise, getYogaAtSunrise,
  getKaranaAtSunrise, getRahuKalamInfo, formatKolkataTime, formatTithiEndBn,
} from "@/lib/panjika";
import { toBengaliDate, toBengaliNumerals } from "@/lib/bengali-calendar";
import { getFestivalsForDate } from "@/lib/festivals";
import { cn } from "@/lib/utils";

const VARA_BN = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"];

function InfoRow({
  icon, label, value, sub, highlight,
}: {
  icon: string; label: string; value: string; sub?: string; highlight?: "good" | "bad";
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0 gap-3">
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground min-w-0">
        <span className="text-base shrink-0">{icon}</span>
        <span className="font-bengali font-medium">{label}</span>
      </div>
      <div className="text-right min-w-0">
        <div className={cn(
          "font-bold font-bengali text-sm",
          highlight === "good" ? "text-green-600 dark:text-green-400" :
          highlight === "bad"  ? "text-red-600 dark:text-red-400" :
          "text-foreground"
        )}>
          {value}
        </div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-card border border-border rounded-2xl overflow-hidden", className)}>
      <div className="px-4 py-2.5 bg-muted/50 border-b border-border">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}

export default function PanjikaPage() {
  const [date, setDate] = useState(() => new Date());
  const today = useMemo(() => new Date(), []);

  const utcDate = useMemo(() => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())), [date]);
  const bnDate    = useMemo(() => toBengaliDate(date), [date]);
  const tithi     = useMemo(() => getTithiAtSunrise(utcDate), [utcDate]);
  const nakshatra = useMemo(() => getNakshatraAtSunrise(utcDate), [utcDate]);
  const yoga      = useMemo(() => getYogaAtSunrise(utcDate), [utcDate]);
  const karana    = useMemo(() => getKaranaAtSunrise(utcDate), [utcDate]);
  const rahu      = useMemo(() => getRahuKalamInfo(utcDate, today), [utcDate, today]);
  const festivals = useMemo(() => getFestivalsForDate(utcDate), [utcDate]);
  const dayOfWeek = utcDate.getUTCDay();

  const isToday = date.toDateString() === today.toDateString();

  const isPurnima  = tithi.number === 15;
  const isAmavasya = tithi.number === 30;

  const SCHEMA_ID = "panjika-schema";

  useEffect(() => {
    applyPageSEO({
      title: `${toBengaliNumerals(bnDate.day)} ${bnDate.monthNameBn} ${toBengaliNumerals(bnDate.year)} পঞ্জিকা — তিথি, নক্ষত্র, রাহু কাল | সঠিক বাংলা ক্যালেন্ডার`,
      description: `${format(date, "d MMMM yyyy")} তারিখের পঞ্জিকা: তিথি ${tithi.nameBn}, নক্ষত্র ${nakshatra.nameBn}, যোগ ${yoga.nameBn}। সূর্যোদয় ${formatKolkataTime(rahu.sunrise)}, সূর্যাস্ত ${formatKolkataTime(rahu.sunset)}।`,
      path: "/panjika",
      schemaId: SCHEMA_ID,
      schema: {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${format(date, "d MMMM yyyy")} পঞ্জিকা`,
        "description": `তিথি: ${tithi.nameBn}, নক্ষত্র: ${nakshatra.nameBn}`,
        "datePublished": date.toISOString().split("T")[0],
      },
    });
    return () => removeSchema(SCHEMA_ID);
  }, [date, bnDate, tithi, nakshatra, yoga, rahu]);

  function goTo(d: Date) {
    setDate(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Date navigation */}
        <div className={cn(
          "relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white mb-6 overflow-hidden",
          isPurnima  ? "bg-gradient-to-br from-amber-500 to-orange-600" :
          isAmavasya ? "bg-gradient-to-br from-slate-700 to-slate-900" :
                       "bg-gradient-to-br from-primary to-primary/80"
        )}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

          <div className="relative z-10">
            {/* Bengali date */}
            <div className="mb-4">
              <div className="text-white/60 text-[10px] uppercase tracking-widest mb-1">সঠিক বাংলা পঞ্জিকা</div>
              <div className="text-3xl sm:text-4xl font-bold font-bengali leading-tight">
                {tithi.icon} {toBengaliNumerals(bnDate.day)} {bnDate.monthNameBn}
              </div>
              <div className="text-white/75 font-bengali text-sm mt-1">
                {toBengaliNumerals(bnDate.year)} বঙ্গাব্দ
              </div>
              <div className="text-white/60 text-xs mt-1">
                {VARA_BN[dayOfWeek]} · {format(date, "d MMMM yyyy")}
              </div>
              {isToday && (
                <div className="inline-flex items-center gap-1 mt-2 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-bengali font-semibold">
                  ✅ আজকের পঞ্জিকা
                </div>
              )}
            </div>

            {/* Prev / Next / Today */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goTo(subDays(date, 1))}
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bengali px-3 py-1.5 rounded-full transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                আগের দিন
              </button>
              {!isToday && (
                <button
                  onClick={() => goTo(today)}
                  className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bengali px-3 py-1.5 rounded-full transition-colors"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  আজ
                </button>
              )}
              <button
                onClick={() => goTo(addDays(date, 1))}
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bengali px-3 py-1.5 rounded-full transition-colors"
              >
                পরের দিন
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Festivals */}
        {festivals.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {festivals.map((f, i) => (
              <div key={i} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 text-xs font-bengali font-semibold px-3 py-1.5 rounded-full">
                <span>{f.icon}</span>
                <span>{f.nameBn}</span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">

          {/* Panchang */}
          <Section title="পঞ্চাঙ্গ">
            <InfoRow
              icon={tithi.icon}
              label="তিথি"
              value={tithi.nameBn}
              sub={`${tithi.pakshaBn}${tithi.endsAt ? ` · ${formatTithiEndBn(tithi.endsAt)} পর্যন্ত` : ""}`}
              highlight={isPurnima || (!isAmavasya && tithi.isShukla) ? "good" : undefined}
            />
            <InfoRow
              icon={nakshatra.icon}
              label="নক্ষত্র"
              value={nakshatra.nameBn}
              sub={nakshatra.nameEn}
            />
            <InfoRow
              icon={yoga.nature === "good" ? "✨" : yoga.nature === "inauspicious" ? "⚠️" : "◎"}
              label="যোগ"
              value={yoga.nameBn}
              sub={yoga.nameEn}
              highlight={yoga.nature === "good" ? "good" : yoga.nature === "inauspicious" ? "bad" : undefined}
            />
            <InfoRow
              icon={karana.nature === "good" ? "🔆" : "🌑"}
              label="করণ"
              value={karana.nameBn}
              sub={karana.nameEn}
            />
            <InfoRow
              icon="📅"
              label="বার"
              value={VARA_BN[dayOfWeek]}
            />
          </Section>

          {/* Sun times */}
          <Section title="সূর্য">
            <InfoRow
              icon="☀️"
              label="সূর্যোদয়"
              value={formatKolkataTime(rahu.sunrise)}
              sub="IST, কলকাতা"
              highlight="good"
            />
            <InfoRow
              icon="🌅"
              label="সূর্যাস্ত"
              value={formatKolkataTime(rahu.sunset)}
              sub="IST, কলকাতা"
            />
            <InfoRow
              icon="⏱"
              label="দিনের দৈর্ঘ্য"
              value={(() => {
                const mins = Math.round((rahu.sunset.getTime() - rahu.sunrise.getTime()) / 60000);
                return `${Math.floor(mins / 60)} ঘণ্টা ${mins % 60} মিনিট`;
              })()}
            />
          </Section>

          {/* Inauspicious periods */}
          <Section title="অশুভ সময়">
            <InfoRow
              icon="🔴"
              label="রাহু কাল"
              value={`${formatKolkataTime(rahu.rahuKalam.start)} – ${formatKolkataTime(rahu.rahuKalam.end)}`}
              sub={rahu.rahuKalam.isActive ? "এখন সক্রিয়" : undefined}
              highlight={rahu.rahuKalam.isActive ? "bad" : undefined}
            />
            <InfoRow
              icon="🟠"
              label="গুলিক কাল"
              value={`${formatKolkataTime(rahu.gulikaKalam.start)} – ${formatKolkataTime(rahu.gulikaKalam.end)}`}
              sub={rahu.gulikaKalam.isActive ? "এখন সক্রিয়" : undefined}
              highlight={rahu.gulikaKalam.isActive ? "bad" : undefined}
            />
            <InfoRow
              icon="🟡"
              label="যমগণ্ড"
              value={`${formatKolkataTime(rahu.yamaganda.start)} – ${formatKolkataTime(rahu.yamaganda.end)}`}
              sub={rahu.yamaganda.isActive ? "এখন সক্রিয়" : undefined}
              highlight={rahu.yamaganda.isActive ? "bad" : undefined}
            />
          </Section>

          {/* Auspicious time */}
          <Section title="শুভ সময়">
            <InfoRow
              icon="⭐"
              label="অভিজিৎ মুহূর্ত"
              value={(() => {
                const sunriseMs = rahu.sunrise.getTime();
                const dayMs = rahu.sunset.getTime() - sunriseMs;
                const abhijitStart = new Date(sunriseMs + dayMs * (11 / 24));
                const abhijitEnd   = new Date(sunriseMs + dayMs * (12 / 24));
                return `${formatKolkataTime(abhijitStart)} – ${formatKolkataTime(abhijitEnd)}`;
              })()}
              sub="সকল শুভ কাজের জন্য"
              highlight="good"
            />
            <InfoRow
              icon="🌞"
              label="ব্রাহ্ম মুহূর্ত"
              value={(() => {
                const sunriseMs = rahu.sunrise.getTime();
                const brahmEnd   = new Date(sunriseMs - 48 * 60 * 1000);
                const brahmStart = new Date(sunriseMs - 96 * 60 * 1000);
                return `${formatKolkataTime(brahmStart)} – ${formatKolkataTime(brahmEnd)}`;
              })()}
              sub="সাধনা ও ধ্যানের জন্য"
              highlight="good"
            />
          </Section>

        </div>

        {/* Day-count info */}
        <p className="text-center text-xs text-muted-foreground mt-6 font-bengali">
          সমস্ত সময় কলকাতা (IST, UTC+5:30) অনুযায়ী · বিশুদ্ধ সিদ্ধান্ত পদ্ধতি
        </p>
      </main>
    </div>
  );
}
