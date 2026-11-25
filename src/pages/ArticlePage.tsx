import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Clock, Eye, Link2 } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { ShareButton } from "@/components/ShareButton";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticleCard, bnPublishDate, formatViewsBn } from "@/components/ArticleCard";
import { applyPageSEO, removeSchema, SITE_URL, OG_IMAGE_URL } from "@/lib/seo";
import { getArticleBySlug, getArticleMetaBySlug, getRelatedArticles } from "@/lib/articles";
import { ARTICLE_CATEGORIES, extractFaq, type Article } from "@/lib/article-parser";
import { toBengaliNumerals } from "@/lib/bengali-calendar";
import { useArticleViews, registerArticleView } from "@/hooks/useArticleViews";
import { cn } from "@/lib/utils";

export default function ArticlePage() {
  const [, params] = useRoute("/articles/:slug");
  const slug = params?.slug ?? "";

  // Metadata (title, excerpt, tags, ...) is available instantly — only the
  // body text (blocks) is fetched lazily, per-slug, below.
  const meta = getArticleMetaBySlug(slug);
  const related = meta ? getRelatedArticles(meta) : [];
  const relatedViews = useArticleViews(related.map(a => a.slug));

  const [article, setArticle] = useState<Article | undefined>(undefined);
  useEffect(() => {
    setArticle(undefined);
    if (!slug) return;
    let cancelled = false;
    getArticleBySlug(slug).then(a => { if (!cancelled) setArticle(a); });
    return () => { cancelled = true; };
  }, [slug]);

  const [views, setViews] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (!slug) return;
    setViews(undefined);
    registerArticleView(slug).then(setViews);
  }, [slug]);

  const SCHEMA_ID = `article-${slug}-schema`;

  useEffect(() => {
    if (!meta) return;

    const canonical = `${SITE_URL}/articles/${meta.slug}`;
    const image = meta.image ? `${SITE_URL}${meta.image}` : OG_IMAGE_URL;
    const faq = article ? extractFaq(article.blocks) : [];

    applyPageSEO({
      title: `${meta.title} | বাংলার ঐতিহ্য ও ইতিহাস — সঠিক বাংলা ক্যালেন্ডার`,
      description: meta.excerpt,
      path: `/articles/${meta.slug}`,
      ogImage: image,
      schemaId: SCHEMA_ID,
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            "headline": meta.title,
            "description": meta.excerpt,
            "image": [image],
            "datePublished": meta.date,
            "inLanguage": "bn",
            "url": canonical,
            "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
            "author": { "@type": "Organization", "name": "সঠিক বাংলা ক্যালেন্ডার", "url": SITE_URL },
            "publisher": { "@type": "Organization", "name": "সঠিক বাংলা ক্যালেন্ডার", "url": SITE_URL },
            "keywords": meta.tags.join(", "),
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "হোম", "item": SITE_URL },
              { "@type": "ListItem", "position": 2, "name": "বাংলার ঐতিহ্য ও ইতিহাস", "item": `${SITE_URL}/articles` },
              { "@type": "ListItem", "position": 3, "name": meta.title, "item": canonical },
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
  }, [slug, meta, article]);

  if (!meta) {
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

  const cat = ARTICLE_CATEGORIES[meta.category];

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

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-bengali leading-tight">{meta.title}</h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-white/80 font-bengali">
            {meta.date && <span>{bnPublishDate(meta.date)}</span>}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {toBengaliNumerals(meta.readMinutes)} মিনিট পড়া
            </span>
            {typeof views === "number" && views > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {formatViewsBn(views)} বার পঠিত
              </span>
            )}
            <ShareButton variant="compact" text={`📖 ${meta.title}\n${meta.excerpt}`} />
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-6 space-y-8">
        {/* Featured image */}
        {meta.image && (
          <img
            src={meta.image}
            alt={meta.imageAlt}
            onError={e => { e.currentTarget.style.display = "none"; }}
            className="w-full aspect-[16/9] object-cover rounded-2xl border border-border shadow-premium"
          />
        )}

        {/* Body — fetched lazily, per-article, so reading one doesn't download every article's text */}
        <article>
          {article ? (
            <ArticleBody blocks={article.blocks} />
          ) : (
            <div className="space-y-3 animate-pulse" aria-hidden="true">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          )}
        </article>

        {/* Tags */}
        {meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {meta.tags.map(t => (
              <span key={t} className="bg-secondary text-secondary-foreground text-xs font-bengali font-medium px-3 py-1 rounded-full">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Curated internal backlinks from frontmatter */}
        {meta.related.length > 0 && (
          <section className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-bold font-bengali text-lg mb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" />
              সম্পর্কিত পাতা
            </h2>
            <div className="flex flex-wrap gap-2">
              {meta.related.map(l => (
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
                <ArticleCard key={a.slug} article={a} compact views={relatedViews[a.slug]} />
              ))}
            </div>
          </section>
        )}

        {/* WhatsApp CTA */}
        <WhatsAppCTA />

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
