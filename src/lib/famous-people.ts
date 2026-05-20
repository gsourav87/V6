import type { Festival } from "./festivals";

export interface FamousPerson {
  id: string;
  nameBn: string;
  nameEn: string;
  birthMD: string;    // "MM-DD" — for recurring annual check
  birthYear: number;
  deathMD?: string;   // "MM-DD" — only for key commemorated dates
  deathYear?: number;
  role: string;
  descBn: string;
  emoji: string;
  wikiUrl: string;
  /** true = birth anniversary already listed in festivals.ts — skip in calendar cell */
  inFestivals?: boolean;
}

export const FAMOUS_PEOPLE: FamousPerson[] = [
  {
    id: "gandhi",
    nameBn: "মহাত্মা গান্ধী",
    nameEn: "Mahatma Gandhi",
    birthMD: "10-02", birthYear: 1869,
    deathMD: "01-30", deathYear: 1948,
    role: "জাতির পিতা",
    descBn: "সত্যাগ্রহ ও অহিংসার পথে ভারতের স্বাধীনতা আন্দোলনের নেতৃত্ব দিয়েছিলেন।",
    emoji: "🕊️",
    wikiUrl: "https://en.wikipedia.org/wiki/Mahatma_Gandhi",
    inFestivals: true,
  },
  {
    id: "bose",
    nameBn: "নেতাজি সুভাষচন্দ্র বসু",
    nameEn: "Subhas Chandra Bose",
    birthMD: "01-23", birthYear: 1897,
    role: "নেতাজি, আজাদ হিন্দ ফৌজের সর্বাধিনায়ক",
    descBn: "\"তোমরা আমাকে রক্ত দাও, আমি তোমাদের স্বাধীনতা দেব\" — এই অমর বাণীর জনক।",
    emoji: "⚔️",
    wikiUrl: "https://en.wikipedia.org/wiki/Subhas_Chandra_Bose",
    inFestivals: true,
  },
  {
    id: "tagore",
    nameBn: "রবীন্দ্রনাথ ঠাকুর",
    nameEn: "Rabindranath Tagore",
    birthMD: "05-07", birthYear: 1861,
    deathYear: 1941,
    role: "বিশ্বকবি",
    descBn: "১৯১৩ সালে সাহিত্যে নোবেল পুরস্কার বিজয়ী। বাংলা সাহিত্যের সর্বশ্রেষ্ঠ কবি।",
    emoji: "✍️",
    wikiUrl: "https://en.wikipedia.org/wiki/Rabindranath_Tagore",
    inFestivals: true,
  },
  {
    id: "vivekananda",
    nameBn: "স্বামী বিবেকানন্দ",
    nameEn: "Swami Vivekananda",
    birthMD: "01-12", birthYear: 1863,
    role: "ধর্মগুরু, যুব আদর্শ",
    descBn: "১৮৯৩ সালে শিকাগো বিশ্বধর্ম সম্মেলনে \"ভ্রাতা ও ভগিনীগণ\" সম্বোধনে বিশ্বকে নাড়া দেন।",
    emoji: "🪷",
    wikiUrl: "https://en.wikipedia.org/wiki/Swami_Vivekananda",
  },
  {
    id: "savitribai",
    nameBn: "সাবিত্রীবাই ফুলে",
    nameEn: "Savitribai Phule",
    birthMD: "01-03", birthYear: 1831,
    role: "ভারতের প্রথম মহিলা শিক্ষিকা",
    descBn: "জ্যোতিরাও ফুলের সঙ্গে মিলে মেয়েদের জন্য ভারতের প্রথম স্কুল প্রতিষ্ঠা করেন।",
    emoji: "📚",
    wikiUrl: "https://en.wikipedia.org/wiki/Savitribai_Phule",
  },
  {
    id: "lala",
    nameBn: "লালা লাজপত রায়",
    nameEn: "Lala Lajpat Rai",
    birthMD: "01-28", birthYear: 1865,
    deathMD: "11-17", deathYear: 1928,
    role: "পাঞ্জাব কেশরি",
    descBn: "সাইমন কমিশনের বিরুদ্ধে শান্তিপূর্ণ মিছিলে ব্রিটিশ লাঠির আঘাতে মৃত্যুবরণ করেন।",
    emoji: "🦁",
    wikiUrl: "https://en.wikipedia.org/wiki/Lala_Lajpat_Rai",
  },
  {
    id: "sarojini",
    nameBn: "সরোজিনী নাইডু",
    nameEn: "Sarojini Naidu",
    birthMD: "02-13", birthYear: 1879,
    role: "ভারতের কোকিল",
    descBn: "ভারতীয় জাতীয় কংগ্রেসের প্রথম মহিলা সভাপতি। কবি ও বাগ্মী হিসেবে বিখ্যাত।",
    emoji: "🌸",
    wikiUrl: "https://en.wikipedia.org/wiki/Sarojini_Naidu",
  },
  {
    id: "bhagat",
    nameBn: "শহীদ ভগৎ সিং",
    nameEn: "Bhagat Singh",
    birthMD: "09-27", birthYear: 1907,
    deathMD: "03-23", deathYear: 1931,
    role: "বিপ্লবী, হিন্দুস্তান সোশ্যালিস্ট রিপাবলিকান অ্যাসোসিয়েশন",
    descBn: "মাত্র ২৩ বছর বয়সে ফাঁসির মঞ্চে \"ইনকিলাব জিন্দাবাদ\" ধ্বনি দিয়ে শহীদ হন।",
    emoji: "🔥",
    wikiUrl: "https://en.wikipedia.org/wiki/Bhagat_Singh",
  },
  {
    id: "ambedkar",
    nameBn: "ড. ভীমরাও আম্বেদকর",
    nameEn: "B. R. Ambedkar",
    birthMD: "04-14", birthYear: 1891,
    role: "সংবিধানের রূপকার",
    descBn: "ভারতের সংবিধান প্রণয়ন কমিটির সভাপতি। দলিত সমাজের অধিকার রক্ষায় আজীবন সংগ্রাম করেন।",
    emoji: "📜",
    wikiUrl: "https://en.wikipedia.org/wiki/B._R._Ambedkar",
  },
  {
    id: "nazrul",
    nameBn: "কাজি নজরুল ইসলাম",
    nameEn: "Kazi Nazrul Islam",
    birthMD: "05-25", birthYear: 1899,
    role: "বিদ্রোহী কবি",
    descBn: "\"বিদ্রোহী\" কবিতা ও \"ধূমকেতু\" পত্রিকার মাধ্যমে ব্রিটিশ শাসনের বিরুদ্ধে কলম চালান।",
    emoji: "🎶",
    wikiUrl: "https://en.wikipedia.org/wiki/Kazi_Nazrul_Islam",
  },
  {
    id: "bismil",
    nameBn: "রাম প্রসাদ বিসমিল",
    nameEn: "Ram Prasad Bismil",
    birthMD: "06-11", birthYear: 1897,
    deathYear: 1927,
    role: "বিপ্লবী কবি",
    descBn: "\"সরফরোশি কি তামান্না\" — এই অমর গজলের রচয়িতা। কাকোরি কাণ্ডে ফাঁসি বরণ করেন।",
    emoji: "🖋️",
    wikiUrl: "https://en.wikipedia.org/wiki/Ram_Prasad_Bismil",
  },
  {
    id: "tilak",
    nameBn: "বাল গঙ্গাধর তিলক",
    nameEn: "Bal Gangadhar Tilak",
    birthMD: "07-23", birthYear: 1856,
    role: "লোকমান্য, স্বরাজের প্রবক্তা",
    descBn: "\"স্বরাজ আমার জন্মগত অধিকার এবং আমি তা নেব\" — এই উক্তির জনক।",
    emoji: "🎯",
    wikiUrl: "https://en.wikipedia.org/wiki/Bal_Gangadhar_Tilak",
  },
  {
    id: "azad",
    nameBn: "চন্দ্রশেখর আজাদ",
    nameEn: "Chandra Shekhar Azad",
    birthMD: "07-23", birthYear: 1906,
    deathMD: "02-27", deathYear: 1931,
    role: "বিপ্লবী",
    descBn: "জীবিত অবস্থায় ব্রিটিশের হাতে ধরা না দেওয়ার শপথ নিয়েছিলেন। আলফ্রেড পার্কে আত্মবলিদান।",
    emoji: "🇮🇳",
    wikiUrl: "https://en.wikipedia.org/wiki/Chandra_Shekhar_Azad",
  },
  {
    id: "mangal-pandey",
    nameBn: "মঙ্গল পাণ্ডে",
    nameEn: "Mangal Pandey",
    birthMD: "07-19", birthYear: 1827,
    deathYear: 1857,
    role: "প্রথম স্বাধীনতা সংগ্রামের অগ্রদূত",
    descBn: "ব্যারাকপুর সেনানিবাসে ব্রিটিশ অফিসারদের বিরুদ্ধে বিদ্রোহ ঘোষণা করেন।",
    emoji: "🫡",
    wikiUrl: "https://en.wikipedia.org/wiki/Mangal_Pandey",
  },
  {
    id: "aurobindo",
    nameBn: "ঋষি অরবিন্দ",
    nameEn: "Sri Aurobindo",
    birthMD: "08-15", birthYear: 1872,
    role: "বিপ্লবী ও দার্শনিক",
    descBn: "প্রথমে সশস্ত্র বিপ্লবের পথিকৃৎ; পরে পন্ডিচেরিতে আশ্রম গড়ে আধ্যাত্মিক সাধনায় মগ্ন হন।",
    emoji: "🧘",
    wikiUrl: "https://en.wikipedia.org/wiki/Sri_Aurobindo",
  },
  {
    id: "bagha-jatin",
    nameBn: "বাঘা যতীন",
    nameEn: "Bagha Jatin",
    birthMD: "12-07", birthYear: 1879,
    deathMD: "09-10", deathYear: 1915,
    role: "যুগান্তর দলের নেতা",
    descBn: "খালি হাতে বাঘ মেরে \"বাঘা যতীন\" নাম পান। বালেশ্বরের যুদ্ধে ব্রিটিশদের বিরুদ্ধে লড়াই করে শহীদ হন।",
    emoji: "🐯",
    wikiUrl: "https://en.wikipedia.org/wiki/Bagha_Jatin",
  },
  {
    id: "khudiram",
    nameBn: "ক্ষুদিরাম বসু",
    nameEn: "Khudiram Bose",
    birthMD: "12-03", birthYear: 1889,
    deathMD: "08-11", deathYear: 1908,
    role: "তরুণতম শহীদ বিপ্লবী",
    descBn: "মাত্র ১৮ বছর বয়সে ফাঁসির মঞ্চে হাসিমুখে মৃত্যুবরণ করেন। বাংলার ঘরে ঘরে বিপ্লবী চেতনা জাগিয়ে দেন।",
    emoji: "🌹",
    wikiUrl: "https://en.wikipedia.org/wiki/Khudiram_Bose",
  },
  {
    id: "bipin",
    nameBn: "বিপিনচন্দ্র পাল",
    nameEn: "Bipin Chandra Pal",
    birthMD: "11-07", birthYear: 1858,
    role: "লাল-বাল-পাল ত্রয়ের অন্যতম",
    descBn: "স্বদেশী, বয়কট ও জাতীয় শিক্ষার পথ দেখান। ভারতের বিপ্লবী চিন্তাধারার পথিকৃৎ।",
    emoji: "📣",
    wikiUrl: "https://en.wikipedia.org/wiki/Bipin_Chandra_Pal",
  },
  {
    id: "nehru",
    nameBn: "জওহরলাল নেহরু",
    nameEn: "Jawaharlal Nehru",
    birthMD: "11-14", birthYear: 1889,
    role: "ভারতের প্রথম প্রধানমন্ত্রী",
    descBn: "আধুনিক ভারতের রূপকার। শিশুদের কাছে \"চাচা নেহরু\"। ১৫ আগস্ট মধ্যরাতে Tryst with Destiny ভাষণ দেন।",
    emoji: "🌹",
    wikiUrl: "https://en.wikipedia.org/wiki/Jawaharlal_Nehru",
  },
  {
    id: "rani-laxmibai",
    nameBn: "রানী লক্ষ্মীবাই",
    nameEn: "Rani Lakshmibai",
    birthMD: "11-19", birthYear: 1828,
    role: "ঝাঁসির রানী",
    descBn: "\"মেরি ঝাঁসি নেহি দুঙ্গি\" — এই ঘোষণা দিয়ে ব্রিটিশদের বিরুদ্ধে যুদ্ধ করেন। অসামান্য সাহসিকতার প্রতীক।",
    emoji: "🗡️",
    wikiUrl: "https://en.wikipedia.org/wiki/Lakshmibai",
  },
  {
    id: "azad-maulana",
    nameBn: "মৌলানা আবুল কালাম আজাদ",
    nameEn: "Maulana Abul Kalam Azad",
    birthMD: "11-11", birthYear: 1888,
    role: "স্বাধীন ভারতের প্রথম শিক্ষামন্ত্রী",
    descBn: "হিন্দু-মুসলিম ঐক্যের প্রবক্তা। ১১ নভেম্বর তাঁর জন্মদিন \"জাতীয় শিক্ষা দিবস\" হিসেবে পালিত।",
    emoji: "📫",
    wikiUrl: "https://en.wikipedia.org/wiki/Maulana_Abul_Kalam_Azad",
  },
  {
    id: "patel",
    nameBn: "সরদার বল্লভভাই প্যাটেল",
    nameEn: "Sardar Vallabhbhai Patel",
    birthMD: "10-31", birthYear: 1875,
    role: "ভারতের লৌহমানব, প্রথম স্বরাষ্ট্রমন্ত্রী",
    descBn: "৫৬২টি দেশীয় রাজ্যকে স্বাধীন ভারতের সঙ্গে যুক্ত করে ভারতের ঐক্য গড়ে তোলেন।",
    emoji: "🏛️",
    wikiUrl: "https://en.wikipedia.org/wiki/Vallabhbhai_Patel",
  },
  {
    id: "shastri",
    nameBn: "লাল বাহাদুর শাস্ত্রী",
    nameEn: "Lal Bahadur Shastri",
    birthMD: "10-02", birthYear: 1904,
    role: "ভারতের দ্বিতীয় প্রধানমন্ত্রী",
    descBn: "\"জয় জওয়ান, জয় কিষান\" স্লোগানের জনক। ১৯৬৫-র ভারত-পাক যুদ্ধে দেশকে নেতৃত্ব দেন।",
    emoji: "🌾",
    wikiUrl: "https://en.wikipedia.org/wiki/Lal_Bahadur_Shastri",
  },
  {
    id: "udham",
    nameBn: "শহীদ উধম সিং",
    nameEn: "Udham Singh",
    birthMD: "12-26", birthYear: 1899,
    role: "জালিয়ানওয়ালাবাগের প্রতিশোধ গ্রহণকারী",
    descBn: "২১ বছর পর লন্ডনে গিয়ে মাইকেল ও'ডায়ারকে গুলি করে জালিয়ানওয়ালাবাগ হত্যাকাণ্ডের প্রতিশোধ নেন।",
    emoji: "🎯",
    wikiUrl: "https://en.wikipedia.org/wiki/Udham_Singh",
  },
  {
    id: "ashfaq",
    nameBn: "আশফাকুল্লা খান",
    nameEn: "Ashfaqulla Khan",
    birthMD: "10-22", birthYear: 1900,
    deathYear: 1927,
    role: "বিপ্লবী, কাকোরি ষড়যন্ত্রে",
    descBn: "রাম প্রসাদ বিসমিলের অন্তরঙ্গ সহযোগী। কাকোরি ট্রেন ডাকাতির মামলায় ফাঁসি।",
    emoji: "🌙",
    wikiUrl: "https://en.wikipedia.org/wiki/Ashfaqulla_Khan",
  },
];

