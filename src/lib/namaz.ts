/**
 * নামাজের সময় (Islamic prayer times) — standard sun-altitude method used by
 * essentially every prayer-time calculator (see e.g. the widely-published
 * PrayTimes.org reference implementation). Independent of panchang
 * conventions: purely the sun's position relative to the horizon.
 *
 * Twilight angles: 18° for Fajr/Isha (University of Islamic Sciences,
 * Karachi convention — the most common default across South Asia). Asr is
 * given in both the Hanafi (shadow = 2x object height) and Shafi/standard
 * (shadow = 1x object height) conventions, since both are in common use.
 */
import { toJDE } from "./ephemeris";
import { KOLKATA_LAT, KOLKATA_LNG, KOLKATA_UTC_OFFSET } from "./bengali-calendar";

const DEG = Math.PI / 180;
const FAJR_ISHA_ANGLE = 18; // degrees below horizon

function jT(jde: number): number {
  return (jde - 2451545.0) / 36525.0;
}

/** Sun's apparent ecliptic longitude and equation of time, both needed below. */
function sunFundamentals(jde: number) {
  const T = jT(jde);
  const T2 = T * T;
  const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T2) % 360;
  const M  = (357.52911 + 35999.05029 * T - 0.0001537 * T2) % 360;
  const Mr = M * DEG;
  const C  = (1.914602 - 0.004817 * T - 0.000014 * T2) * Math.sin(Mr)
           + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
           + 0.000289 * Math.sin(3 * Mr);
  const trueLon = L0 + C;
  const eps = 23.439291 - 0.0130042 * T; // obliquity of the ecliptic, degrees
  const decl = Math.asin(Math.sin(eps * DEG) * Math.sin(trueLon * DEG)) / DEG; // degrees

  // Meeus 28.3 equation of time (minutes)
  const e = 0.016708634 - 0.000042037 * T;
  const y = Math.pow(Math.tan((eps * DEG) / 2), 2);
  const L0r = L0 * DEG;
  const Er = y * Math.sin(2 * L0r) - 2 * e * Math.sin(Mr) + 4 * e * y * Math.sin(Mr) * Math.cos(2 * L0r)
           - 0.5 * y * y * Math.sin(4 * L0r) - 1.25 * e * e * Math.sin(2 * Mr);
  const eotMinutes = Er * 4 * (180 / Math.PI);

  return { decl, eotMinutes };
}

/** Clock-time hour offset from local midnight (IST) for solar noon on this JDE. */
function solarNoonHours(eotMinutes: number): number {
  const longitudeCorrectionMin = 4 * (KOLKATA_LNG - KOLKATA_UTC_OFFSET * 15);
  return 12 - (longitudeCorrectionMin + eotMinutes) / 60;
}

/** Hour angle (degrees) at which the sun reaches altitude `altDeg` (negative = below horizon). */
function hourAngleForAltitude(altDeg: number, declDeg: number): number | null {
  const lat = KOLKATA_LAT * DEG, decl = declDeg * DEG, alt = altDeg * DEG;
  const cosH = (Math.sin(alt) - Math.sin(lat) * Math.sin(decl)) / (Math.cos(lat) * Math.cos(decl));
  if (cosH < -1 || cosH > 1) return null; // sun never reaches this altitude today (polar-ish edge case)
  return Math.acos(cosH) / DEG;
}

function hoursToDate(baseUtcMidnight: Date, hours: number): Date {
  return new Date(baseUtcMidnight.getTime() + (hours - KOLKATA_UTC_OFFSET) * 3600000);
}

export interface NamazTimes {
  fajr: Date | null;
  sunrise: Date;
  dhuhr: Date;
  asrShafi: Date | null;
  asrHanafi: Date | null;
  maghrib: Date;
  isha: Date | null;
}

export function getNamazTimes(date: Date): NamazTimes {
  const baseUtcMidnight = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const jde = toJDE(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), 12 - KOLKATA_UTC_OFFSET, 0);
  const { decl, eotMinutes } = sunFundamentals(jde);
  const noon = solarNoonHours(eotMinutes);

  const hSunrise = hourAngleForAltitude(-0.833, decl); // standard refraction + solar radius allowance
  const hFajr    = hourAngleForAltitude(-FAJR_ISHA_ANGLE, decl);
  const hIsha    = hourAngleForAltitude(-FAJR_ISHA_ANGLE, decl);

  const asrAlt = (shadowFactor: number) => {
    const latMinusDecl = Math.abs(KOLKATA_LAT - decl) * DEG;
    return Math.atan(1 / (shadowFactor + Math.tan(latMinusDecl))) / DEG;
  };
  const hAsrShafi  = hourAngleForAltitude(asrAlt(1), decl);
  const hAsrHanafi = hourAngleForAltitude(asrAlt(2), decl);

  return {
    fajr:      hFajr    !== null ? hoursToDate(baseUtcMidnight, noon - hFajr / 15)    : null,
    sunrise:   hoursToDate(baseUtcMidnight, noon - (hSunrise ?? 90) / 15),
    dhuhr:     hoursToDate(baseUtcMidnight, noon + 1 / 60), // a couple of minutes' customary margin past solar noon
    asrShafi:  hAsrShafi  !== null ? hoursToDate(baseUtcMidnight, noon + hAsrShafi / 15)  : null,
    asrHanafi: hAsrHanafi !== null ? hoursToDate(baseUtcMidnight, noon + hAsrHanafi / 15) : null,
    maghrib:   hoursToDate(baseUtcMidnight, noon + (hSunrise ?? 90) / 15),
    isha:      hIsha     !== null ? hoursToDate(baseUtcMidnight, noon + hIsha / 15)     : null,
  };
}
