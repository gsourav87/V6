/**
 * দগ্ধা তিথি / বিষ তিথি / হুতাশন তিথি — classical weekday+tithi combinations
 * held inauspicious for starting new work (cited to Varahamihira /
 * Jyotirvidyabharanam in standard Vedic astrology references). Tithi number
 * here is 1–15 within the running paksha, matching TithiInfo.idx+1.
 */

// Index 0 = Sunday … 6 = Saturday
const DAGDHA_TITHI    = [12, 11, 5, 3, 6, 8, 9];
const VISHA_TITHI     = [4, 6, 7, 2, 8, 9, 7];
const HUTASHAN_TITHI  = [12, 6, 7, 8, 9, 10, 11];

export interface TithiDoshaInfo {
  isDagdha: boolean;
  isVisha: boolean;
  isHutashan: boolean;
}

/** `tithiWithinPaksha` is 1–15 (e.g. Purnima/Amavasya = 15). `dayOfWeek` is 0=Sunday. */
export function getTithiDosha(tithiWithinPaksha: number, dayOfWeek: number): TithiDoshaInfo {
  return {
    isDagdha:   DAGDHA_TITHI[dayOfWeek]   === tithiWithinPaksha,
    isVisha:    VISHA_TITHI[dayOfWeek]    === tithiWithinPaksha,
    isHutashan: HUTASHAN_TITHI[dayOfWeek] === tithiWithinPaksha,
  };
}
