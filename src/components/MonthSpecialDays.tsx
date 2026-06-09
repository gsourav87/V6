import { useMemo } from "react";
import { Link } from "wouter";
import { bengaliMonthDays, toBengaliNumerals, BANGLA_DAYS } from "@/lib/bengali-calendar";
import { getAllEventsForDate } from "@/lib/calendar-events";
import { Sparkles, ChevronRight } from "lucide-react";

const GREG_MONTH_BN = ["জানু", "ফেব", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্ট", "অক্টো", "নভে", "ডিসে"];

interface Props {
  banglaYear: number;
  banglaMonth: number;   // 0 = Boishakh
}

/**
 * Lists every special day (festivals, observances, person anniversaries) that
 * falls within the displayed Bengali month, as a scannable panel beneath the grid.
 */
export function MonthSpecialDays({ banglaYear, banglaMonth }: Props) {
  const days = useMemo(() => {
    return bengaliMonthDays(banglaYear, banglaMonth)
      .map(d => ({ ...d, events: getAllEventsForDate(d.gregDate) }))
      .filter(d => d.events.length > 0);
  }, [banglaYear, banglaMonth]);

  const total = days.reduce((n, d) => n + d.events.length, 0);
  if (days.length === 0) return null;

  return (
    <section className="bg-card border border-card-border rounded-3xl shadow-premium overflow-hidden animate-fade-up">
      <div className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-primary/15 to-transparent border-b border-border/60">
        <Sparkles className="w-4 h-4 text-primary shrink-0" />
        <h3 className="font-bengali font-bold text-foreground text-base">এই মাসের বিশেষ দিন</h3>
        <span className="ml-auto text-xs font-bengali text-muted-foreground">
          {toBengaliNumerals(total)}টি দিন
        </span>
      </div>

      <ul className="divide-y divide-border/50">
        {days.map(({ gregDate, bengaliDay, events }) => {
          const gM = gregDate.getUTCMonth();
          const gD = gregDate.getUTCDate();
          const dow = gregDate.getUTCDay();
          const href = `/date/${gregDate.getUTCFullYear()}/${gM + 1}/${gD}`;
          return (
            <li key={gregDate.toISOString()}>
              <Link
                href={href}
                className="group flex items-center gap-3 px-4 py-3 hover:bg-accent/40 transition-colors"
              >
                {/* Date chip */}
                <div className="shrink-0 w-12 text-center">
                  <div className="text-lg font-bold font-bengali text-primary leading-none">
                    {toBengaliNumerals(gD)}
                  </div>
                  <div className="text-[10px] font-bengali text-muted-foreground mt-0.5">{GREG_MONTH_BN[gM]}</div>
                </div>

                <div className="w-px self-stretch bg-border/60" />

                {/* Events */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {events.map((e, i) => (
                      <span key={i} className="inline-flex items-center gap-1 font-bengali text-sm text-foreground">
                        <span className="text-base">{e.icon}</span>
                        <span className="leading-tight">{e.nameBn}</span>
                        {i < events.length - 1 && <span className="text-muted-foreground/50">·</span>}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] font-bengali text-muted-foreground mt-0.5">
                    {BANGLA_DAYS[dow].bn} · বাংলা {toBengaliNumerals(bengaliDay)}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary shrink-0 transition-colors" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
