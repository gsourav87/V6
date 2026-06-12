/**
 * West Bengal festival and holiday dataset.
 * Covers Bengali years 1431–1434 (Gregorian ~2024–2027).
 * Includes national holidays, religious observances, and cultural events.
 *
 * Each entry: { date: "YYYY-MM-DD" (Gregorian UTC), nameBn, nameEn, category }
 * Categories: "religious" | "national" | "cultural" | "observance"
 *
 * Six festivals are NOT hand-typed here — Dol Purnima, Jamai Shashthi,
 * Jagaddhatri Puja, Charak Puja, Gajan and Nabanna are computed from the
 * panjika ephemeris for every year (see festival-engine.ts) and merged into
 * the exported FESTIVALS below.
 */
import { computeEngineFestivals, ENGINE_SLUGS } from "./festival-engine";

export type FestivalCategory = "religious" | "national" | "cultural" | "observance";

export interface Festival {
  date: string;   // YYYY-MM-DD
  nameBn: string;
  nameEn: string;
  category: FestivalCategory;
  icon: string;
  wikiUrl?: string;
  slug?: string;  // links to /festival/:slug detail page
  descBn?: string;    // optional Bengali significance (used by recurring observances)
  yearRef?: number;   // optional source year (for historical events)
}

export function getFestivalBySlug(slug: string): Festival | undefined {
  return FESTIVALS.find(f => f.slug === slug);
}

export function getUpcomingDatesForSlug(slug: string, fromDate: Date, count = 4): Festival[] {
  const from = fromDate.toISOString().slice(0, 10);
  return FESTIVALS.filter(f => f.slug === slug && f.date >= from).slice(0, count);
}

