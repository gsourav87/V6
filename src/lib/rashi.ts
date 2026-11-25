/** The 12 rashis (moon signs), shared across Rashifal, Grahasphuta and the birth-rashi calculator. */
export interface RashiInfo {
  id: string;
  nameBn: string;
  nameEn: string;
  symbol: string;
  element: "fire" | "earth" | "air" | "water";
  lord: string;
  color: string;
  border: string;
  bg: string;
}

export const RASHIS: RashiInfo[] = [
  { id: "mesh",     nameBn: "মেষ",     nameEn: "Aries",       symbol: "♈", element: "fire",  lord: "মঙ্গল",    color: "from-red-500 to-orange-500",      border: "border-red-200 dark:border-red-800",      bg: "bg-red-50 dark:bg-red-950/20" },
  { id: "brisha",   nameBn: "বৃষ",     nameEn: "Taurus",      symbol: "♉", element: "earth", lord: "শুক্র",    color: "from-green-500 to-emerald-600",   border: "border-green-200 dark:border-green-800",  bg: "bg-green-50 dark:bg-green-950/20" },
  { id: "mithun",   nameBn: "মিথুন",   nameEn: "Gemini",      symbol: "♊", element: "air",   lord: "বুধ",      color: "from-yellow-500 to-amber-500",    border: "border-yellow-200 dark:border-yellow-800",bg: "bg-yellow-50 dark:bg-yellow-950/20" },
  { id: "karkat",   nameBn: "কর্কট",   nameEn: "Cancer",      symbol: "♋", element: "water", lord: "চন্দ্র",   color: "from-slate-500 to-blue-500",      border: "border-slate-200 dark:border-slate-700",  bg: "bg-slate-50 dark:bg-slate-900/20" },
  { id: "simha",    nameBn: "সিংহ",    nameEn: "Leo",         symbol: "♌", element: "fire",  lord: "সূর্য",    color: "from-orange-500 to-yellow-500",   border: "border-orange-200 dark:border-orange-800",bg: "bg-orange-50 dark:bg-orange-950/20" },
  { id: "kanya",    nameBn: "কন্যা",   nameEn: "Virgo",       symbol: "♍", element: "earth", lord: "বুধ",      color: "from-teal-500 to-green-600",      border: "border-teal-200 dark:border-teal-800",    bg: "bg-teal-50 dark:bg-teal-950/20" },
  { id: "tula",     nameBn: "তুলা",    nameEn: "Libra",       symbol: "♎", element: "air",   lord: "শুক্র",    color: "from-blue-500 to-indigo-500",     border: "border-blue-200 dark:border-blue-800",    bg: "bg-blue-50 dark:bg-blue-950/20" },
  { id: "brischik", nameBn: "বৃশ্চিক", nameEn: "Scorpio",     symbol: "♏", element: "water", lord: "মঙ্গল",    color: "from-red-800 to-purple-700",      border: "border-red-300 dark:border-red-900",      bg: "bg-red-50 dark:bg-red-950/20" },
  { id: "dhanu",    nameBn: "ধনু",     nameEn: "Sagittarius", symbol: "♐", element: "fire",  lord: "বৃহস্পতি", color: "from-purple-500 to-violet-600",   border: "border-purple-200 dark:border-purple-800",bg: "bg-purple-50 dark:bg-purple-950/20" },
  { id: "makar",    nameBn: "মকর",     nameEn: "Capricorn",   symbol: "♑", element: "earth", lord: "শনি",      color: "from-stone-500 to-amber-700",     border: "border-stone-200 dark:border-stone-700",  bg: "bg-stone-50 dark:bg-stone-900/20" },
  { id: "kumbha",   nameBn: "কুম্ভ",   nameEn: "Aquarius",    symbol: "♒", element: "air",   lord: "শনি",      color: "from-cyan-500 to-blue-600",       border: "border-cyan-200 dark:border-cyan-800",    bg: "bg-cyan-50 dark:bg-cyan-950/20" },
  { id: "meen",     nameBn: "মীন",     nameEn: "Pisces",      symbol: "♓", element: "water", lord: "বৃহস্পতি", color: "from-indigo-500 to-teal-500",     border: "border-indigo-200 dark:border-indigo-800",bg: "bg-indigo-50 dark:bg-indigo-950/20" },
];

const ELEMENT_BN: Record<RashiInfo["element"], string> = {
  fire: "অগ্নি", earth: "পৃথিবী", air: "বায়ু", water: "জল",
};
export function elementNameBn(e: RashiInfo["element"]): string {
  return ELEMENT_BN[e];
}

/** Which rashi a sidereal longitude (0–360°) falls in. */
export function rashiFromSiderealLon(lon: number): RashiInfo {
  const idx = Math.floor(((lon % 360) + 360) % 360 / 30);
  return RASHIS[idx];
}
