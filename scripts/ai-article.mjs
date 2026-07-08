#!/usr/bin/env node
/**
 * CI article generator — used by .github/workflows/generate-articles.yml to
 * publish articles to the live site with zero manual steps. Can also be run
 * locally:
 *
 *   GEMINI_API_KEY=xxx node scripts/ai-article.mjs "topic | slug | category | dates(optional)"
 *
 * Pipeline per topic: generate (Gemini by default; PROVIDER=openai|grok to
 * switch) → auto-interlink against real site data → validate (broken internal
 * links or <3 interlinks = hard fail, article is NOT saved) → write the .md
 * into src/content/articles/. The workflow then commits, Vercel deploys.
 *
 * No featured image is set in CI (the site shows a category gradient tile);
 * add one later via Article Studio if wanted.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARTICLES_DIR = path.join(ROOT, "src", "content", "articles");
const FESTIVAL_DETAILS = path.join(ROOT, "src", "lib", "festival-details.ts");
const FESTIVALS_TS = path.join(ROOT, "src", "lib", "festivals.ts");

const CATEGORIES = ["festival", "person", "history", "observance", "facts"];
const MONTH_SLUGS = ["boishakh", "jaistha", "ashar", "shraban", "bhadra", "ashwin", "kartik", "agrohayon", "poush", "magh", "falgun", "chaitra"];
const STATIC_ROUTES = new Set(["/", "/panjika", "/muhurta", "/today-bengali-date", "/rashifal", "/weather", "/finance", "/articles"]);
const DEFAULT_MODELS = { gemini: "gemini-2.5-flash", openai: "gpt-4o-mini", grok: "grok-3-mini" };

// ── site context ────────────────────────────────────────────────────────────

function festivalSlugs() {
  try {
    const src = fs.readFileSync(FESTIVAL_DETAILS, "utf-8");
    return [...src.matchAll(/^\s{2}"([a-z0-9-]+)":\s*\{/gm)].map(m => m[1]);
  } catch { return []; }
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const meta = {};
  if (m) for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return meta;
}

function articleEntries() {
  try {
    return fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith(".md")).map(f => {
      const meta = parseFrontmatter(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8"));
      return { slug: meta.slug || f.replace(/\.md$/, ""), title: meta.title || f, tags: meta.tags || "" };
    });
  } catch { return []; }
}

// ── auto-interlinking ───────────────────────────────────────────────────────

function entityMap() {
  const fests = new Set(festivalSlugs());
  const map = new Map();
  const stripParen = s => s.replace(/\s*\([^)]*\)\s*$/, "").trim();
  try {
    const src = fs.readFileSync(FESTIVALS_TS, "utf-8");
    for (const m of src.matchAll(/nameBn:\s*"([^"]+)"[^}\n]*?slug:\s*"([a-z0-9-]+)"/g)) {
      const name = stripParen(m[1]);
      if (name.length >= 4 && fests.has(m[2]) && !map.has(name)) map.set(name, "/festival/" + m[2]);
    }
  } catch {}
  for (const [n, s] of Object.entries({ "দোলযাত্রা": "dol-purnima", "দোল পূর্ণিমা": "dol-purnima", "জগদ্ধাত্রী পূজা": "jagaddhatri-puja" }))
    if (fests.has(s) && !map.has(n)) map.set(n, "/festival/" + s);
  const BLACK = new Set(["উৎসব", "ইতিহাস", "অজানা তথ্য", "ঐতিহ্য", "বাংলা", "সাহিত্য", "লোকসংস্কৃতি", "কলকাতা"]);
  const tagCount = new Map(), tagSlug = new Map();
  for (const a of articleEntries()) {
    for (const t of a.tags.split(",").map(s => s.trim()).filter(Boolean)) {
      if (BLACK.has(t) || t.length < 4) continue;
      tagCount.set(t, (tagCount.get(t) || 0) + 1);
      tagSlug.set(t, a.slug);
    }
  }
  for (const [t, c] of tagCount) if (c === 1 && !map.has(t)) map.set(t, "/articles/" + tagSlug.get(t));
  if (!map.has("শুভ মুহূর্ত")) map.set("শুভ মুহূর্ত", "/muhurta");
  if (!map.has("পঞ্জিকা")) map.set("পঞ্জিকা", "/panjika");
  return map;
}

function autolink(content) {
  const fm = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  const head = fm ? fm[0] : "";
  let body = content.slice(head.length);
  const meta = parseFrontmatter(content);
  const entities = [...entityMap().entries()].map(([name, href]) => ({ name, href }))
    .sort((a, b) => b.name.length - a.name.length);
  let added = 0;
  for (const e of entities) {
    if (added >= 12) break;
    if (meta.slug && e.href === "/articles/" + meta.slug) continue;
    if (body.includes("](" + e.href + ")")) continue;
    const lines = body.split("\n");
    let done = false;
    for (let i = 0; i < lines.length && !done; i++) {
      if (/^#{1,6}\s/.test(lines[i]) || /^!\[/.test(lines[i].trim())) continue;
      const parts = lines[i].split(/(!?\[[^\]]*\]\([^)]*\))/);
      for (let p = 0; p < parts.length && !done; p++) {
        if (p % 2 === 1) continue;
        const idx = parts[p].indexOf(e.name);
        if (idx !== -1) {
          parts[p] = parts[p].slice(0, idx) + "[" + e.name + "](" + e.href + ")" + parts[p].slice(idx + e.name.length);
          lines[i] = parts.join("");
          added++;
          done = true;
        }
      }
      if (done) body = lines.join("\n");
    }
  }
  return head + body;
}

// ── validation ──────────────────────────────────────────────────────────────

function validateArticle(content) {
  const errors = [];
  const meta = parseFrontmatter(content);
  const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  for (const key of ["title", "slug", "date", "category", "excerpt"])
    if (!meta[key]) errors.push(`frontmatter is missing "${key}"`);
  if (meta.slug && !/^[a-z0-9-]+$/.test(meta.slug)) errors.push(`invalid slug "${meta.slug}"`);
  if (meta.category && !CATEGORIES.includes(meta.category)) errors.push(`invalid category "${meta.category}"`);
  if (meta.date && !/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) errors.push(`invalid date "${meta.date}"`);
  const words = body.split(/\s+/).filter(Boolean).length;
  if (words < 900) errors.push(`article too short (${words} words)`);
  if (/^\s*\|.*\|\s*$/m.test(body)) errors.push("markdown table found — not supported");

  const fests = new Set(festivalSlugs());
  const arts = new Set(articleEntries().map(a => a.slug));
  if (meta.slug) arts.add(meta.slug);
  const links = [...(body + "\n" + (meta.related || "")).matchAll(/\((\/[^)\s]*)\)|\|\s*(\/[^,\n]*)/g)]
    .map(m => (m[1] || m[2] || "").trim()).filter(Boolean);
  let internalCount = 0;
  for (const href of links) {
    const clean = href.replace(/[#?].*$/, "").replace(/\/$/, "") || "/";
    internalCount++;
    if (STATIC_ROUTES.has(clean)) continue;
    let m;
    if ((m = clean.match(/^\/festival\/([a-z0-9-]+)$/))) { if (!fests.has(m[1])) errors.push(`broken link: ${clean}`); }
    else if ((m = clean.match(/^\/month\/([a-z]+)\/\d{4}$/))) { if (!MONTH_SLUGS.includes(m[1])) errors.push(`broken link: ${clean}`); }
    else if ((m = clean.match(/^\/date\/\d{4}\/(\d{1,2})\/(\d{1,2})$/))) { if (+m[1] < 1 || +m[1] > 12 || +m[2] < 1 || +m[2] > 31) errors.push(`broken link: ${clean}`); }
    else if ((m = clean.match(/^\/articles\/([a-z0-9-]+)$/))) { if (!arts.has(m[1])) errors.push(`broken link: ${clean}`); }
    else errors.push(`unknown internal path: ${clean}`);
  }
  if (internalCount < 3) errors.push(`only ${internalCount} internal link(s) — at least 3 required`);
  return { ok: errors.length === 0, errors, words, internalCount, meta };
}

// ── prompt + providers ──────────────────────────────────────────────────────

function buildPrompt(input) {
  const today = new Date().toISOString().slice(0, 10);
  const fests = festivalSlugs();
  const arts = articleEntries().map(a => `/articles/${a.slug} — ${a.title}`).slice(0, 40);
  return `তুমি "সঠিক বাংলা ক্যালেন্ডার" (sothikbanglacalendar.live) ওয়েবসাইটের বাংলা কনটেন্ট রাইটার।
নিচের বিষয়ে একটি সম্পূর্ণ markdown আর্টিকেল ফাইল লিখবে।

ফাইলের শুরুতে ঠিক এই ফরম্যাটে frontmatter:
---
title: <SEO-বান্ধব বাংলা শিরোনাম>
slug: ${input.slug}
date: ${today}
category: ${input.category}
excerpt: <২-৩ বাক্যের সারাংশ, মূল তারিখ ও কীওয়ার্ডসহ>
tags: <কমা দিয়ে ৪-৬টি বাংলা ট্যাগ>
related: <লেবেল | /path, লেবেল | /path — ৩-৪টি ইন্টারনাল লিংক>
---

কাঠামো (মোট ১৮০০-২২০০ শব্দ):
1. ভূমিকা — প্রথম অনুচ্ছেদেই মূল তথ্য/তারিখের সরাসরি উত্তর, **বোল্ড** করে
2. ### এক নজরে — বুলেটে মূল তথ্য
3. ৫-৭টি ## সেকশন — ইতিহাস, পুরাণ/প্রেক্ষাপট, বাংলার নিজস্ব দিক, আচার, সংস্কৃতি
4. ## অজানা তথ্য — ৫-৬টি বুলেট, প্রতিটি **বোল্ড শিরোনাম** দিয়ে শুরু
5. ## সাধারণ প্রশ্ন (FAQ) — ৫টি ### প্রশ্ন, প্রতিটির নিচে ২-৩ বাক্যের উত্তর
6. শেষে --- দিয়ে ভাগ করে সম্পর্কিত পাতার লিংকসহ ২ লাইনের সমাপ্তি

কঠোর নিয়ম:
- markdown-এ শুধু ## ###, **বোল্ড**, *ইটালিক*, [লিংক](/path), - বুলেট, > উদ্ধৃতি, --- চলবে। টেবিল/HTML/নেস্টেড লিস্ট নয়।
- তারিখ-তিথি শুধু ইনপুটে দেওয়া তথ্য থেকে — নিজে বানাবে না। বডিতে তারিখ বাংলা সংখ্যায়।
- কিংবদন্তিতে "কথিত আছে/প্রচলিত মতে"; শুধু যাচাইযোগ্য তথ্য।
- শুধু ফাইলের কনটেন্ট দেবে — কোনো ভূমিকা, ব্যাখ্যা বা কোড-ফেন্স নয়।
- কমপক্ষে ৫টি ইন্টারনাল লিংক, শুধু নিচের বৈধ টার্গেট থেকে:
  স্থির পাতা: /panjika, /muhurta, /today-bengali-date
  উৎসব: ${fests.map(s => "/festival/" + s).join(", ")}
  মাস: /month/<slug>/<বছর> — slug: ${MONTH_SLUGS.join(", ")}
  তারিখ: /date/YYYY/M/D
  আর্টিকেল: ${arts.join("; ") || "(নেই)"}

এবারের বিষয়:
- বিষয়: ${input.topic}
- ক্যাটাগরি: ${input.category}
- যাচাই করা তারিখ/তথ্য: ${input.dates || "(দেওয়া হয়নি — কোনো নির্দিষ্ট তারিখ লিখবে না)"}`;
}

async function generate(prompt) {
  const provider = ["gemini", "openai", "grok"].includes(process.env.PROVIDER) ? process.env.PROVIDER : "gemini";
  const model = process.env.MODEL || DEFAULT_MODELS[provider];
  const key = provider === "gemini" ? process.env.GEMINI_API_KEY
    : provider === "openai" ? process.env.OPENAI_API_KEY
    : (process.env.XAI_API_KEY || process.env.GROK_API_KEY);
  if (!key) throw new Error(`no API key for provider "${provider}" — set ${provider === "gemini" ? "GEMINI_API_KEY" : provider === "openai" ? "OPENAI_API_KEY" : "XAI_API_KEY"}`);

  if (provider === "gemini") {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data?.error?.message || `Gemini HTTP ${r.status}`);
    const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join("") || "";
    if (!text) throw new Error("empty response");
    return text;
  }
  const base = provider === "grok" ? "https://api.x.ai/v1" : "https://api.openai.com/v1";
  const r = await fetch(base + "/chat/completions", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || data?.error || `${provider} HTTP ${r.status}`);
  const text = data.choices?.[0]?.message?.content || "";
  if (!text) throw new Error("empty response");
  return text;
}

// ── main ────────────────────────────────────────────────────────────────────

const line = process.argv[2] || "";
const [topic, slug, category, dates] = line.split("|").map(s => (s || "").trim());

if (!topic || !slug || !category) {
  console.error('usage: node scripts/ai-article.mjs "topic | slug | category | dates(optional)"');
  process.exit(2);
}
if (!/^[a-z0-9-]+$/.test(slug)) { console.error(`✗ invalid slug "${slug}" (a-z, 0-9, hyphens)`); process.exit(2); }
if (!CATEGORIES.includes(category)) { console.error(`✗ invalid category "${category}" — use: ${CATEGORIES.join(" | ")}`); process.exit(2); }

const outFile = path.join(ARTICLES_DIR, slug + ".md");
if (fs.existsSync(outFile)) { console.log(`↷ ${slug}.md already exists — skipping`); process.exit(0); }

console.log(`✎ generating: ${topic} (${slug}, ${category})`);
let raw;
try {
  raw = await generate(buildPrompt({ topic, slug, category, dates }));
} catch (e) {
  console.error(`✗ generation failed: ${e.message || e}`);
  process.exit(1);
}
raw = raw.replace(/^\s*```(?:markdown|md)?\s*\n/, "").replace(/\n```\s*$/, "").trim() + "\n";
raw = autolink(raw);
// CI has no curated image — drop any image lines the model added
raw = raw.replace(/^image:.*\n/m, "").replace(/^imageAlt:.*\n/m, "");

const v = validateArticle(raw);
if (!v.ok) {
  console.error(`✗ validation failed for "${topic}" — NOT saved:`);
  v.errors.forEach(e => console.error("   • " + e));
  process.exit(1);
}
fs.mkdirSync(ARTICLES_DIR, { recursive: true });
fs.writeFileSync(outFile, raw, "utf-8");
console.log(`✓ saved src/content/articles/${slug}.md (${v.words} words, ${v.internalCount} internal links)`);
