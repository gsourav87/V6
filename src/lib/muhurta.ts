/**
 * Shubha Muhurta (শুভ মুহূর্ত) calculator.
 * Scores each day for a requested activity based on Vara, Tithi, Nakshatra, Yoga, Karana.
 * All calculations use Kolkata sunrise as the reference moment (traditional panjika convention).
 */

import { getTithiAtSunrise, getNakshatraAtSunrise, getYogaAtSunrise, getKaranaAtSunrise } from "./panjika";
import { toBengaliDate, toBengaliNumerals } from "./bengali-calendar";
import { format } from "date-fns";

// ── Activity types ──────────────────────────────────────────────────────────

export type ActivityType = "যাত্রা" | "বিবাহ" | "ব্যবসা" | "গৃহপ্রবেশ" | "নামকরণ" | "শিক্ষারম্ভ" | "অন্নপ্রাশন" | "শস্য ক্রয়বিক্রয়";

export const ACTIVITIES: { id: ActivityType; en: string; icon: string }[] = [
  { id: "যাত্রা",         en: "Travel",      icon: "✈️" },
  { id: "বিবাহ",          en: "Marriage",    icon: "💍" },
  { id: "ব্যবসা",         en: "Business",    icon: "💼" },
  { id: "গৃহপ্রবেশ",      en: "House Entry", icon: "🏠" },
  { id: "নামকরণ",        en: "Naming",      icon: "👶" },
  { id: "শিক্ষারম্ভ",     en: "Education",   icon: "📚" },
  { id: "অন্নপ্রাশন",     en: "Annaprashan", icon: "🍚" },
  { id: "শস্য ক্রয়বিক্রয়", en: "Grain Trade", icon: "🌾" },
];

// ── Vara (weekday) scores [0=Sun … 6=Sat] ───────────────────────────────────
// Based on planetary rulerships: Mon/Wed/Thu/Fri are auspicious; Tue/Sat are inauspicious.

const VARA_SCORES: Record<ActivityType, number[]> = {
  "যাত্রা":         [3, 5, 1, 5, 5, 4, 1],
  "বিবাহ":          [3, 5, 1, 3, 5, 5, 1],
  "ব্যবসা":         [3, 4, 1, 5, 5, 4, 1],
  "গৃহপ্রবেশ":      [3, 5, 1, 4, 5, 4, 1],
  "নামকরণ":        [3, 5, 1, 4, 5, 5, 1],
  "শিক্ষারম্ভ":     [3, 3, 1, 5, 5, 4, 1],
  // Annaprashan: Mon/Thu/Fri excellent; Sun/Wed good; Tue/Sat inauspicious
  "অন্নপ্রাশন":     [3, 5, 1, 4, 5, 5, 2],
  // Grain trade: Wed/Thu/Fri best (Mercury/Jupiter/Venus rule commerce); Tue/Sat bad
  "শস্য ক্রয়বিক্রয়": [2, 4, 2, 5, 4, 4, 2],
};

const VARA_BN = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"];

// ── Tithi scores (number 1–30) ───────────────────────────────────────────────
// Rikta tithis (4,9,14) + Amavasya are inauspicious; Shukla 2,3,5,7,10-13 are excellent.

const TITHI_BEST   = new Set([2, 3, 5, 7, 10, 11, 12, 13]);
const TITHI_DECENT = new Set([1, 6, 15, 16, 22, 26]);
const TITHI_BAD    = new Set([4, 9, 14, 19, 24, 29]);

function tithiScore(num: number): number {
  if (num === 30)               return 0; // Amavasya
  if (TITHI_BAD.has(num))       return 1;
  if (TITHI_DECENT.has(num))    return 3;
  if (TITHI_BEST.has(num))      return 5;
  return 2;
}

// ── Nakshatra types ─────────────────────────────────────────────────────────
// 0=Sthira(fixed)  1=Chara(movable)  2=Mridu(soft)  3=Tikshna(sharp)
// 4=Ugra(fierce)   5=Misra(mixed)

type NakType = 0 | 1 | 2 | 3 | 4 | 5;

const NAK_TYPE: NakType[] = [
  1, 4, 5, 0, 2, 3,   // 0-5:  Ashwini, Bharani, Krittika, Rohini, Mrigashira, Ardra
  1, 2, 3, 4, 4, 0,   // 6-11: Punarvasu, Pushya, Ashlesha, Magha, Purva Ph., Uttara Ph.
  1, 2, 1, 5, 2, 3,   // 12-17:Hasta, Chitra, Swati, Vishakha, Anuradha, Jyeshtha
  3, 4, 0, 1, 1, 1,   // 18-23:Mula, Purvashadha, Uttarashadha, Shravana, Dhanishtha, Shatabhisha
  4, 0, 1,            // 24-26:Purva Bhadrapada, Uttara Bhadrapada, Revati
];

