import { useMemo } from "react";
import { Link } from "wouter";
import { X, ExternalLink } from "lucide-react";
import {
  getTithiAtSunrise, getNakshatraAtSunrise, getYogaAtSunrise,
  getKaranaAtSunrise, getSunTimes, getRahuKalamInfo, formatKolkataTime, formatTimeBn,
} from "@/lib/panjika";
import { toBengaliDate, toBengaliNumerals } from "@/lib/bengali-calendar";
import { getFestivalsForDate } from "@/lib/festivals";
import { getObservancesForDate } from "@/lib/observances";
import { getAllAnniversariesForDate } from "@/lib/calendar-events";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const VARA_BN = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"];

interface Props {
  date: Date;
  onClose?: () => void;
}

function InfoRow({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0 gap-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
        <span className="text-base shrink-0">{icon}</span>
        <span className="font-bengali font-medium">{label}</span>
      </div>
      <div className="text-right min-w-0">
        <div className="font-bold font-bengali text-foreground text-sm">{value}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

function SectionHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4 mb-2 px-1", className)}>
      {children}
    </div>
  );
}

export function DayDetailsModal({ date, onClose }: Props) {
  const utcDate = useMemo(
    () => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())),
    [date]
  );

  const tithi        = getTithiAtSunrise(utcDate);
  const nakshatra    = getNakshatraAtSunrise(utcDate);
  const yoga         = getYogaAtSunrise(utcDate);
  const karana       = getKaranaAtSunrise(utcDate);
  const sunTimes     = getSunTimes(utcDate);
  const rahu         = getRahuKalamInfo(utcDate);
  const festivals    = [...getFestivalsForDate(utcDate), ...getObservancesForDate(utcDate)];
  const anniversaries = getAllAnniversariesForDate(utcDate);
  const bnDate       = toBengaliDate(date);
  const dayOfWeek    = utcDate.getUTCDay();

  const isPurnima  = tithi.number === 15;
  const isAmavasya = tithi.number === 30;

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">

      {/* Gradient header */}
      <div className={cn(
        "relative p-5 text-white",
        isPurnima  ? "bg-gradient-to-br from-amber-500 to-orange-600" :
        isAmavasya ? "bg-gradient-to-br from-slate-700 to-slate-900" :
                     "bg-gradient-to-br from-orange-500 to-red-600"
      )}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <div className="text-2xl font-bold font-bengali leading-tight">
              {tithi.icon} {toBengaliNumerals(bnDate.day)} {bnDate.monthNameBn}
            </div>
            <div className="text-white/80 font-bengali text-sm mt-0.5">
              {toBengaliNumerals(bnDate.year)} বঙ্গাব্দ
            </div>
            <div className="text-white/60 text-xs mt-1.5">
              {format(date, "d MMM yyyy")} · {VARA_BN[dayOfWeek]}
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-1.5"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        <div className="mt-3 inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bengali font-semibold">
          <span>{tithi.icon}</span>
          <span>{tithi.nameBn}</span>
          <span className="opacity-70">·</span>
          <span className="opacity-80">{tithi.pakshaBn}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 bg-card">

        {/* Festivals */}
        {festivals.length > 0 && (
          <>
            <SectionHead>উৎসব ও বিশেষ দিন</SectionHead>
            <div className="space-y-1.5 mb-1">
              {festivals.map((f, i) => {
                const inner = (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base shrink-0">{f.icon}</span>
                      <span className="font-bengali font-semibold text-sm text-foreground leading-tight">
                        {f.nameBn}{f.yearRef ? ` (${toBengaliNumerals(f.yearRef)})` : ""}
                      </span>
                    </div>
                    {f.descBn && (
                      <p className="text-xs text-muted-foreground font-bengali mt-0.5 leading-relaxed pl-6">{f.descBn}</p>
                    )}
                  </>
                );
                return f.slug ? (
                  <Link key={i} href={`/festival/${f.slug}`}
                    className="block bg-primary/5 border border-primary/15 rounded-xl px-3 py-2 hover:bg-primary/10 transition-colors">
                    {inner}
                  </Link>
                ) : (
                  <div key={i} className="bg-primary/5 border border-primary/15 rounded-xl px-3 py-2">
                    {inner}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Famous people anniversaries with Wikipedia links */}
        {anniversaries.length > 0 && (
          <>
            <SectionHead>বিশেষ ব্যক্তিত্ব</SectionHead>
            <div className="space-y-2 mb-1">
              {anniversaries.map((a, i) => (
                <div key={i} className={cn(
                  "flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 border",
                  a.anniversaryType === "birth"
                    ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                    : "bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-700"
                )}>
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-xl shrink-0 mt-0.5">{a.person.emoji}</span>
                    <div className="min-w-0">
                      <div className="font-bold font-bengali text-sm text-foreground leading-tight">
                        {a.person.nameBn}
                      </div>
                      <div className="text-xs text-muted-foreground font-bengali mt-0.5">
                        {a.person.role}
                      </div>
                      <div className="text-xs font-bengali text-foreground/80 mt-1 leading-relaxed">
                        {a.person.descBn}
                      </div>
                      <div className={cn(
                        "inline-flex items-center text-[10px] font-semibold mt-1.5 px-2 py-0.5 rounded-full",
                        a.anniversaryType === "birth"
                          ? "bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      )}>
                        {a.anniversaryType === "birth"
                          ? `জন্মবার্ষিকী — ${toBengaliNumerals(a.yearsSince)} বছর`
                          : `স্মরণ দিবস — ${toBengaliNumerals(a.yearsSince)} বছর`}
                      </div>
                    </div>
                  </div>
                  <a
                    href={a.wikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-2 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    title={`Wikipedia: ${a.person.nameEn}`}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Wiki
                  </a>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Panchang data — single column on mobile, two columns on wider screens */}
        <div className="md:grid md:grid-cols-2 md:gap-x-5">
          <div>
            <SectionHead>পঞ্চাঙ্গ</SectionHead>
            <div className="bg-background rounded-xl px-3 divide-y divide-border/50">
              <InfoRow icon="🌓" label="তিথি"    value={tithi.nameBn}     sub={tithi.pakshaBn} />
              <InfoRow icon="⏳" label="তিথি আরম্ভ"  value={formatTimeBn(tithi.startsAt) || "পূর্ববর্তী দিনে"} />
              <InfoRow icon="⌛" label="তিথি সমাপ্তি" value={formatTimeBn(tithi.endsAt)   || "পরবর্তী দিনে"} />
              <InfoRow icon="⭐" label="নক্ষত্র"  value={nakshatra.nameBn} sub={nakshatra.nameEn} />
              <InfoRow icon={yoga.nature === "good" ? "✨" : "⚠️"} label="যোগ" value={yoga.nameBn} sub={yoga.nameEn} />
              <InfoRow icon="🔆" label="করণ"     value={karana.nameBn}    sub={karana.nameEn} />
            </div>

            <SectionHead>সূর্য</SectionHead>
            <div className="bg-background rounded-xl px-3 divide-y divide-border/50">
              <InfoRow icon="☀️"  label="সূর্যোদয়" value={formatKolkataTime(sunTimes.sunrise)} sub="IST" />
              <InfoRow icon="🌅" label="সূর্যাস্ত"  value={formatKolkataTime(sunTimes.sunset)}  sub="IST" />
            </div>
          </div>

          <div>
            <SectionHead className="text-destructive/70">অশুভ সময়</SectionHead>
            <div className="bg-background rounded-xl px-3 divide-y divide-border/50">
              <InfoRow icon="🔴" label="রাহু কাল"  value={`${formatKolkataTime(rahu.rahuKalam.start)} – ${formatKolkataTime(rahu.rahuKalam.end)}`} />
              <InfoRow icon="🟠" label="গুলিক কাল" value={`${formatKolkataTime(rahu.gulikaKalam.start)} – ${formatKolkataTime(rahu.gulikaKalam.end)}`} />
              <InfoRow icon="🟡" label="যমগণ্ড"    value={`${formatKolkataTime(rahu.yamaganda.start)} – ${formatKolkataTime(rahu.yamaganda.end)}`} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
