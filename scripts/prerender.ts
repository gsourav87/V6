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
import { FESTIVALS, getFestivalsForDate } from "../src/lib/festivals";
import { OBSERVANCES, getObservancesForDate } from "../src/lib/observances";
import { FAMOUS_PEOPLE } from "../src/lib/famous-people";
import { convertToBengali, BANGLA_DAYS } from "../src/lib/bengali-calendar";
import { getTithiAtSunrise, getNakshatraAtSunrise } from "../src/lib/panjika";
import { getAllEventsForDate, getAllAnniversariesForDate } from "../src/lib/calendar-events";
import { parseArticle, renderBlocksToHtml, extractFaq, ARTICLE_CATEGORIES, type Article } from "../src/lib/article-parser";

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
  ogImage?: string;
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
  if (m.ogImage) {
    const img = esc(m.ogImage);
    html = html.replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/, `$1${img}$2`);
    html = html.replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/, `$1${img}$2`);
  }

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

// ── firebase-messaging-sw.js (FCM background push) ──────────────────────────
// Generated from env so the (public) Firebase web config isn't committed.
{
  const cfg = {
    apiKey:            process.env.VITE_FIREBASE_API_KEY || "",
    authDomain:        process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId:         process.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket:     process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId:             process.env.VITE_FIREBASE_APP_ID || "",
  };
  const sw = `/* Auto-generated — FCM background push handler */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
firebase.initializeApp(${JSON.stringify(cfg)});
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
  var d = payload.data || {};
  self.registration.showNotification(d.title || 'সঠিক বাংলা ক্যালেন্ডার', {
    body: d.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    lang: 'bn',
    data: { link: d.link || '/' }
  });
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.link) || '/';
  e.waitUntil(clients.matchAll({ type: 'window' }).then(function (list) {
    for (var i = 0; i < list.length; i++) { if ('focus' in list[i]) { list[i].navigate(url); return list[i].focus(); } }
    return clients.openWindow(url);
  }));
});
`;
  fs.writeFileSync(path.join(DIST, "firebase-messaging-sw.js"), sw, "utf-8");
  console.log(cfg.apiKey ? "  ✓  firebase-messaging-sw.js (config from env)" : "  ⚠  firebase-messaging-sw.js written WITHOUT config (env vars missing)");
}

// ── festival pages ────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10);

const GREG_MONTHS_BN = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

/** "2026-10-16" → "১৬ অক্টোবর ২০২৬, শুক্রবার" */
function bnDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const weekday = BANGLA_DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()].bn;
  return `${bn(d)} ${GREG_MONTHS_BN[m - 1]} ${bn(y)}, ${weekday}`;
}

/** Parenthetical day name from a FESTIVALS entry, e.g. "দুর্গা পূজা (মহাষষ্ঠী)" → "মহাষষ্ঠী". */
function subName(nameBn: string): string | undefined {
  return nameBn.match(/\(([^)]+)\)/)?.[1];
}

/**
 * Self-contained Bengali sentence answering "<festival> <year> কবে?" for the
 * given year's occurrence(s) — the direct-answer line AI engines extract.
 */
