/**
 * Build-time static prerender script.
 *
 * Reads dist/index.html (produced by vite build), then for each enumerated
 * route injects route-specific <title>, <meta>, canonical, OG tags, JSON-LD,
 * and Bengali body content.  Writes dist/<route>/index.html.
 *
 * Vercel serves static files before applying its catch-all SPA rewrite, so
 * crawlers receive the correct HTML immediately without waiting for JS.
 *
 * Run: tsx scripts/prerender.ts   (after vite build)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// These files are plain data — no browser APIs, relative imports only.
import { FESTIVAL_DETAILS } from "../src/lib/festival-details";
import { FESTIVALS } from "../src/lib/festivals";
import { OBSERVANCES } from "../src/lib/observances";

// ── constants ─────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SITE = "https://www.sothikbanglacalendar.live";

// ── utilities ─────────────────────────────────────────────────────────────

/** Convert ASCII digits to Bengali numerals */
function bn(n: number): string {
  return String(n).replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[+d]);
}

/** Escape for HTML attribute values */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

interface HeadMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDesc?: string;
  schema?: object;
}

/** Replace head meta tags and inject JSON-LD into an HTML string. */
function swapHead(html: string, m: HeadMeta): string {
  const title   = esc(m.title);
  const desc    = esc(m.description);
  const url     = esc(m.canonical);
  const ogTitle = esc(m.ogTitle ?? m.title);
  const ogDesc  = esc(m.ogDesc  ?? m.description);

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/,   `$1${desc}$2`);
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/,          `$1${url}$2`);
  html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/,   `$1${ogTitle}$2`);
  html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/,`$1${ogDesc}$2`);
  html = html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/,     `$1${url}$2`);
  html = html.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,  `$1${ogTitle}$2`);
  html = html.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,`$1${ogDesc}$2`);

  // hreflang — point the template's self-referential tags at this page's URL.
  for (const lang of ["bn", "bn-IN", "bn-BD", "x-default"]) {
    html = html.replace(
      new RegExp(`(<link rel="alternate" hreflang="${lang}" href=")[^"]*(")`),
      `$1${url}$2`
    );
  }

  if (m.schema) {
    const tag = `<script type="application/ld+json">${JSON.stringify(m.schema)}</script>`;
    html = html.replace("</head>", `${tag}\n</head>`);
  }
  return html;
}

// ── sitemap collection ──────────────────────────────────────────────────────
const NOW_ISO = new Date().toISOString().slice(0, 10);
const sitemap: Array<{ loc: string; priority: string; changefreq: string }> = [];
function addUrl(loc: string, priority = "0.7", changefreq = "weekly") {
  sitemap.push({ loc, priority, changefreq });
}

/** Replace the content inside <div id="seo-static"> with route-specific HTML. */
function swapBody(html: string, content: string): string {
  return html.replace(
    /(<div id="seo-static"[^>]*>)([\s\S]*?)(<\/div>)/,
    `$1\n${content}\n$3`
  );
}

