import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronLeft, ChevronRight, CalendarDays, Sparkles } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { MonthSpecialDays } from "@/components/MonthSpecialDays";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCalendar } from "@/hooks/useCalendar";
import { BANGLA_MONTHS, toBengaliNumerals, bengaliMonthDays } from "@/lib/bengali-calendar";
import { getAllEventsForDate } from "@/lib/calendar-events";
import { applyPageSEO, injectSchema, removeSchema, SITE_URL } from "@/lib/seo";

const SCHEMA_ID = "important-days-schema";

export default function ImportantDaysPage() {
  const {
    selectedYear, selectedMonth, goToPrevMonth, goToNextMonth, goToToday, setMonth, setYear,
  } = useCalendar();

  const years = Array.from({ length: 7 }, (_, i) => 1430 + i);
  const monthLabel = BANGLA_MONTHS[selectedMonth];

  const eventCount = useMemo(() => {
    return bengaliMonthDays(selectedYear, selectedMonth)
      .reduce((n, d) => n + getAllEventsForDate(d.gregDate).length, 0);
  }, [selectedYear, selectedMonth]);

  const title = `${monthLabel.bn} ${toBengaliNumerals(selectedYear)} বঙ্গাব্দের বিশেষ দিন ও উৎসব`;
  const description = `${monthLabel.bn} (${monthLabel.en}) ${toBengaliNumerals(selectedYear)} বঙ্গাব্দে কোন কোন বিশেষ দিন, উৎসব ও জয়ন্তী পড়ছে — সম্পূর্ণ তালিকা দেখুন।`;

  useEffect(() => {
    applyPageSEO({
      title: `${title} | সঠিক বাংলা ক্যালেন্ডার`,
      description,
      path: "/important-days",
      schemaId: SCHEMA_ID,
      schema: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": title,
        "description": description,
        "url": `${SITE_URL}/important-days`,
      },
    });
    injectSchema("important-days-breadcrumb-schema", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "সঠিক বাংলা ক্যালেন্ডার", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "বিশেষ দিন", "item": `${SITE_URL}/important-days` },
      ],
    });
    return () => {
      removeSchema(SCHEMA_ID);
      removeSchema("important-days-breadcrumb-schema");
    };
  }, [title, description]);

  return (
    <div className="min-h-screen pb-20">
      <NavBar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-bengali">মূল ক্যালেন্ডারে ফিরুন</span>
        </Link>

        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold font-bengali text-foreground">এই মাসের বিশেষ দিন ও উৎসব</h1>
        </div>
        <p className="text-sm text-muted-foreground font-bengali mb-5">
          {monthLabel.bn} {toBengaliNumerals(selectedYear)} বঙ্গাব্দে মোট {toBengaliNumerals(eventCount)}টি বিশেষ দিন রয়েছে।
        </p>

        {/* Month navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-card p-4 rounded-2xl shadow-sm border border-card-border mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="icon" onClick={goToPrevMonth} aria-label="আগের মাস">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth} aria-label="পরের মাস">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={goToToday} className="ml-2 font-bengali font-medium">
              <CalendarDays className="mr-2 h-4 w-4" />
              এই মাস
            </Button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={selectedMonth.toString()} onValueChange={v => setMonth(parseInt(v))}>
              <SelectTrigger className="w-[140px] font-bengali font-medium bg-background">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {BANGLA_MONTHS.map(m => (
                  <SelectItem key={m.idx} value={m.idx.toString()} className="font-bengali">
                    {m.bn} ({m.en})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear.toString()} onValueChange={v => setYear(parseInt(v))}>
              <SelectTrigger className="w-[110px] font-bengali font-medium bg-background">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={y.toString()} className="font-bengali">
                    {toBengaliNumerals(y)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <MonthSpecialDays banglaYear={selectedYear} banglaMonth={selectedMonth} />
        {eventCount === 0 && (
          <div className="text-center text-muted-foreground font-bengali text-sm py-10 border-2 border-dashed border-border rounded-2xl">
            এই মাসে তালিকাভুক্ত কোনো বিশেষ দিন নেই।
          </div>
        )}

        <nav aria-label="আরও দেখুন" className="mt-6 flex flex-wrap gap-2 justify-center">
          <Link href="/festivals" className="text-xs bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-full transition-colors font-bengali font-medium">
            সব উৎসবের তালিকা
          </Link>
          <Link href="/panjika" className="text-xs bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-full transition-colors font-bengali font-medium">
            আজকের পঞ্জিকা
          </Link>
        </nav>
      </main>
    </div>
  );
}
