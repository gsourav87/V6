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
        "relative min-h-[62px] sm:min-h-[92px] md:min-h-[112px]",
        "p-1 sm:p-2 md:p-2.5",
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
          "font-bold font-bengali tabular-nums leading-none",
          "text-xl sm:text-3xl md:text-4xl",
          dayNumColor,
        )}>
          {isCurrentMonth ? toBengaliNumerals(bengaliDay) : ""}
        </span>
        {isCurrentMonth && (
          <span className={cn(
            "shrink-0 mt-0.5 text-[9px] sm:text-[11px] tabular-nums leading-none sm:px-1.5 sm:py-0.5 sm:rounded",
            engDateClass,
          )}>
            {format(gregDate, "d")}
          </span>
        )}
      </div>

      {isCurrentMonth && (
        <div className="relative z-10 mt-auto min-w-0">
          {/* ── Mobile: paksha initial + tithi name (in words) ── */}
          <div className="sm:hidden">
            {tithiNameBn && tithiNumber && (
              <div className={cn("text-[10px] font-bengali leading-tight truncate", tithiColor)}>
                {isPurnima ? "🌕 পূর্ণিমা" : isAmavasya ? "🌑 অমাবস্যা" : (
                  <><span className="text-primary/80 font-semibold">{isShukla ? "শু " : "কৃ "}</span>{tithiNameBn}</>
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
            <div className="flex flex-col gap-0.5">
              {festivals.slice(0, 2).map((f, i) => (
                <div
                  key={i}
                  title={f.nameBn}
                  className={cn(
                    "flex items-center gap-0.5 text-[11px] font-bengali font-medium px-1 py-0.5 rounded min-w-0",
                    f.category === "national" ? "bg-green-600/80 text-white"
                    : f.category === "religious" ? "bg-primary/80 text-primary-foreground"
                    : "bg-violet-500/80 text-white",
                  )}
                >
                  <span className="shrink-0 text-sm">{f.icon}</span>
                  <span className="truncate">{f.nameBn}</span>
                </div>
              ))}
              {festivals.length > 2 && (
                <div className="text-[11px] text-muted-foreground font-medium pl-0.5">
                  +{toBengaliNumerals(festivals.length - 2)} আরো
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
