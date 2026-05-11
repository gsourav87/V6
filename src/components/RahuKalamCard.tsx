import { useState, useEffect, useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { getRahuKalamInfo, formatKolkataTime, PeriodInfo } from "@/lib/panjika";

// ── Single period row ────────────────────────────────────────────────────────

function PeriodRow({
  labelBn, label, period, dotColor,
}: {
  labelBn: string; label: string; period: PeriodInfo; dotColor: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-colors ${
      period.isActive
        ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700"
        : "bg-background border-border"
    }`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {period.isActive
          ? <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          : <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
        }
        <div className="min-w-0">
          <div className="font-bengali font-semibold text-sm leading-tight">{labelBn}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
        {period.isActive && (
          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bengali whitespace-nowrap shrink-0">
            এখন চলছে
          </span>
        )}
      </div>
      <div className="text-sm font-semibold tabular-nums text-right whitespace-nowrap shrink-0">
        {formatKolkataTime(period.start)}
        <span className="text-muted-foreground font-normal mx-1">–</span>
        {formatKolkataTime(period.end)}
      </div>
    </div>
  );
}

// ── Day timeline bar ─────────────────────────────────────────────────────────

function DayTimeline({
  sunrise, sunset, rahuKalam, gulikaKalam, yamaganda, now,
}: {
  sunrise: Date; sunset: Date;
  rahuKalam: PeriodInfo; gulikaKalam: PeriodInfo; yamaganda: PeriodInfo;
  now: Date;
}) {
  const dayMs = sunset.getTime() - sunrise.getTime();
  const pct   = (d: Date) =>
    Math.min(100, Math.max(0, ((d.getTime() - sunrise.getTime()) / dayMs) * 100));

  const bands = [
    { p: rahuKalam,   bg: "bg-red-400",    title: "রাহু কাল" },
    { p: gulikaKalam, bg: "bg-orange-400", title: "গুলিক কাল" },
    { p: yamaganda,   bg: "bg-yellow-400", title: "যমগণ্ড" },
  ];

  const nowPct    = pct(now);
  const nowInDay  = now >= sunrise && now <= sunset;

  return (
    <div className="mt-5">
      <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-bengali">
        <span>☀️ {formatKolkataTime(sunrise)}</span>
        <span className="text-center opacity-60">— দিনের সময়রেখা —</span>
        <span>🌅 {formatKolkataTime(sunset)}</span>
      </div>

      <div className="relative h-5 rounded-full bg-muted overflow-hidden">
        {/* Slot grid lines */}
        {[1,2,3,4,5,6,7].map(i => (
          <div key={i} className="absolute top-0 bottom-0 w-px bg-border/50"
            style={{ left: `${i * 12.5}%` }} />
        ))}
        {/* Coloured bands */}
        {bands.map(({ p, bg, title }) => (
          <div key={title} title={title}
            className={`absolute top-0 bottom-0 opacity-85 ${bg}`}
            style={{ left: `${pct(p.start)}%`, width: `${pct(p.end) - pct(p.start)}%` }}
          />
        ))}
        {/* Current-time needle */}
        {nowInDay && (
          <div className="absolute top-0 bottom-0 w-0.5 bg-foreground/80 z-10"
            style={{ left: `${nowPct}%` }} />
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-400 inline-block" />রাহু কাল
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-orange-400 inline-block" />গুলিক কাল
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block" />যমগণ্ড
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          <span className="w-0.5 h-3.5 bg-foreground/60 inline-block" />এখন
        </span>
      </div>
    </div>
  );
}

// ── Main card ────────────────────────────────────────────────────────────────

export function RahuKalamCard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const todayUTC = useMemo(
    () => new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())),
    // recalculate only when the calendar date changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [now.toDateString()]
  );

  const info = useMemo(() => getRahuKalamInfo(todayUTC, now), [todayUTC, now]);

  const anyActive =
    info.rahuKalam.isActive || info.gulikaKalam.isActive || info.yamaganda.isActive;

  return (
    <div className={`bg-card rounded-2xl shadow-sm p-5 border transition-colors ${
      anyActive ? "border-red-300 dark:border-red-700" : "border-card-border"
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className={`h-5 w-5 shrink-0 ${anyActive ? "text-red-500" : "text-amber-500"}`} />
        <h2 className="text-xl font-bold font-bengali text-card-foreground">
          অশুভ সময় (Inauspicious Periods)
        </h2>
        {anyActive && (
          <span className="ml-auto text-xs bg-red-500 text-white px-2.5 py-1 rounded-full font-bengali animate-pulse shrink-0">
            ⚠ এখন চলছে
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-4 font-bengali leading-relaxed">
        এই সময়গুলিতে কোনো নতুন বা শুভ কাজ শুরু না করাই ভালো।
        কলকাতার সূর্যোদয়-সূর্যাস্তের উপর ভিত্তি করে গণনা।
      </p>

      {/* Period rows */}
      <div className="space-y-2">
        <PeriodRow labelBn="রাহু কাল"  label="Rahu Kalam"   period={info.rahuKalam}   dotColor="bg-red-400" />
        <PeriodRow labelBn="গুলিক কাল" label="Gulika Kalam" period={info.gulikaKalam} dotColor="bg-orange-400" />
        <PeriodRow labelBn="যমগণ্ড"    label="Yamaganda"    period={info.yamaganda}   dotColor="bg-yellow-400" />
      </div>

      {/* Timeline */}
      <DayTimeline
        sunrise={info.sunrise}
        sunset={info.sunset}
        rahuKalam={info.rahuKalam}
        gulikaKalam={info.gulikaKalam}
        yamaganda={info.yamaganda}
        now={now}
      />

      <p className="text-xs text-muted-foreground mt-3 font-bengali">
        * প্রতিটি সময়কাল প্রায় {Math.round(info.slotMinutes)} মিনিট।
        সময়রেখায় উলম্ব রেখাটি বর্তমান সময় নির্দেশ করছে।
      </p>
    </div>
  );
}