/** Write the HTML to dist/<route>/index.html (skips root) and record for sitemap. */
function emit(route: string, html: string, priority = "0.7", changefreq = "weekly"): void {
  const dir  = path.join(DIST, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
  addUrl(`${SITE}${route}`, priority, changefreq);
  console.log(`  ✓  ${route}`);
}

// ── load template ─────────────────────────────────────────────────────────

const template = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

// ── festival pages ────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10);

function firstUpcoming(slug: string): string | undefined {
  const fromFestivals = FESTIVALS
    .filter(f => f.slug === slug && f.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0]?.date;
  if (fromFestivals) return fromFestivals;

  // Recurring observances/events: next annual occurrence of its MM-DD.
  const obs = OBSERVANCES.find(o => o.slug === slug);
  if (obs) {
    const y = new Date().getUTCFullYear();
    const thisYear = `${y}-${obs.md}`;
    return thisYear >= today ? thisYear : `${y + 1}-${obs.md}`;
  }
  return undefined;
}

console.log("\n📄 Festival pages");

for (const [slug, detail] of Object.entries(FESTIVAL_DETAILS)) {
  const route    = `/festival/${slug}`;
  const canonical = `${SITE}${route}`;
  const year     = new Date().getFullYear();
  const title    = `${detail.nameBn} ${year} — তারিখ, ইতিহাস ও তাৎপর্য | সঠিক বাংলা ক্যালেন্ডার`;
  const desc     = `${detail.tagline}। ${detail.descBn[0].slice(0, 130)}…`;

  const upcoming = firstUpcoming(slug);
  const schema: object = upcoming
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": detail.nameEn,
        "alternateName": detail.nameBn,
        "description": detail.descBn[0],
        "url": canonical,
        "startDate": upcoming,
        "inLanguage": "bn",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "organizer": { "@type": "Organization", "name": "সঠিক বাংলা ক্যালেন্ডার", "url": SITE },
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": detail.descBn[0],
        "url": canonical,
        "inLanguage": "bn",
        "isPartOf": { "@type": "WebSite", "url": SITE, "name": "সঠিক বাংলা ক্যালেন্ডার" },
      };

  const body = [
    `<h1>${detail.icon} ${detail.nameBn} — ${year}</h1>`,
    `<p><strong>${detail.tagline}</strong></p>`,
    ...detail.descBn.map(p => `<p>${p}</p>`),
    `<p><a href="/">← সঠিক বাংলা ক্যালেন্ডারে ফিরুন</a> &nbsp;|&nbsp; <a href="/panjika">পঞ্জিকা</a></p>`,
  ].join("\n");

  let html = swapHead(template, { title, description: desc, canonical, schema });
  html = swapBody(html, body);
  emit(route, html);
}

// ── month pages ───────────────────────────────────────────────────────────

const MONTHS = [
  { slug: "boishakh",  nameBn: "বৈশাখ",     nameEn: "Boishakh",   idx: 0 },
  { slug: "jaistha",   nameBn: "জ্যৈষ্ঠ",   nameEn: "Jaistha",    idx: 1 },
  { slug: "ashar",     nameBn: "আষাঢ়",      nameEn: "Ashar",      idx: 2 },
  { slug: "shraban",   nameBn: "শ্রাবণ",    nameEn: "Shraban",    idx: 3 },
  { slug: "bhadra",    nameBn: "ভাদ্র",     nameEn: "Bhadra",     idx: 4 },
  { slug: "ashwin",    nameBn: "আশ্বিন",    nameEn: "Ashwin",     idx: 5 },
  { slug: "kartik",    nameBn: "কার্তিক",   nameEn: "Kartik",     idx: 6 },
  { slug: "agrohayon", nameBn: "অগ্রহায়ণ",  nameEn: "Agrohayon",  idx: 7 },
  { slug: "poush",     nameBn: "পৌষ",       nameEn: "Poush",      idx: 8 },
  { slug: "magh",      nameBn: "মাঘ",       nameEn: "Magh",       idx: 9 },
  { slug: "falgun",    nameBn: "ফাল্গুন",   nameEn: "Falgun",     idx: 10 },
  { slug: "chaitra",   nameBn: "চৈত্র",     nameEn: "Chaitra",    idx: 11 },
];

function bengaliYear(gregYear: number, monthIdx: number): number {
  return monthIdx <= 8 ? gregYear - 593 : gregYear - 594;
}

console.log("\n📅 Month pages");

// Generate for years 2025, 2026, 2027 — all 12 months each
for (const gregYear of [2025, 2026, 2027]) {
  for (const m of MONTHS) {
    const banglaYear = bengaliYear(gregYear, m.idx);
    const route      = `/month/${m.slug}/${gregYear}`;
    const canonical  = `${SITE}${route}`;
    const title      = `${m.nameBn} ${bn(banglaYear)} বাংলা ক্যালেন্ডার — তিথি, নক্ষত্র ও পঞ্জিকা`;
    const desc       = `${m.nameBn} ${bn(banglaYear)} বঙ্গাব্দ (${m.nameEn} ${gregYear}) বাংলা ক্যালেন্ডার। এই মাসের সমস্ত তিথি, নক্ষত্র, উৎসব ও পঞ্জিকা তথ্য দেখুন।`;

    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": desc,
      "url": canonical,
      "inLanguage": "bn",
      "isPartOf": { "@type": "WebSite", "url": SITE, "name": "সঠিক বাংলা ক্যালেন্ডার" },
    };

    const body = [
      `<h1>${m.nameBn} ${bn(banglaYear)} বঙ্গাব্দ বাংলা ক্যালেন্ডার</h1>`,
      `<p>${m.nameBn} বাংলা বর্ষপঞ্জির ${bn(m.idx + 1)} নম্বর মাস। গ্রেগরিয়ান ক্যালেন্ডারে এটি ${m.nameEn} ${gregYear} এ পড়ে।</p>`,
      `<p>এই মাসের সমস্ত তিথি, নক্ষত্র, যোগ ও করণের বিস্তারিত তথ্য ক্যালেন্ডারে দেখুন। যেকোনো তারিখে ক্লিক করলে সেই দিনের সম্পূর্ণ পঞ্জিকা পাওয়া যাবে।</p>`,
      `<p><a href="/">← সঠিক বাংলা ক্যালেন্ডারে ফিরুন</a> &nbsp;|&nbsp; <a href="/panjika">পঞ্জিকা</a></p>`,
    ].join("\n");

    let html = swapHead(template, { title, description: desc, canonical, schema });
    html = swapBody(html, body);
    emit(route, html);
  }
}

