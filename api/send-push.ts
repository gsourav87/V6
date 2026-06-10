// Vercel Node function — sends the daily Bengali panchang push.
// Triggered by the scheduled GitHub Actions workflow (3 slots/day).
// Reuses the app's own panchang computation so content is always accurate.
import { fsListTokens, fsDeleteToken, fcmSend } from "../src/server/google";
import { convertToBengali, toBengaliNumerals } from "../src/lib/bengali-calendar";
import { getTithiAtSunrise, getSunTimes, formatKolkataTime } from "../src/lib/panjika";
import { getAllEventsForDate } from "../src/lib/calendar-events";
import { FESTIVALS } from "../src/lib/festivals";

const SITE = "https://www.sothikbanglacalendar.live";

// Big festivals worth a countdown notification.
const MAJOR = new Set([
  "durga-puja", "kali-puja", "lakshmi-puja", "saraswati-puja", "bangla-nabobarsho",
  "rath-yatra", "jagaddhatri-puja", "dol-purnima", "biswakarma-puja", "mahalaya",
]);

function pad(n: number) { return String(n).padStart(2, "0"); }

function buildMessage(slot: string): { title: string; body: string; link: string } | null {
  // "Today" in IST.
  const ist = new Date(Date.now() + 5.5 * 3600 * 1000);
  const y = ist.getUTCFullYear(), m = ist.getUTCMonth() + 1, d = ist.getUTCDate();
  const utc = new Date(Date.UTC(y, m - 1, d));
  const todayStr = `${y}-${pad(m)}-${pad(d)}`;

  if (slot === "noon") {
    // Significance of the day — only if something special falls today.
    const events = getAllEventsForDate(utc);
    if (events.length === 0) return null;
    const names = events.slice(0, 3).map(e => `${e.icon} ${e.nameBn}`).join(" · ");
    return {
      title: "✨ আজকের বিশেষ দিন",
      body: names + (events.length > 3 ? ` · আরও ${toBengaliNumerals(events.length - 3)}টি` : ""),
      link: `${SITE}/date/${y}/${m}/${d}`,
    };
  }

  if (slot === "evening") {
    // Festival countdown — only when a big festival is within 30 days.
    const upcoming = FESTIVALS
      .filter(f => f.slug && MAJOR.has(f.slug) && f.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    if (!upcoming) return null;
    const days = Math.round((Date.parse(upcoming.date + "T00:00:00Z") - Date.parse(todayStr + "T00:00:00Z")) / 86400000);
    if (days < 0 || days > 30) return null;
    const when = days === 0 ? "আজ" : `আর ${toBengaliNumerals(days)} দিন বাকি`;
    return {
      title: `${upcoming.icon} উৎসব আসছে`,
      body: `${upcoming.nameBn} ${when}!`,
      link: upcoming.slug ? `${SITE}/festival/${upcoming.slug}` : SITE,
    };
  }

  // morning (default) — today's date, tithi, sunrise/sunset.
  const bnDate = convertToBengali(y, m, d);
  const tithi  = getTithiAtSunrise(utc);
  const sun    = getSunTimes(utc);
  return {
    title: "🗓 আজকের পঞ্জিকা",
    body:
      `${toBengaliNumerals(bnDate.day)} ${bnDate.monthNameBn} ${toBengaliNumerals(bnDate.year)} · তিথি ${tithi.nameBn}\n` +
      `সূর্যোদয় ${formatKolkataTime(sun.sunrise)} · সূর্যাস্ত ${formatKolkataTime(sun.sunset)}`,
    link: `${SITE}/date/${y}/${m}/${d}`,
  };
}

export default async function handler(req: any, res: any) {
  // Auth — only the scheduled job (with CRON_SECRET) may trigger sends.
  const auth = req.headers["authorization"] || "";
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const slot = String(req.query?.slot || "morning");
  const msg = buildMessage(slot);
  if (!msg) return res.status(200).json({ ok: true, slot, skipped: "nothing to send" });

  try {
    const subs = await fsListTokens(); // [{ id, token }]
    if (subs.length === 0) return res.status(200).json({ ok: true, slot, sent: 0, note: "no subscribers" });

    let sent = 0, failed = 0;
    const stale: string[] = [];

    // Send in parallel chunks (FCM HTTP v1 is one token per call).
    const CHUNK = 50;
    for (let i = 0; i < subs.length; i += CHUNK) {
      const chunk = subs.slice(i, i + CHUNK);
      const results = await Promise.all(chunk.map(s => fcmSend(s.token, msg).then(r => ({ s, r }))));
      for (const { s, r } of results) {
        if (r.ok) sent++;
        else { failed++; if (r.unregistered) stale.push(s.id); }
      }
    }

    // Prune dead tokens so the list stays clean.
    await Promise.all(stale.map(id => fsDeleteToken(id)));

    return res.status(200).json({ ok: true, slot, subscribers: subs.length, sent, failed, pruned: stale.length });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
