import { useState, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StaticPageLayout } from "@/components/StaticPageLayout";
import { toBengaliNumerals } from "@/lib/bengali-calendar";
import { cn } from "@/lib/utils";

function diffBreakdown(from: Date, to: Date) {
  const [earlier, later] = from <= to ? [from, to] : [to, from];
  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  let days = later.getDate() - earlier.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(later.getFullYear(), later.getMonth(), 0).getDate();
  }
  if (months < 0) { years -= 1; months += 12; }
  const totalDays = Math.round((later.getTime() - earlier.getTime()) / 86400000);
  return { years, months, days, totalDays, weeks: Math.floor(totalDays / 7) };
}

export default function DateDifferencePage() {
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>();

  const result = useMemo(() => {
    if (!fromDate || !toDate) return null;
    return diffBreakdown(fromDate, toDate);
  }, [fromDate, toDate]);

  return (
    <StaticPageLayout
      path="/date-difference"
      crumb="তারিখ পার্থক্য"
      title="দুই তারিখের পার্থক্য (Date Difference Calculator)"
      description="দুটি তারিখের মধ্যে কত বছর, মাস, সপ্তাহ ও দিনের ব্যবধান তা সহজে জেনে নিন।"
    >
      <div className="not-prose space-y-6">
        <p className="text-muted-foreground font-bengali">
          দুটি তারিখ দিন — কত দিন, সপ্তাহ, মাস বা বছরের ব্যবধান তা দেখুন।
        </p>

        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block font-bengali">প্রথম তারিখ</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-input bg-background", !fromDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "d MMMM yyyy") : <span>তারিখ বেছে নিন</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border" align="start">
                <Calendar mode="single" selected={fromDate} onSelect={setFromDate} captionLayout="dropdown" startMonth={new Date(1920, 0)} endMonth={new Date(2040, 0)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block font-bengali">দ্বিতীয় তারিখ</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-input bg-background", !toDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "d MMMM yyyy") : <span>তারিখ বেছে নিন</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border" align="start">
                <Calendar mode="single" selected={toDate} onSelect={setToDate} captionLayout="dropdown" startMonth={new Date(1920, 0)} endMonth={new Date(2040, 0)} initialFocus />
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
              <div className="text-sm text-primary-foreground/70 mb-1">পার্থক্য</div>
              <div className="text-3xl font-bold font-bengali">
                {toBengaliNumerals(result.years)} বছর {toBengaliNumerals(result.months)} মাস {toBengaliNumerals(result.days)} দিন
              </div>
              <div className="text-sm text-primary-foreground/70 mt-2 font-bengali">
                সর্বমোট {toBengaliNumerals(result.totalDays)} দিন ({toBengaliNumerals(result.weeks)} সপ্তাহ)
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground font-bengali">দুটি তারিখ বেছে নিন</div>
          )}
        </div>
      </div>
    </StaticPageLayout>
  );
}
