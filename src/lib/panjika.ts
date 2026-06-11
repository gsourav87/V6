/**
 * Panjika (পঞ্জিকা) calculations for Kolkata:
 * - Tithi (lunar day) with paksha and end time
 * - Sunrise / Sunset
 * Kolkata: 22.5726°N, 88.3639°E, UTC+5:30
 */

import SunCalc from "suncalc";
import { toJDE, moonTropicalLon, moonSiderealLon, sunTropicalLon, sunSiderealLon, norm360 } from "./ephemeris";
import { KOLKATA_LAT, KOLKATA_LNG, KOLKATA_UTC_OFFSET } from "./bengali-calendar";

// ── Tithi names ────────────────────────────────────────────────────────────

export const TITHI_NAMES_BN = [
  "প্রতিপদ", "দ্বিতীয়া", "তৃতীয়া", "চতুর্থী", "পঞ্চমী",
  "ষষ্ঠী", "সপ্তমী", "অষ্টমী", "নবমী", "দশমী",
  "একাদশী", "দ্বাদশী", "ত্রয়োদশী", "চতুর্দশী", "পূর্ণিমা/অমাবস্যা",
];

export const TITHI_NAMES_EN = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashti", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya",
];

export const PAKSHA_BN = { shukla: "শুক্লপক্ষ", krishna: "কৃষ্ণপক্ষ" };
export const PAKSHA_EN = { shukla: "Shukla Paksha", krishna: "Krishna Paksha" };

export interface TithiInfo {
  number: number;        // 1-30 (1-15 = Shukla, 16-30 = Krishna)
  idx: number;           // 0-14 (index within paksha)
  nameBn: string;
  nameEn: string;
  pakshaBn: string;
  pakshaEn: string;
  isShukla: boolean;
  /** UTC time when the tithi began (JS Date). null if it began > the search window ago. */
  startsAt: Date | null;
  /** UTC time when the tithi ends (JS Date). null if tithi spans > the search window. */
  endsAt: Date | null;
  /** Moon phase icon */
  icon: string;
}

// Tithi number at a given JDE (1 = Shukla Pratipada … 15 = Purnima, 16 = Krishna Pratipada … 30 = Amavasya)
function tithiAtJDE(jde: number): number {
  const moonLon = moonTropicalLon(jde);
  const sunLon  = sunTropicalLon(jde);
  const elongation = norm360(moonLon - sunLon);
  const t = Math.floor(elongation / 12) + 1; // 1..30
  return t;
}

// Moon phase icon based on tithi number
function moonIcon(tithiNum: number): string {
  if (tithiNum === 15) return "🌕";
  if (tithiNum === 30) return "🌑";
  if (tithiNum <= 7)   return "🌒";
  if (tithiNum <= 14)  return "🌖";
  if (tithiNum <= 22)  return "🌘";
  return "🌒";
}

/**
 * Compute tithi info for a given JS Date (day in Kolkata).
 * Returns the tithi that is running at sunrise on that day.
 */
export function getTithiAtSunrise(date: Date): TithiInfo {
  // Get sunrise time for this day
  const utcDate = new Date(Date.UTC(
    date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()
  ));
  const sun = SunCalc.getTimes(utcDate, KOLKATA_LAT, KOLKATA_LNG);
  const sunriseJDE = toJDE(
    sun.sunrise.getUTCFullYear(),
    sun.sunrise.getUTCMonth() + 1,
    sun.sunrise.getUTCDate(),
    sun.sunrise.getUTCHours() + sun.sunrise.getUTCMinutes() / 60,
    0 // already UT
  );

  const tNum = tithiAtJDE(sunriseJDE);
  const isShukla = tNum <= 15;
  const idx      = (tNum - 1) % 15;
  const nameBn   = TITHI_NAMES_BN[idx === 14 ? 14 : idx];
  const nameEn   = TITHI_NAMES_EN[idx === 14 ? 14 : idx];
  // Correct last tithi name
  const finalNameBn = (tNum === 15) ? "পূর্ণিমা" : (tNum === 30) ? "অমাবস্যা" : nameBn;
  const finalNameEn = (tNum === 15) ? "Purnima"  : (tNum === 30) ? "Amavasya"  : nameEn;

  // Find when this tithi ends (elongation hits next multiple of 12°)
  const targetElong = tNum * 12; // degrees
  const endsAt   = findTithiEnd(sunriseJDE, tNum, targetElong);
  // …and when it began (elongation last crossed into this tithi)
  const startsAt = findTithiStart(sunriseJDE, tNum);

  return {
    number:   tNum,
    idx:      idx,
    nameBn:   finalNameBn,
    nameEn:   finalNameEn,
    pakshaBn: isShukla ? PAKSHA_BN.shukla : PAKSHA_BN.krishna,
    pakshaEn: isShukla ? PAKSHA_EN.shukla : PAKSHA_EN.krishna,
    isShukla,
    startsAt,
    endsAt,
    icon:     moonIcon(tNum),
  };
}

