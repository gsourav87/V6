import { useEffect, useMemo } from "react";
import { format } from "date-fns";
import { NavBar } from "@/components/NavBar";
import { applyPageSEO, removeSchema, SITE_URL } from "@/lib/seo";
import { toBengaliDate, toBengaliNumerals } from "@/lib/bengali-calendar";

const RASHIS = [
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

const WORK_MSGS = [
  "কর্মক্ষেত্রে আজ নতুন সুযোগ আসতে পারে। সিনিয়রদের সহযোগিতা পাবেন।",
  "কাজে একটু বেশি মনোযোগ দিন। পরিশ্রম বৃথা যাবে না, ফলাফল পাবেন।",
  "দলগত কাজে সাফল্য আসবে। নতুন প্রকল্পে যোগ দেওয়া আজ শুভ।",
  "আজ সিদ্ধান্ত নেওয়ার ক্ষেত্রে সতর্ক থাকুন। তাড়াহুড়ো এড়িয়ে চলুন।",
  "ব্যবসায়িক আলোচনা ফলপ্রসূ হবে। অংশীদারিত্বে লাভ সম্ভব।",
  "কর্মস্থলে পরিবর্তন আসতে পারে, ইতিবাচক থাকুন।",
  "আর্থিক বিষয়ে বিনিয়োগের জন্য ভালো দিন। দীর্ঘমেয়াদি পরিকল্পনা করুন।",
  "সৃজনশীল কাজে আজ মনোযোগ দিন। অনুপ্রেরণা পাবেন।",
  "উচ্চতর কর্তৃপক্ষের সঙ্গে সম্পর্ক ভালো থাকবে। পদোন্নতির সম্ভাবনা।",
];

const LOVE_MSGS = [
  "পারিবারিক সম্পর্ক মধুর থাকবে। প্রিয়জনের সাথে সময় কাটান।",
  "নতুন সম্পর্ক তৈরির সম্ভাবনা আছে। মন খুলে কথা বলুন।",
  "দাম্পত্য জীবনে শান্তি বিরাজ করবে। বিশেষ কিছু পরিকল্পনা করুন।",
  "পুরনো বন্ধুত্ব নতুন রূপ নিতে পারে। যোগাযোগ বজায় রাখুন।",
  "পরিবারের কারো সাহায্যে কাজ এগোবে। সম্পর্ক আরও মজবুত হবে।",
  "আজ প্রিয়জনকে বিস্মিত করুন। ছোট উপহারেই মন জয় হবে।",
  "সম্পর্কে বিশ্বাস ও বোঝাপড়া বাড়বে। একে অপরকে সময় দিন।",
  "মতভেদ এড়িয়ে চলুন। ধৈর্য ধরে কথা বললে সমস্যার সমাধান হবে।",
];

const HEALTH_MSGS = [
  "স্বাস্থ্যের যত্ন নিন। পর্যাপ্ত ঘুম ও জলপান জরুরি।",
  "শরীরচর্চা শুরু করার উপযুক্ত সময়। মানসিক চাপ কমান।",
  "পুরনো সমস্যা সেরে উঠবে। চিকিৎসকের পরামর্শ মেনে চলুন।",
  "আজ বিশ্রাম নিন। অতিরিক্ত পরিশ্রম এড়িয়ে চলুন।",
  "ইতিবাচক মনোভাব রাখুন। মন সুস্থ থাকলে শরীরও সুস্থ।",
  "খাদ্যাভ্যাসে পরিবর্তন আনুন। হালকা ও পুষ্টিকর খাবার উপকারী।",
  "যোগব্যায়াম বা ধ্যানে সময় দিন। মানসিক শান্তি পাবেন।",
  "বাইরে হাঁটুন, তাজা বাতাসে সময় কাটান। শক্তি বাড়বে।",
];

const LUCKY_COLORS = ["লাল", "নীল", "সবুজ", "হলুদ", "সাদা", "বেগুনি", "কমলা", "আকাশী", "গোলাপি", "সোনালি"];
const LUCKY_NUMS   = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const STARS = ["★★★☆☆", "★★★★☆", "★★★★★"];

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getRashiHoroscope(rashiIndex: number, date: Date) {
  const s = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate() + rashiIndex * 1337;
  const pick = <T,>(arr: T[], offset: number) => arr[Math.floor(seededRandom(s + offset) * arr.length)];
  return {
    work:   pick(WORK_MSGS,   0),
    love:   pick(LOVE_MSGS,   1),
    health: pick(HEALTH_MSGS, 2),
    color:  pick(LUCKY_COLORS, 3),
    num:    LUCKY_NUMS[Math.floor(seededRandom(s + 4) * LUCKY_NUMS.length)],
    stars:  STARS[Math.floor(seededRandom(s + 5) * 3)],
  };
}

export default function RashifalPage() {
  const today  = useMemo(() => new Date(), []);
  const bnDate = useMemo(() => toBengaliDate(today), [today]);

  const SCHEMA_ID = "rashifal-schema";

  useEffect(() => {
    applyPageSEO({
      title: `আজকের রাশিফল ${format(today, "d MMMM yyyy")} — সব রাশির ভাগ্যফল | সঠিক বাংলা ক্যালেন্ডার`,
      description: "আজকের রাশিফল: মেষ, বৃষ, মিথুন, কর্কট, সিংহ, কন্যা, তুলা, বৃশ্চিক, ধনু, মকর, কুম্ভ ও মীন — সব রাশির ভাগ্যফল।",
      path: "/rashifal",
      schemaId: SCHEMA_ID,
      schema: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "url": `${SITE_URL}/rashifal`,
        "inLanguage": "bn",
        "mainEntity": RASHIS.map(r => ({
          "@type": "Question",
          "name": `আজকের ${r.nameBn} রাশিফল কী?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${r.nameBn} (${r.nameEn}) রাশির আজকের ভাগ্যফল জানতে সঠিক বাংলা ক্যালেন্ডারের রাশিফল পাতা দেখুন।`,
          },
        })),
      },
    });
    return () => removeSchema(SCHEMA_ID);
  }, [today]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔮</div>
          <h1 className="text-3xl sm:text-4xl font-bold font-bengali mb-2">আজকের রাশিফল</h1>
          <p className="text-muted-foreground font-bengali text-sm">
            {toBengaliNumerals(bnDate.day)} {bnDate.monthNameBn} {toBengaliNumerals(bnDate.year)} বঙ্গাব্দ
            &nbsp;·&nbsp;
            {format(today, "d MMMM yyyy")}
          </p>
        </div>

        {/* Rashi grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RASHIS.map((rashi, i) => {
            const h = getRashiHoroscope(i, today);
            return (
              <div key={rashi.id} className={`rounded-2xl border ${rashi.border} ${rashi.bg} overflow-hidden`}>
                {/* Gradient header */}
                <div className={`bg-gradient-to-r ${rashi.color} p-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold font-bengali">
                        {rashi.symbol} {rashi.nameBn}
                      </div>
                      <div className="text-white/75 text-xs mt-0.5">{rashi.nameEn}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-200 text-sm tracking-tight">{h.stars}</div>
                      <div className="text-white/65 text-xs mt-1 font-bengali">শাসক: {rashi.lord}</div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">💼 কর্ম ও অর্থ</div>
                    <p className="text-sm font-bengali text-foreground leading-relaxed">{h.work}</p>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">❤️ প্রেম ও পরিবার</div>
                    <p className="text-sm font-bengali text-foreground leading-relaxed">{h.love}</p>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">🏥 স্বাস্থ্য</div>
                    <p className="text-sm font-bengali text-foreground leading-relaxed">{h.health}</p>
                  </div>
                  <div className="flex gap-4 pt-2 border-t border-border/40">
                    <div className="text-xs font-bengali">
                      <span className="text-muted-foreground">শুভ রং: </span>
                      <span className="font-semibold text-foreground">{h.color}</span>
                    </div>
                    <div className="text-xs font-bengali">
                      <span className="text-muted-foreground">শুভ সংখ্যা: </span>
                      <span className="font-semibold text-foreground">{toBengaliNumerals(h.num)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 font-bengali">
          রাশিফল বিনোদনের উদ্দেশ্যে প্রদান করা হয়। ব্যক্তিগত সিদ্ধান্তের জন্য বিশেষজ্ঞের পরামর্শ নিন।
        </p>
      </div>
    </div>
  );
}
