import { Link } from "wouter";
import { ArrowRight, BookOpen } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/articles";

/**
 * Homepage strip: the three latest বাংলার ঐতিহ্য ও ইতিহাস articles, shown
 * right under the today's-date hero. Lazy-loaded from App so the article
 * markdown bundle stays out of the initial page load.
 */
export default function LatestArticles() {
  const latest = getAllArticles().slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <section aria-label="বাংলার ঐতিহ্য ও ইতিহাস — সাম্প্রতিক নিবন্ধ">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 font-bengali font-bold text-foreground text-base sm:text-lg">
          <span className="grid place-items-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md ring-1 ring-white/20">
            <BookOpen className="w-4 h-4" />
          </span>
          বাংলার ঐতিহ্য ও ইতিহাস
        </h2>
        <Link
          href="/articles"
          className="inline-flex items-center gap-1 text-sm font-bengali font-semibold text-primary hover:underline underline-offset-2"
        >
          সব নিবন্ধ <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {latest.map(a => (
          <ArticleCard key={a.slug} article={a} compact />
        ))}
      </div>
    </section>
  );
}
