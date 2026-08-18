// Daily article generator — pops one topic from content-queue/article-topics.txt,
// writes it with Gemini, auto-interlinks it against real site data, fetches a
// free-license featured image from Pexels, and saves it exactly like Article
// Studio would. Run by .github/workflows/daily-article.yml.
//
//   tsx scripts/daily-article.ts            — publish the next queued topic
//   tsx scripts/daily-article.ts --dry-run  — generate + print, write nothing
//
// Needs GEMINI_API_KEY and (optionally) PEXELS_API_KEY env vars.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArticle, ARTICLE_CATEGORIES, type ArticleCategory } from "../src/lib/article-parser";
import { FESTIVALS } from "../src/lib/festivals";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const QUEUE_FILE = path.join(ROOT, "content-queue", "article-topics.txt");
const ARTICLES_DIR = path.join(ROOT, "src", "content", "articles");
const IMAGES_DIR = path.join(ROOT, "public", "articles");

const dryRun = process.argv.includes("--dry-run");
const todayISO = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

// ── 1. pop the next topic off the queue ────────────────────────────────────

function nextTopic(): { category: ArticleCategory; topic: string; remaining: string[] } | null {
  const lines = fs.readFileSync(QUEUE_FILE, "utf-8").split(/\r?\n/);
  const idx = lines.findIndex(l => l.trim() && !l.trim().startsWith("#"));
  if (idx === -1) return null;

  const [rawCategory, ...rest] = lines[idx].split("|");
  const category = rawCategory.trim() as ArticleCategory;
  const topic = rest.join("|").trim();
  if (!(category in ARTICLE_CATEGORIES) || !topic) {
    throw new Error(`bad queue line: "${lines[idx]}" — expected "category|topic"`);
  }

  const remaining = [...lines.slice(0, idx), ...lines.slice(idx + 1)];
  return { category, topic, remaining };
}

const picked = nextTopic();
if (!picked) {
  console.log("↷ content-queue/article-topics.txt is empty — nothing to publish today. Add more topics!");
  process.exit(0);
}
const { category, topic } = picked;
console.log(`📝 today's topic: [${category}] ${topic}`);

// ── 2. write the article with Gemini ───────────────────────────────────────

interface Draft {
  title: string;
  slug: string;
  excerpt: string;
  imageQuery: string;
  imageAlt: string;
  tags: string[];
  body: string;
}

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY missing");
  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.85 },
      }),
    }
  );
  const data: any = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error?.message || `Gemini HTTP ${r.status}`);
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response");
  return text;
}

function existingSlugs(): Set<string> {
  return new Set(
    fs.existsSync(ARTICLES_DIR)
      ? fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith(".md")).map(f => f.replace(/\.md$/, ""))
      : []
  );
}

