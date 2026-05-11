import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toBengaliDate, toBengaliNumerals, fromBengaliDate, BANGLA_MONTHS } from "@/lib/bengali-calendar";
import { cn } from "@/lib/utils";

export function DateConverter() {
  const [mode, setMode] = useState<"eng2bn" | "bn2eng">("eng2bn");

  const [engDate, setEngDate] = useState<Date | undefined>(new Date());

  const today = toBengaliDate(new Date());
  const [bnYear, setBnYear] = useState(today.year.toString());
  const [bnMonth, setBnMonth] = useState(today.month.toString());
  const [bnDay, setBnDay] = useState(today.day.toString());

  const bengaliResult = engDate ? toBengaliDate(engDate) : null;

  const gregResult = (() => {
    const y = parseInt(bnYear);
    const m = parseInt(bnMonth);
    const d = parseInt(bnDay);
    if (!y || isNaN(m) || !d || d < 1 || d > 32) return null;
    try { return fromBengaliDate(y, m, d); } catch { return null; }
  })();

  return (
    <div className="bg-card border border-card-border p-6 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <h2 className="text-xl font-bold font-bengali text-card-foreground">
          তারিখ রূপান্তর (Date Converter)
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMode(m => m === "eng2bn" ? "bn2eng" : "eng2bn")}
          className="gap-2 text-xs shrink-0"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          {mode === "eng2bn" ? "Switch: Bengali → English" : "Switch: English → Bengali"}
        </Button>
      </div>

      {mode === "eng2bn" ? (
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-full sm:w-auto">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Select English Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full sm:w-[240px] justify-start text-left font-normal border-input bg-background", !engDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {engDate ? format(engDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-border" align="start">
                <Calendar mode="single" selected={engDate} onSelect={setEngDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1 w-full bg-accent/30 rounded-xl p-4 border border-accent/50 min-h-[90px] flex flex-col justify-center">
            {bengaliResult ? (
              <div>
                <div className="text-sm text-muted-foreground font-medium mb-1">Bengali Date</div>
                <div className="text-2xl font-bold font-bengali text-foreground">
                  {toBengaliNumerals(bengaliResult.day)} {bengaliResult.monthNameBn}, {toBengaliNumerals(bengaliResult.year)} বঙ্গাব্দ
                </div>
                <div className="text-sm text-muted-foreground font-bengali mt-1">
                  {bengaliResult.dayNameBn} ({bengaliResult.dayNameEn})
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground italic">Select a date to convert</div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-full sm:w-auto space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block font-bengali">বাংলা মাস</label>
              <Select value={bnMonth} onValueChange={setBnMonth}>
                <SelectTrigger className="w-full sm:w-[170px] font-bengali bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BANGLA_MONTHS.map(m => (
                    <SelectItem key={m.idx} value={m.idx.toString()} className="font-bengali">
                      {m.bn} ({m.en})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block font-bengali">দিন (Day)</label>
                <input
                  type="number" min="1" max="31" value={bnDay}
                  onChange={e => setBnDay(e.target.value)}
                  className="w-20 h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Year (BS)</label>
                <input
                  type="number" min="1400" max="1450" value={bnYear}
                  onChange={e => setBnYear(e.target.value)}
                  className="w-24 h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="1433"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 w-full bg-accent/30 rounded-xl p-4 border border-accent/50 min-h-[90px] flex flex-col justify-center">
            {gregResult ? (
              <div>
                <div className="text-sm text-muted-foreground font-medium mb-1">English Date</div>
                <div className="text-2xl font-bold text-foreground">
                  {format(gregResult, "d MMMM yyyy")}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {format(gregResult, "EEEE")}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground italic">Enter a Bengali date to convert</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
