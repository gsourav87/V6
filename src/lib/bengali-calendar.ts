/**
 * Bengali Calendar (West Bengal / Bisuddha Siddhanta system)
 * Uses sidereal solar zodiac with Lahiri ayanamsa.
 * Kolkata coordinates: 22.5726°N, 88.3639°E, UTC+5:30
 *
 * Month boundaries: a new Bengali month begins on the day the sun enters a
 * new sidereal zodiac sign.  If the ingress occurs BEFORE sunrise (Kolkata),
 * the new month starts that day; otherwise it starts the next day.
 */

import SunCalc from "suncalc";
import { findSiderealSunIngress, toJDE } from "./ephemeris";

export const KOLKATA_LAT = 22.5726;
export const KOLKATA_LNG = 88.3639;
export const KOLKATA_UTC_OFFSET = 5.5; // hours

export const BANGLA_MONTHS = [
  { en: "Boishakh",   bn: "বৈশাখ",   idx: 0 },
  { en: "Joishtho",   bn: "জ্যৈষ্ঠ",  idx: 1 },
  { en: "Asharh",     bn: "আষাঢ়",    idx: 2 },
  { en: "Srabon",     bn: "শ্রাবণ",   idx: 3 },
  { en: "Bhadro",     bn: "ভাদ্র",    idx: 4 },
  { en: "Ashshin",    bn: "আশ্বিন",   idx: 5 },
  { en: "Kartik",     bn: "কার্তিক",  idx: 6 },
  { en: "Ogrohaeon",  bn: "অগ্রহায়ণ", idx: 7 },
  { en: "Poush",      bn: "পৌষ",      idx: 8 },
  { en: "Magh",       bn: "মাঘ",      idx: 9 },
  { en: "Falgun",     bn: "ফাল্গুন",  idx: 10 },
  { en: "Choitro",    bn: "চৈত্র",    idx: 11 },
];

/** Bengali month name (as produced by monthNameBn) → the /month/:slug route segment. */
export const BN_MONTH_SLUG: Record<string, string> = {
  "বৈশাখ": "boishakh", "জ্যৈষ্ঠ": "jaistha", "আষাঢ়": "ashar",
  "শ্রাবণ": "shraban", "ভাদ্র": "bhadra", "আশ্বিন": "ashwin",
  "কার্তিক": "kartik", "অগ্রহায়ণ": "agrohayon", "পৌষ": "poush",
  "মাঘ": "magh", "ফাল্গুন": "falgun", "চৈত্র": "chaitra",
};

export interface BengaliSeason {
  nameBn: string;
  nameEn: string;
  emoji: string;
  monthsBn: string;
}

export const BENGALI_SEASONS: BengaliSeason[] = [
  { nameBn: "গ্রীষ্ম",  nameEn: "Summer",      emoji: "☀️",  monthsBn: "বৈশাখ–জ্যৈষ্ঠ" },
  { nameBn: "বর্ষা",    nameEn: "Monsoon",     emoji: "🌧️", monthsBn: "আষাঢ়–শ্রাবণ" },
  { nameBn: "শরৎ",     nameEn: "Autumn",      emoji: "🌸",  monthsBn: "ভাদ্র–আশ্বিন" },
  { nameBn: "হেমন্ত",   nameEn: "Late Autumn", emoji: "🍂",  monthsBn: "কার্তিক–অগ্রহায়ণ" },
  { nameBn: "শীত",     nameEn: "Winter",      emoji: "❄️",  monthsBn: "পৌষ–মাঘ" },
  { nameBn: "বসন্ত",   nameEn: "Spring",      emoji: "🌺",  monthsBn: "ফাল্গুন–চৈত্র" },
];

// Bengali month index (0=Boishakh) → season index (0=গ্রীষ্ম)
const MONTH_TO_SEASON_IDX = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5];

export function getBengaliSeason(monthIdx: number): BengaliSeason {
  return BENGALI_SEASONS[MONTH_TO_SEASON_IDX[monthIdx] ?? 0];
}

