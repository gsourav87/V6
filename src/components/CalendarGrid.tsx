import { useMemo } from "react";
import { bengaliMonthDays, BANGLA_DAYS } from "@/lib/bengali-calendar";
import { Festival } from "@/lib/festivals";
import { getAllEventsForDate } from "@/lib/calendar-events";
import { getTithiAtSunrise } from "@/lib/panjika";
import { cn } from "@/lib/utils";
import { DayCell } from "./DayCell";

interface CalendarGridProps {
  year: number;
  month: number;
  todayDate: Date;
  onDateClick?: (date: Date) => void;
}

export function CalendarGrid({ year, month, todayDate, onDateClick }: CalendarGridProps) {
  const currentMonthDays = useMemo(() => {
    return bengaliMonthDays(year, month).map(dayObj => {
      const t = getTithiAtSunrise(dayObj.gregDate);
      return {
        ...dayObj,
        festivals:   getAllEventsForDate(dayObj.gregDate),
        tithiNumber: t.number,
        tithiNameBn: t.nameBn,
        isShukla:    t.isShukla,
      };
    });
  }, [year, month]);

  const startDayOfWeek = currentMonthDays[0].gregDate.getUTCDay();

  const paddingStart = Array.from({ length: startDayOfWeek }).map((_, i) => {
    const d = new Date(currentMonthDays[0].gregDate);
    d.setUTCDate(d.getUTCDate() - (startDayOfWeek - i));
    return { gregDate: d, bengaliDay: 0, festivals: [] as Festival[], tithiNumber: undefined, tithiNameBn: undefined, isShukla: undefined, isCurrentMonth: false };
  });

  const totalCells    = paddingStart.length + currentMonthDays.length;
  const paddingEndCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  const paddingEnd = Array.from({ length: paddingEndCount }).map((_, i) => {
    const d = new Date(currentMonthDays[currentMonthDays.length - 1].gregDate);
    d.setUTCDate(d.getUTCDate() + i + 1);
    return { gregDate: d, bengaliDay: 0, festivals: [] as Festival[], tithiNumber: undefined, tithiNameBn: undefined, isShukla: undefined, isCurrentMonth: false };
  });

  const allCells = [
    ...paddingStart,
    ...currentMonthDays.map(d => ({ ...d, isCurrentMonth: true })),
    ...paddingEnd,
  ];

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getUTCFullYear() === d2.getFullYear() &&
    d1.getUTCMonth()    === d2.getMonth()    &&
    d1.getUTCDate()     === d2.getDate();

  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl glow-focus border border-primary/15 overflow-hidden animate-fade-up">
      {/* Header Row */}
      <div className="grid grid-cols-7 bg-gradient-to-br from-primary via-primary to-primary/85 text-primary-foreground">
        {BANGLA_DAYS.map((day, i) => (
          <div key={i} className="py-2.5 sm:py-3 text-center">
            <div className={cn(
              "font-bold font-bengali text-sm sm:text-base md:text-lg",
              (i === 0 || i === 6) ? "text-amber-200" : "text-primary-foreground",
            )}>{day.short}</div>
            <div className="text-[8px] sm:text-[10px] md:text-xs text-primary-foreground/70 uppercase tracking-wider hidden sm:block">
              {day.en}
            </div>
          </div>
        ))}
      </div>

      {/* Days Grid — borderless table (no gaps), cells share grid lines */}
      <div className="grid grid-cols-7">
        {allCells.map((cell, i) => (
          <DayCell
            key={i}
            gregDate={cell.gregDate}
            bengaliDay={cell.bengaliDay}
            isToday={cell.isCurrentMonth && isSameDay(cell.gregDate, todayDate)}
            festivals={cell.festivals}
            isCurrentMonth={cell.isCurrentMonth}
            tithiNumber={cell.tithiNumber}
            tithiNameBn={cell.tithiNameBn}
            isShukla={cell.isShukla}
            onClick={cell.isCurrentMonth && onDateClick
              ? () => onDateClick(cell.gregDate)
              : undefined}
          />
        ))}
      </div>
    </div>
  );
}