function dateAnswer(nameBn: string, entries: Array<{ date: string; nameBn: string }>): string {
  const year = bn(Number(entries[0].date.slice(0, 4)));
  if (entries.length === 1) {
    return `${nameBn} ${year} সালের ${bnDateLong(entries[0].date)} তারিখে পালিত হবে।`;
  }
  const first = entries[0];
  const last = entries[entries.length - 1];
  const firstLabel = subName(first.nameBn) ? ` (${subName(first.nameBn)})` : "";
  const lastLabel = subName(last.nameBn) ? ` (${subName(last.nameBn)})` : "";
  return `${year} সালে ${nameBn} ${bnDateLong(first.date)}${firstLabel} থেকে ${bnDateLong(last.date)}${lastLabel} পর্যন্ত পালিত হবে।`;
}

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

  // Per-festival 1200×630 OG image (generated into public/og/) — Google
  // Discover requires large unique images in both OG tags and JSON-LD.
  const ogImage = fs.existsSync(path.join(ROOT, "public", "og", `${slug}.png`))
    ? `${SITE}/og/${slug}.png`
    : undefined;

  const upcoming = firstUpcoming(slug);

  // GEO: question–answer pairs surfaced both as visible FAQ content and as
  // FAQPage JSON-LD, so AI engines get clean extractable sentences.
  const upcomingEntries = FESTIVALS
    .filter(f => f.slug === slug && f.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const faqYears = [...new Set(upcomingEntries.map(e => e.date.slice(0, 4)))].slice(0, 2);
  const faq: Array<{ q: string; a: string }> = faqYears.map(y => ({
    q: `${detail.nameBn} ${bn(Number(y))} কবে?`,
    a: dateAnswer(detail.nameBn, upcomingEntries.filter(e => e.date.startsWith(y))),
  }));
  if (faq.length === 0 && upcoming) {
    faq.push({
      q: `${detail.nameBn} ${bn(Number(upcoming.slice(0, 4)))} কবে?`,
      a: dateAnswer(detail.nameBn, [{ date: upcoming, nameBn: detail.nameBn }]),
    });
  }
  const answerLine = faq[0]?.a;
  faq.push({ q: `${detail.nameBn} কী?`, a: `${detail.tagline}। ${detail.descBn[0]}` });

  const mainSchema: object = upcoming
    ? {
        "@type": "Event",
        "name": detail.nameEn,
        "alternateName": detail.nameBn,
        "description": detail.descBn[0],
        "url": canonical,
        ...(ogImage ? { image: [ogImage] } : {}),
        "startDate": upcoming,
        "inLanguage": "bn",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "organizer": { "@type": "Organization", "name": "সঠিক বাংলা ক্যালেন্ডার", "url": SITE },
      }
    : {
        "@type": "WebPage",
        "name": title,
        "description": detail.descBn[0],
        "url": canonical,
        "inLanguage": "bn",
        ...(ogImage ? { image: ogImage } : {}),
        "isPartOf": { "@type": "WebSite", "url": SITE, "name": "সঠিক বাংলা ক্যালেন্ডার" },
      };

  const faqSchema = {
    "@type": "FAQPage",
    "mainEntity": faq.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a },
    })),
  };
  const schema = { "@context": "https://schema.org", "@graph": [mainSchema, faqSchema] };

  const body = [
    `<h1>${detail.icon} ${detail.nameBn} — ${year}</h1>`,
    // direct-answer line first: AI engines and featured snippets lift this
    ...(answerLine ? [`<p><strong>${answerLine}</strong></p>`] : []),
    `<p><strong>${detail.tagline}</strong></p>`,
    ...detail.descBn.map(p => `<p>${p}</p>`),
    `<h2>সাধারণ প্রশ্ন</h2>`,
    ...faq.map(({ q, a }) => `<h3>${q}</h3>\n<p>${a}</p>`),
    `<p><a href="/">← সঠিক বাংলা ক্যালেন্ডারে ফিরুন</a> &nbsp;|&nbsp; <a href="/panjika">পঞ্জিকা</a></p>`,
  ].join("\n");

  let html = swapHead(template, { title, description: desc, canonical, ogImage, schema });
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
    route: "/muhurta",
    title: "শুভ মুহূর্ত ২০২৬ — বিবাহ, গৃহপ্রবেশ, যাত্রার শুভ দিন | সঠিক বাংলা ক্যালেন্ডার",
    desc:  "আগামী ১০ দিনের শুভ মুহূর্ত — বিবাহ, গৃহপ্রবেশ, যাত্রা, ব্যবসা, নামকরণ ও অন্নপ্রাশনের শুভ দিন। তিথি, নক্ষত্র, যোগ ও করণ বিচার করে কলকাতার সূর্যোদয় অনুসারে গণনা।",
    body: [
      "<h1>শুভ মুহূর্ত ২০২৬ — শুভ দিন ও সময়</h1>",
      "<p>বিবাহ, গৃহপ্রবেশ, যাত্রা, ব্যবসা, নামকরণ, শিক্ষারম্ভ ও অন্নপ্রাশনের জন্য আগামী ১০ দিনের শুভ দিন দেখুন। প্রতিটি দিনের তিথি, নক্ষত্র, যোগ ও করণ বিচার করে কলকাতার সূর্যোদয় অনুসারে গণনা করা হয়েছে।</p>",
      "<p>শুভ মুহূর্ত হলো কোনো গুরুত্বপূর্ণ কাজ শুরু করার জন্য জ্যোতিষশাস্ত্র অনুসারে নির্ধারিত শুভ সময়। গুরুত্বপূর্ণ অনুষ্ঠানের জন্য বিশেষজ্ঞ পণ্ডিতের পরামর্শ নেওয়া বাঞ্ছনীয়।</p>",
      "<p><a href='/panjika'>আজকের পঞ্জিকা</a> &nbsp;|&nbsp; <a href='/'>← মূল ক্যালেন্ডারে ফিরুন</a></p>",
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

// ── article pages (বাংলার ঐতিহ্য ও ইতিহাস) ────────────────────────────────────────────

console.log("\n📚 Article pages");

const ARTICLES_DIR = path.join(ROOT, "src", "content", "articles");
const articles: Article[] = fs.existsSync(ARTICLES_DIR)
  ? fs.readdirSync(ARTICLES_DIR)
      .filter(f => f.endsWith(".md"))
      .map(f => parseArticle(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8"), f.replace(/\.md$/, "")))
      .sort((a, b) => b.date.localeCompare(a.date))
  : [];

for (const a of articles) {
  const route     = `/articles/${a.slug}`;
  const canonical = `${SITE}${route}`;
  const title     = `${a.title} | বাংলার ঐতিহ্য ও ইতিহাস — সঠিক বাংলা ক্যালেন্ডার`;
  const ogImage   = a.image ? `${SITE}${a.image}` : undefined;
  const cat       = ARTICLE_CATEGORIES[a.category];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": a.title,
        "description": a.excerpt,
        ...(ogImage ? { image: [ogImage] } : {}),
        "datePublished": a.date,
        "inLanguage": "bn",
        "url": canonical,
        "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
        "author": { "@type": "Organization", "name": "সঠিক বাংলা ক্যালেন্ডার", "url": SITE },
        "publisher": { "@type": "Organization", "name": "সঠিক বাংলা ক্যালেন্ডার", "url": SITE },
        "keywords": a.tags.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "হোম", "item": SITE },
          { "@type": "ListItem", "position": 2, "name": "বাংলার ঐতিহ্য ও ইতিহাস", "item": `${SITE}/articles` },
          { "@type": "ListItem", "position": 3, "name": a.title, "item": canonical },
        ],
      },
      ...(extractFaq(a.blocks).length > 0
        ? [{
            "@type": "FAQPage",
            "mainEntity": extractFaq(a.blocks).map(({ q, a: ans }) => ({
              "@type": "Question",
              "name": q,
              "acceptedAnswer": { "@type": "Answer", "text": ans },
            })),
          }]
        : []),
    ],
  };

  const body = [
    `<p><a href="/articles">← বাংলার ঐতিহ্য ও ইতিহাস</a></p>`,
    `<h1>${esc(a.title)}</h1>`,
    `<p><strong>${cat.icon} ${cat.labelBn}</strong>${a.date ? ` &nbsp;·&nbsp; ${bnDateLong(a.date)}` : ""}</p>`,
    ...(a.excerpt ? [`<p><strong>${esc(a.excerpt)}</strong></p>`] : []),
    renderBlocksToHtml(a.blocks),
    ...(a.related.length
      ? [`<h2>সম্পর্কিত পাতা</h2><ul>${a.related.map(l => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join("")}</ul>`]
      : []),
    `<p><a href="/articles">← বাংলার ঐতিহ্য ও ইতিহাস</a> &nbsp;|&nbsp; <a href="/">সঠিক বাংলা ক্যালেন্ডার</a></p>`,
  ].join("\n");

  let html = swapHead(template, { title, description: a.excerpt, canonical, ogImage, schema });
  html = swapBody(html, body);
  emit(route, html, "0.7", "monthly");
}

