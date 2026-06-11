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
  const pakshaDay  = tithiNumber ? ((tithiNumber - 1) % 15) + 1 : 0;

  const tithiColor = isPurnima
    ? "text-amber-700 dark:text-amber-300 font-bold"
    : isAmavasya ? "text-slate-600 dark:text-slate-300 font-bold"
    : "text-muted-foreground";

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
        isCurrentMonth && onClick && "cursor-pointer hover:bg-accent/40",
        !isCurrentMonth && "opacity-40 pointer-events-none bg-muted/20",
        isCurrentMonth && (
          isToday       ? "bg-primary/12 dark:bg-primary/20 ring-1 ring-inset ring-primary/50"
          : isPurnima   ? "bg-amber-50 dark:bg-amber-950/25"
          : isAmavasya  ? "bg-slate-100 dark:bg-slate-900/40"
          : "bg-card"
        ),
      )}
    >
      {isToday && <div className="absolute top-0 inset-x-0 h-1 bg-primary" />}

      {/* Top: Bengali day + Gregorian date */}
      <div className="flex items-start justify-between gap-0.5 leading-none">
        <span className={cn(
          "font-bold font-bengali tabular-nums leading-none",
          "text-base sm:text-2xl md:text-3xl",
          isToday      ? "text-primary"
          : isPurnima  ? "text-amber-600 dark:text-amber-400"
          : isAmavasya ? "text-slate-600 dark:text-slate-300"
          : "text-foreground",
        )}>
          {isCurrentMonth ? toBengaliNumerals(bengaliDay) : ""}
        </span>
        {isCurrentMonth && (
          <span className="shrink-0 mt-0.5 text-[9px] sm:text-[11px] text-muted-foreground tabular-nums leading-none sm:bg-muted/70 sm:px-1.5 sm:py-0.5 sm:rounded">
            {format(gregDate, "d")}
          </span>
        )}
      </div>

      {isCurrentMonth && (
        <div className="relative z-10 mt-auto min-w-0">
          {/* ── Mobile: compact, complete (no truncation) ── */}
          <div className="sm:hidden">
            {tithiNumber && (
              <div className={cn("text-[9px] font-bengali leading-tight tabular-nums", tithiColor)}>
                {isPurnima ? "🌕 পূর্ণিমা" : isAmavasya ? "🌑 অমাবস্যা" : (
                  <><span className="text-primary/80 font-semibold">{isShukla ? "শু" : "কৃ"}</span>{toBengaliNumerals(pakshaDay)}</>
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