const STATIC_FESTIVALS: Festival[] = [
  // ── 2024 (1430-1431) ────────────────────────────────────────────────
  { date: "2024-01-14", nameBn: "মকর সংক্রান্তি", nameEn: "Makar Sankranti", category: "religious", icon: "🌞", slug: "makar-sankranti" },
  { date: "2024-01-15", nameBn: "পোঙ্গল", nameEn: "Pongal", category: "religious", icon: "🌾" },
  { date: "2024-01-22", nameBn: "নেতাজি জন্মজয়ন্তী", nameEn: "Netaji Birthday", category: "national", icon: "🇮🇳", slug: "netaji-jayanti" },
  { date: "2024-01-26", nameBn: "প্রজাতন্ত্র দিবস", nameEn: "Republic Day", category: "national", icon: "🇮🇳", slug: "republic-day" },
  { date: "2024-02-14", nameBn: "সরস্বতী পূজা", nameEn: "Saraswati Puja", category: "religious", icon: "🙏", slug: "saraswati-puja" },
  { date: "2024-03-08", nameBn: "আন্তর্জাতিক নারী দিবস", nameEn: "International Women's Day", category: "observance", icon: "♀️" },
  { date: "2024-04-09", nameBn: "রামনবমী", nameEn: "Ram Navami", category: "religious", icon: "🙏", slug: "ram-navami" },
  { date: "2024-04-11", nameBn: "ইদ-উল-ফিতর", nameEn: "Eid ul-Fitr", category: "religious", icon: "🌙", slug: "eid-ul-fitr" },
  { date: "2024-04-14", nameBn: "বাংলা নববর্ষ ১৪৩১", nameEn: "Bengali New Year 1431 (WB)", category: "cultural", icon: "🎊", slug: "bangla-nabobarsho" },
  { date: "2024-04-17", nameBn: "শ্রীরামচন্দ্রের জন্মতিথি", nameEn: "Ram Navami (Traditional)", category: "religious", icon: "🙏" },
  { date: "2024-05-08", nameBn: "রবীন্দ্র জয়ন্তী", nameEn: "Rabindra Jayanti", category: "cultural", icon: "📖", slug: "rabindra-jayanti" },
  { date: "2024-05-23", nameBn: "বুদ্ধ পূর্ণিমা", nameEn: "Buddha Purnima", category: "religious", icon: "☮️", slug: "buddha-purnima" },
  { date: "2024-06-17", nameBn: "ইদ-উল-আজহা", nameEn: "Eid ul-Adha", category: "religious", icon: "🌙", slug: "eid-ul-adha" },
  { date: "2024-07-07", nameBn: "রথযাত্রা", nameEn: "Rath Yatra", category: "religious", icon: "🛕", slug: "rath-yatra" },
  { date: "2024-08-15", nameBn: "স্বাধীনতা দিবস", nameEn: "Independence Day", category: "national", icon: "🇮🇳", slug: "independence-day" },
  { date: "2024-09-16", nameBn: "বিশ্বকর্মা পূজা", nameEn: "Biswakarma Puja", category: "religious", icon: "⚙️", slug: "biswakarma-puja" },
  { date: "2024-10-02", nameBn: "গান্ধী জয়ন্তী", nameEn: "Gandhi Jayanti", category: "national", icon: "🕊️", slug: "gandhi-jayanti" },
  { date: "2024-10-10", nameBn: "মহালয়া", nameEn: "Mahalaya", category: "religious", icon: "🙏", slug: "mahalaya" },
  { date: "2024-10-10", nameBn: "দুর্গা পূজা (মহাষষ্ঠী)", nameEn: "Durga Puja - Maha Shashthi", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2024-10-11", nameBn: "দুর্গা পূজা (মহাসপ্তমী)", nameEn: "Durga Puja - Maha Saptami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2024-10-12", nameBn: "দুর্গা পূজা (মহাঅষ্টমী)", nameEn: "Durga Puja - Maha Ashtami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2024-10-13", nameBn: "দুর্গা পূজা (মহানবমী)", nameEn: "Durga Puja - Maha Navami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2024-10-14", nameBn: "দুর্গা পূজা (বিজয়াদশমী)", nameEn: "Durga Puja - Vijaya Dashami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2024-10-16", nameBn: "লক্ষ্মী পূজা", nameEn: "Lakshmi Puja", category: "religious", icon: "🙏", slug: "lakshmi-puja" },
  { date: "2024-11-01", nameBn: "কালী পূজা / দীপাবলি", nameEn: "Kali Puja / Diwali", category: "religious", icon: "🛕", slug: "kali-puja" },
  { date: "2024-12-25", nameBn: "বড়দিন", nameEn: "Christmas", category: "religious", icon: "🎄", slug: "christmas" },

  // ── 2025 (1431-1432) ────────────────────────────────────────────────
  { date: "2025-01-01", nameBn: "নববর্ষ (ইংরেজি)", nameEn: "New Year's Day", category: "observance", icon: "🎉" },
  { date: "2025-01-14", nameBn: "মকর সংক্রান্তি", nameEn: "Makar Sankranti", category: "religious", icon: "🌞", slug: "makar-sankranti" },
  { date: "2025-01-23", nameBn: "নেতাজি জন্মজয়ন্তী", nameEn: "Netaji Birthday", category: "national", icon: "🇮🇳", slug: "netaji-jayanti" },
  { date: "2025-01-26", nameBn: "প্রজাতন্ত্র দিবস", nameEn: "Republic Day", category: "national", icon: "🇮🇳", slug: "republic-day" },
  { date: "2025-02-02", nameBn: "সরস্বতী পূজা", nameEn: "Saraswati Puja", category: "religious", icon: "🙏", slug: "saraswati-puja" },
  { date: "2025-02-26", nameBn: "মহা শিবরাত্রি", nameEn: "Maha Shivaratri", category: "religious", icon: "🙏", slug: "maha-shivaratri" },
  { date: "2025-03-30", nameBn: "ইদ-উল-ফিতর", nameEn: "Eid ul-Fitr", category: "religious", icon: "🌙", slug: "eid-ul-fitr" },
  { date: "2025-04-15", nameBn: "বাংলা নববর্ষ ১৪৩২", nameEn: "Bengali New Year 1432 (WB)", category: "cultural", icon: "🎊", slug: "bangla-nabobarsho" },
  { date: "2025-05-09", nameBn: "রবীন্দ্র জয়ন্তী", nameEn: "Rabindra Jayanti", category: "cultural", icon: "📖", slug: "rabindra-jayanti" },
  { date: "2025-05-12", nameBn: "বুদ্ধ পূর্ণিমা", nameEn: "Buddha Purnima", category: "religious", icon: "☮️", slug: "buddha-purnima" },
  { date: "2025-06-07", nameBn: "ইদ-উল-আজহা", nameEn: "Eid ul-Adha", category: "religious", icon: "🌙", slug: "eid-ul-adha" },
  { date: "2025-06-27", nameBn: "রথযাত্রা", nameEn: "Rath Yatra", category: "religious", icon: "🛕", slug: "rath-yatra" },
  { date: "2025-08-15", nameBn: "স্বাধীনতা দিবস", nameEn: "Independence Day", category: "national", icon: "🇮🇳", slug: "independence-day" },
  { date: "2025-09-17", nameBn: "বিশ্বকর্মা পূজা", nameEn: "Biswakarma Puja", category: "religious", icon: "⚙️", slug: "biswakarma-puja" },
  { date: "2025-09-22", nameBn: "মহালয়া", nameEn: "Mahalaya", category: "religious", icon: "🙏", slug: "mahalaya" },
  { date: "2025-10-01", nameBn: "দুর্গা পূজা (মহাষষ্ঠী)", nameEn: "Durga Puja - Maha Shashthi", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2025-10-02", nameBn: "দুর্গা পূজা (মহাসপ্তমী)", nameEn: "Durga Puja - Maha Saptami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2025-10-03", nameBn: "দুর্গা পূজা (মহাঅষ্টমী)", nameEn: "Durga Puja - Maha Ashtami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2025-10-04", nameBn: "দুর্গা পূজা (মহানবমী)", nameEn: "Durga Puja - Maha Navami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2025-10-05", nameBn: "দুর্গা পূজা (বিজয়াদশমী)", nameEn: "Durga Puja - Vijaya Dashami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2025-10-06", nameBn: "লক্ষ্মী পূজা", nameEn: "Lakshmi Puja", category: "religious", icon: "🙏", slug: "lakshmi-puja" },
  { date: "2025-10-20", nameBn: "কালী পূজা / দীপাবলি", nameEn: "Kali Puja / Diwali", category: "religious", icon: "🪔", slug: "kali-puja" },
  { date: "2025-12-25", nameBn: "বড়দিন", nameEn: "Christmas", category: "religious", icon: "🎄", slug: "christmas" },

  // ── 2026 (1432-1433) ────────────────────────────────────────────────
  { date: "2026-01-01", nameBn: "নববর্ষ (ইংরেজি)", nameEn: "New Year's Day", category: "observance", icon: "🎉" },
  { date: "2026-01-14", nameBn: "মকর সংক্রান্তি", nameEn: "Makar Sankranti", category: "religious", icon: "🌞", slug: "makar-sankranti" },
  { date: "2026-01-23", nameBn: "নেতাজি জন্মজয়ন্তী", nameEn: "Netaji Birthday", category: "national", icon: "🇮🇳", slug: "netaji-jayanti" },
  { date: "2026-01-26", nameBn: "প্রজাতন্ত্র দিবস", nameEn: "Republic Day", category: "national", icon: "🇮🇳", slug: "republic-day" },
  { date: "2026-02-18", nameBn: "মহা শিবরাত্রি", nameEn: "Maha Shivaratri", category: "religious", icon: "🙏", slug: "maha-shivaratri" },
  { date: "2026-02-22", nameBn: "সরস্বতী পূজা", nameEn: "Saraswati Puja", category: "religious", icon: "🙏", slug: "saraswati-puja" },
  { date: "2026-03-20", nameBn: "ইদ-উল-ফিতর", nameEn: "Eid ul-Fitr", category: "religious", icon: "🌙", slug: "eid-ul-fitr" },
  { date: "2026-04-15", nameBn: "বাংলা নববর্ষ ১৪৩৩", nameEn: "Bengali New Year 1433 (WB)", category: "cultural", icon: "🎊", slug: "bangla-nabobarsho" },
  { date: "2026-05-01", nameBn: "বুদ্ধ পূর্ণিমা", nameEn: "Buddha Purnima", category: "religious", icon: "☮️", slug: "buddha-purnima" },
  { date: "2026-05-09", nameBn: "রবীন্দ্র জয়ন্তী", nameEn: "Rabindra Jayanti", category: "cultural", icon: "📖", slug: "rabindra-jayanti" },
  { date: "2026-05-27", nameBn: "ইদ-উল-আজহা", nameEn: "Eid ul-Adha", category: "religious", icon: "🌙", slug: "eid-ul-adha" },
  { date: "2026-07-16", nameBn: "রথযাত্রা", nameEn: "Rath Yatra", category: "religious", icon: "🛕", slug: "rath-yatra" },
  { date: "2026-08-15", nameBn: "স্বাধীনতা দিবস", nameEn: "Independence Day", category: "national", icon: "🇮🇳", slug: "independence-day" },
  { date: "2026-09-17", nameBn: "বিশ্বকর্মা পূজা", nameEn: "Biswakarma Puja", category: "religious", icon: "⚙️", slug: "biswakarma-puja" },
  { date: "2026-10-02", nameBn: "গান্ধী জয়ন্তী", nameEn: "Gandhi Jayanti", category: "national", icon: "🕊️", slug: "gandhi-jayanti" },
  { date: "2026-10-12", nameBn: "মহালয়া", nameEn: "Mahalaya", category: "religious", icon: "🙏", slug: "mahalaya" },
  { date: "2026-10-17", nameBn: "দুর্গা পূজা (মহাষষ্ঠী)", nameEn: "Durga Puja - Maha Shashthi", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2026-10-18", nameBn: "দুর্গা পূজা (মহাসপ্তমী)", nameEn: "Durga Puja - Maha Saptami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2026-10-19", nameBn: "দুর্গা পূজা (মহাঅষ্টমী)", nameEn: "Durga Puja - Maha Ashtami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2026-10-20", nameBn: "দুর্গা পূজা (মহানবমী)", nameEn: "Durga Puja - Maha Navami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2026-10-21", nameBn: "দুর্গা পূজা (বিজয়াদশমী)", nameEn: "Durga Puja - Vijaya Dashami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2026-10-24", nameBn: "লক্ষ্মী পূজা", nameEn: "Lakshmi Puja", category: "religious", icon: "🙏", slug: "lakshmi-puja" },
  { date: "2026-11-09", nameBn: "কালী পূজা / দীপাবলি", nameEn: "Kali Puja / Diwali", category: "religious", icon: "🪔", slug: "kali-puja" },
  { date: "2026-12-25", nameBn: "বড়দিন", nameEn: "Christmas", category: "religious", icon: "🎄", slug: "christmas" },

  // ── 2027 (1433-1434) ────────────────────────────────────────────────
  { date: "2027-01-01", nameBn: "নববর্ষ (ইংরেজি)", nameEn: "New Year's Day", category: "observance", icon: "🎉" },
  { date: "2027-01-14", nameBn: "মকর সংক্রান্তি", nameEn: "Makar Sankranti", category: "religious", icon: "🌞", slug: "makar-sankranti" },
  { date: "2027-01-23", nameBn: "নেতাজি জন্মজয়ন্তী", nameEn: "Netaji Birthday", category: "national", icon: "🇮🇳", slug: "netaji-jayanti" },
  { date: "2027-01-26", nameBn: "প্রজাতন্ত্র দিবস", nameEn: "Republic Day", category: "national", icon: "🇮🇳", slug: "republic-day" },
  { date: "2027-02-11", nameBn: "সরস্বতী পূজা", nameEn: "Saraswati Puja", category: "religious", icon: "🙏", slug: "saraswati-puja" },
  { date: "2027-03-08", nameBn: "মহা শিবরাত্রি", nameEn: "Maha Shivaratri", category: "religious", icon: "🙏", slug: "maha-shivaratri" },
  { date: "2027-03-10", nameBn: "ইদ-উল-ফিতর", nameEn: "Eid ul-Fitr", category: "religious", icon: "🌙", slug: "eid-ul-fitr" },
  { date: "2027-04-15", nameBn: "বাংলা নববর্ষ ১৪৩৪", nameEn: "Bengali New Year 1434 (WB)", category: "cultural", icon: "🎊", slug: "bangla-nabobarsho" },
  { date: "2027-05-09", nameBn: "রবীন্দ্র জয়ন্তী", nameEn: "Rabindra Jayanti", category: "cultural", icon: "📖", slug: "rabindra-jayanti" },
  { date: "2027-05-16", nameBn: "ইদ-উল-আজহা", nameEn: "Eid ul-Adha", category: "religious", icon: "🌙", slug: "eid-ul-adha" },
  { date: "2027-08-15", nameBn: "স্বাধীনতা দিবস", nameEn: "Independence Day", category: "national", icon: "🇮🇳", slug: "independence-day" },
  { date: "2027-10-02", nameBn: "গান্ধী জয়ন্তী", nameEn: "Gandhi Jayanti", category: "national", icon: "🕊️", slug: "gandhi-jayanti" },
  { date: "2027-10-08", nameBn: "দুর্গা পূজা (মহাষষ্ঠী)", nameEn: "Durga Puja - Maha Shashthi", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2027-10-09", nameBn: "দুর্গা পূজা (মহাসপ্তমী)", nameEn: "Durga Puja - Maha Saptami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2027-10-10", nameBn: "দুর্গা পূজা (মহাঅষ্টমী)", nameEn: "Durga Puja - Maha Ashtami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2027-10-11", nameBn: "দুর্গা পূজা (মহানবমী)", nameEn: "Durga Puja - Maha Navami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2027-10-12", nameBn: "দুর্গা পূজা (বিজয়াদশমী)", nameEn: "Durga Puja - Vijaya Dashami", category: "religious", icon: "🛕", slug: "durga-puja" },
  { date: "2027-10-28", nameBn: "কালী পূজা / দীপাবলি", nameEn: "Kali Puja / Diwali", category: "religious", icon: "🪔", slug: "kali-puja" },
  { date: "2027-12-25", nameBn: "বড়দিন", nameEn: "Christmas", category: "religious", icon: "🎄", slug: "christmas" },
];

// ── Engine-derived festivals ──────────────────────────────────────────────
// Dol Purnima, Jamai Shashthi, Jagaddhatri, Charak, Gajan and Nabanna are
// computed from the ephemeris (festival-engine.ts) for every covered year,
// so their dates stay correct without manual updates. The ENGINE_SLUGS
// filter drops any static leftovers for those festivals so nothing can
// double-list if an entry is ever re-added above.
const ENGINE_TO_YEAR = Math.max(2028, new Date().getUTCFullYear() + 2);
const engineFestivals: Festival[] = [];
for (let y = 2024; y <= ENGINE_TO_YEAR; y++) {
  engineFestivals.push(...computeEngineFestivals(y));
}

export const FESTIVALS: Festival[] = [
  ...STATIC_FESTIVALS.filter(f => !f.slug || !ENGINE_SLUGS.has(f.slug)),
  ...engineFestivals,
].sort((a, b) => a.date.localeCompare(b.date));

/** Get festivals for a Gregorian month+year */
export function getFestivalsForGregorianMonth(year: number, month: number): Festival[] {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return FESTIVALS.filter(f => f.date.startsWith(prefix));
}

/** Get festivals for a specific Gregorian date */
export function getFestivalsForDate(date: Date): Festival[] {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const key = `${y}-${m}-${d}`;
  return FESTIVALS.filter(f => f.date === key);
}