// Article index page
{
  const route     = "/articles";
  const canonical = `${SITE}${route}`;
  const title     = "বাংলার ঐতিহ্য ও ইতিহাস — উৎসব, ব্যক্তিত্ব ও অজানা তথ্যের নিবন্ধ | সঠিক বাংলা ক্যালেন্ডার";
  const desc      = "বাংলার ঐতিহ্য ও ইতিহাস — বাংলার উৎসব, বিখ্যাত ব্যক্তিত্ব, ঐতিহাসিক ঘটনা, অজানা তথ্য ও বিশেষ দিন নিয়ে বাংলা নিবন্ধ সংগ্রহ। ইতিহাস, তাৎপর্য ও তারিখসহ বিস্তারিত পড়ুন।";

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "বাংলার ঐতিহ্য ও ইতিহাস",
    "description": desc,
    "url": canonical,
    "inLanguage": "bn",
    "isPartOf": { "@type": "WebSite", "url": SITE, "name": "সঠিক বাংলা ক্যালেন্ডার" },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": articles.slice(0, 20).map((a, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": a.title,
        "url": `${SITE}/articles/${a.slug}`,
      })),
    },
  };

  const body = [
    `<h1>বাংলার ঐতিহ্য ও ইতিহাস</h1>`,
    `<p>বাংলার উৎসব, বিখ্যাত ব্যক্তিত্ব, ঐতিহাসিক ঘটনা, অজানা তথ্য ও বিশেষ দিন — ইতিহাস, তাৎপর্য ও তারিখসহ বাছাই করা নিবন্ধের সংগ্রহ।</p>`,
    `<ul>`,
    ...articles.map(a =>
      `<li><a href="/articles/${esc(a.slug)}">${esc(a.title)}</a>${a.excerpt ? ` — ${esc(a.excerpt)}` : ""}</li>`
    ),
    `</ul>`,
    `<p><a href="/">← সঠিক বাংলা ক্যালেন্ডারে ফিরুন</a> &nbsp;|&nbsp; <a href="/panjika">পঞ্জিকা</a></p>`,
  ].join("\n");

  let html = swapHead(template, { title, description: desc, canonical, schema });
  html = swapBody(html, body);
  emit(route, html, "0.8", "weekly");
}

