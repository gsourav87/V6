import { Link } from "wouter";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toBengaliNumerals } from "@/lib/bengali-calendar";
import { ARTICLE_CATEGORIES, type Article } from "@/lib/article-parser";

const GREG_MONTHS_BN = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

/** "2026-07-05" → "৫ জুলাই ২০২৬" */
export function bnPublishDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${toBengaliNumerals(d)} ${GREG_MONTHS_BN[m - 1]} ${toBengaliNumerals(y)}`;
}

export function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  const cat = ARTICLE_CATEGORIES[article.category];

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group card-lift flex flex-col bg-card border border-border/70 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-premium transition-colors"
    >
      {/* Featured image over a gradient tile — the tile also covers missing/broken images */}
      <div className={cn("relative w-full overflow-hidden", compact ? "aspect-[2/1]" : "aspect-[16/9]")}>
        <div className={cn("absolute inset-0 bg-gradient-to-br grid place-items-center", cat.tile)}>
          <span className="text-5xl drop-shadow">{cat.icon}</span>
        </div>
        {article.image && (
          <img
            src={article.image}
            alt={article.imageAlt}
            loading="lazy"
            onError={e => { e.currentTarget.style.display = "none"; }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 bg-black/55 backdrop-blur text-white text-[11px] font-bengali font-semibold px-2.5 py-1 rounded-full">
          {cat.icon} {cat.labelBn}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className={cn("font-bengali font-bold text-foreground leading-snug group-hover:text-primary transition-colors", compact ? "text-sm" : "text-base sm:text-lg")}>
          {article.title}
        </h3>
        {!compact && article.excerpt && (
          <p className="font-bengali text-muted-foreground text-sm leading-relaxed mt-2 line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 mt-auto pt-3 text-xs text-muted-foreground font-bengali">
          {article.date && <span>{bnPublishDate(article.date)}</span>}
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {toBengaliNumerals(article.readMinutes)} মিনিট পড়া
          </span>
        </div>
      </div>
    </Link>
  );
}