// Find the UTC time when the elongation reaches targetElong degrees
// Search up to 26 hours from startJDE
function findTithiEnd(startJDE: number, currentTithi: number, _targetElong: number): Date | null {
  const endJDE = startJDE + 1.1; // search ~26 hours
  // Bisection to find crossing point
  let lo = startJDE, hi = endJDE;
  const elong0 = norm360(moonTropicalLon(lo) - sunTropicalLon(lo));

  // Adjust target for possible wrap-around
  let target = currentTithi * 12;
  if (target >= 360) target = 0; // Amavasya → next Pratipada at 0/360

  // Use simple stepping: check every 10-minute interval
  const step = 10 / 1440; // 10 minutes in days
  let prevElong = elong0;
  for (let jde = lo + step; jde <= hi; jde += step) {
    const curElong = norm360(moonTropicalLon(jde) - sunTropicalLon(jde));
    const prevTithi = Math.floor(prevElong / 12) + 1;
    const curTithi  = Math.floor(curElong  / 12) + 1;
    if (prevTithi !== curTithi && prevTithi === currentTithi) {
      // Bisect between jde-step and jde
      let blo = jde - step, bhi = jde;
      for (let i = 0; i < 20; i++) {
        const bmid = (blo + bhi) / 2;
        const bt = Math.floor(norm360(moonTropicalLon(bmid) - sunTropicalLon(bmid)) / 12) + 1;
        if (bt === currentTithi) blo = bmid; else bhi = bmid;
      }
      const endMs = ((blo + bhi) / 2 - 2440587.5) * 86400000;
      return new Date(endMs);
    }
    prevElong = curElong;
  }
  return null;
}

// Find the UTC time when the current tithi BEGAN — search backward ~26 hours
// from sunrise for the moment elongation last crossed into `currentTithi`.
function findTithiStart(sunriseJDE: number, currentTithi: number): Date | null {
  const beginJDE = sunriseJDE - 1.1; // search back ~26 hours
  const step = 10 / 1440;            // 10-minute steps
  let nextElong = norm360(moonTropicalLon(sunriseJDE) - sunTropicalLon(sunriseJDE));
  for (let jde = sunriseJDE - step; jde >= beginJDE; jde -= step) {
    const curElong  = norm360(moonTropicalLon(jde) - sunTropicalLon(jde));
    const curTithi  = Math.floor(curElong  / 12) + 1;
    const nextTithi = Math.floor(nextElong / 12) + 1;
    // Boundary: earlier sample is the previous tithi, later sample is this one.
    if (curTithi !== nextTithi && nextTithi === currentTithi) {
      let blo = jde, bhi = jde + step;
      for (let i = 0; i < 20; i++) {
        const bmid = (blo + bhi) / 2;
        const bt = Math.floor(norm360(moonTropicalLon(bmid) - sunTropicalLon(bmid)) / 12) + 1;
        if (bt === currentTithi) bhi = bmid; else blo = bmid;
      }
      const startMs = ((blo + bhi) / 2 - 2440587.5) * 86400000;
      return new Date(startMs);
    }
    nextElong = curElong;
  }
  return null;
}

// ── Nakshatra ──────────────────────────────────────────────────────────────

export const NAKSHATRA_NAMES_BN = [
  "অশ্বিনী", "ভরণী", "কৃত্তিকা", "রোহিণী", "মৃগশিরা", "আর্দ্রা",
  "পুনর্বসু", "পুষ্যা", "আশ্লেষা", "মঘা", "পূর্বফাল্গুনী", "উত্তরফাল্গুনী",
  "হস্তা", "চিত্রা", "স্বাতী", "বিশাখা", "অনুরাধা", "জ্যেষ্ঠা",
  "মূলা", "পূর্বাষাঢ়া", "উত্তরাষাঢ়া", "শ্রবণা", "ধনিষ্ঠা", "শতভিষা",
  "পূর্বভাদ্রপদ", "উত্তরভাদ্রপদ", "রেবতী",
];

