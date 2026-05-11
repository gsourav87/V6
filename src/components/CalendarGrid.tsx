import { useMemo } from "react";
import { bengaliMonthDays, BANGLA_DAYS } from "@/lib/bengali-calendar";
import { Festival } from "@/lib/festivals";
import { getAllEventsForDate } from "@/lib/calendar-events";
import { getTithiAtSunrise } from "@/lib/panjika";
import { DayCell } from "./DayCell";

interface CalendarGridProps {
  year: number;
  month: number;
  todayDate: Date;
  onDateClick?: (date: Date) => void;
}

export function CalendarGrid({ year, month, todayDate, onDateClick }: CalendarGridProps) {
  const currentMonthDays = useMemo(() => {
    return bengaliMonthDays(year, month).map(dayObj => ({
      ...dayObj,
      festivals:   getAllEventsForDate(dayObj.gregDate),
      tithiNumber: getTithiAtSunrise(dayObj.gregDate).number,
    }));
  }, [year, month]);

  const startDayOfWeek = currentMonthDays[0].gregDate.getUTCDay();

  const paddingStart = Array.from({ length: startDayOfWeek }).map((_, i) => {
    const d = new Date(currentMonthDays[0].gregDate);
    d.setUTCDate(d.getUTCDate() - (startDayOfWeek - i));
    return { gregDate: d, bengaliDay: 0, festivals: [] as Festival[], tithiNumber: undefined, isCurrentMonth: false };
  });

  const totalCells    = paddingStart.length + currentMonthDays.length;
  const paddingEndCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  const paddingEnd = Array.from({ length: paddingEndCount }).map((_, i) => {
    const d = new Date(currentMonthDays[currentMonthDays.length - 1].gregDate);
    d.setUTCDate(d.getUTCDate() + i + 1);
    return { gregDate: d, bengaliDay: 0, festivals: [] as Festival[], tithiNumber: undefined, isCurrentMonth: false };
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
    <div className="bg-card rounded-3xl shadow-lg border-2 border-border/20 overflow-hidden backdrop-blur-sm">
      {/* Header Row */}
      <div className="grid grid-cols-7 border-b-2 border-gradient-to-r from-primary/30 via-primary/20 to-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
        {BANGLA_DAYS.map((day, i) => (
          <div key={i} className="p-2 sm:p-3 text-center border-r border-border/20 last:border-r-0">
            <div className="font-bold font-bengali text-foreground text-sm sm:text-base md:text-lg">{day.short}</div>
            <div className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider hidden sm:block">
              {day.en}
            </div>
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-px bg-gradient-to-b from-border/20 to-border/10">
        {allCells.map((cell, i) => (
          <DayCell
            key={i}
            gregDate={cell.gregDate}
            bengaliDay={cell.bengaliDay}
            isToday={cell.isCurrentMonth && isSameDay(cell.gregDate, todayDate)}
            festivals={cell.festivals}
            isCurrentMonth={cell.isCurrentMonth}
            tithiNumber={cell.tithiNumber}
            onClick={cell.isCurrentMonth && onDateClick
              ? () => onDateClick(cell.gregDate)
              : undefined}
          />
        ))}
      </div>
    </div>
  );
}
