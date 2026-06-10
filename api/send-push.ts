// Sends the daily Bengali panchang push (FCM HTTP v1). Web-standard handler.
// Triggered by the scheduled GitHub Actions workflow (3 slots/day).
import { fsListTokens, fsDeleteToken, fcmSend } from "../src/server/google";
import { convertToBengali, toBengaliNumerals } from "../src/lib/bengali-calendar";
import { getTithiAtSunrise, getSunTimes, formatKolkataTime } from "../src/lib/panjika";
import { getAllEventsForDate } from "../src/lib/calendar-events";
import { FESTIVALS } from "../src/lib/festivals";

const SITE = "https://www.sothikbanglacalendar.live";

const MAJOR = new Set([
  "durga-puja", "kali-puja", "lakshmi-puja", "saraswati-puja", "bangla-nabobarsho",
  "rath-yatra", "jagaddhatri-puja", "dol-purnima", "biswakarma-puja", "mahalaya",
]);

const pad = (n: number) => String(n).padStart(2, "0");
const json = (o: any, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });

function buildMessage(slot: string): { title: string; body: string; link: string } | null {
  const ist = new Date(Date.now() + 5.5 * 3600 * 1000);
  const y = ist.getUTCFullYear(), m = ist.getUTCMonth() + 1, d = ist.getUTCDate();
  const utc = new Date(Date.UTC(y, m - 1, d));
  const todayStr = `${y}-${pad(m)}-${pad(d)}`;

  if (slot === "noon") {
    const events = getAllEventsForDate(utc);
    if (events.length === 0) return null;
    const names = events.slice(0, 3).map(e => `${e.icon} ${e.nameBn}`).join(" · ");
    return { title: "✨ আজকের বিশেষ দিন", body: names + (events.length > 3 ? ` · আরও ${toBengaliNumerals(events.length - 3)}টি` : ""), link: `${SITE}/date/${y}/${m}/${d}` };
  }

  if (slot === "evening") {
    const upcoming = FESTIVALS
      .filter(f => f.slug && MAJOR.has(f.slug) && f.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    if (!upcoming) return null;
    const days = Math.round((Date.parse(upcoming.date + "T00:00:00Z") - Date.parse(todayStr + "T00:00:00Z")) / 86400000);
    if (days < 0 || days > 30) return null;
    const when = days === 0 ? "আজ" : `আর ${toBengaliNumerals(days)} দিন বাকি`;
    return { title: `${upcoming.icon} উৎসব আসছে`, body: `${upcoming.nameBn} ${when}!`, link: upcoming.slug ? `${SITE}/festival/${upcoming.slug}` : SITE };
  }

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

export default async function handler(req: Request): Promise<Response> {
  const secret = (globalThis as any).process?.env?.CRON_SECRET;
  const auth = req.headers.get("authorization") || "";
  if (!secret || auth !== `Bearer ${secret}`) return json({ error: "unauthorized" }, 401);

  const slot = new URL(req.url).searchParams.get("slot") || "morning";
  const msg = buildMessage(slot);
  if (!msg) return json({ ok: true, slot, skipped: "nothing to send" });

  try {
    const subs = await fsListTokens();
    if (subs.length === 0) return json({ ok: true, slot, sent: 0, note: "no subscribers" });

    let sent = 0, failed = 0;
    const stale: string[] = [];
    const CHUNK = 50;
    for (let i = 0; i < subs.length; i += CHUNK) {
      const chunk = subs.slice(i, i + CHUNK);
      const results = await Promise.all(chunk.map(s => fcmSend(s.token, msg).then(r => ({ s, r }))));
      for (const { s, r } of results) {
        if (r.ok) sent++;
        else { failed++; if (r.unregistered) stale.push(s.id); }
      }
    }
    await Promise.all(stale.map(id => fsDeleteToken(id)));
    return json({ ok: true, slot, subscribers: subs.length, sent, failed, pruned: stale.length });
  } catch (e: any) {
    return json({ error: String(e?.message || e) }, 500);
  }
}
