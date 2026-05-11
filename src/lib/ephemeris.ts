/**
 * Core astronomical calculations based on Meeus "Astronomical Algorithms" (2nd ed.)
 * Implements sun and moon longitude with accuracy suitable for tithi calculation (~1' arc)
 * All angles in degrees unless noted. Kolkata: 22.5726°N, 88.3639°E, UTC+5:30
 */

const DEG = Math.PI / 180;

// Normalize angle to [0, 360)
export function norm360(a: number): number {
  return ((a % 360) + 360) % 360;
}

// Julian Ephemeris Day from Gregorian calendar (UT)
// hour is local time, utcOffset in hours (Kolkata = 5.5)
export function toJDE(year: number, month: number, day: number, hourLocal = 12, utcOffset = 5.5): number {
  const ut = hourLocal - utcOffset;
  let y = year;
  let m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day + ut / 24 + B - 1524.5;
}

// Julian century from J2000.0
function jT(jde: number) { return (jde - 2451545.0) / 36525.0; }

// Sun's apparent tropical longitude (degrees), Meeus Ch.25
export function sunTropicalLon(jde: number): number {
  const T = jT(jde);
  const T2 = T * T;
  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T2);
  const M  = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T2);
  const Mr = M * DEG;
  const C  = (1.914602 - 0.004817 * T - 0.000014 * T2) * Math.sin(Mr)
           + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
           + 0.000289 * Math.sin(3 * Mr);
  const sunLon = L0 + C;
  const omega  = 125.04 - 1934.136 * T;
  return norm360(sunLon - 0.00569 - 0.00478 * Math.sin(omega * DEG));
}

// Lahiri ayanamsa (degrees) — the standard ayanamsa for Indian calendars
// Rate: 50.2878 arcsec/year = 5028.78 arcsec/century = 1.39689°/century
// Value at J2000.0 (Jan 1.5, 2000): ~23.8517°
export function lahiriAyanamsa(jde: number): number {
  const T = jT(jde); // Julian centuries from J2000.0
  return norm360(23.8517 + 1.39689 * T);
}

// Sun's sidereal longitude using Lahiri ayanamsa
export function sunSiderealLon(jde: number): number {
  return norm360(sunTropicalLon(jde) - lahiriAyanamsa(jde));
}

