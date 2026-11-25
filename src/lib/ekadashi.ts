/**
 * একাদশী উপবাস / পারণ (Ekadashi fast + its breaking time). The basic rule
 * cited across panchang references: the fast is broken (parana) only after
 * the following sunrise, and must complete before Dwadashi tithi ends. This
 * implements that basic rule — not the finer Hari Vasara refinement some
 * traditions apply, which varies by sect and isn't universally agreed on.
 */
import { getTithiAtSunrise, getSunTimes, formatTithiEndBn } from "./panjika";

export interface EkadashiInfo {
  isEkadashi: boolean;
  /** Parana (fast-breaking) window: from the next day's sunrise until Dwadashi ends. */
  paranaStart: Date | null;
  paranaEnd: Date | null;
  paranaEndLabelBn: string;
}

export function getEkadashiInfo(date: Date): EkadashiInfo {
  const tithi = getTithiAtSunrise(date);
  const idxInPaksha = ((tithi.number - 1) % 15) + 1; // 1–15
  if (idxInPaksha !== 11) {
    return { isEkadashi: false, paranaStart: null, paranaEnd: null, paranaEndLabelBn: "" };
  }

  const nextDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1));
  const nextSun = getSunTimes(nextDay);
  const nextTithi = getTithiAtSunrise(nextDay);
  // If the day after Ekadashi is already past Dwadashi at sunrise (rare skip
  // cases), fall back to that tithi's own end time rather than show nothing.
  const paranaEnd = nextTithi.endsAt ?? null;

  return {
    isEkadashi: true,
    paranaStart: nextSun.sunrise,
    paranaEnd,
    paranaEndLabelBn: paranaEnd ? formatTithiEndBn(paranaEnd) : "পরদিন সূর্যোদয়ের পর",
  };
}
