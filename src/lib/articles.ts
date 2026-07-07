/**
 * Client-side article registry. Loads every markdown file in
 * src/content/articles/ at build time via Vite's glob import — adding a new
 * article is just dropping a .md file in that folder (plus its featured image
 * in public/articles/) and deploying.
 *
 * This module is only imported by the lazy-loaded article pages, so article
 * content stays out of the initial bundle.
 */
import { parseArticle, type Article, type ArticleCategory } from "./article-parser";

const files = import.meta.glob("../content/articles/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const ARTICLES: Article[] = Object.entries(files)
  .map(([path, raw]) => parseArticle(raw, path.split("/").pop()!.replace(/\.md$/, "")))
  .sort((a, b) => b.date.localeCompare(a.date));

export function getAllArticles(): Article[] {
  return ARTICLES;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug);
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return ARTICLES.filter(a => a.category === category);
}

/** Rank by shared category + shared tags, newest first — used for "আরও পড়ুন". */
export function getRelatedArticles(article: Article, count = 3): Article[] {
  return ARTICLES.filter(a => a.slug !== article.slug)
    .map(a => ({
      a,
      score: (a.category === article.category ? 2 : 0) + a.tags.filter(t => article.tags.includes(t)).length,
    }))
    .sort((x, y) => y.score - x.score || y.a.date.localeCompare(x.a.date))
    .slice(0, count)
    .map(x => x.a);
}