// ── sitemap: home + high-value date pages ───────────────────────────────────

// Home (highest priority, changes daily).
sitemap.unshift({ loc: `${SITE}/`, priority: "1.0", changefreq: "daily" });

// High-value date pages — the rich, computed pages users search for:
//   • festivals/events in a ~2-year window ("durga puja 2026 date")
//   • every famous person's birth/death anniversary ("rabindranath tagore birthday")
//   • the recurring observance/event anniversaries
function shift(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
/** Next annual occurrence of an "MM-DD", as YYYY-MM-DD (this year or next). */
function nextOccurrence(md: string): string {
  const y = new Date().getUTCFullYear();
  const thisYear = `${y}-${md}`;
  return thisYear >= today ? thisYear : `${y + 1}-${md}`;
}

const winStart = shift(-30);
const winEnd   = shift(730);
const dateSet  = new Set<string>([today]);

for (const f of FESTIVALS) {
  if (f.date >= winStart && f.date <= winEnd) dateSet.add(f.date);
}
for (const p of FAMOUS_PEOPLE) {
  dateSet.add(nextOccurrence(p.birthMD));
  if (p.deathMD) dateSet.add(nextOccurrence(p.deathMD));
}
for (const o of OBSERVANCES) {
  if (o.slug) dateSet.add(nextOccurrence(o.md));
}

console.log("\n🗓  Date pages (computed panchang)");

const pad4 = (n: number) => String(n).padStart(4, "0");

for (const d of [...dateSet].sort()) {
  const [y, m, day] = d.split("-").map(Number);
  const route     = `/date/${y}/${m}/${day}`;
  const canonical = `${SITE}${route}`;
  const utc       = new Date(Date.UTC(y, m - 1, day));

  const bnDate    = convertToBengali(y, m, day);
  const tithi     = getTithiAtSunrise(utc);
  const nak       = getNakshatraAtSunrise(utc);
  const events    = getAllEventsForDate(utc);            // festivals + observances + anniversaries
  const annivs    = getAllAnniversariesForDate(utc);     // person cards
  const festObs   = [...getFestivalsForDate(utc), ...getObservancesForDate(utc)]; // for Event schema

  const title = `${bn(bnDate.day)} ${bnDate.monthNameBn} ${bn(bnDate.year)} — তিথি ${tithi.nameBn}, নক্ষত্র ${nak.nameBn} | বাংলা পঞ্জিকা`;
  const desc  = `${bn(bnDate.day)} ${bnDate.monthNameBn} ${bn(bnDate.year)} বঙ্গাব্দ (${day}/${m}/${y}) — তিথি: ${tithi.nameBn} (${tithi.pakshaBn}), নক্ষত্র: ${nak.nameBn}। সম্পূর্ণ বাংলা পঞ্জিকা তথ্য দেখুন।`;

  const eventsHtml = events.length
    ? `<h2>উৎসব ও বিশেষ দিন</h2><ul>${events.map(e => `<li>${e.icon} ${esc(e.nameBn)}</li>`).join("")}</ul>`
    : "";
  const body = [
    `<h1>${bn(bnDate.day)} ${bnDate.monthNameBn} ${bn(bnDate.year)} বঙ্গাব্দ — পঞ্জিকা</h1>`,
    `<p><strong>গ্রেগরিয়ান তারিখ:</strong> ${day}/${m}/${y} (${bnDate.dayNameBn})</p>`,
    `<p><strong>তিথি:</strong> ${esc(tithi.nameBn)} (${esc(tithi.pakshaBn)}) &nbsp;|&nbsp; <strong>নক্ষত্র:</strong> ${esc(nak.nameBn)}</p>`,
    eventsHtml,
    `<p>বিশুদ্ধ সিদ্ধান্ত পদ্ধতিতে কলকাতার সূর্যোদয় অনুসারে গণনা করা সম্পূর্ণ পঞ্জিকা — তিথি, নক্ষত্র, যোগ, করণ, সূর্যোদয়, সূর্যাস্ত ও রাহু কাল।</p>`,
    `<p><a href="/">← সঠিক বাংলা ক্যালেন্ডার</a> &nbsp;|&nbsp; <a href="/panjika">পঞ্জিকা</a></p>`,
  ].filter(Boolean).join("\n");

  const graph: object[] = [
    { "@type": "WebPage", "name": title, "description": desc, "url": canonical, "inLanguage": "bn",
      "isPartOf": { "@type": "WebSite", "url": SITE, "name": "সঠিক বাংলা ক্যালেন্ডার" } },
    ...annivs.map(a => ({
      "@type": "Person",
      "name": a.person.nameBn,
      "alternateName": a.person.nameEn,
      "birthDate": `${pad4(a.person.birthYear)}-${a.person.birthMD}`,
      ...(a.person.deathYear
        ? { "deathDate": a.person.deathMD ? `${pad4(a.person.deathYear)}-${a.person.deathMD}` : pad4(a.person.deathYear) }
        : {}),
      "jobTitle": a.person.role,
      "description": a.person.descBn,
      "sameAs": a.person.wikiUrl,
      "nationality": "Indian",
    })),
    ...festObs.map(f => ({
      "@type": "Event",
      "name": f.nameEn,
      "alternateName": f.nameBn,
      "startDate": f.date,
      ...(f.descBn ? { "description": f.descBn } : {}),
      "inLanguage": "bn",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "url": f.slug ? `${SITE}/festival/${f.slug}` : canonical,
    })),
  ];
  const schema = { "@context": "https://schema.org", "@graph": graph };

  let html = swapHead(template, { title, description: desc, canonical, schema });
  html = swapBody(html, body);
  emit(route, html, "0.6", "monthly");
}

// ── write sitemaps: index + core / articles / dates ─────────────────────────
// Split index keeps the primary sitemaps small and high-quality and lets
// Search Console report indexing per bucket. All date pages stay prerendered
// (they're reachable through internal links), but only the timely window
// (-7…+90 days) is listed in the sitemap so the crawl queue isn't flooded
// with hundreds of same-pattern URLs. lastmod is emitted only where it's
// truthful (per-article publish dates) — identical stamps on every URL teach
// Google to ignore the field.

const dateWinStart = shift(-7);
const dateWinEnd   = shift(90);

const articleLastmod = new Map<string, string>(
  articles.map(a => [`${SITE}/articles/${a.slug}`, a.date])
);
if (articles[0]?.date) articleLastmod.set(`${SITE}/articles`, articles[0].date);

const buckets: Record<string, typeof sitemap> = { core: [], articles: [], dates: [] };
for (const u of sitemap) {
  const route = u.loc.slice(SITE.length) || "/";
  if (route === "/articles" || route.startsWith("/articles/")) buckets.articles.push(u);
  else if (route.startsWith("/date/")) {
    const m = route.match(/^\/date\/(\d+)\/(\d+)\/(\d+)$/);
    const iso = m ? `${m[1]}-${String(m[2]).padStart(2, "0")}-${String(m[3]).padStart(2, "0")}` : "";
    if (iso >= dateWinStart && iso <= dateWinEnd) buckets.dates.push(u);
  } else buckets.core.push(u);
}

function writeUrlset(file: string, entries: typeof sitemap, lastmodFor?: (loc: string) => string | undefined): void {
  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...entries.map(u => {
      const lm = lastmodFor?.(u.loc);
      return `  <url><loc>${u.loc}</loc>${lm ? `<lastmod>${lm}</lastmod>` : ""}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`;
    }),
    `</urlset>`,
  ].join("\n");
  fs.writeFileSync(path.join(DIST, file), xml, "utf-8");
}

