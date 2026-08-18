/**
 * Client-side article registry, split into two layers:
 *
 *  - Metadata (title, excerpt, date, category, tags, readMinutes, ...) for
 *    ALL articles is precomputed at build time (scripts/gen-articles-meta.ts)
 *    and imported eagerly here — cheap, used by listings/cards.
 *  - Full body content (blocks) is loaded lazily, one article at a time, via
 *    Vite's glob import — so reading one article never downloads every
 *    other article's text too.
 *
 * Adding a new article is still just dropping a .md file in
 * src/content/articles/ (plus its featured image in public/articles/) —
 * `npm run dev`/`npm run build` regenerate the metadata index automatically.
 */
import { parseArticle, type Article, type ArticleMeta, type ArticleCategory } from "./article-parser";
import generatedMeta from "../content/articles-meta.generated.json";

const ARTICLES = (generatedMeta as ArticleMeta[]).slice().sort((a, b) => b.date.localeCompare(a.date));

const rawLoaders = import.meta.glob("../content/articles/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

export function getAllArticles(): ArticleMeta[] {
  return ARTICLES;
}

export function getArticleMetaBySlug(slug: string): ArticleMeta | undefined {
  return ARTICLES.find(a => a.slug === slug);
}

export function getArticlesByCategory(category: ArticleCategory): ArticleMeta[] {
  return ARTICLES.filter(a => a.category === category);
}

/** Rank by shared category + shared tags, newest first — used for "আরও পড়ুন". */
export function getRelatedArticles(article: ArticleMeta, count = 3): ArticleMeta[] {
  return ARTICLES.filter(a => a.slug !== article.slug)
    .map(a => ({
      a,
      score: (a.category === article.category ? 2 : 0) + a.tags.filter(t => article.tags.includes(t)).length,
    }))
    .sort((x, y) => y.score - x.score || y.a.date.localeCompare(x.a.date))
    .slice(0, count)
    .map(x => x.a);
}

/** Fetches one article's full body (fetched + parsed only for this slug, not every article). */
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const meta = getArticleMetaBySlug(slug);
  if (!meta) return undefined;
  const loader = rawLoaders[`../content/articles/${meta.file}`];
  if (!loader) return undefined;
  const raw = await loader();
  return parseArticle(raw, meta.file.replace(/\.md$/, ""));
}