export const BANGLA_DAYS = [
  { en: "Sunday",    bn: "রবিবার",     short: "রবি" },
  { en: "Monday",    bn: "সোমবার",     short: "সোম" },
  { en: "Tuesday",   bn: "মঙ্গলবার",   short: "মঙ্গল" },
  { en: "Wednesday", bn: "বুধবার",     short: "বুধ" },
  { en: "Thursday",  bn: "বৃহস্পতিবার", short: "বৃহ" },
  { en: "Friday",    bn: "শুক্রবার",   short: "শুক্র" },
  { en: "Saturday",  bn: "শনিবার",     short: "শনি" },
];

export interface BengaliDate {
  year: number;
  month: number;       // 0-indexed (0 = Boishakh)
  day: number;         // 1-indexed
  monthNameEn: string;
  monthNameBn: string;
  dayOfWeek: number;   // 0=Sunday
  dayNameEn: string;
  dayNameBn: string;
  season: BengaliSeason;
}

// Convert Bengali numerals (English digits → Bengali)
export function toBengaliNumerals(n: number | string): string {
  const BN = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  return String(n).replace(/[0-9]/g, d => BN[parseInt(d)]);
}

// Cache for computed month-start dates (key: "year-month")
const monthStartCache = new Map<string, Date>();

/**
 * Returns the first day of a Bengali month in Gregorian (local Kolkata date).
 * Bengali month index: 0 = Boishakh, 1 = Joishtho, …, 11 = Choitro
 */
export function bengaliMonthStart(banglaYear: number, banglaMonth: number): Date {
  const key = `${banglaYear}-${banglaMonth}`;
  if (monthStartCache.has(key)) return monthStartCache.get(key)!;

  // The sidereal zodiac sign the sun must enter to start this month
  const siderealTarget = banglaMonth * 30; // 0°=Aries, 30°=Taurus, …

  // Rough Gregorian year for the search window
  // Bangla year = Gregorian year - 593 (approximately, after Boishakh)
  const gregYear = banglaYear + 593;

  // Approximate Gregorian month for this Bengali month
  // Boishakh ~ April, so shift by ~3.5 months.
  // Boishakh–Poush (idx 0–8) fall in `gregYear`; Magh–Chaitra (idx 9–11)
  // are Jan–Mar, which land in the FOLLOWING Gregorian year.
  const approxGregMonth = ((banglaMonth + 3) % 12) + 1;
  const approxGregYear  = banglaMonth < 9 ? gregYear : gregYear + 1;

  // Build search window: ±25 days around approximate date
  const approxDate = new Date(approxGregYear, approxGregMonth - 1, 1);
  const jdeLow  = toJDE(approxDate.getFullYear(), approxDate.getMonth() + 1,
                        approxDate.getDate() - 25, 0, KOLKATA_UTC_OFFSET);
  const jdeHigh = toJDE(approxDate.getFullYear(), approxDate.getMonth() + 1,
                        approxDate.getDate() + 25, 23, KOLKATA_UTC_OFFSET);

  // Find exact JDE of solar ingress
  const ingressJDE = findSiderealSunIngress(siderealTarget, jdeLow, jdeHigh);

  // Convert JDE back to Kolkata local date/time
  const ingressMs = (ingressJDE - 2440587.5) * 86400000; // Unix ms (UT)
  const ingressDateUT = new Date(ingressMs);

  // Kolkata local date of ingress
  const kolkataOffset = KOLKATA_UTC_OFFSET * 60 * 60 * 1000;
  const ingressLocal  = new Date(ingressMs + kolkataOffset);
  const localYear  = ingressLocal.getUTCFullYear();
  const localMonth = ingressLocal.getUTCMonth() + 1;
  const localDay   = ingressLocal.getUTCDate();

  // Sunrise in Kolkata on the ingress day
  const ingressDayMidnight = new Date(Date.UTC(localYear, localMonth - 1, localDay));
  const sun = SunCalc.getTimes(ingressDayMidnight, KOLKATA_LAT, KOLKATA_LNG);
  const sunriseMS = sun.sunrise.getTime();

  // Bengali month starts on ingress day if ingress is before sunrise, else next day
  let startDate: Date;
  if (ingressDateUT.getTime() <= sunriseMS) {
    startDate = new Date(Date.UTC(localYear, localMonth - 1, localDay));
  } else {
    startDate = new Date(Date.UTC(localYear, localMonth - 1, localDay + 1));
  }

  monthStartCache.set(key, startDate);
  return startDate;
}

