import { useState, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StaticPageLayout } from "@/components/StaticPageLayout";
import { toJDE, moonSiderealLon } from "@/lib/ephemeris";
import { rashiFromSiderealLon, elementNameBn } from "@/lib/rashi";
import { cn } from "@/lib/utils";

export default function BirthRashiPage() {
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [birthTime, setBirthTime] = useState("12:00");

  const result = useMemo(() => {
    if (!birthDate) return null;
    const [hh, mm] = birthTime.split(":").map(Number);
    const jde = toJDE(birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate(), hh + mm / 60, 5.5);
    const lon = moonSiderealLon(jde);
    return rashiFromSiderealLon(lon);
  }, [birthDate, birthTime]);

  return (
    <StaticPageLayout
      path="/birth-rashi-calculator"
      crumb="জন্ম রাশি"
      title="জন্ম রাশি নির্ণয় (Birth Rashi Calculator)"
      description="জন্মের তারিখ ও সময় দিয়ে নিজের জন্ম রাশি (চন্দ্র রাশি) জেনে নিন।"
    >
      <div className="not-prose space-y-6">
        <p className="text-muted-foreground font-bengali">
          জন্মের সময় চন্দ্র যে রাশিতে অবস্থান করছিল, জ্যোতিষ শাস্ত্রে সেটিকেই
          জন্ম রাশি বা চন্দ্র রাশি বলা হয়। জন্ম তারিখ ও সময় (ভারতীয় প্রমাণ সময়, IST) দিন।
        </p>

        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block font-bengali">জন্ম তারিখ</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-input bg-background", !birthDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "d MMMM yyyy") : <span>জন্ম তারিখ বেছে নিন</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border" align="start">
                <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} captionLayout="dropdown" startMonth={new Date(1920, 0)} endMonth={new Date()} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block font-bengali">জন্ম সময় (IST)</label>
            <input
              type="time"
              value={birthTime}
              onChange={e => setBirthTime(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className={cn(
          "rounded-2xl p-6 min-h-[140px] flex flex-col justify-center",
          result
            ? cn("shadow-premium border bg-gradient-to-br text-white", result.color)
            : "border-2 border-dashed border-border bg-muted/20",
        )}>
          {result ? (
            <>
              <div className="text-sm text-white/70 mb-1">জন্ম রাশি</div>
              <div className="text-3xl font-bold font-bengali flex items-center gap-2">
                <span>{result.symbol}</span>
                <span>{result.nameBn}</span>
                <span className="text-lg font-normal text-white/70">({result.nameEn})</span>
              </div>
              <div className="text-sm text-white/80 mt-2 font-bengali">
                রাশিপতি: {result.lord} · মূল তত্ত্ব: {elementNameBn(result.element)}
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground font-bengali">জন্ম তারিখ ও সময় দিন</div>
          )}
        </div>

        <p className="text-xs text-muted-foreground font-bengali">
          জ্যোতিষ কার্যে সঠিক গণনার ক্ষেত্রে সাধারণত দৃকসিদ্ধ ভিত্তিক (লাহিড়ী অয়নাংশ) গণনাকে প্রাধান্য
          দেওয়া হয় — এখানেও সেই পদ্ধতিতেই রাশি নির্ণয় করা হয়েছে।
        </p>
      </div>
    </StaticPageLayout>
  );
}
