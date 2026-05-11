import { useState, useMemo, useCallback } from "react";
import { toBengaliDate } from "@/lib/bengali-calendar";

export function useCalendar() {
  const today = useMemo(() => toBengaliDate(new Date()), []);
  
  const [selectedYear, setSelectedYear] = useState<number>(today.year);
  const [selectedMonth, setSelectedMonth] = useState<number>(today.month);

  const goToToday = useCallback(() => {
    setSelectedYear(today.year);
    setSelectedMonth(today.month);
  }, [today.year, today.month]);

  const goToNextMonth = useCallback(() => {
    if (selectedMonth === 11) {
      if (selectedYear < 1436) {
        setSelectedYear(y => y + 1);
        setSelectedMonth(0);
      }
    } else {
      setSelectedMonth(m => m + 1);
    }
  }, [selectedMonth, selectedYear]);

  const goToPrevMonth = useCallback(() => {
    if (selectedMonth === 0) {
      if (selectedYear > 1430) {
        setSelectedYear(y => y - 1);
        setSelectedMonth(11);
      }
    } else {
      setSelectedMonth(m => m - 1);
    }
  }, [selectedMonth, selectedYear]);

  const setMonth = useCallback((month: number) => setSelectedMonth(month), []);
  const setYear = useCallback((year: number) => setSelectedYear(year), []);

  return {
    selectedYear,
    selectedMonth,
    goToToday,
    goToNextMonth,
    goToPrevMonth,
    setMonth,
    setYear,
  };
}