/**
 * Convert a JavaScript Date (local system time) to BengaliDate.
 * The date is interpreted in the user's system timezone for the day,
 * but the Bengali year/month/day is computed for Kolkata.
 */
export function toBengaliDate(date: Date): BengaliDate {
  // Work with UTC midnight for the given calendar day in Kolkata
  const kolkataMs = date.getTime() + (KOLKATA_UTC_OFFSET * 3600000);
  const d = new Date(kolkataMs);
  const gregYear  = d.getUTCFullYear();
  const gregMonth = d.getUTCMonth() + 1;
  const gregDay   = d.getUTCDate();

  // Determine approximate Bengali year to search
  const approxBanglaYear = gregYear - 593;

  // Check two possible Bengali years (spanning year boundary)
  for (const bYear of [approxBanglaYear, approxBanglaYear + 1, approxBanglaYear - 1]) {
    for (let bMonth = 0; bMonth < 12; bMonth++) {
      const start = bengaliMonthStart(bYear, bMonth);
      const nextMonthIdx = (bMonth + 1) % 12;
      const nextYear     = bMonth === 11 ? bYear + 1 : bYear;
      const end   = bengaliMonthStart(nextYear, nextMonthIdx);

      const targetMs = Date.UTC(gregYear, gregMonth - 1, gregDay);
      if (targetMs >= start.getTime() && targetMs < end.getTime()) {
        const bDay = Math.floor((targetMs - start.getTime()) / 86400000) + 1;
        const dow  = new Date(targetMs).getUTCDay();
        return {
          year:        bYear,
          month:       bMonth,
          day:         bDay,
          monthNameEn: BANGLA_MONTHS[bMonth].en,
          monthNameBn: BANGLA_MONTHS[bMonth].bn,
          dayOfWeek:   dow,
          dayNameEn:   BANGLA_DAYS[dow].en,
          dayNameBn:   BANGLA_DAYS[dow].bn,
          season:      getBengaliSeason(bMonth),
        };
      }
    }
  }

  // Fallback (shouldn't happen)
  return {
    year: approxBanglaYear, month: 0, day: 1,
    monthNameEn: "Boishakh", monthNameBn: "বৈশাখ",
    dayOfWeek: 0, dayNameEn: "Sunday", dayNameBn: "রবিবার",
    season: getBengaliSeason(0),
  };
}

/**
 * Returns all Gregorian days in a given Bengali month as an array of { gregDate, bengaliDay }.
 */
export function bengaliMonthDays(banglaYear: number, banglaMonth: number): Array<{ gregDate: Date; bengaliDay: number }> {
  const start = bengaliMonthStart(banglaYear, banglaMonth);
  const nextMonthIdx = (banglaMonth + 1) % 12;
  const nextYear     = banglaMonth === 11 ? banglaYear + 1 : banglaYear;
  const end = bengaliMonthStart(nextYear, nextMonthIdx);

  const days: Array<{ gregDate: Date; bengaliDay: number }> = [];
  let current = new Date(start);
  let bDay = 1;
  while (current.getTime() < end.getTime()) {
    days.push({ gregDate: new Date(current), bengaliDay: bDay });
    current = new Date(current.getTime() + 86400000);
    bDay++;
  }
  return days;
}

/** Convert English date to Bengali date */
export function convertToBengali(year: number, month: number, day: number): BengaliDate {
  return toBengaliDate(new Date(Date.UTC(year, month - 1, day, 12, 0, 0)));
}

/**
 * Convert a Bengali date (year, month 0-indexed, day 1-indexed) to a Gregorian Date.
 * Returns the UTC-midnight Date for that Bengali day.
 */
export function fromBengaliDate(year: number, month: number, day: number): Date {
  const start = bengaliMonthStart(year, month);
  const clamped = Math.max(1, Math.min(day, 32));
  return new Date(start.getTime() + (clamped - 1) * 86400000);
}