function existingTitles(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith(".md"))
    .map(f => parseArticle(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8"), f).title);
}

async function generateDraft(): Promise<Draft> {
  const catLabel = ARTICLE_CATEGORIES[category].labelBn;
  const avoid = existingTitles();

  const prompt = `তুমি "সঠিক বাংলা ক্যালেন্ডার" (sothikbanglacalendar.live) ওয়েবসাইটের "বাংলার ঐতিহ্য ও ইতিহাস" বিভাগের একজন বাংলা কনটেন্ট লেখক। পাঠক মূলত পশ্চিমবঙ্গ ও বাংলাদেশের বাংলাভাষী।

বিষয় (${catLabel}): ${topic}

এই বিষয়ে ২০০০-৩০০০ শব্দের একটি সম্পূর্ণ, তথ্যবহুল ও আকর্ষণীয় বাংলা নিবন্ধ লেখো। ইতিমধ্যে প্রকাশিত এই শিরোনামগুলোর সাথে ওভারল্যাপ এড়িয়ে চলো:
${avoid.map(t => `- ${t}`).join("\n")}

নিয়মাবলী:
- বডি টেক্সট মার্কডাউনে লেখো: ## এবং ### হেডিং, **বোল্ড**, *ইটালিক*, - বা ১. লিস্ট, > উক্তি — এসবই ব্যবহার করতে পারো। কোনো লিংক ([text](url)) বা ছবি ![alt](src) বসিও না, ওগুলো আলাদাভাবে যোগ হবে।
- শেষে "## সাধারণ প্রশ্ন" শিরোনামে ৩-৪টি প্রাসঙ্গিক প্রশ্ন-উত্তর (### প্রশ্ন, তারপর উত্তর অনুচ্ছেদ) যোগ করো।
- এসইও-বান্ধব, আকর্ষণীয়, কিন্তু তথ্যগতভাবে সঠিক শিরোনাম দাও।
- যেখানে প্রাসঙ্গিক ও স্বাভাবিক, প্রসঙ্গক্রমে সম্পর্কিত উৎসব, পঞ্জিকা, রাশিফল বা শুভ মুহূর্তের মতো বিষয়ের উল্লেখ কোরো (জোর করে নয়, শুধু যেখানে গল্পের সাথে সত্যিই খাপ খায়)।

শুধু নিচের কাঠামোয় একটি JSON অবজেক্ট ফেরত দাও, অন্য কিছু নয়:
{
  "title": "বাংলা শিরোনাম",
  "slug": "english-kebab-case-slug-5-to-8-words",
  "excerpt": "এক-দুই বাক্যের বাংলা সারাংশ",
  "imageQuery": "2-4 English keywords to find a matching stock photo, e.g. \\"bengal terracotta temple\\"",
  "imageAlt": "ছবির বাংলা বিবরণ",
  "tags": ["বাংলা ট্যাগ ১", "বাংলা ট্যাগ ২", "বাংলা ট্যাগ ৩"],
  "body": "সম্পূর্ণ মার্কডাউন বডি টেক্সট এখানে"
}`;

  const raw = await callGemini(prompt);
  const draft: Draft = JSON.parse(raw);

  // Guard against a slug collision with an existing article.
  const taken = existingSlugs();
  let slug = draft.slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  if (taken.has(slug)) {
    let n = 2;
    while (taken.has(`${slug}-${n}`)) n++;
    slug = `${slug}-${n}`;
  }
  return { ...draft, slug };
}

// ── 3. auto-interlink (same idea as Article Studio's 🔗 button) ────────────

const STATIC_LINKS: Record<string, string> = {
  "পঞ্জিকা": "/panjika",
  "আজকের পঞ্জিকা": "/panjika",
  "শুভ মুহূর্ত": "/muhurta",
  "রাশিফল": "/rashifal",
  "আজকের বাংলা তারিখ": "/today-bengali-date",
  "আবহাওয়া": "/weather",
};

function buildInterlinkDict(): Record<string, string> {
  const dict: Record<string, string> = { ...STATIC_LINKS };
  const seenFestivalSlugs = new Set<string>();
  for (const f of FESTIVALS) {
    if (!f.slug || seenFestivalSlugs.has(f.slug)) continue;
    seenFestivalSlugs.add(f.slug);
    // "দুর্গা পূজা (মহাষষ্ঠী)" -> "দুর্গা পূজা" — the parenthetical rarely
    // appears verbatim in generated prose, so match on the clean name.
    const cleanName = f.nameBn.replace(/\s*\([^)]*\)\s*$/, "").trim();
    dict[cleanName] = `/festival/${f.slug}`;
  }
  if (fs.existsSync(ARTICLES_DIR)) {
    for (const file of fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith(".md"))) {
      const a = parseArticle(fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8"), file);
      dict[a.title] = `/articles/${a.slug}`;
    }
  }
  return dict;
}

/** Links known-term mentions (up to 2 per line, cap total), skipping headings/quotes. */
function autoInterlink(body: string, dict: Record<string, string>, cap = 8): string {
  const terms = Object.keys(dict).sort((a, b) => b.length - a.length);
  const lines = body.split(/\r?\n/);
  let linked = 0;

  for (let i = 0; i < lines.length && linked < cap; i++) {
    let line = lines[i];
    if (line.startsWith("#") || line.startsWith(">")) continue; // don't rewrite headings/quotes
    let perLine = 0;
    for (const term of terms) {
      if (linked >= cap || perLine >= 2) break;
      if (term.length < 3) continue;
      const idx = line.indexOf(term);
      if (idx === -1) continue;
      // Skip if already inside a markdown link's brackets.
      const before = line.slice(0, idx);
      if ((before.match(/\[/g)?.length ?? 0) > (before.match(/\]/g)?.length ?? 0)) continue;
      line = line.slice(0, idx) + `[${term}](${dict[term]})` + line.slice(idx + term.length);
      lines[i] = line;
      linked++;
      perLine++;
    }
  }
  return lines.join("\n");
}