export const NAKSHATRA_NAMES_EN = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purvashadha", "Uttarashadha", "Shravana", "Dhanishtha", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

// Ruling deity symbols for each nakshatra (traditional)
const NAKSHATRA_ICONS = [
  "🐴","⚖️","🔥","🌹","🦌","💫","⭐","🌸","🐍","👑",
  "🌺","☀️","✋","🎨","🌿","🎋","🌊","🦋","🌱","🏹",
  "🏆","🦅","🥁","🌀","⚡","🐟","🎵",
];

export interface NakshatraInfo {
  index: number;     // 0–26
  nameBn: string;
  nameEn: string;
  icon: string;
  /** degrees of Moon within this nakshatra (0–13.33) */
  degreeWithin: number;
}

/**
 * Compute the nakshatra of the Moon at sunrise on the given date.
 * Each nakshatra spans 360/27 = 13°20' of sidereal longitude.
 */
export function getNakshatraAtSunrise(date: Date): NakshatraInfo {
  const utcDate = new Date(Date.UTC(
    date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()
  ));
  const sun = SunCalc.getTimes(utcDate, KOLKATA_LAT, KOLKATA_LNG);
  const sunriseJDE = toJDE(
    sun.sunrise.getUTCFullYear(),
    sun.sunrise.getUTCMonth() + 1,
    sun.sunrise.getUTCDate(),
    sun.sunrise.getUTCHours() + sun.sunrise.getUTCMinutes() / 60,
    0 // already UT
  );

  const moonLon = moonSiderealLon(sunriseJDE); // 0–360°
  const nakshatraSpan = 360 / 27;              // 13.3333…°
  const index = Math.floor(moonLon / nakshatraSpan);
  const degreeWithin = moonLon - index * nakshatraSpan;

  return {
    index,
    nameBn: NAKSHATRA_NAMES_BN[index],
    nameEn: NAKSHATRA_NAMES_EN[index],
    icon:   NAKSHATRA_ICONS[index],
    degreeWithin,
  };
}

// ── Yoga ───────────────────────────────────────────────────────────────────

export const YOGA_NAMES_BN = [
  "বিষ্কম্ভ", "প্রীতি", "আয়ুষ্মান", "সৌভাগ্য", "শোভন",
  "অতিগণ্ড", "সুকর্মা", "ধৃতি", "শূল", "গণ্ড",
  "বৃদ্ধি", "ধ্রুব", "ব্যাঘাত", "হর্ষণ", "বজ্র",
  "সিদ্ধি", "ব্যতীপাত", "বরীয়ান", "পরিঘ", "শিব",
  "সিদ্ধ", "সাধ্য", "শুভ", "শুক্ল", "ব্রহ্ম",
  "ইন্দ্র", "বৈধৃতি",
];

export const YOGA_NAMES_EN = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
  "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
  "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
  "Indra", "Vaidhriti",
];

// Auspiciousness: "good" | "neutral" | "inauspicious"
const YOGA_NATURE: ("good" | "neutral" | "inauspicious")[] = [
  "inauspicious", "good", "good", "good", "good",
  "inauspicious", "good", "good", "inauspicious", "inauspicious",
  "good", "good", "inauspicious", "good", "inauspicious",
  "good", "inauspicious", "good", "inauspicious", "good",
  "good", "good", "good", "good", "good",
  "good", "inauspicious",
];

export interface YogaInfo {
  index: number;     // 0–26
  nameBn: string;
  nameEn: string;
  nature: "good" | "neutral" | "inauspicious";
}

/**
 * Yoga = floor((sunSiderealLon + moonSiderealLon) / (360/27)) mod 27
 * Calculated at sunrise, matching traditional panjika convention.
 */
