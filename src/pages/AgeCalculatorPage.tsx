import { useState, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StaticPageLayout } from "@/components/StaticPageLayout";
import { toBengaliNumerals } from "@/lib/bengali-calendar";
import { cn } from "@/lib/utils";

function ageBreakdown(birth: Date, asOf: Date) {
  let years = asOf.getFullYear() - birth.getFullYear();
  let months = asOf.getMonth() - birth.getMonth();
  let days = asOf.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalDays = Math.floor((asOf.getTime() - birth.getTime()) / 86400000);
  return { years, months, days, totalDays };
}

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [asOfDate, setAsOfDate] = useState<Date>(new Date());

  const result = useMemo(() => {
    if (!birthDate || birthDate > asOfDate) return null;
    return ageBreakdown(birthDate, asOfDate);
  }, [birthDate, asOfDate]);

  return (
    <StaticPageLayout
      path="/age-calculator"
      crumb="বয়স গণনা"
      title="বয়স গণনা (Age Calculator)"
      description="জন্ম তারিখ থেকে সঠিক বয়স জানুন — বছর, মাস ও দিন হিসেবে।"
    >
      <div className="not-prose space-y-6">
        <p className="text-muted-foreground font-bengali">
          জন্ম তারিখ দিন, নির্ভুলভাবে বছর-মাস-দিন হিসেবে বয়স জেনে নিন।
        </p>

        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block font-bengali">জন্ম তারিখ</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal border-input bg-background", !birthDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "d MMMM yyyy") : <span>জন্ম তারিখ বেছে নিন</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  captionLayout="dropdown"
                  startMonth={new Date(1920, 0)}
                  endMonth={new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block font-bengali">কোন তারিখে বয়স জানতে চান</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal border-input bg-background">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(asOfDate, "d MMMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border" align="start">
                <Calendar mode="single" selected={asOfDate} onSelect={d => d && setAsOfDate(d)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className={cn(
          "rounded-2xl p-6 min-h-[120px] flex flex-col justify-center",
          result
            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-premium"
            : "border-2 border-dashed border-border bg-muted/20",
        )}>
          {result ? (
            <>
              <div className="text-sm text-primary-foreground/70 mb-1">বয়স</div>
              <div className="text-3xl font-bold font-bengali">
                {toBengaliNumerals(result.years)} বছর {toBengaliNumerals(result.months)} মাস {toBengaliNumerals(result.days)} দিন
              </div>
              <div className="text-sm text-primary-foreground/70 mt-2 font-bengali">
                সর্বমোট {toBengaliNumerals(result.totalDays)} দিন
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground font-bengali">জন্ম তারিখ বেছে নিন</div>
          )}
        </div>
      </div>
    </StaticPageLayout>
  );
}