// ── 4. featured image via Pexels (free license, no attribution required) ───

async function fetchFeaturedImage(query: string, slug: string): Promise<string | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) { console.log("↷ no PEXELS_API_KEY — publishing without a featured image"); return null; }

  try {
    const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
      headers: { Authorization: key },
    });
    if (!r.ok) throw new Error(`Pexels search HTTP ${r.status}`);
    const data: any = await r.json();
    const photoUrl = data?.photos?.[0]?.src?.large;
    if (!photoUrl) { console.log(`↷ no Pexels results for "${query}"`); return null; }

    const imgRes = await fetch(photoUrl);
    if (!imgRes.ok) throw new Error(`image download HTTP ${imgRes.status}`);
    const buf = Buffer.from(await imgRes.arrayBuffer());

    if (!dryRun) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
      fs.writeFileSync(path.join(IMAGES_DIR, `${slug}.jpg`), buf);
    }
    return `/articles/${slug}.jpg`;
  } catch (err) {
    console.log(`↷ featured image fetch failed: ${(err as Error).message} — publishing without one`);
    return null;
  }
}

// ── 5. validate — reject rather than publish something broken/thin ────────

const STATIC_ROUTES = new Set(["/", "/panjika", "/muhurta", "/today-bengali-date", "/rashifal", "/weather", "/finance", "/articles"]);

function validateBody(body: string, dict: Record<string, string>): void {
  const words = body.split(/\s+/).filter(Boolean).length;
  if (words < 1200) throw new Error(`article too short (${words} words)`);
  if (/^\s*\|.*\|\s*$/m.test(body)) throw new Error("markdown table found — not supported by the site's renderer");

  const knownHrefs = new Set(Object.values(dict));
  const hrefs = [...body.matchAll(/\((\/[^)\s]*)\)/g)].map(m => m[1]);
  let internalCount = 0;
  for (const href of hrefs) {
    const clean = href.replace(/[#?].*$/, "").replace(/\/$/, "") || "/";
    internalCount++;
    if (STATIC_ROUTES.has(clean) || knownHrefs.has(clean)) continue;
    throw new Error(`broken internal link: ${clean}`);
  }
  if (internalCount < 2) throw new Error(`only ${internalCount} internal link(s) inserted — at least 2 required`);
}

// ── 6. assemble + save ──────────────────────────────────────────────────────

function toFrontmatterLine(key: string, value: string): string {
  return `${key}: ${value.replace(/\r?\n/g, " ").trim()}`;
}

async function main() {
  const draft = await generateDraft();
  const dict = buildInterlinkDict();
  const body = autoInterlink(draft.body, dict);
  validateBody(body, dict);
  const image = await fetchFeaturedImage(draft.imageQuery, draft.slug);

  const frontmatter = [
    "---",
    toFrontmatterLine("title", draft.title),
    toFrontmatterLine("slug", draft.slug),
    toFrontmatterLine("date", todayISO),
    toFrontmatterLine("category", category),
    toFrontmatterLine("excerpt", draft.excerpt),
    ...(image ? [toFrontmatterLine("image", image), toFrontmatterLine("imageAlt", draft.imageAlt)] : []),
    toFrontmatterLine("tags", draft.tags.join(", ")),
    "---",
    "",
  ].join("\n");

  const fileContent = frontmatter + body.trim() + "\n";
  const outPath = path.join(ARTICLES_DIR, `${draft.slug}.md`);

  if (dryRun) {
    console.log(`── would write ${outPath} ──\n${fileContent}`);
    console.log(image ? `🖼  featured image: ${image}` : "🖼  no featured image");
    return;
  }

  fs.writeFileSync(outPath, fileContent);
  fs.writeFileSync(QUEUE_FILE, picked!.remaining.join("\n"));
  console.log(`✓ published ${draft.slug}.md${image ? ` (+ ${draft.slug}.jpg)` : ""}`);
}

main().catch(err => {
  console.error(`✗ daily-article failed: ${err.message}`);
  process.exit(1);
});
