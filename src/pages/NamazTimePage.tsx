import { useState, useMemo } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaticPageLayout } from "@/components/StaticPageLayout";
import { getNamazTimes } from "@/lib/namaz";
import { formatKolkataTime } from "@/lib/panjika";
import { cn } from "@/lib/utils";

function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
      <span className="font-bengali font-medium text-muted-foreground">{label}</span>
      <div className="text-right">
        <div className="font-bold text-foreground">{value}</div>
        {sub && <div className="text-xs text-muted-foreground font-bengali">{sub}</div>}
      </div>
    </div>
  );
}

export default function NamazTimePage() {
  const [date, setDate] = useState(() => new Date());
  const utcDate = useMemo(() => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())), [date]);
  const times = useMemo(() => getNamazTimes(utcDate), [utcDate]);

  return (
    <StaticPageLayout
      path="/namaz-time"
      crumb="নামাজের সময়"
      title="নামাজের সময়সূচী (Namaz Time — Kolkata)"
      description="কলকাতার জন্য আজকের ফজর, যোহর, আসর, মাগরিব ও এশার নামাজের সঠিক সময়।"
    >
      <div className="not-prose space-y-5">
        <div className="flex items-center justify-between gap-2">
          <Button variant="outline" size="icon" onClick={() => setDate(d => subDays(d, 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="font-bengali font-bold text-foreground">{format(date, "d MMMM yyyy")}</div>
          <Button variant="outline" size="icon" onClick={() => setDate(d => addDays(d, 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="bg-card border border-card-border rounded-2xl shadow-sm px-4">
          <Row label="ফজর / সুবহে সাদিক" value={times.fajr ? formatKolkataTime(times.fajr) : "—"} />
          <Row label="সূর্যোদয়" value={formatKolkataTime(times.sunrise)} />
          <Row label="যোহর" value={formatKolkataTime(times.dhuhr)} />
          <Row label="আসর" value={times.asrHanafi ? formatKolkataTime(times.asrHanafi) : "—"} sub="হানাফি মত" />
          <Row label="আসর" value={times.asrShafi ? formatKolkataTime(times.asrShafi) : "—"} sub="শাফি মত" />
          <Row label="মাগরিব" value={formatKolkataTime(times.maghrib)} />
          <Row label="এশা" value={times.isha ? formatKolkataTime(times.isha) : "—"} />
        </div>

        <p className={cn("text-xs text-muted-foreground font-bengali")}>
          কলকাতার স্থানাঙ্ক অনুযায়ী গণনা করা হয়েছে (ফজর/এশার কোণ ১৮°, করাচি পদ্ধতি অনুসরণে)। স্থানীয়
          মসজিদের ঘোষিত সময়ের সাথে কয়েক মিনিটের তফাত হতে পারে।
        </p>
      </div>
    </StaticPageLayout>
  );
}
