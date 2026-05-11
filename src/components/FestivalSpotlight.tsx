import { useMemo } from "react";
import { Link } from "wouter";
import { FESTIVALS } from "@/lib/festivals";
import { getFestivalDetail } from "@/lib/festival-details";
import { toBengaliNumerals } from "@/lib/bengali-calendar";
import { cn } from "@/lib/utils";
import { ChevronRight, Sparkles } from "lucide-react";

function todayKey() {
  const n = new Date();
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, "0");
  const d = String(n.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function FestivalSpotlight() {
  const { todayFestivals, nextFestival, daysUntil } = useMemo(() => {
    const today = todayKey();
    const todayFestivals = FESTIVALS.filter(f => f.date === today && f.slug);

    const upcoming = FESTIVALS.filter(f => f.date > today && f.slug)
      .sort((a, b) => a.date.localeCompare(b.date));

    // pick first unique slug
    const seen = new Set<string>();
    const nextUnique = upcoming.find(f => {
      if (seen.has(f.slug!)) return false;
      seen.add(f.slug!);
      return true;
    });

    const daysUntil = nextUnique
      ? Math.round((new Date(nextUnique.date + "T00:00:00Z").getTime() - new Date().setHours(0,0,0,0)) / 86400000)
      : 0;

    return { todayFestivals, nextFestival: nextUnique, daysUntil };
  }, []);

  // Today has festival(s)
  if (todayFestivals.length > 0) {
    const primary = todayFestivals[0];
    const detail = primary.slug ? getFestivalDetail(primary.slug) : null;
    const gradient = detail?.headerGradient ?? "from-orange-500 to-red-600";

    return (
      <div className={cn("rounded-2xl bg-gradient-to-br text-white p-5 shadow-md", gradient)}>
        <div className="flex items-center gap-2 text-white/70 text-xs font-bengali font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          আজকের উৎসব
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-3xl mb-1">{primary.icon}</div>
            <h2 className="text-xl font-bold font-bengali leading-tight">{primary.nameBn}</h2>
            {detail && (
              <p className="text-white/75 text-xs font-bengali mt-1 leading-relaxed line-clamp-2">
                {detail.tagline}
              </p>
            )}
            {todayFestivals.length > 1 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {todayFestivals.slice(1).map(f => (
                  <span key={f.date + f.nameBn} className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bengali">
                    {f.icon} {f.nameBn}
                  </span>
                ))}
              </div>
            )}
          </div>
          {primary.slug && (
            <Link
              href={`/festival/${primary.slug}`}
              className="shrink-0 flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-bengali font-semibold transition-colors"
            >
              বিস্তারিত <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  // No festival today — show next upcoming
  if (!nextFestival) return null;

  const detail = nextFestival.slug ? getFestivalDetail(nextFestival.slug) : null;

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
      <div className="text-3xl shrink-0">{nextFestival.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold text-muted-foreground font-bengali uppercase tracking-wider mb-0.5">
          পরবর্তী উৎসব
        </div>
        <div className="font-bold font-bengali text-foreground leading-tight">{nextFestival.nameBn}</div>
        {detail && (
          <div className="text-xs text-muted-foreground font-bengali mt-0.5 line-clamp-1">{detail.tagline}</div>
        )}
      </div>
      <div className="shrink-0 text-right">
        <div className="text-2xl font-bold text-primary font-bengali leading-none">
          {toBengaliNumerals(daysUntil)}
        </div>
        <div className="text-[10px] text-muted-foreground font-bengali">দিন বাকি</div>
        {nextFestival.slug && (
          <Link
            href={`/festival/${nextFestival.slug}`}
            className="mt-1.5 inline-flex items-center gap-0.5 text-[10px] text-primary hover:underline font-bengali font-semibold"
          >
            বিস্তারিত <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
