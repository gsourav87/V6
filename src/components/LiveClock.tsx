import { format } from "date-fns";
import { Moon, Sun, Share2 } from "lucide-react";
import { toBengaliNumerals } from "@/lib/bengali-calendar";
import { formatKolkataTime } from "@/lib/panjika";
import { useTodayInfo } from "@/hooks/useTodayInfo";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

function PanchangChip({
  label, value, sub, icon, className,
}: {
  label: string; value: string; sub?: string; icon: string; className?: string;
}) {
  return (
    <div className={cn(
      "bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 flex flex-col min-w-0",
      className
    )}>
      <span className="text-primary-foreground/55 text-[9px] sm:text-[10px] uppercase tracking-wider font-medium mb-0.5 whitespace-nowrap">
        {label}
      </span>
      <span className="font-semibold text-xs sm:text-sm text-primary-foreground font-bengali flex items-center gap-1 min-w-0">
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{value}</span>
      </span>
      {sub && (
        <span className="text-primary-foreground/45 text-[9px] sm:text-[10px] truncate">{sub}</span>
      )}
    </div>
  );
}

function SunRiseSetIcon({ type }: { type: "rise" | "set" }) {
  return type === "rise" ? (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="4"/>
      <line x1="12" y1="3" x2="12" y2="5"/>
      <line x1="4.22" y1="6.22" x2="5.64" y2="7.64"/>
      <line x1="2" y1="14" x2="4" y2="14"/>
      <line x1="20" y1="14" x2="22" y2="14"/>
      <line x1="18.36" y1="7.64" x2="19.78" y2="6.22"/>
      <polyline points="8 17 12 13 16 17"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
    </svg>
  ) : (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="11" r="4"/>
      <line x1="12" y1="3" x2="12" y2="5"/>
      <line x1="4.22" y1="6.22" x2="5.64" y2="7.64"/>
      <line x1="2" y1="12" x2="4" y2="12"/>
      <line x1="20" y1="12" x2="22" y2="12"/>
      <line x1="18.36" y1="7.64" x2="19.78" y2="6.22"/>
      <polyline points="16 17 12 21 8 17"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
    </svg>
  );
}

export function LiveClock() {
  const { now, bengaliDate, tithiInfo, sunTimes, nakshatraInfo, yogaInfo, karanaInfo } = useTodayInfo();
  const { theme, setTheme } = useTheme();

  const shareText =
    `🗓 *আজকের পঞ্চাঙ্গ — সঠিক বাংলা ক্যালেন্ডার*\n\n` +
    `📅 ${bengaliDate.dayNameBn}, ${toBengaliNumerals(bengaliDate.day)} ${bengaliDate.monthNameBn} ${toBengaliNumerals(bengaliDate.year)} বঙ্গাব্দ\n` +
    `🗓 ${format(now, "EEEE, d MMMM yyyy")}\n\n` +
    `তিথি: ${tithiInfo.icon} ${tithiInfo.nameBn} (${tithiInfo.pakshaBn})\n` +
    `নক্ষত্র: 🌙 ${nakshatraInfo.nameBn}\n` +
    `যোগ: ${yogaInfo.nameBn}  করণ: ${karanaInfo.nameBn}\n` +
    `☀️ সূর্যোদয়: ${formatKolkataTime(sunTimes.sunrise)}  🌅 সূর্যাস্ত: ${formatKolkataTime(sunTimes.sunset)}\n\n` +
    `📲 ${window.location.href}`;

  return (
    <div className="relative bg-primary text-primary-foreground rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">

      {/* Atmospheric background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-white/5 pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/15 rounded-full blur-2xl pointer-events-none" />

      {/* Top action bar */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
        <button
          onClick={() => {
            const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
            window.open(url, "_blank", "noopener,noreferrer");
          }}
          className="flex items-center gap-1.5 bg-green-500/90 hover:bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors shadow-sm"
          aria-label="Share on WhatsApp"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-white/15 hover:bg-white/25 p-1.5 rounded-full transition-colors"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 p-5 sm:p-7 md:p-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">

          {/* Left — Primary date display */}
          <div className="flex flex-col items-start space-y-1">
            <div className="text-[10px] sm:text-xs font-medium text-primary-foreground/50 uppercase tracking-widest">
              সঠিক বাংলা ক্যালেন্ডার
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-bengali tracking-tight leading-none">
              {toBengaliNumerals(bengaliDate.day)} {bengaliDate.monthNameBn}
            </h1>
            <div className="text-primary-foreground/70 font-medium text-sm sm:text-base">
              {bengaliDate.dayNameBn} · {format(now, "d MMMM yyyy")}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="inline-flex items-center bg-white/12 border border-white/10 px-3 py-1 rounded-full font-bengali text-sm font-semibold">
                {toBengaliNumerals(bengaliDate.year)} বঙ্গাব্দ
              </div>
              <div className="inline-flex items-center gap-1 bg-white/10 border border-white/10 px-3 py-1 rounded-full font-bengali text-sm">
                <span>{bengaliDate.season.emoji}</span>
                <span>{bengaliDate.season.nameBn}</span>
              </div>
            </div>
          </div>

          {/* Right — Clock + panchang chips */}
          <div className="flex flex-col items-start lg:items-end gap-3 w-full lg:w-auto">

            {/* Live clock */}
            <div className="text-3xl sm:text-4xl font-bold tabular-nums tracking-tighter drop-shadow-sm">
              {format(now, "hh:mm:ss a")}
            </div>

            {/* Panchang info grid */}
            <div className="flex flex-wrap gap-2 w-full lg:justify-end">
              <PanchangChip
                label="তিথি (Tithi)"
                value={`${tithiInfo.nameBn}`}
                sub={tithiInfo.pakshaBn}
                icon={tithiInfo.icon}
              />
              <PanchangChip
                label="নক্ষত্র (Nakshatra)"
                value={nakshatraInfo.nameBn}
                sub={nakshatraInfo.nameEn}
                icon="🌙"
              />
              <PanchangChip
                label="যোগ (Yoga)"
                value={yogaInfo.nameBn}
                sub={yogaInfo.nameEn}
                icon={yogaInfo.nature === "good" ? "✨" : yogaInfo.nature === "inauspicious" ? "⚠️" : "◎"}
              />
              <PanchangChip
                label="করণ (Karana)"
                value={karanaInfo.nameBn}
                sub={karanaInfo.nameEn}
                icon={karanaInfo.nature === "good" ? "🔆" : "🌑"}
              />
            </div>

            {/* Sunrise / Sunset row */}
            <div className="flex gap-2">
              <div className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 text-sm">
                <SunRiseSetIcon type="rise" />
                <div>
                  <div className="text-[9px] text-primary-foreground/50 uppercase tracking-wide">সূর্যোদয়</div>
                  <div className="font-semibold text-xs sm:text-sm tabular-nums">{formatKolkataTime(sunTimes.sunrise)}</div>
                </div>
              </div>
              <div className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 text-sm">
                <SunRiseSetIcon type="set" />
                <div>
                  <div className="text-[9px] text-primary-foreground/50 uppercase tracking-wide">সূর্যাস্ত</div>
                  <div className="font-semibold text-xs sm:text-sm tabular-nums">{formatKolkataTime(sunTimes.sunset)}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
