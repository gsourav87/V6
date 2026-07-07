import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Clock, Link2 } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { ShareButton } from "@/components/ShareButton";
import { TelegramCTA } from "@/components/TelegramCTA";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticleCard, bnPublishDate } from "@/components/ArticleCard";
import { applyPageSEO, removeSchema, SITE_URL, OG_IMAGE_URL } from "@/lib/seo";
import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { ARTICLE_CATEGORIES, extractFaq } from "@/lib/article-parser";
import { toBengaliNumerals } from "@/lib/bengali-calendar";
import { cn } from "@/lib/utils";

export default function ArticlePage() {
  const [, params] = useRoute("/articles/:slug");
  const slug = params?.slug ?? "";
  const article = getArticleBySlug(slug);
  const related = article ? getRelatedArticles(article) : [];

  const SCHEMA_ID = `article-${slug}-schema`;

  useEffect(() => {
    if (!article) return;

    const canonical = `${SITE_URL}/articles/${article.slug}`;
    const image = article.image ? `${SITE_URL}${article.image}` : OG_IMAGE_URL;
    const faq = extractFaq(article.blocks);

    applyPageSEO({
      title: `${article.title} | বাংলার ঐতিহ্য ও ইতিহাস — সঠিক বাংলা ক্যালেন্ডার`,
      description: article.excerpt,
      path: `/articles/${article.slug}`,
      ogImage: image,
      schemaId: SCHEMA_ID,
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            "headline": article.title,
            "description": article.excerpt,
            "image": [image],
            "datePublished": article.date,
            "inLanguage": "bn",
            "url": canonical,
            "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
            "author": { "@type": "Organization", "name": "সঠিক বাংলা ক্যালেন্ডার", "url": SITE_URL },
            "publisher": { "@type": "Organization", "name": "সঠিক বাংলা ক্যালেন্ডার", "url": SITE_URL },
            "keywords": article.tags.join(", "),
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "হোম", "item": SITE_URL },
              { "@type": "ListItem", "position": 2, "name": "বাংলার ঐতিহ্য ও ইতিহাস", "item": `${SITE_URL}/articles` },
              { "@type": "ListItem", "position": 3, "name": article.title, "item": canonical },
            ],
          },
          ...(faq.length > 0
            ? [{
                "@type": "FAQPage",
                "mainEntity": faq.map(({ q, a }) => ({
                  "@type": "Question",
                  "name": q,
                  "acceptedAnswer": { "@type": "Answer", "text": a },
                })),
              }]
            : []),
        ],
      },
    });
    return () => removeSchema(SCHEMA_ID);
  }, [slug, article]);

  if (!article) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center font-bengali">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">নিবন্ধ পাওয়া যায়নি</h1>
          <p className="text-muted-foreground mb-6">এই নিবন্ধটি সরানো হয়েছে বা কখনও ছিল না।</p>
          <Link href="/articles" className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold">
            সব নিবন্ধে ফিরুন
          </Link>
        </main>
      </div>
    );
  }

  const cat = ARTICLE_CATEGORIES[article.category];

  return (
    <div className="min-h-screen pb-20">
      <NavBar />

      {/* Hero header */}
      <div className={cn("bg-gradient-to-br text-white py-10 px-4", cat.tile)}>
        <div className="max-w-2xl mx-auto">
          <Link href="/articles" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bengali">বাংলার ঐতিহ্য ও ইতিহাসে ফিরুন</span>
          </Link>

          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 bg-white/15 ring-1 ring-white/25 text-xs font-bengali font-semibold px-3 py-1 rounded-full">
              {cat.icon} {cat.labelBn}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-bengali leading-tight">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-white/80 font-bengali">
            {article.date && <span>{bnPublishDate(article.date)}</span>}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {toBengaliNumerals(article.readMinutes)} মিনিট পড়া
            </span>
            <ShareButton variant="compact" text={`📖 ${article.title}\n${article.excerpt}`} />
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-6 space-y-8">
        {/* Featured image */}
        {article.image && (
          <img
            src={article.image}
            alt={article.imageAlt}
            className="w-full aspect-[16/9] object-cover rounded-2xl border border-border shadow-premium"
          />
        )}

        {/* Body */}
        <article>
          <ArticleBody blocks={article.blocks} />
        </article>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map(t => (
              <span key={t} className="bg-secondary text-secondary-foreground text-xs font-bengali font-medium px-3 py-1 rounded-full">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Curated internal backlinks from frontmatter */}
        {article.related.length > 0 && (
          <section className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-bold font-bengali text-lg mb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" />
              সম্পর্কিত পাতা
            </h2>
            <div className="flex flex-wrap gap-2">
              {article.related.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center bg-accent hover:bg-primary hover:text-primary-foreground text-accent-foreground px-4 py-2 rounded-full text-sm font-bengali font-medium transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related articles */}
        {related.length > 0 && (
          <section>
            <h2 className="font-bold font-bengali text-xl mb-4">আরও পড়ুন</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map(a => (
                <ArticleCard key={a.slug} article={a} compact />
              ))}
            </div>
          </section>
        )}

        {/* Telegram CTA */}
        <TelegramCTA />

        {/* Internal nav backlinks */}
        <section className="border-t border-border pt-6">
          <div className="flex flex-wrap gap-3 font-bengali text-sm">
            <Link href="/articles" className="text-primary hover:underline">📚 বাংলার ঐতিহ্য ও ইতিহাস</Link>
            <Link href="/" className="text-primary hover:underline">📅 ক্যালেন্ডার</Link>
            <Link href="/panjika" className="text-primary hover:underline">📖 পঞ্জিকা</Link>
            <Link href="/today-bengali-date" className="text-primary hover:underline">🗓 আজকের তারিখ</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
