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
  const isPurnima    = tithiNumber === 15;
  const isAmavasya   = tithiNumber === 30;

  return (
    <div
      onClick={isCurrentMonth && onClick ? onClick : undefined}
      className={cn(
        // Base — each day is a distinct, rounded, bordered box
        "relative min-h-[76px] sm:min-h-[104px] md:min-h-[124px]",
        "p-1.5 sm:p-2.5 md:p-3 rounded-xl border",
        "flex flex-col justify-between overflow-hidden",
        "transition-all duration-200 select-none",
        // States
        isCurrentMonth && onClick && "cursor-pointer card-lift hover:shadow-premium hover:border-primary/50",
        !isCurrentMonth && "opacity-40 pointer-events-none border-transparent bg-transparent",
        // Background + border per day type
        isCurrentMonth && (
          isToday
            ? "bg-primary/12 dark:bg-primary/20 border-primary shadow-sm ring-1 ring-primary/40"
            : isPurnima  ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60"
            : isAmavasya ? "bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700"
            : "bg-card border-card-border shadow-sm"
        ),
      )}
    >
      {/* Today indicator bar at top */}
      {isToday && (
        <div className="absolute top-0 inset-x-0 h-1 bg-primary" />
      )}

      {/* Large moon watermark for Purnima / Amavasya */}
      {isCurrentMonth && (isPurnima || isAmavasya) && (
        <span className="absolute -bottom-1 -right-1 text-3xl sm:text-4xl opacity-20 pointer-events-none select-none">
          {isPurnima ? "🌕" : "🌑"}
        </span>
      )}

      {/* Top row: Bengali day + Gregorian date */}
      <div className="flex justify-between items-start gap-1 min-w-0">
        <span
          className={cn(
            "text-2xl sm:text-3xl md:text-4xl font-bold font-bengali tabular-nums leading-none",
            isToday          ? "text-primary"
            : isPurnima      ? "text-amber-600 dark:text-amber-400"
            : isAmavasya     ? "text-slate-600 dark:text-slate-300"
            : "text-foreground",
          )}
        >
          {isCurrentMonth ? toBengaliNumerals(bengaliDay) : ""}
        </span>

        <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted/70 px-1 sm:px-1.5 py-0.5 rounded shrink-0 leading-tight tabular-nums">
          {format(gregDate, "d")}
        </span>
      </div>

      {/* Tithi line — shown on every day */}
      {isCurrentMonth && tithiNameBn && (
        <div className={cn(
          "relative z-10 mt-1 text-[10px] sm:text-xs md:text-sm font-bengali leading-tight truncate",
          isPurnima  ? "font-bold text-amber-700 dark:text-amber-300"
          : isAmavasya ? "font-bold text-slate-600 dark:text-slate-300"
          : "text-muted-foreground",
        )}>
          {isPurnima ? "🌕 পূর্ণিমা" : isAmavasya ? "🌑 অমাবস্যা" : (
            <><span className="text-primary/70 font-semibold">{isShukla ? "শু" : "কৃ"}</span> {tithiNameBn}</>
          )}
        </div>
      )}

      {/* Bottom: festival badges */}
      {isCurrentMonth && festivals.length > 0 && (
        <div className="relative z-10 mt-auto pt-1 flex flex-col gap-0.5">
          {festivals.slice(0, 2).map((f, i) => (
            <div
              key={i}
              title={f.nameBn}
              className={cn(
                "flex items-center gap-0.5 text-[9px] sm:text-[11px] font-bengali font-medium px-1 py-0.5 rounded min-w-0",
                f.category === "national"
                  ? "bg-green-600/80 text-white"
                  : f.category === "religious"
                  ? "bg-primary/80 text-primary-foreground"
                  : "bg-violet-500/80 text-white",
              )}
            >
              <span className="shrink-0 text-[11px] sm:text-sm">{f.icon}</span>
              <span className="truncate">{f.nameBn}</span>
            </div>
          ))}

          {festivals.length > 2 && (
            <div className="text-[9px] sm:text-[11px] text-muted-foreground font-medium pl-0.5">
              +{toBengaliNumerals(festivals.length - 2)} আরো
            </div>
          )}
        </div>
      )}
    </div>
  );
}
