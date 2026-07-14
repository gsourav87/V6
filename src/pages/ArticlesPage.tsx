import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, BookOpen } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { ArticleCard } from "@/components/ArticleCard";
import { applyPageSEO, injectSchema, removeSchema, SITE_URL } from "@/lib/seo";
import { getAllArticles } from "@/lib/articles";
import { ARTICLE_CATEGORIES, type ArticleCategory } from "@/lib/article-parser";
import { toBengaliNumerals } from "@/lib/bengali-calendar";
import { useArticleViews } from "@/hooks/useArticleViews";
import { cn } from "@/lib/utils";

const SCHEMA_ID = "articles-index-schema";

const FILTERS: Array<{ key: ArticleCategory | "all"; labelBn: string; icon: string }> = [
  { key: "all", labelBn: "সব নিবন্ধ", icon: "📚" },
  ...(Object.entries(ARTICLE_CATEGORIES) as Array<[ArticleCategory, (typeof ARTICLE_CATEGORIES)[ArticleCategory]]>).map(
    ([key, meta]) => ({ key, labelBn: meta.labelBn, icon: meta.icon })
  ),
];

export default function ArticlesPage() {
  const [filter, setFilter] = useState<ArticleCategory | "all">("all");
  const articles = getAllArticles();
  const visible = filter === "all" ? articles : articles.filter(a => a.category === filter);
  const views = useArticleViews(visible.map(a => a.slug));

  useEffect(() => {
    applyPageSEO({
      title: "বাংলার ঐতিহ্য ও ইতিহাস — উৎসব, ব্যক্তিত্ব ও অজানা তথ্যের নিবন্ধ | সঠিক বাংলা ক্যালেন্ডার",
      description:
        "বাংলার ঐতিহ্য ও ইতিহাস — বাংলার উৎসব, বিখ্যাত ব্যক্তিত্ব, ঐতিহাসিক ঘটনা, অজানা তথ্য ও বিশেষ দিন নিয়ে বাংলা নিবন্ধ সংগ্রহ। ইতিহাস, তাৎপর্য ও তারিখসহ বিস্তারিত পড়ুন।",
      path: "/articles",
      schemaId: SCHEMA_ID,
      schema: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "বাংলার ঐতিহ্য ও ইতিহাস",
        "description": "বাংলার উৎসব, ব্যক্তিত্ব, ইতিহাস, অজানা তথ্য ও বিশেষ দিনের নিবন্ধ সংগ্রহ",
        "url": `${SITE_URL}/articles`,
        "inLanguage": "bn",
        "isPartOf": { "@type": "WebSite", "url": SITE_URL, "name": "সঠিক বাংলা ক্যালেন্ডার" },
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": articles.slice(0, 20).map((a, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": a.title,
            "url": `${SITE_URL}/articles/${a.slug}`,
          })),
        },
      },
    });
    injectSchema("articles-breadcrumb-schema", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "সঠিক বাংলা ক্যালেন্ডার", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "বাংলার ঐতিহ্য ও ইতিহাস", "item": `${SITE_URL}/articles` },
      ],
    });
    return () => {
      removeSchema(SCHEMA_ID);
      removeSchema("articles-breadcrumb-schema");
    };
  }, [articles]);

  return (
    <div className="min-h-screen pb-20">
      <NavBar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bengali">ক্যালেন্ডারে ফিরুন</span>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white/15 ring-1 ring-white/25">
              <BookOpen className="w-6 h-6" />
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-bengali leading-tight">বাংলার ঐতিহ্য ও ইতিহাস</h1>
          </div>
          <p className="text-white/85 font-bengali text-sm sm:text-base leading-relaxed max-w-2xl">
            বাংলার উৎসব, বিখ্যাত ব্যক্তিত্ব, ঐতিহাসিক ঘটনা, অজানা তথ্য ও বিশেষ দিন — ইতিহাস,
            তাৎপর্য ও তারিখসহ বাছাই করা নিবন্ধের সংগ্রহ।
          </p>
          <p className="text-white/60 font-bengali text-xs mt-3">
            মোট {toBengaliNumerals(articles.length)}টি নিবন্ধ
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="নিবন্ধ বিভাগ">
          {FILTERS.map(f => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bengali font-semibold transition-colors",
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              )}
            >
              <span>{f.icon}</span>
              <span>{f.labelBn}</span>
            </button>
          ))}
        </div>

        {/* Article grid */}
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visible.map(a => (
              <ArticleCard key={a.slug} article={a} views={views[a.slug]} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 font-bengali text-muted-foreground">
            <div className="text-4xl mb-3">🗒️</div>
            <p>এই বিভাগে এখনও কোনো নিবন্ধ নেই — শীঘ্রই আসছে।</p>
          </div>
        )}

        {/* WhatsApp CTA */}
        <div className="mt-10">
          <WhatsAppCTA />
        </div>

        {/* Internal nav backlinks */}
        <section className="border-t border-border pt-6 mt-10">
          <div className="flex flex-wrap gap-3 font-bengali text-sm">
            <Link href="/" className="text-primary hover:underline">📅 ক্যালেন্ডার</Link>
            <Link href="/panjika" className="text-primary hover:underline">📖 পঞ্জিকা</Link>
            <Link href="/today-bengali-date" className="text-primary hover:underline">🗓 আজকের তারিখ</Link>
            <Link href="/muhurta" className="text-primary hover:underline">🕉️ শুভ মুহূর্ত</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
