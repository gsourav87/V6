import { useEffect, useState } from "react";
import { Link } from "wouter";
import { X, Sparkles } from "lucide-react";
import { FESTIVALS } from "@/lib/festivals";
import { toBengaliNumerals } from "@/lib/bengali-calendar";

const DAY_MS = 86400000;

/** Nearest upcoming (or currently in-progress) occurrence of a festival slug. */
function nearestDate(slug: string, today: string): string | undefined {
  const dates = FESTIVALS.filter(f => f.slug === slug).map(f => f.date).sort();
  return dates.find(d => d >= today) ?? dates[dates.length - 1];
}

/**
 * Dismissible countdown banner for Durga Puja — only renders in the ~month
 * leading up to Shashthi through the day after Vijaya Dashami, so it doesn't
 * linger as clutter the rest of the year. Dismissal is keyed by that year's
 * Shashthi date, so it naturally reappears fresh next year without any code
 * changes needed.
 */
export function DurgaPujaBanner() {
  const [dismissed, setDismissed] = useState(true); // default hidden until we know the window applies

  const todayStr = new Date().toISOString().slice(0, 10);
  const shashthi = nearestDate("maha-shashthi", todayStr);
  const dashami = nearestDate("vijaya-dashami", todayStr);

  useEffect(() => {
    if (!shashthi || !dashami) return;
    const windowStart = new Date(new Date(shashthi + "T00:00:00Z").getTime() - 30 * DAY_MS).toISOString().slice(0, 10);
    const windowEnd = new Date(new Date(dashami + "T00:00:00Z").getTime() + 1 * DAY_MS).toISOString().slice(0, 10);
    if (todayStr < windowStart || todayStr > windowEnd) return;

    try {
      if (localStorage.getItem(`dpb-dismissed-${shashthi}`) === "1") return;
    } catch { /* localStorage unavailable — just show it */ }
    setDismissed(false);
  }, [shashthi, dashami, todayStr]);

  if (dismissed || !shashthi) return null;

  const daysUntil = Math.round((new Date(shashthi + "T00:00:00Z").getTime() - new Date().setHours(0, 0, 0, 0)) / DAY_MS);
  const inProgress = daysUntil < 0;
  const year = shashthi.slice(0, 4);

  const dismiss = () => {
    try { localStorage.setItem(`dpb-dismissed-${shashthi}`, "1"); } catch { /* ignore */ }
    setDismissed(true);
  };

  return (
    <div className="relative bg-gradient-to-r from-orange-600 via-rose-600 to-red-700 text-white rounded-2xl shadow-premium mb-4 overflow-hidden">
      <button
        onClick={dismiss}
        aria-label="বন্ধ করুন"
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <Link href="/festival/durga-puja" className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 pr-10">
        <span className="text-3xl sm:text-4xl shrink-0">🌺</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-white/80 text-[11px] font-bengali font-semibold uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3 h-3" />
            দুর্গাপূজা {toBengaliNumerals(year)}
          </div>
          <div className="font-bengali font-bold text-base sm:text-lg leading-tight">
            {inProgress ? "শুভ দুর্গাপূজা চলছে!" : "দুর্গাপূজা আসছে!"}
          </div>
          <div className="text-white/85 text-xs sm:text-sm font-bengali mt-0.5">
            {inProgress
              ? "ষষ্ঠী থেকে বিজয়া দশমী — সম্পূর্ণ নির্ঘণ্ট ও প্রতিদিনের সময়সূচি দেখুন"
              : `ষষ্ঠী আর ${toBengaliNumerals(daysUntil)} দিন বাকি — সম্পূর্ণ নির্ঘণ্ট, সন্ধিপুজোর সময়সূচি সবকিছু দেখুন`}
          </div>
        </div>
        <span className="shrink-0 hidden sm:inline-flex items-center rounded-full bg-white text-red-700 font-bengali font-bold text-sm px-4 py-2">
          নির্ঘণ্ট দেখুন
        </span>
      </Link>
    </div>
  );
}
