import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BANGLA_MONTHS, toBengaliNumerals } from "@/lib/bengali-calendar";
import { PushNotifications } from "@/components/PushNotifications";
import { ThemeSelector } from "@/components/ThemeSelector";

interface MonthNavigatorProps {
  selectedYear: number;
  selectedMonth: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
}

export function MonthNavigator({
  selectedYear,
  selectedMonth,
  setYear,
  setMonth,
  goToPrevMonth,
  goToNextMonth,
  goToToday
}: MonthNavigatorProps) {
  // Year range 1430-1436
  const years = Array.from({ length: 7 }, (_, i) => 1430 + i);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card p-4 rounded-2xl shadow-sm border border-card-border mb-6">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button variant="outline" size="icon" onClick={goToPrevMonth} data-testid="button-prev-month" aria-label="আগের মাস">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={goToNextMonth} data-testid="button-next-month" aria-label="পরের মাস">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="secondary" onClick={goToToday} className="ml-2 font-bengali font-medium" data-testid="button-today">
          <CalendarIcon className="mr-2 h-4 w-4" />
          আজ (Today)
        </Button>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Select value={selectedMonth.toString()} onValueChange={(v) => setMonth(parseInt(v))} data-testid="select-month">
          <SelectTrigger className="w-[140px] font-bengali font-medium bg-background">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {BANGLA_MONTHS.map((m) => (
              <SelectItem key={m.idx} value={m.idx.toString()} className="font-bengali">
                {m.bn} ({m.en})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear.toString()} onValueChange={(v) => setYear(parseInt(v))} data-testid="select-year">
          <SelectTrigger className="w-[110px] font-bengali font-medium bg-background">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()} className="font-bengali">
                {toBengaliNumerals(y)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <PushNotifications />

        <ThemeSelector />
      </div>
    </div>
  );
}