// Moon's tropical longitude (degrees), Meeus Ch.47 — 60-term series, ~10" accuracy
export function moonTropicalLon(jde: number): number {
  const T  = jT(jde);
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;

  const Lp = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000);
  const D  = norm360(297.8501921 + 445267.1114034  * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000);
  const M  = norm360(357.5291092 + 35999.0502909   * T - 0.0001536 * T2 + T3 / 24490000);
  const Mp = norm360(134.9633964 + 477198.8675055  * T + 0.0087414 * T2 + T3 / 69699    - T4 / 14712000);
  const F  = norm360(93.2720950  + 483202.0175233  * T - 0.0036539 * T2 - T3 / 3526000  + T4 / 863310000);

  const E  = 1 - 0.002516 * T - 0.0000074 * T2;
  const E2 = E * E;

  // Convert to radians
  const Dr  = D  * DEG, Mr  = M  * DEG, Mpr = Mp * DEG, Fr  = F  * DEG;

  // Σl in units of 0.000001 degrees — main 60 periodic terms (Meeus Table 47.A)
  const sl =
    6288774 * Math.sin(Mpr) +
    1274027 * Math.sin(2*Dr - Mpr) +
    658314  * Math.sin(2*Dr) +
    213618  * Math.sin(2*Mpr) +
    -185116 * E  * Math.sin(Mr) +
    -114332 * Math.sin(2*Fr) +
    58793   * Math.sin(2*Dr - 2*Mpr) +
    57066   * E  * Math.sin(2*Dr - Mr - Mpr) +
    53322   * Math.sin(2*Dr + Mpr) +
    45758   * E  * Math.sin(2*Dr - Mr) +
    -40923  * E  * Math.sin(Mr - Mpr) +
    -34720  * Math.sin(Dr) +
    -30383  * E  * Math.sin(Mr + Mpr) +
    15327   * Math.sin(2*Dr - 2*Fr) +
    -12528  * Math.sin(Mpr + 2*Fr) +
    10980   * Math.sin(Mpr - 2*Fr) +
    10675   * Math.sin(4*Dr - Mpr) +
    10034   * Math.sin(3*Mpr) +
    8548    * Math.sin(4*Dr - 2*Mpr) +
    -7888   * E  * Math.sin(2*Dr + Mr - Mpr) +
    -6766   * E  * Math.sin(2*Dr + Mr) +
    -5163   * Math.sin(Dr - Mpr) +
    4987    * E  * Math.sin(Dr + Mr) +
    4036    * E  * Math.sin(2*Dr - Mr + Mpr) +
    3994    * Math.sin(2*Dr + 2*Mpr) +
    3861    * Math.sin(4*Dr) +
    3665    * Math.sin(2*Dr - 3*Mpr) +
    -2689   * E  * Math.sin(Mr - 2*Mpr) +
    -2602   * Math.sin(2*Dr - Mpr + 2*Fr) +
    2390    * E  * Math.sin(2*Dr - Mr - 2*Mpr) +
    -2348   * Math.sin(Dr + Mpr) +
    2236    * E2 * Math.sin(2*Dr - 2*Mr) +
    -2120   * E  * Math.sin(Mr + 2*Mpr) +
    -2069   * E2 * Math.sin(2*Mr) +
    2048    * E2 * Math.sin(2*Dr - 2*Mr - Mpr) +
    -1773   * Math.sin(2*Dr + Mpr - 2*Fr) +
    -1595   * Math.sin(2*Dr + 2*Fr) +
    1215    * E  * Math.sin(4*Dr - Mr - Mpr) +
    -1110   * Math.sin(2*Mpr + 2*Fr) +
    -892    * Math.sin(3*Dr - Mpr) +
    -810    * E  * Math.sin(2*Dr + Mr + Mpr) +
    759     * E  * Math.sin(4*Dr - Mr - 2*Mpr) +
    -713    * E2 * Math.sin(2*Mr - Mpr) +
    -700    * E2 * Math.sin(2*Dr + 2*Mr - Mpr) +
    596     * E  * Math.sin(2*Dr - Mr + 2*Fr) +
    549     * Math.sin(4*Dr + Mpr) +
    537     * Math.sin(4*Mpr) +
    520     * E  * Math.sin(4*Dr - Mr) +
    -487    * Math.sin(Dr - 2*Mpr) +
    -399    * E  * Math.sin(2*Dr + Mr - 2*Fr) +
    -381    * Math.sin(2*Mpr - 2*Fr) +
    351     * E  * Math.sin(Dr + Mr + Mpr) +
    -340    * Math.sin(3*Dr - 2*Mpr) +
    330     * Math.sin(4*Dr - 3*Mpr) +
    327     * E  * Math.sin(2*Dr - Mr + 2*Mpr) +
    -323    * E2 * Math.sin(2*Mr + Mpr) +
    299     * E  * Math.sin(Dr + Mr - Mpr) +
    294     * Math.sin(2*Dr + 3*Mpr);

  // Additional planetary/flattening terms (Meeus p.338)
  const A1 = norm360(119.75 + 131.849 * T);
  const A2 = norm360(53.09  + 479264.290 * T);
  const slAdj = 3958 * Math.sin(A1 * DEG)
              + 1962 * Math.sin((Lp - F) * DEG)
              +  318 * Math.sin(A2 * DEG);

  return norm360(Lp + (sl + slAdj) / 1e6);
}

// Moon's sidereal longitude using Lahiri ayanamsa
export function moonSiderealLon(jde: number): number {
  return norm360(moonTropicalLon(jde) - lahiriAyanamsa(jde));
}

// Find JDE when sun's sidereal longitude = targetDeg (0-360) using bisection
// Search within [jdeLow, jdeHigh]
export function findSiderealSunIngress(targetDeg: number, jdeLow: number, jdeHigh: number): number {
  // Handle wrap-around near 0°/360°
  let lo = jdeLow, hi = jdeHigh;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const sunLon = sunSiderealLon(mid);
    // Angular difference from target, accounting for wraparound
    let diff = sunLon - targetDeg;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (diff < 0) lo = mid; else hi = mid;
    if (hi - lo < 0.0001) break; // ~8 second precision
  }
  return (lo + hi) / 2;
}
