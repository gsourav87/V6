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
  onClick?: () => void;
}

export function DayCell({
  gregDate, bengaliDay, isToday, festivals, isCurrentMonth, tithiNumber, onClick
}: DayCellProps) {
  const isPurnima    = tithiNumber === 15;
  const isAmavasya   = tithiNumber === 30;

  return (
    <div
      onClick={isCurrentMonth && onClick ? onClick : undefined}
      className={cn(
        // Base
        "relative min-h-[62px] sm:min-h-[84px] md:min-h-[104px]",
        "p-1.5 sm:p-2.5 md:p-3",
        "flex flex-col justify-between",
        "border-r border-b border-border/30 last:border-r-0",
        "transition-all duration-150 select-none",
        // States
        isCurrentMonth && onClick && "cursor-pointer",
        !isCurrentMonth && "opacity-30 pointer-events-none",
        // Background
        isToday
          ? "bg-primary/10 dark:bg-primary/15"
          : isPurnima  && isCurrentMonth ? "bg-amber-50/70 dark:bg-amber-950/20"
          : isAmavasya && isCurrentMonth ? "bg-slate-100/60 dark:bg-slate-900/40"
          : "bg-card",
        // Hover — only for current month with click handler
        isCurrentMonth && onClick && !isToday && "hover:bg-accent/30",
      )}
    >
      {/* Today indicator bar at top */}
      {isToday && (
        <div className="absolute top-0 inset-x-0 h-[3px] bg-primary rounded-t-sm" />
      )}

      {/* Hover ring overlay */}
      {isCurrentMonth && onClick && (
        <div className="absolute inset-0 ring-inset ring-1 ring-transparent hover:ring-primary/25 transition-all pointer-events-none rounded-sm" />
      )}

      {/* Top row: Bengali day + Gregorian date */}
      <div className="flex justify-between items-start gap-1 min-w-0">
        <span
          className={cn(
            "text-xl sm:text-2xl md:text-3xl font-bold font-bengali tabular-nums leading-none",
            isToday          ? "text-primary"
            : isPurnima      ? "text-amber-600 dark:text-amber-400"
            : isAmavasya     ? "text-slate-500 dark:text-slate-400"
            : "text-foreground",
          )}
        >
          {isCurrentMonth ? toBengaliNumerals(bengaliDay) : ""}
        </span>

        <span className="text-[9px] sm:text-[11px] text-muted-foreground bg-muted/70 px-1 sm:px-1.5 py-0.5 rounded shrink-0 leading-tight">
          {format(gregDate, "d")}
        </span>
      </div>

      {/* Bottom: badges */}
      {isCurrentMonth && (
        <div className="mt-auto pt-0.5 flex flex-col gap-0.5">

          {isPurnima && (
            <div className="flex items-center gap-0.5 text-[8px] sm:text-[10px] font-bengali font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded min-w-0">
              <span className="shrink-0">🌕</span>
              <span className="truncate hidden sm:inline">পূর্ণিমা</span>
            </div>
          )}

          {isAmavasya && (
            <div className="flex items-center gap-0.5 text-[8px] sm:text-[10px] font-bengali font-semibold text-slate-300 bg-slate-700 dark:bg-slate-800 px-1 py-0.5 rounded min-w-0">
              <span className="shrink-0">🌑</span>
              <span className="truncate hidden sm:inline">অমাবস্যা</span>
            </div>
          )}

          {festivals.slice(0, isPurnima || isAmavasya ? 1 : 2).map((f, i) => (
            <div
              key={i}
              title={f.nameBn}
              className={cn(
                "flex items-center gap-0.5 text-[8px] sm:text-[10px] font-bengali font-medium px-1 py-0.5 rounded min-w-0",
                f.category === "national"
                  ? "bg-green-600/80 text-white"
                  : f.category === "religious"
                  ? "bg-primary/80 text-primary-foreground"
                  : "bg-violet-500/80 text-white",
              )}
            >
              <span className="shrink-0 text-[10px] sm:text-xs">{f.icon}</span>
              <span className="truncate">{f.nameBn}</span>
            </div>
          ))}

          {festivals.length > (isPurnima || isAmavasya ? 1 : 2) && (
            <div className="text-[8px] sm:text-[10px] text-muted-foreground font-medium pl-0.5">
              +{festivals.length - (isPurnima || isAmavasya ? 1 : 2)} আরো
            </div>
          )}
        </div>
      )}
    </div>
  );
}