writeUrlset("sitemap-core.xml", buckets.core);
writeUrlset("sitemap-articles.xml", buckets.articles, loc => articleLastmod.get(loc));
writeUrlset("sitemap-dates.xml", buckets.dates);

const indexXml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...["sitemap-core.xml", "sitemap-articles.xml", "sitemap-dates.xml"].map(
    f => `  <sitemap><loc>${SITE}/${f}</loc><lastmod>${NOW_ISO}</lastmod></sitemap>`
  ),
  `</sitemapindex>`,
].join("\n");
fs.writeFileSync(path.join(DIST, "sitemap.xml"), indexXml, "utf-8");

// ── RSS feed (বাংলার ঐতিহ্য ও ইতিহাস articles) ───────────────────────────────

const rfc822 = (iso: string) => new Date(iso + "T06:00:00Z").toUTCString();
const feedItems = articles.map(a => {
  const link = `${SITE}/articles/${a.slug}`;
  return [
    `    <item>`,
    `      <title>${esc(a.title)}</title>`,
    `      <link>${link}</link>`,
    `      <guid isPermaLink="true">${link}</guid>`,
    `      <pubDate>${rfc822(a.date)}</pubDate>`,
    `      <description>${esc(a.excerpt)}</description>`,
    `    </item>`,
  ].join("\n");
});
const feedXml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<rss version="2.0">`,
  `  <channel>`,
  `    <title>বাংলার ঐতিহ্য ও ইতিহাস — সঠিক বাংলা ক্যালেন্ডার</title>`,
  `    <link>${SITE}/articles</link>`,
  `    <description>বাংলার উৎসব, বিখ্যাত ব্যক্তিত্ব, ইতিহাস, অজানা তথ্য ও বিশেষ দিনের নিবন্ধ</description>`,
  `    <language>bn</language>`,
  `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
  ...feedItems,
  `  </channel>`,
  `</rss>`,
].join("\n");
fs.writeFileSync(path.join(DIST, "feed.xml"), feedXml, "utf-8");

// ── summary ───────────────────────────────────────────────────────────────

const festCount  = Object.keys(FESTIVAL_DETAILS).length;
const monthCount = 3 * 12; // 3 years × 12 months
const staticCount = staticPages.length;

console.log(`\n🗺  sitemap index — core ${buckets.core.length} + articles ${buckets.articles.length} + dates ${buckets.dates.length} URLs (${sitemap.length - buckets.core.length - buckets.articles.length - buckets.dates.length} date pages prerendered but unlisted)`);
console.log(`📡 feed.xml — ${articles.length} items`);
console.log(`✅  Prerender complete — ${festCount} festival + ${monthCount} month + ${staticCount} static + ${articles.length + 1} article pages\n`);
