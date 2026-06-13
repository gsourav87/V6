// Posts the daily Bengali panjika to a Telegram channel via the Bot API.
// Triggered once each morning by the scheduled GitHub Actions workflow.
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (e.g. "@sothikbanglacalendar" or
// a numeric "-100…" id), and the shared CRON_SECRET for authorization.
import { convertToBengali, toBengaliNumerals } from "../src/lib/bengali-calendar";
import {
  getTithiAtSunrise,
  getNakshatraAtSunrise,
  getYogaAtSunrise,
  getKaranaAtSunrise,
  getSunTimes,
  getRahuKalamInfo,
  formatKolkataTime,
} from "../src/lib/panjika";
import { getAllEventsForDate } from "../src/lib/calendar-events";

const SITE = "https://www.sothikbanglacalendar.live";

const GREG_MONTHS_BN = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

const json = (o: any, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });

/** Escape the few characters Telegram's HTML parse mode treats specially. */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildPost(): { text: string; link: string } {
  // "Today" in IST, so the post matches the Kolkata calendar day.
  const ist = new Date(Date.now() + 5.5 * 3600 * 1000);
  const y = ist.getUTCFullYear(), m = ist.getUTCMonth() + 1, d = ist.getUTCDate();
  const utc = new Date(Date.UTC(y, m - 1, d));

  const bnDate  = convertToBengali(y, m, d);
  const tithi   = getTithiAtSunrise(utc);
  const nak     = getNakshatraAtSunrise(utc);
  const yoga    = getYogaAtSunrise(utc);
  const karana  = getKaranaAtSunrise(utc);
  const sun     = getSunTimes(utc);
  const rahu    = getRahuKalamInfo(utc, utc);
  const events  = getAllEventsForDate(utc);
  const link    = `${SITE}/date/${y}/${m}/${d}`;

  const gregLine = `${toBengaliNumerals(d)} ${GREG_MONTHS_BN[m - 1]} ${toBengaliNumerals(y)}, ${bnDate.dayNameBn}`;

  const lines = [
    "🗓 <b>আজকের পঞ্জিকা</b>",
    esc(gregLine),
    "",
    `📅 <b>বাংলা তারিখ:</b> ${esc(`${toBengaliNumerals(bnDate.day)} ${bnDate.monthNameBn} ${toBengaliNumerals(bnDate.year)} বঙ্গাব্দ`)}`,
    `🌗 <b>তিথি:</b> ${esc(`${tithi.pakshaBn} ${tithi.nameBn}`)}`,
    `⭐ <b>নক্ষত্র:</b> ${esc(nak.nameBn)}`,
    `🧘 <b>যোগ:</b> ${esc(yoga.nameBn)}`,
    `🔱 <b>করণ:</b> ${esc(karana.nameBn)}`,
    "",
    `🌅 <b>সূর্যোদয়:</b> ${formatKolkataTime(sun.sunrise)}   🌇 <b>সূর্যাস্ত:</b> ${formatKolkataTime(sun.sunset)}`,
    `⚠️ <b>রাহুকাল:</b> ${formatKolkataTime(rahu.rahuKalam.start)} – ${formatKolkataTime(rahu.rahuKalam.end)}`,
  ];

  if (events.length > 0) {
    const names = events.slice(0, 4).map(e => `${e.icon} ${esc(e.nameBn)}`).join(" · ");
    lines.push("", `🎉 <b>আজকের বিশেষ দিন:</b> ${names}${events.length > 4 ? " …" : ""}`);
  }

  lines.push(
    "",
    `🔗 <a href="${link}">সম্পূর্ণ পঞ্জিকা — তিথি, নক্ষত্র ও রাহুকাল</a>`,
    "<i>সঠিক বাংলা ক্যালেন্ডার</i>",
  );

  return { text: lines.join("\n"), link };
}

export default async function handler(req: Request): Promise<Response> {
  const env = (globalThis as any).process?.env ?? {};
  const secret = env.CRON_SECRET;
  const auth = req.headers.get("authorization") || "";
  if (!secret || auth !== `Bearer ${secret}`) return json({ error: "unauthorized" }, 401);

  const token  = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return json({ error: "missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID" }, 500);

  const { text } = buildPost();

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        link_preview_options: { prefer_large_media: true },
      }),
    });
    const data = await res.json();
    if (!data.ok) return json({ error: "telegram rejected", detail: data }, 502);
    return json({ ok: true, message_id: data.result?.message_id });
  } catch (e: any) {
    return json({ error: String(e?.message || e) }, 500);
  }
}

export const config = { runtime: "edge" };
