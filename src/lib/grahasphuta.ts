/**
 * গ্রহস্ফুট (Grahasphuta) — sidereal longitude of each of the nine traditional
 * "grahas" (navagraha) at sunrise: which rashi each sits in, and how many
 * degrees into it. Sun/Moon reuse the already-verified ephemeris code; the
 * five classical planets use standard low-precision Keplerian elements;
 * Rahu/Ketu are the mean lunar node and its opposite point.
 */
import SunCalc from "suncalc";
import {
  toJDE, sunSiderealLon, moonSiderealLon, planetSiderealLon,
  rahuSiderealLon, ketuSiderealLon, norm360,
} from "./ephemeris";
import { KOLKATA_LAT, KOLKATA_LNG } from "./bengali-calendar";
import { RASHIS } from "./rashi";

export const GRAHA_NAMES_BN = ["রবি", "চন্দ্র", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি", "রাহু", "কেতু"];
export const GRAHA_NAMES_EN = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

export interface GrahaPosition {
  nameBn: string;
  nameEn: string;
  siderealLon: number;    // 0–360°
  rashiIndex: number;     // 0–11
  rashiNameBn: string;
  degreeInRashi: number;  // 0–30
}

function sunriseJDE(date: Date): number {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const sun = SunCalc.getTimes(utcDate, KOLKATA_LAT, KOLKATA_LNG);
  return toJDE(
    sun.sunrise.getUTCFullYear(), sun.sunrise.getUTCMonth() + 1, sun.sunrise.getUTCDate(),
    sun.sunrise.getUTCHours() + sun.sunrise.getUTCMinutes() / 60, 0,
  );
}

function toPosition(lon: number, i: number): GrahaPosition {
  const siderealLon = norm360(lon);
  const rashiIndex = Math.floor(siderealLon / 30);
  return {
    nameBn: GRAHA_NAMES_BN[i],
    nameEn: GRAHA_NAMES_EN[i],
    siderealLon,
    rashiIndex,
    rashiNameBn: RASHIS[rashiIndex].nameBn,
    degreeInRashi: siderealLon - rashiIndex * 30,
  };
}

/** Navagraha positions at sunrise on the given date, in traditional order (Sun…Ketu). */
export function getGrahasphutaAtSunrise(date: Date): GrahaPosition[] {
  const jde = sunriseJDE(date);
  const lons = [
    sunSiderealLon(jde),
    moonSiderealLon(jde),
    planetSiderealLon("mars", jde),
    planetSiderealLon("mercury", jde),
    planetSiderealLon("jupiter", jde),
    planetSiderealLon("venus", jde),
    planetSiderealLon("saturn", jde),
    rahuSiderealLon(jde),
    ketuSiderealLon(jde),
  ];
  return lons.map(toPosition);
}
