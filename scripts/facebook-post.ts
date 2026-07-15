/**
 * Builds and publishes one of the day's scheduled Facebook posts, using the
 * exact same panchang/festival/weather/article data the website itself
 * computes — no separate content source, nothing that can drift from what a
 * visitor sees on the site.
 *
 * Run: tsx scripts/facebook-post.ts <slot>
 *   slot: morning | rashifal | noon | afternoon | evening | night
 *
 * Env: FB_PAGE_ID, FB_PAGE_ACCESS_TOKEN
 *
 * A slot with nothing genuine to say (no festival today, weather API down)
 * skips silently rather than posting a hollow or stale-looking update —
 * six posts most days, five or four on quieter ones. That's intentional.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fbPostText } from "../src/server/facebook";
import { convertToBengali, toBengaliNumerals } from "../src/lib/bengali-calendar";
import {
  getTithiAtSunrise, getNakshatraAtSunrise, getYogaAtSunrise, getKaranaAtSunrise,
  getSunTimes, formatKolkataTime,
} from "../src/lib/panjika";
import { getAllEventsForDate } from "../src/lib/calendar-events";
import { fetchWeather, describeCode, CITIES } from "../src/lib/weather";
import { parseArticle, type Article } from "../src/lib/article-parser";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.sothikbanglacalendar.live";

type Post = { message: string; link: string } | null;

function todayIST() {
  const ist = new Date(Date.now() + 5.5 * 3600 * 1000);
  const y = ist.getUTCFullYear(), m = ist.getUTCMonth() + 1, d = ist.getUTCDate();
  return { y, m, d, utc: new Date(Date.UTC(y, m - 1, d)) };
}

function loadArticles(): Article[] {
  const dir = path.join(ROOT, "src", "content", "articles");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".md"))
    .map(f => parseArticle(fs.readFileSync(path.join(dir, f), "utf-8"), f.replace(/\.md$/, "")))
    .sort((a, b) => b.date.localeCompare(a.date));
}

// ── the six slots ────────────────────────────────────────────────────────

async function buildMorning(): Promise<Post> {
  const { y, m, d, utc } = todayIST();
  const bn = convertToBengali(y, m, d);
  const tithi = getTithiAtSunrise(utc);
  const nak = getNakshatraAtSunrise(utc);
  const yoga = getYogaAtSunrise(utc);
  const karana = getKaranaAtSunrise(utc);
  const sun = getSunTimes(utc);

  const message = [
    "🌅 আজকের বাংলা পঞ্জিকা",
    "",
    `📅 ${toBengaliNumerals(bn.day)} ${bn.monthNameBn} ${toBengaliNumerals(bn.year)} বঙ্গাব্দ, ${bn.dayNameBn}`,
    `🌙 তিথি: ${tithi.nameBn} (${tithi.pakshaBn})`,
    `⭐ নক্ষত্র: ${nak.nameBn}`,
    `🔯 যোগ: ${yoga.nameBn}  ·  করণ: ${karana.nameBn}`,
    `🌄 সূর্যোদয়: ${formatKolkataTime(sun.sunrise)}   🌇 সূর্যাস্ত: ${formatKolkataTime(sun.sunset)}`,
    "",
    "বিস্তারিত পঞ্জিকা ও রাহু কাল দেখুন 👇",
  ].join("\n");
  return { message, link: `${SITE}/panjika` };
}

async function buildRashifal(): Promise<Post> {
  const message = [
    "🔮 আজকের রাশিফল",
    "",
    "মেষ থেকে মীন — সব রাশির আজকের ভাগ্যফল একসাথে দেখুন।",
  ].join("\n");
  return { message, link: `${SITE}/rashifal` };
}

async function buildNoon(): Promise<Post> {
  const { utc } = todayIST();
  const events = getAllEventsForDate(utc);
  if (events.length === 0) return null; // nothing today — don't pad with a hollow post
  const names = events.map(e => `${e.icon} ${e.nameBn}`).join("\n");
  const message = ["✨ আজকের বিশেষ দিন", "", names].join("\n");
  return { message, link: `${SITE}/today-bengali-date` };
}

async function buildAfternoon(): Promise<Post> {
  const kolkata = CITIES.find(c => c.id === "kolkata") ?? CITIES[0];
  try {
    const w = await fetchWeather(kolkata.lat, kolkata.lon);
    const desc = describeCode(w.current.code);
    const today = w.daily[0];
    const message = [
      `${desc.emoji} আজকের আবহাওয়া — ${kolkata.nameBn}`,
      "",
      `${desc.label}, ${w.current.temp}°সে (অনুভূত ${w.current.feelsLike}°সে)`,
      `🔺 সর্বোচ্চ ${today.tempMax}°সে  🔻 সর্বনিম্ন ${today.tempMin}°সে`,
      `💧 আর্দ্রতা: ${w.current.humidity}%`,
      "",
      "৭ দিনের সম্পূর্ণ পূর্বাভাস দেখুন 👇",
    ].join("\n");
    return { message, link: `${SITE}/weather` };
  } catch {
    return null; // weather API hiccup — skip rather than post stale/wrong data
  }
}

async function buildEvening(): Promise<Post> {
  const articles = loadArticles();
  if (articles.length === 0) return null;
  // rotate deterministically by day-of-year so it's not the same pick daily
  const start = Date.UTC(new Date().getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start) / 86400000);
  const a = articles[dayOfYear % articles.length];
  const message = [
    "📚 বাংলার ঐতিহ্য ও ইতিহাস",
    "",
    a.title,
    "",
    a.excerpt,
  ].join("\n");
  return { message, link: `${SITE}/articles/${a.slug}` };
}

async function buildNight(): Promise<Post> {
  const { y, m, d } = todayIST();
  const tomorrow = new Date(Date.UTC(y, m - 1, d + 1));
  const bn = convertToBengali(tomorrow.getUTCFullYear(), tomorrow.getUTCMonth() + 1, tomorrow.getUTCDate());
  const tithi = getTithiAtSunrise(tomorrow);
  const message = [
    "🕉️ আগামীকালের প্রস্তুতি",
    "",
    `${toBengaliNumerals(bn.day)} ${bn.monthNameBn} — তিথি: ${tithi.nameBn}`,
    "",
    "শুভ মুহূর্ত ও বিস্তারিত পঞ্জিকা দেখুন 👇",
  ].join("\n");
  return { message, link: `${SITE}/muhurta` };
}

const BUILDERS: Record<string, () => Promise<Post>> = {
  morning: buildMorning,
  rashifal: buildRashifal,
  noon: buildNoon,
  afternoon: buildAfternoon,
  evening: buildEvening,
  night: buildNight,
};

// ── main ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const slot = args.find(a => a === "all" || a in BUILDERS);
if (!slot) {
  console.error(`usage: tsx scripts/facebook-post.ts <all|${Object.keys(BUILDERS).join("|")}> [--dry-run]`);
  process.exit(2);
}

if (slot === "all") {
  if (!dryRun) {
    console.error("✗ 'all' is preview-only — run with --dry-run (batch-posting for real isn't supported)");
    process.exit(2);
  }
  for (const name of Object.keys(BUILDERS)) {
    const p = await BUILDERS[name]();
    if (!p) {
      console.log(`↷ [${name}] nothing to post today — skipped.\n`);
      continue;
    }
    console.log(`── [${name}] would post ──\n${p.message}\n\n🔗 ${p.link}\n`);
  }
  process.exit(0);
}

const post = await BUILDERS[slot]();
if (!post) {
  console.log(`↷ [${slot}] nothing to post today — skipped.`);
  process.exit(0);
}

if (dryRun) {
  console.log(`── [${slot}] would post ──\n${post.message}\n\n🔗 ${post.link}`);
  process.exit(0);
}

const pageId = process.env.FB_PAGE_ID;
const token = process.env.FB_PAGE_ACCESS_TOKEN;
if (!pageId || !token) {
  console.error("✗ FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN must be set");
  process.exit(1);
}

const result = await fbPostText(pageId, token, post.message, post.link);
if (!result.ok) {
  console.error(`✗ [${slot}] post failed: ${result.error}`);
  process.exit(1);
}
console.log(`✓ [${slot}] posted (id: ${result.id})`);