export interface Anniversary extends Omit<Festival, "wikiUrl"> {
  wikiUrl: string;
  person: FamousPerson;
  anniversaryType: "birth" | "death";
  yearsSince: number;
}

export function getAnniversariesForDate(date: Date): Anniversary[] {
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const md = `${mm}-${dd}`;
  const year = date.getUTCFullYear();

  const results: Anniversary[] = [];

  for (const p of FAMOUS_PEOPLE) {
    if (p.birthMD === md) {
      results.push({
        date: `${year}-${mm}-${dd}`,
        nameBn: `${p.nameBn} জন্মজয়ন্তী`,
        nameEn: `${p.nameEn} Birth Anniversary`,
        category: "national",
        icon: p.emoji,
        wikiUrl: p.wikiUrl,
        person: p,
        anniversaryType: "birth",
        yearsSince: year - p.birthYear,
      });
    }
    if (p.deathMD === md && p.deathYear) {
      results.push({
        date: `${year}-${mm}-${dd}`,
        nameBn: `${p.nameBn} — স্মরণ দিবস`,
        nameEn: `${p.nameEn} Remembrance Day`,
        category: "national",
        icon: "🕯️",
        wikiUrl: p.wikiUrl,
        person: p,
        anniversaryType: "death",
        yearsSince: year - p.deathYear,
      });
    }
  }

  return results;
}
