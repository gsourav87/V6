export interface City {
  id: string;
  nameBn: string;
  nameEn: string;
  lat: number;
  lon: number;
}

export const CITIES: City[] = [
  { id: "kolkata",    nameBn: "কলকাতা",   nameEn: "Kolkata",    lat: 22.5726, lon: 88.3639 },
  { id: "dhaka",      nameBn: "ঢাকা",      nameEn: "Dhaka",      lat: 23.8103, lon: 90.4125 },
  { id: "chittagong", nameBn: "চট্টগ্রাম", nameEn: "Chittagong", lat: 22.3569, lon: 91.7832 },
  { id: "agartala",   nameBn: "আগরতলা",   nameEn: "Agartala",   lat: 23.8315, lon: 91.2868 },
  { id: "siliguri",   nameBn: "শিলিগুড়ি", nameEn: "Siliguri",   lat: 26.7271, lon: 88.3953 },
];

export interface WeatherDay {
  date: string;        // YYYY-MM-DD
  code: number;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  windMax: number;
  uvIndex: number;
}

export interface CurrentWeather {
  time: string;
  code: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: WeatherDay[];
}

const API_BASE = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = new URL(API_BASE);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature");
  url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max");
  url.searchParams.set("timezone", "Asia/Kolkata");
  url.searchParams.set("forecast_days", "15");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Weather API ${res.status}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d: any = await res.json();

  const current: CurrentWeather = {
    time:      d.current.time,
    code:      d.current.weather_code,
    temp:      Math.round(d.current.temperature_2m),
    feelsLike: Math.round(d.current.apparent_temperature),
    humidity:  d.current.relative_humidity_2m,
    wind:      Math.round(d.current.wind_speed_10m),
  };

  const daily: WeatherDay[] = (d.daily.time as string[]).map((date: string, i: number) => ({
    date,
    code:          d.daily.weather_code[i],
    tempMax:       Math.round(d.daily.temperature_2m_max[i]),
    tempMin:       Math.round(d.daily.temperature_2m_min[i]),
    precipitation: Math.round((d.daily.precipitation_sum[i] ?? 0) * 10) / 10,
    windMax:       Math.round(d.daily.wind_speed_10m_max[i]),
    uvIndex:       Math.round(d.daily.uv_index_max[i] ?? 0),
  }));

  return { current, daily };
}

// ── WMO code → Bengali label + emoji ─────────────────────────────────────────
interface WeatherDesc { label: string; emoji: string; bg: string }

export function describeCode(code: number): WeatherDesc {
  if (code === 0)                   return { label: "পরিষ্কার আকাশ",          emoji: "☀️",  bg: "from-amber-400 to-orange-400" };
  if (code === 1)                   return { label: "মূলত পরিষ্কার",          emoji: "🌤️", bg: "from-amber-300 to-sky-400" };
  if (code === 2)                   return { label: "আংশিক মেঘলা",           emoji: "⛅",  bg: "from-sky-300 to-slate-400" };
  if (code === 3)                   return { label: "মেঘলা",                  emoji: "☁️",  bg: "from-slate-400 to-slate-500" };
  if (code >= 45 && code <= 48)     return { label: "কুয়াশা",                emoji: "🌫️", bg: "from-slate-300 to-slate-400" };
  if (code >= 51 && code <= 55)     return { label: "গুঁড়ি গুঁড়ি বৃষ্টি",  emoji: "🌦️", bg: "from-sky-400 to-blue-500" };
  if (code >= 56 && code <= 57)     return { label: "শীতল গুঁড়ি বৃষ্টি",   emoji: "🌧️", bg: "from-sky-500 to-blue-600" };
  if (code >= 61 && code <= 65)     return { label: "বৃষ্টি",                emoji: "🌧️", bg: "from-blue-500 to-blue-700" };
  if (code >= 66 && code <= 67)     return { label: "শীতল বৃষ্টি",           emoji: "🌨️", bg: "from-blue-400 to-indigo-500" };
  if (code >= 71 && code <= 77)     return { label: "তুষারপাত",              emoji: "❄️",  bg: "from-sky-200 to-blue-300" };
  if (code >= 80 && code <= 82)     return { label: "বৃষ্টিঝড়",             emoji: "🌦️", bg: "from-blue-500 to-indigo-600" };
  if (code >= 85 && code <= 86)     return { label: "তুষারঝড়",              emoji: "🌨️", bg: "from-indigo-300 to-blue-400" };
  if (code === 95)                  return { label: "বজ্রঝড়",               emoji: "⛈️",  bg: "from-slate-600 to-purple-700" };
  if (code >= 96)                   return { label: "শিলাবৃষ্টি সহ বজ্রঝড়", emoji: "⛈️",  bg: "from-slate-700 to-purple-800" };
  return { label: "অজানা",                                                     emoji: "🌡️", bg: "from-slate-400 to-slate-500" };
}

// ── UV index Bengali label ────────────────────────────────────────────────────
export function uvLabel(uv: number): { label: string; color: string } {
  if (uv <= 2)  return { label: "কম",        color: "text-green-600" };
  if (uv <= 5)  return { label: "মাঝারি",    color: "text-yellow-600" };
  if (uv <= 7)  return { label: "বেশি",      color: "text-orange-500" };
  if (uv <= 10) return { label: "অনেক বেশি", color: "text-red-500" };
  return         { label: "অত্যন্ত বেশি",    color: "text-purple-600" };
}

const BN_DAYS    = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"];
const BN_MONTHS  = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];

export function formatDateBn(dateStr: string): { day: string; full: string; isToday: boolean } {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth()    === today.getMonth()    &&
    d.getDate()     === today.getDate();
  return {
    day:     isToday ? "আজ" : BN_DAYS[d.getDay()],
    full:    `${d.getDate()} ${BN_MONTHS[d.getMonth()]}`,
    isToday,
  };
}