export function getYogaAtSunrise(date: Date): YogaInfo {
  const utcDate = new Date(Date.UTC(
    date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()
  ));
  const sun = SunCalc.getTimes(utcDate, KOLKATA_LAT, KOLKATA_LNG);
  const sunriseJDE = toJDE(
    sun.sunrise.getUTCFullYear(),
    sun.sunrise.getUTCMonth() + 1,
    sun.sunrise.getUTCDate(),
    sun.sunrise.getUTCHours() + sun.sunrise.getUTCMinutes() / 60,
    0 // already UT
  );

  const combined = norm360(sunSiderealLon(sunriseJDE) + moonSiderealLon(sunriseJDE));
  const yogaSpan = 360 / 27; // 13.333…°
  const index = Math.floor(combined / yogaSpan) % 27;

  return {
    index,
    nameBn: YOGA_NAMES_BN[index],
    nameEn: YOGA_NAMES_EN[index],
    nature: YOGA_NATURE[index],
  };
}

// ── Karana ─────────────────────────────────────────────────────────────────
// A Karana = half a Tithi = 6° of Moon-Sun elongation.
// 60 total: 1 fixed (Kimstughna) + 7 repeating × 8 cycles (56) + 3 fixed at end.

const KARANA_CHARA_BN = ["বব", "বালব", "কৌলব", "তৈতিল", "গরজ", "বণিজ", "ভদ্রা"];
const KARANA_CHARA_EN = ["Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Bhadra"];
const KARANA_CHARA_NATURE: ("good" | "inauspicious")[] = [
  "good", "good", "good", "good", "good", "good", "inauspicious",
];

const KARANA_FIXED_BN     = ["কিংস্তুঘ্ন", "শকুনি", "চতুষ্পদ", "নাগব"];
const KARANA_FIXED_EN     = ["Kimstughna", "Shakuni", "Chatushpada", "Nagava"];
const KARANA_FIXED_NATURE: ("good" | "inauspicious")[] = [
  "inauspicious", "inauspicious", "good", "inauspicious",
];

export interface KaranaInfo {
  index: number;       // 0–59 raw index
  nameBn: string;
  nameEn: string;
  nature: "good" | "inauspicious";
  isFixed: boolean;    // true for the 4 sthira karanas
}

function resolveKarana(rawIndex: number): KaranaInfo {
  if (rawIndex === 0) {
    return { index: rawIndex, nameBn: KARANA_FIXED_BN[0], nameEn: KARANA_FIXED_EN[0], nature: KARANA_FIXED_NATURE[0], isFixed: true };
  }
  if (rawIndex >= 57) {
    const fi = rawIndex - 56;
    return { index: rawIndex, nameBn: KARANA_FIXED_BN[fi], nameEn: KARANA_FIXED_EN[fi], nature: KARANA_FIXED_NATURE[fi], isFixed: true };
  }
  const ci = (rawIndex - 1) % 7;
  return { index: rawIndex, nameBn: KARANA_CHARA_BN[ci], nameEn: KARANA_CHARA_EN[ci], nature: KARANA_CHARA_NATURE[ci], isFixed: false };
}

/**
 * Karana running at sunrise on the given date.
 * karanaIndex = floor(elongation / 6), elongation = norm360(moonLon - sunLon)
 */
export function getKaranaAtSunrise(date: Date): KaranaInfo {
  const utcDate = new Date(Date.UTC(
    date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()
  ));
  const sun = SunCalc.getTimes(utcDate, KOLKATA_LAT, KOLKATA_LNG);
  const sunriseJDE = toJDE(
    sun.sunrise.getUTCFullYear(),
    sun.sunrise.getUTCMonth() + 1,
    sun.sunrise.getUTCDate(),
    sun.sunrise.getUTCHours() + sun.sunrise.getUTCMinutes() / 60,
    0
  );

  const elongation  = norm360(moonTropicalLon(sunriseJDE) - sunTropicalLon(sunriseJDE));
  const rawIndex    = Math.min(59, Math.floor(elongation / 6));
  return resolveKarana(rawIndex);
}

// ── Sunrise / Sunset ───────────────────────────────────────────────────────

export interface SunTimes {
  sunrise: Date;
  sunset:  Date;
}

export function getSunTimes(date: Date): SunTimes {
  const utcDate = new Date(Date.UTC(
    date.getFullYear(), date.getMonth(), date.getDate()
  ));
  const times = SunCalc.getTimes(utcDate, KOLKATA_LAT, KOLKATA_LNG);
  return { sunrise: times.sunrise, sunset: times.sunset };
}

// ── Rahu Kalam / Gulika Kalam / Yamaganda ──────────────────────────────────
// The day (sunrise→sunset) is split into 8 equal slots.
// Each inauspicious period occupies one slot, with position depending on weekday.

