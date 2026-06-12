/**
 * Engine-computed festivals — derived from the panjika ephemeris so dates are
 * astronomically correct for ANY year (no hand-typed dates that can drift).
 *
 * Lunar (tithi) festivals use the classic amanta rule:
 *   lunar month = the lunation (new moon → new moon) that CONTAINS the
 *   sankranti of the corresponding sidereal sign. A lunation with no
 *   sankranti is an adhik (leap) month and is skipped automatically —
 *   e.g. 2026 has Adhik Jyeshtha, so Jamai Shashthi correctly lands in the
 *   following (nija) Jyeshtha on 20 Jun, not in the leap month.
 *   The festival day is then the day whose KOLKATA SUNRISE carries the
 *   target tithi (udaya-tithi rule), matching drikpanchang.
 *
 * Solar festivals come straight from the sidereal-sankranti month boundaries
 * already computed by bengaliMonthStart (Charak/Gajan = Chaitra Sankranti,
 * Nabanna = 1 Agrahayan).
 *
 * Verified against drikpanchang/web for 2024–2027:
 *   Dol 2024-03-25 / 2025-03-14 / 2026-03-03 / 2027-03-22
 *   Jamai Shashthi 2026-06-20, Jagaddhatri (Kartik Shukla Navami) 2026-11-19
 */
import type { Festival } from "./festivals";
import SunCalc from "suncalc";
import { bengaliMonthStart } from "./bengali-calendar";
import {
  norm360, toJDE, moonTropicalLon, sunTropicalLon, findSiderealSunIngress,
} from "./ephemeris";

const KOLKATA_LAT = 22.5726;
const KOLKATA_LNG = 88.3639;
const DAY_MS = 86400000;

const fmt = (d: Date) =>
  `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;

const elongAt = (jde: number) => norm360(moonTropicalLon(jde) - sunTropicalLon(jde));

/** Tithi number (1–30) running at Kolkata sunrise of the given UTC day. */
function sunriseTithi(dayUTC: Date): number {
  const sun = SunCalc.getTimes(dayUTC, KOLKATA_LAT, KOLKATA_LNG);
  const sr = sun.sunrise;
  const jde = toJDE(
    sr.getUTCFullYear(), sr.getUTCMonth() + 1, sr.getUTCDate(),
    sr.getUTCHours() + sr.getUTCMinutes() / 60, 0,
  );
  return Math.floor(elongAt(jde) / 12) + 1;
}

/** JDE of the last new moon (elongation wraps to 0°) at or before `jde`. */
function newMoonBefore(jde: number): number {
  const step = 0.25; // 6-hour scan, then bisect
  for (let j = jde; j >= jde - 33; j -= step) {
    const a = elongAt(j - step), b = elongAt(j);
    if (a > 330 && b < 30) {
      let lo = j - step, hi = j;
      for (let i = 0; i < 40; i++) {
        const mid = (lo + hi) / 2;
        if (elongAt(mid) < 30) hi = mid; else lo = mid;
      }
      return (lo + hi) / 2;
    }
  }
  return jde - 29.53; // unreachable in practice
}

/**
 * Gregorian date of `tithiNum` in the amanta lunar month containing the
 * sankranti into `signDeg`, whose ingress falls near `approxGregMonth`.
 */
function lunarFestivalDate(gregYear: number, signDeg: number, approxGregMonth: number, tithiNum: number): Date | null {
  const lo = toJDE(gregYear, approxGregMonth, 1, 0, 5.5) - 18;
  const hi = toJDE(gregYear, approxGregMonth, 28, 23, 5.5) + 6;
  const sankranti = findSiderealSunIngress(signDeg, lo, hi);
  const nm = newMoonBefore(sankranti);

  const nmDate = new Date((nm - 2440587.5) * DAY_MS);
  const day0 = Date.UTC(nmDate.getUTCFullYear(), nmDate.getUTCMonth(), nmDate.getUTCDate());
  let prev = 0;
  for (let off = 0; off <= 32; off++) {
    const d = new Date(day0 + off * DAY_MS);
    const t = sunriseTithi(d);
    if (t === tithiNum) return d;
    // Kshaya (skipped) tithi: it began and ended between two sunrises, so no
    // sunrise carries it. It ran during the PREVIOUS day's daytime — observe then.
    if (prev !== 0 && prev < tithiNum && t > tithiNum && (t <= 15) === (tithiNum <= 15)) {
      return new Date(day0 + (off - 1) * DAY_MS);
    }
    prev = t;
  }
  return null;
}

/** All engine-computed festivals falling in the given Gregorian year. */
export function computeEngineFestivals(gregYear: number): Festival[] {
  const out: Festival[] = [];
  const banglaYear = gregYear - 593; // Bengali year that opens (Boishakh) in this Gregorian year

  const push = (d: Date | null, f: Omit<Festival, "date">) => {
    if (d) out.push({ ...f, date: fmt(d) });
  };

  // ── Lunar (tithi) ────────────────────────────────────────────────────
  // Dol Purnima / Holi — Phalguna Purnima (lunation containing Meena sankranti, ~mid-Mar)
  push(lunarFestivalDate(gregYear, 330, 3, 15), {
    nameBn: "দোল পূর্ণিমা/হোলি", nameEn: "Dol Purnima / Holi",
    category: "religious", icon: "🎨", slug: "dol-purnima",
  });

  // Jamai Shashthi — Jyeshtha Shukla Shashthi (lunation containing Mithuna sankranti, ~mid-Jun)
  push(lunarFestivalDate(gregYear, 60, 6, 6), {
    nameBn: "জামাইষষ্ঠী", nameEn: "Jamai Shashthi",
    category: "cultural", icon: "🍲",
  });

  // Jagaddhatri Puja — Kartik Shukla Navami (lunation containing Vrischika sankranti, ~mid-Nov)
  push(lunarFestivalDate(gregYear, 210, 11, 9), {
    nameBn: "জগদ্ধাত্রী পূজা", nameEn: "Jagaddhatri Puja",
    category: "religious", icon: "🛕", slug: "jagaddhatri-puja",
  });

  // ── Solar (sankranti) ────────────────────────────────────────────────
  // Charak Puja & Gajan — climax on Chaitra Sankranti, the day before Boishakh 1.
  const boishakh1 = bengaliMonthStart(banglaYear, 0);
  const chaitraSankranti = new Date(boishakh1.getTime() - DAY_MS);
  push(chaitraSankranti, {
    nameBn: "চড়ক পূজা", nameEn: "Charak Puja",
    category: "religious", icon: "🎡",
  });
  push(chaitraSankranti, {
    nameBn: "গাজন", nameEn: "Gajan",
    category: "religious", icon: "🥁",
  });

  // Nabanna — the new-rice harvest festival, 1 Agrahayan (Pohela Ogrohayon)
  push(bengaliMonthStart(banglaYear, 7), {
    nameBn: "নবান্ন", nameEn: "Nabanna",
    category: "cultural", icon: "🌾",
  });

  return out;
}

/** Hardcoded slugs superseded by the engine (their static entries are dropped). */
export const ENGINE_SLUGS = new Set<string>(["dol-purnima", "jagaddhatri-puja"]);
