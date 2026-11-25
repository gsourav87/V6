// Precomputes a lightweight metadata index (everything except each article's
// body/blocks) for the client bundle. Runs before `vite build`/`vite dev` so
// src/lib/articles.ts can import it eagerly — without this, every article's
// full text would need to be embedded just to know its title/excerpt/date.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArticle, type ArticleMeta } from "../src/lib/article-parser";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARTICLES_DIR = path.join(ROOT, "src", "content", "articles");
const OUT_FILE = path.join(ROOT, "src", "content", "articles-meta.generated.json");

const files = fs.existsSync(ARTICLES_DIR)
  ? fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith(".md"))
  : [];

const meta: ArticleMeta[] = files
  .map(file => {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
    const { blocks, ...rest } = parseArticle(raw, file.replace(/\.md$/, ""));
    return { ...rest, file };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

fs.writeFileSync(OUT_FILE, JSON.stringify(meta, null, 2) + "\n");
console.log(`📇 articles-meta.generated.json — ${meta.length} articles`);