// Slot number (1-indexed from sunrise) for each weekday [Sun=0 … Sat=6]
const RAHU_SLOT:    number[] = [8, 2, 7, 5, 6, 4, 3];
const GULIKA_SLOT:  number[] = [7, 6, 5, 4, 3, 2, 1];
const YAMAG_SLOT:   number[] = [4, 3, 2, 1, 8, 7, 6];

export interface PeriodInfo {
  start:    Date;
  end:      Date;
  isActive: boolean;
}

export interface RahuKalamInfo {
  rahuKalam:   PeriodInfo;
  gulikaKalam: PeriodInfo;
  yamaganda:   PeriodInfo;
  /** Duration of one slot in minutes */
  slotMinutes: number;
  sunrise:     Date;
  sunset:      Date;
}

function makePeriod(sunrise: Date, slotMs: number, slot: number, now: Date): PeriodInfo {
  const start = new Date(sunrise.getTime() + (slot - 1) * slotMs);
  const end   = new Date(sunrise.getTime() + slot * slotMs);
  return { start, end, isActive: now >= start && now < end };
}

/**
 * Compute Rahu Kalam, Gulika Kalam, and Yamaganda for the given JS Date.
 * Pass `now` (defaults to current time) to determine isActive flags.
 */
export function getRahuKalamInfo(date: Date, now: Date = new Date()): RahuKalamInfo {
  // Determine Kolkata weekday from the supplied date
  const kolkataMs  = date.getTime() + KOLKATA_UTC_OFFSET * 3600000;
  const dow        = new Date(kolkataMs).getUTCDay(); // 0=Sun

  const { sunrise, sunset } = getSunTimes(date);
  const slotMs      = (sunset.getTime() - sunrise.getTime()) / 8;
  const slotMinutes = slotMs / 60000;

  return {
    rahuKalam:   makePeriod(sunrise, slotMs, RAHU_SLOT[dow],   now),
    gulikaKalam: makePeriod(sunrise, slotMs, GULIKA_SLOT[dow], now),
    yamaganda:   makePeriod(sunrise, slotMs, YAMAG_SLOT[dow],  now),
    slotMinutes,
    sunrise,
    sunset,
  };
}

// Format a UTC time as "HH:MM AM/PM" in Kolkata local time
export function formatKolkataTime(utcDate: Date | null): string {
  if (!utcDate) return "—";
  const local = new Date(utcDate.getTime() + KOLKATA_UTC_OFFSET * 3600000);
  let h = local.getUTCHours();
  const m = local.getUTCMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
}

// Format a UTC time in Bengali clock style with day-period word: "সকাল ০৮:১২"
export function formatTimeBn(utcDate: Date | null): string {
  if (!utcDate) return "";
  const local = new Date(utcDate.getTime() + KOLKATA_UTC_OFFSET * 3600000);
  const h = local.getUTCHours();
  const m = local.getUTCMinutes();
  const BN = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  const pad = (n: number) => String(n).padStart(2,"0").replace(/[0-9]/g, d => BN[parseInt(d)]);
  let period = "রাত";
  if (h >= 4  && h < 12) period = "সকাল";
  else if (h >= 12 && h < 16) period = "দুপুর";
  else if (h >= 16 && h < 19) period = "বিকাল";
  else if (h >= 19 && h < 21) period = "সন্ধ্যা";
  return `${period} ${pad(h % 12 || 12)}:${pad(m)}`;
}

// Format tithi end time as Bengali style: "সকাল ০৮:১২ পর্যন্ত"
export function formatTithiEndBn(utcDate: Date | null): string {
  if (!utcDate) return "";
  const local = new Date(utcDate.getTime() + KOLKATA_UTC_OFFSET * 3600000);
  const h = local.getUTCHours();
  const m = local.getUTCMinutes();
  const BN = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  const pad = (n: number) => String(n).padStart(2,"0").replace(/[0-9]/g, d => BN[parseInt(d)]);
  let period = "রাত";
  if (h >= 4  && h < 12) period = "সকাল";
  else if (h >= 12 && h < 16) period = "দুপুর";
  else if (h >= 16 && h < 19) period = "বিকাল";
  else if (h >= 19 && h < 21) period = "সন্ধ্যা";
  return `${period} ${pad(h % 12 || 12)}:${pad(m)} পর্যন্ত`;
}