// ── static pages ──────────────────────────────────────────────────────────

console.log("\n🗂  Static pages");

const staticPages = [
  {
    route: "/today-bengali-date",
    title: "আজকের বাংলা তারিখ ২০২৬ — তিথি ও নক্ষত্র | সঠিক বাংলা ক্যালেন্ডার",
    desc:  "আজকের সঠিক বাংলা তারিখ, তিথি ও নক্ষত্র দেখুন। বিশুদ্ধ সিদ্ধান্ত পদ্ধতিতে গণনা করা সঠিক বাংলা ক্যালেন্ডার।",
    body: [
      "<h1>আজকের বাংলা তারিখ ২০২৬</h1>",
      "<p>আজকের সঠিক বাংলা তারিখ, তিথি, নক্ষত্র, যোগ ও করণ একনজরে দেখুন। বিশুদ্ধ সিদ্ধান্ত পদ্ধতিতে কলকাতার সূর্যোদয় অনুসারে গণনা।</p>",
      "<ul><li><a href='/panjika'>আজকের পঞ্জিকা — তিথি, নক্ষত্র, রাহু কাল</a></li>",
      "<li><a href='/rashifal'>আজকের রাশিফল</a></li></ul>",
      "<p><a href='/'>← মূল ক্যালেন্ডারে ফিরুন</a></p>",
    ].join("\n"),
  },
  {
    route: "/panjika",
    title: "আজকের পঞ্জিকা ২০২৬ — তিথি, নক্ষত্র, রাহু কাল | সঠিক বাংলা ক্যালেন্ডার",
    desc:  "আজকের বাংলা পঞ্জিকা — তিথি, নক্ষত্র, যোগ, করণ, সূর্যোদয়, সূর্যাস্ত ও রাহু কাল। বিশুদ্ধ সিদ্ধান্ত পদ্ধতিতে গণনা।",
    body: [
      "<h1>আজকের বাংলা পঞ্জিকা ২০২৬</h1>",
      "<p>আজকের তিথি, নক্ষত্র, যোগ, করণ, সূর্যোদয়, সূর্যাস্ত ও রাহু কালের সম্পূর্ণ বিবরণ। কলকাতার স্থানীয় সময় অনুসারে।</p>",
      "<p>পঞ্জিকা হলো বাংলার ঐতিহ্যবাহী সময় গণনা পদ্ধতি — শুভ কাজের মুহূর্ত নির্ধারণ থেকে শুরু করে উৎসবের তারিখ পর্যন্ত সব কিছুই এতে থাকে।</p>",
      "<p><a href='/'>← মূল ক্যালেন্ডারে ফিরুন</a></p>",
    ].join("\n"),
  },
  {
    route: "/rashifal",
    title: "আজকের রাশিফল ২০২৬ — সব রাশির ভবিষ্যৎ বাংলায় | সঠিক বাংলা ক্যালেন্ডার",
    desc:  "আজকের রাশিফল — মেষ থেকে মীন পর্যন্ত সব রাশির ভবিষ্যৎ বাংলায় পড়ুন। প্রতিদিন আপডেট।",
    body: [
      "<h1>আজকের রাশিফল ২০২৬</h1>",
      "<p>মেষ, বৃষ, মিথুন, কর্কট, সিংহ, কন্যা, তুলা, বৃশ্চিক, ধনু, মকর, কুম্ভ ও মীন — সব রাশির আজকের রাশিফল।</p>",
      "<p>জ্যোতিষশাস্ত্র অনুযায়ী প্রতিটি রাশির জন্য আজকের ভাগ্য, প্রেম, অর্থ ও স্বাস্থ্যের পূর্বাভাস।</p>",
      "<p><a href='/'>← মূল ক্যালেন্ডারে ফিরুন</a></p>",
    ].join("\n"),
  },
  {
    route: "/news",
    title: "বাংলা সংবাদ — আজকের খবর | সঠিক বাংলা ক্যালেন্ডার",
    desc:  "সর্বশেষ বাংলা সংবাদ ও খবর পড়ুন। বিবিসি বাংলার সর্বশেষ সংবাদ আপডেট।",
    body: [
      "<h1>বাংলা সংবাদ — আজকের খবর</h1>",
      "<p>সর্বশেষ বাংলা সংবাদ পড়ুন। বিবিসি বাংলার সর্বশেষ খবর ও সংবাদ আপডেট।</p>",
      "<p><a href='/'>← মূল ক্যালেন্ডারে ফিরুন</a></p>",
    ].join("\n"),
  },
  {
    route: "/weather",
    title: "আবহাওয়া পূর্বাভাস ২০২৬ — ১৫ দিনের আবহাওয়া বাংলায় | সঠিক বাংলা ক্যালেন্ডার",
    desc:  "কলকাতা, ঢাকা, চট্টগ্রাম, আগরতলা ও শিলিগুড়ির আবহাওয়া পূর্বাভাস। ১৫ দিনের বিস্তারিত আবহাওয়া বাংলায়।",
    body: [
      "<h1>আবহাওয়া পূর্বাভাস — ১৫ দিনের বিস্তারিত</h1>",
      "<p>কলকাতা, ঢাকা, চট্টগ্রাম, আগরতলা ও শিলিগুড়ির আবহাওয়ার সম্পূর্ণ পূর্বাভাস। তাপমাত্রা, আর্দ্রতা, বৃষ্টিপাত ও বায়ু বেগের তথ্য বাংলায়।</p>",
      "<p><a href='/'>← মূল ক্যালেন্ডারে ফিরুন</a></p>",
    ].join("\n"),
  },
];

