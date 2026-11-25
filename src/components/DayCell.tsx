import { format } from "date-fns";
import { Festival } from "@/lib/festivals";
import { toBengaliNumerals } from "@/lib/bengali-calendar";
import { cn } from "@/lib/utils";

interface DayCellProps {
  gregDate: Date;
  bengaliDay: number;
  isToday: boolean;
  festivals: Festival[];
  isCurrentMonth: boolean;
  tithiNumber?: number;
  tithiNameBn?: string;
  isShukla?: boolean;
  onClick?: () => void;
}

export function DayCell({
  gregDate, bengaliDay, isToday, festivals, isCurrentMonth, tithiNumber, tithiNameBn, isShukla, onClick
}: DayCellProps) {
  const isPurnima  = tithiNumber === 15;
  const isAmavasya = tithiNumber === 30;

  // Weekend marking (panjika convention): Sunday = holiday (red), Saturday = yellow.
  const dow        = gregDate.getUTCDay();
  const isSunday   = dow === 0;
  const isSaturday = dow === 6;
  const onDark     = isCurrentMonth && isAmavasya;   // Amavasya cells have a dark bg

  // Background: lunar events + today own the fill; weekends get a soft tint.
  const bgClass = !isCurrentMonth
    ? "opacity-40 pointer-events-none bg-muted/20"
    : isToday
      ? "bg-primary/12 dark:bg-primary/20 ring-1 ring-inset ring-primary/50"
    : isPurnima
      ? "bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/55 dark:to-amber-800/40 ring-1 ring-inset ring-amber-400/70 shadow-[inset_0_0_18px_rgba(251,191,36,0.55)]"
    : isAmavasya
      ? "bg-slate-800 dark:bg-slate-950 ring-1 ring-inset ring-slate-600/60"
    : isSunday
      ? "bg-red-50 dark:bg-red-950/30"
    : isSaturday
      ? "bg-yellow-50 dark:bg-yellow-950/25"
    : "bg-card";

  // Day-number colour: weekend hue wins, but stays light on the dark Amavasya fill.
  const dayNumColor = isToday
    ? "text-primary"
    : onDark
      ? (isSunday ? "text-red-300" : isSaturday ? "text-yellow-300" : "text-slate-100")
    : isSunday
      ? "text-red-600 dark:text-red-400"
    : isSaturday
      ? "text-yellow-700 dark:text-yellow-300"
    : isPurnima
      ? "text-amber-700 dark:text-amber-200"
    : "text-foreground";

  const tithiColor = onDark
    ? "text-slate-200 font-semibold"
    : isPurnima ? "text-amber-800 dark:text-amber-200 font-bold"
    : isSunday  ? "text-red-600/90 dark:text-red-300"
    : "text-muted-foreground";

  const engDateClass = onDark
    ? "text-slate-300 sm:bg-slate-700/50"
    : "text-muted-foreground sm:bg-muted/70";

  return (
    <div
      onClick={isCurrentMonth && onClick ? onClick : undefined}
      className={cn(
        // Borderless table cell — shares grid lines with neighbours, no gaps
        "relative min-h-[88px] sm:min-h-[132px] md:min-h-[162px] lg:min-h-[190px] xl:min-h-[206px]",
        "p-1.5 sm:p-3 md:p-3.5",
        "flex flex-col overflow-hidden",
        "border-r border-b border-border/50",
        "transition-colors duration-150 select-none",
        isCurrentMonth && onClick && "cursor-pointer hover:brightness-95 dark:hover:brightness-110",
        bgClass,
      )}
    >
      {isToday && <div className="absolute top-0 inset-x-0 h-1 bg-primary" />}

      {/* Top: Bengali day + Gregorian date */}
      <div className="flex items-start justify-between gap-0.5 leading-none">
        <span className={cn(
          "font-bold font-bengali tabular-nums leading-none whitespace-nowrap",
          "text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-7xl",
          dayNumColor,
        )}>
          {isCurrentMonth ? toBengaliNumerals(bengaliDay) : ""}
        </span>
        {isCurrentMonth && (
          <span className={cn(
            "shrink-0 mt-0.5 text-[9px] sm:text-xs tabular-nums leading-none whitespace-nowrap sm:px-1.5 sm:py-0.5 sm:rounded",
            engDateClass,
          )}>
            {format(gregDate, "d")}
          </span>
        )}
      </div>

      {isCurrentMonth && (
        <div className="relative z-10 mt-auto min-w-0">
          {/* ── Mobile: paksha initial + tithi ordinal — the full Bengali name
               (e.g. "ত্রয়োদশী") doesn't fit a 7-column mobile cell without an
               ugly mid-word ellipsis, so show the compact "শু ১৩" form instead,
               same convention most printed panjikas use at this scale. ── */}
          <div className="sm:hidden">
            {tithiNameBn && tithiNumber && (
              <div className={cn("text-[11px] font-bengali font-semibold leading-tight whitespace-nowrap", tithiColor)}>
                {isPurnima ? "🌕 পূর্ণিমা" : isAmavasya ? "🌑 অমা" : (
                  <>
                    <span className="text-primary/80">{isShukla ? "শু " : "কৃ "}</span>
                    {toBengaliNumerals(((tithiNumber - 1) % 15) + 1)}
                  </>
                )}
              </div>
            )}
            {festivals.length > 0 && (
              <div className="flex items-center gap-0.5 leading-none mt-0.5">
                {festivals.slice(0, 3).map((f, i) => (
                  <span key={i} title={f.nameBn} className="text-[11px]">{f.icon}</span>
                ))}
                {festivals.length > 3 && (
                  <span className="text-[8px] text-muted-foreground font-medium">+{toBengaliNumerals(festivals.length - 3)}</span>
                )}
              </div>
            )}
          </div>

          {/* ── Desktop: full tithi name + labelled festival pills ── */}
          <div className="hidden sm:block">
            {tithiNameBn && tithiNumber && (
              <div className={cn("text-xs md:text-sm font-bengali leading-tight truncate mb-0.5", tithiColor)}>
                {isPurnima ? "🌕 পূর্ণিমা" : isAmavasya ? "🌑 অমাবস্যা" : (
                  <><span className="text-primary/70 font-semibold">{isShukla ? "শু" : "কৃ"}</span> {tithiNameBn}</>
                )}
              </div>
            )}
            {/* Icon badges, not inline names — many festival/person names run
                long in Bengali and would need either truncation (cropped) or
                multi-line wrapping inside a single grid cell; the full name
                is still available via the tooltip and the day-details modal. */}
            <div className="flex flex-wrap items-center gap-1">
              {festivals.slice(0, 4).map((f, i) => (
                <span
                  key={i}
                  title={f.nameBn}
                  className={cn(
                    "grid place-items-center w-5 h-5 md:w-6 md:h-6 rounded-full text-xs md:text-sm shrink-0",
                    f.category === "national" ? "bg-green-600/80"
                    : f.category === "religious" ? "bg-primary/80"
                    : "bg-violet-500/80",
                  )}
                >
                  {f.icon}
                </span>
              ))}
              {festivals.length > 4 && (
                <span className="text-[11px] text-muted-foreground font-medium">
                  +{toBengaliNumerals(festivals.length - 4)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