// Base nakshatra type → activity score
const NAK_SCORES: Record<ActivityType, Record<NakType, number>> = {
  "যাত্রা":         { 0: 3, 1: 5, 2: 4, 3: 1, 4: 1, 5: 3 },
  "বিবাহ":          { 0: 5, 1: 2, 2: 4, 3: 1, 4: 1, 5: 3 },
  "ব্যবসা":         { 0: 3, 1: 4, 2: 5, 3: 1, 4: 1, 5: 3 },
  "গৃহপ্রবেশ":      { 0: 5, 1: 3, 2: 3, 3: 1, 4: 1, 5: 3 },
  "নামকরণ":        { 0: 3, 1: 3, 2: 5, 3: 1, 4: 1, 5: 3 },
  "শিক্ষারম্ভ":     { 0: 3, 1: 2, 2: 5, 3: 1, 4: 1, 5: 3 },
  // Annaprashan: soft nakshatras (mridu) and fixed best; like naming ceremony
  "অন্নপ্রাশন":     { 0: 4, 1: 3, 2: 5, 3: 1, 4: 1, 5: 3 },
  // Grain trade: movable (chara) and soft nakshatras best for commerce/flow
  "শস্য ক্রয়বিক্রয়": { 0: 3, 1: 5, 2: 4, 3: 1, 4: 2, 5: 3 },
};

// Special individual nakshatra overrides (by nakshatra index)
const NAKSHATRA_OVERRIDES: Partial<Record<ActivityType, Record<number, number>>> = {
  "ব্যবসা":         { 7: 5 },   // Pushya — best for business
  "শিক্ষারম্ভ":     { 7: 5 },   // Pushya — best for education
  "নামকরণ":        { 7: 5 },   // Pushya — best for naming
  "বিবাহ":          { 3: 5, 11: 5, 16: 5, 25: 5 }, // Rohini, Uttara Ph., Anuradha, Uttara Bhadra
  "যাত্রা":         { 0: 5, 12: 5, 14: 5, 26: 5 }, // Ashwini, Hasta, Swati, Revati
  "গৃহপ্রবেশ":      { 3: 5, 11: 5, 20: 5 },         // Rohini, Uttara Ph., Uttarashadha
  // Annaprashan: Pushya, Rohini, Hasta are especially auspicious
  "অন্নপ্রাশন":     { 7: 5, 3: 5, 12: 5, 4: 4, 11: 4 },
  // Grain trade: Pushya (best!), Revati, Hasta, Rohini for commerce and abundance
  "শস্য ক্রয়বিক্রয়": { 7: 5, 26: 5, 12: 4, 3: 4, 14: 4 },
};

// ── Result type ─────────────────────────────────────────────────────────────

export interface MuhurtaDay {
  date: Date;
  engDate: string;
  bnDate: string;
  stars: number;      // 1–5
  score: number;      // 0–18
  vara: string;
  tithiBn: string;
  tithiNum: number;
  nakshatraBn: string;
  yogaBn: string;
  karanaBn: string;
  yogaNature: "good" | "neutral" | "inauspicious";
  karanaNature: "good" | "inauspicious";
}

// ── Main computation ─────────────────────────────────────────────────────────

export function computeMuhurta(activity: ActivityType, fromDate: Date, days = 10): MuhurtaDay[] {
  const results: MuhurtaDay[] = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(fromDate);
    d.setDate(d.getDate() + i);
    const utcD = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

    const tithi     = getTithiAtSunrise(utcD);
    const nakshatra = getNakshatraAtSunrise(utcD);
    const yoga      = getYogaAtSunrise(utcD);
    const karana    = getKaranaAtSunrise(utcD);
    const vara      = utcD.getUTCDay();

    // Nakshatra score — check individual override first, then type-based
    let nakScore = NAK_SCORES[activity][NAK_TYPE[nakshatra.index]];
    const overrides = NAKSHATRA_OVERRIDES[activity];
    if (overrides && overrides[nakshatra.index] !== undefined) {
      nakScore = overrides[nakshatra.index]!;
    }
    // Hasta is a universal bonus nakshatra
    if (nakshatra.index === 12) nakScore = Math.max(nakScore, 4);

    const varaScore = VARA_SCORES[activity][vara];
    const tScore    = tithiScore(tithi.number);
    const yogaBonus = yoga.nature   === "good" ? 2 : 0;
    const karBonus  = karana.nature === "good" ? 1 : 0;

    const score = varaScore + tScore + nakScore + yogaBonus + karBonus;
    // Score 0-18 → stars 1-5
    const stars = score >= 14 ? 5 : score >= 11 ? 4 : score >= 8 ? 3 : score >= 5 ? 2 : 1;

    const bn = toBengaliDate(d);

    results.push({
      date:         d,
      engDate:      format(d, "EEE, d MMM"),
      bnDate:       `${toBengaliNumerals(bn.day)} ${bn.monthNameBn}`,
      stars,
      score,
      vara:         VARA_BN[vara],
      tithiBn:      `${tithi.nameBn} (${tithi.pakshaBn})`,
      tithiNum:     tithi.number,
      nakshatraBn:  nakshatra.nameBn,
      yogaBn:       yoga.nameBn,
      karanaBn:     karana.nameBn,
      yogaNature:   yoga.nature,
      karanaNature: karana.nature,
    });
  }

  return results;
}