for (const p of staticPages) {
  const canonical = `${SITE}${p.route}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": p.title,
    "description": p.desc,
    "url": canonical,
    "inLanguage": "bn",
    "isPartOf": { "@type": "WebSite", "url": SITE, "name": "সঠিক বাংলা ক্যালেন্ডার" },
  };
  let html = swapHead(template, { title: p.title, description: p.desc, canonical, schema });
  html = swapBody(html, p.body);
  emit(p.route, html);
}

// ── sitemap: home + high-value date pages ───────────────────────────────────

// Home (highest priority, changes daily).
sitemap.unshift({ loc: `${SITE}/`, priority: "1.0", changefreq: "daily" });

// Date pages for every festival/event falling in a ~15-month window — these are
// the rich, computed pages users search for ("durga puja 2026 date" etc.).
function shift(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
const winStart = shift(-30);
const winEnd   = shift(460);
const dateSet  = new Set<string>([today]);
for (const f of FESTIVALS) {
  if (f.date >= winStart && f.date <= winEnd) dateSet.add(f.date);
}
for (const d of [...dateSet].sort()) {
  const [y, m, day] = d.split("-");
  addUrl(`${SITE}/date/${+y}/${+m}/${+day}`, "0.6", "monthly");
}

// ── write sitemap.xml ───────────────────────────────────────────────────────

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...sitemap.map(u =>
    `  <url><loc>${u.loc}</loc><lastmod>${NOW_ISO}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
  ),
  `</urlset>`,
].join("\n");
fs.writeFileSync(path.join(DIST, "sitemap.xml"), xml, "utf-8");

// ── summary ───────────────────────────────────────────────────────────────

const festCount  = Object.keys(FESTIVAL_DETAILS).length;
const monthCount = 3 * 12; // 3 years × 12 months
const staticCount = staticPages.length;

console.log(`\n🗺  sitemap.xml — ${sitemap.length} URLs`);
console.log(`✅  Prerender complete — ${festCount} festival + ${monthCount} month + ${staticCount} static pages\n`);
