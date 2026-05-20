That syntax error happens because of how the arrays were combined right before the loops. Look closely at how the arrays are merged in your current file:

```typescript
const generatedPeople: FamousPerson[] = [...FAMOUS_PEOPLE];const generatedEvents: HistoricEvent[] = [...HISTORIC_EVENTS];const generatedDates: ImportantDate[] = [...IMPORTANT_DATES];const generatedFestivals: Festival[] = [...FESTIVALS];const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

```

Because those declarations are crammed onto a single line without explicit line breaks or semicolons, standard JavaScript/TypeScript Automatic Semicolon Insertion (ASI) fails to separate them cleanly.

Esbuild reads the squashed statements, loses track of where the initialization ends, and assumes `const months` or the subsequent loop setup is part of the same block, throwing `ERROR: Expected ";" but found "auto"`.

Here is the fully fixed, structurally clean version of your code. It keeps your exact dynamic logic intact but spreads out the statements correctly with clear formatting so Vite and esbuild can compile it flawlessly.

```typescript
export interface FamousPerson {
  id: string;
  nameBn: string;
  nameEn: string;
  birthMD: string;
  birthYear: number;
  deathMD?: string;
  deathYear?: number;
  role: string;
  descBn: string;
  emoji: string;
  wikiUrl: string;
  tags?: string[];
  category?: string;
  nationality?: string;
  birthPlace?: string;
  inFestivals?: boolean;
}

export interface HistoricEvent {
  id: string;
  dateMD: string;
  year: number;
  titleBn: string;
  titleEn: string;
  descBn: string;
  category: string;
  emoji: string;
  wikiUrl: string;
  tags?: string[];
}

export interface ImportantDate {
  id: string;
  dateMD: string;
  nameBn: string;
  nameEn: string;
  category: string;
  descBn: string;
  emoji: string;
  wikiUrl?: string;
}

export interface Festival {
  id: string;
  date?: string;
  recurringMD?: string;
  nameBn: string;
  nameEn: string;
  category: string;
  descBn: string;
  emoji: string;
  wikiUrl?: string;
}

export const FAMOUS_PEOPLE: FamousPerson[] = [
  {
    id: "rabindranath-tagore",
    nameBn: "রবীন্দ্রনাথ ঠাকুর",
    nameEn: "Rabindranath Tagore",
    birthMD: "05-07",
    birthYear: 1861,
    deathMD: "08-07",
    deathYear: 1941,
    role: "কবি, সাহিত্যিক ও দার্শনিক",
    descBn: "এশিয়ার প্রথম নোবেল বিজয়ী সাহিত্যিক যিনি গীতাঞ্জলি কাব্যের জন্য বিশ্বজোড়া খ্যাতি লাভ করেন এবং দুই দেশের জাতীয় সংগীত রচনা করেন।",
    emoji: "✍️",
    wikiUrl: "https://bn.wikipedia.org/wiki/রবীন্দ্রনাথ_ঠাকুর",
    tags: ["কবি", "নোবেল বিজয়ী", "রেনেসাঁ"],
    category: "bengali-poets",
    nationality: "Indian",
    birthPlace: "কলকাতা",
    inFestivals: true
  },
  {
    id: "kazi-nazrul-islam",
    nameBn: "কাজী নজরুল ইসলাম",
    nameEn: "Kazi Nazrul Islam",
    birthMD: "05-24",
    birthYear: 1899,
    deathMD: "08-29",
    deathYear: 1976,
    role: "বিদ্রোহী কবি",
    descBn: "বাংলাদেশের জাতীয় কবি যার অগ্নিময় কবিতা ও গান পরাধীনতার বিরুদ্ধে এবং শোষণের বিরুদ্ধে আপসহীন সংগ্রামের প্রেরণা জোগায়।",
    emoji: "🎸",
    wikiUrl: "https://bn.wikipedia.org/wiki/কাজী_নজরুল_ইসলাম",
    tags: ["কবি", "বিদ্রোহী", "সংগীতজ্ঞ"],
    category: "bengali-poets",
    nationality: "Bangladeshi",
    birthPlace: "চুরুলিয়া"
  },
  {
    id: "ishwar-chandra-vidyasagar",
    nameBn: "ঈশ্বরচন্দ্র বিদ্যাসাগর",
    nameEn: "Ishwar Chandra Vidyasagar",
    birthMD: "09-26",
    birthYear: 1820,
    deathMD: "07-29",
    deathYear: 1891,
    role: "সমাজ সংস্কারক ও শিক্ষাবিদ",
    descBn: "বাংলা গদ্যের জনক এবং বিধবা বিবাহ আইন পাসের প্রধান উদ্যোক্তা যিনি সমাজ সংস্কারে অসামান্য অবদান রাখেন।",
    emoji: "📚",
    wikiUrl: "https://bn.wikipedia.org/wiki/ঈশ্বরচন্দ্র_বিদ্যাসাগর",
    tags: ["সংস্কারক", "শিক্ষাবিদ", "রেনেসাঁ"],
    category: "bengali-philosophers",
    nationality: "Indian",
    birthPlace: "বীরসিংহ"
  },
  {
    id: "swami-vivekananda",
    nameBn: "স্বামী বিবেকানন্দ",
    nameEn: "Swami Vivekananda",
    birthMD: "01-12",
    birthYear: 1863,
    deathMD: "07-04",
    deathYear: 1902,
    role: "আধ্যাত্মিক গুরু ও সমাজ সংস্কারক",
    descBn: "রামকৃষ্ণ মিশনের প্রতিষ্ঠাতা এবং শিকাগো ধর্মসভায় সনাতন ধর্মের বিশ্বজনীন বাণী প্রচারকারী মহান দার্শনিক।",
    emoji: "🕉️",
    wikiUrl: "https://bn.wikipedia.org/wiki/স্বামী_বিবেকানন্দ",
    tags: ["সাধু", "দার্শনিক", "যুব আইকন"],
    category: "bengali-saints",
    nationality: "Indian",
    birthPlace: "কলকাতা"
  },
  {
    id: "jagadish-chandra-bose",
    nameBn: "জগদীশ চন্দ্র বসু",
    nameEn: "Jagadish Chandra Bose",
    birthMD: "11-30",
    birthYear: 1858,
    deathMD: "11-23",
    deathYear: 1937,
    role: "বিজ্ঞানী",
    descBn: "উদ্ভিদের প্রাণ আবিষ্কারক এবং বেতার তরঙ্গের অন্যতম পথপ্রদর্শক যিনি আধুনিক বিজ্ঞান গবেষণায় বাঙালিকে বিশ্বমঞ্চে তুলে ধরেন।",
    emoji: "🌱",
    wikiUrl: "https://bn.wikipedia.org/wiki/জগদীশ_চন্দ্র_বসু",
    tags: ["বিজ্ঞানী", "পদার্থবিদ", "উদ্ভিদবিদ"],
    category: "bengali-scientists",
    nationality: "Indian",
    birthPlace: "ময়মনসিংহ"
  },
  {
    id: "satyajit-ray",
    nameBn: "সত্যজিৎ রায়",
    nameEn: "Satyajit Ray",
    birthMD: "05-02",
    birthYear: 1921,
    deathMD: "04-23",
    deathYear: 1992,
    role: "চলচ্চিত্র পরিচালক ও সাহিত্যিক",
    descBn: "অস্কার বিজয়ী চলচ্চিত্র নির্মাতা যিনি পথের পাঁচালী ছবির মাধ্যমে বাংলা সিনেমাকে আন্তর্জাতিক স্তরে সুপ্রতিষ্ঠিত করেন।",
    emoji: "🎬",
    wikiUrl: "https://bn.wikipedia.org/wiki/সত্যজিৎ_রায়",
    tags: ["চলচ্চিত্র", "অস্কার", "লেখক"],
    category: "bengali-film-legends",
    nationality: "Indian",
    birthPlace: "কলকাতা"
  },
  {
    id: "subhas-chandra-bose",
    nameBn: "নেতাজি সুভাষচন্দ্র বসু",
    nameEn: "Subhas Chandra Bose",
    birthMD: "01-23",
    birthYear: 1897,
    deathMD: "08-18",
    deathYear: 1945,
    role: "স্বাধীনতা সংগ্রামী",
    descBn: "আজাদ হিন্দ ফৌজের অধিনায়ক যিনি 'তোমরা আমাকে রক্ত দাও, আমি তোমাদের স্বাধীনতা দেব' স্লোগানে কাঁপিয়েছিলেন ব্রিটিশ রাজ।",
    emoji: "🎖️",
    wikiUrl: "https://bn.wikipedia.org/wiki/সুভাষচন্দ্র_বসু",
    tags: ["বিপ্লবী", "স্বাধীনতা সংগ্রামী", "নেতাজি"],
    category: "bengali-revolutionaries",
    nationality: "Indian",
    birthPlace: "কটক"
  },
  {
    id: "satyendra-nath-bose",
    nameBn: "সত্যেন্দ্রনাথ বসু",
    nameEn: "Satyendra Nath Bose",
    birthMD: "01-01",
    birthYear: 1894,
    deathMD: "02-04",
    deathYear: 1974,
    role: "তাত্ত্বিক পদার্থবিজ্ঞানী",
    descBn: "বোস-আইনস্টাইন পরিসংখ্যানের জন্য বিখ্যাত পদার্থবিদ, যাঁর নামানুসারে পরমাণুর মৌলিক কণা 'বোসন' এর নামকরণ করা হয়েছে।",
    emoji: "⚛️",
    wikiUrl: "https://bn.wikipedia.org/wiki/সত্যেন্দ্রনাথ_বসু",
    tags: ["বিজ্ঞানী", "পদার্থবিদ", "বোসন"],
    category: "bengali-scientists",
    nationality: "Indian",
    birthPlace: "কলকাতা"
  },
  {
    id: "amartya-sen",
    nameBn: "অমর্ত্য সেন",
    nameEn: "Amartya Sen",
    birthMD: "11-03",
    birthYear: 1933,
    role: "অর্থনীতিবিদ",
    descBn: "কল্যাণমুখী অর্থনীতি এবং দুর্ভিক্ষ নিয়ে গবেষণার জন্য ১৯৯৮ সালে অর্থনীতিতে নোবেল স্মারক পুরস্কার লাভ করেন।",
    emoji: "📊",
    wikiUrl: "https://bn.wikipedia.org/wiki/অমর্ত্য_সেন",
    tags: ["অর্থনীতিবিদ", "নোবেল বিজয়ী"],
    category: "indian-nobel-winners",
    nationality: "Indian",
    birthPlace: "শান্তিনিকেতন"
  },
  {
    id: "lalon-shah",
    nameBn: "লালন শাহ",
    nameEn: "Lalon Shah",
    birthMD: "10-14",
    birthYear: 1774,
    deathMD: "10-17",
    deathYear: 1890,
    role: "বাউল সাধক ও সমাজ সংস্কারক",
    descBn: "অসাম্প্রদায়িক মানবতাবাদী বাউল গানের প্রধান পুরুষ যিনি জাতপ্রথার ঊর্ধ্বে উঠে মানুষের জয়গান গেয়েছেন।",
    emoji: "🪕",
    wikiUrl: "https://bn.wikipedia.org/wiki/লালন",
    tags: ["সাধু", "সংগীতজ্ঞ", "বাউল"],
    category: "bengali-saints",
    nationality: "Bangladeshi",
    birthPlace: "ঝিনাইদহ"
  },
  {
    id: "sri-aurobindo",
    nameBn: "শ্রী অরবিন্দ",
    nameEn: "Sri Aurobindo",
    birthMD: "08-15",
    birthYear: 1872,
    deathMD: "12-05",
    deathYear: 1950,
    role: "যোগী, দার্শনিক ও বিপ্লবী",
    descBn: "জাতীয়তাবাদী আন্দোলনের প্রারম্ভিক নেতা যিনি পরবর্তীকালে আধ্যাত্মিক সাধনায় নিমগ্ন হয়ে পণ্ডিচেরিতে আশ্রম গড়ে তোলেন।",
    emoji: "🧘",
    wikiUrl: "https://bn.wikipedia.org/wiki/শ্রী_অরবিন্দ",
    tags: ["দার্শনিক", "বিপ্লবী", "সাধু"],
    category: "bengali-philosophers",
    nationality: "Indian",
    birthPlace: "কলকাতা"
  },
  {
    id: "ram-mohan-roy",
    nameBn: "রাজা রামমোহন রায়",
    nameEn: "Raja Ram Mohan Roy",
    birthMD: "05-22",
    birthYear: 1772,
    deathMD: "09-27",
    deathYear: 1833,
    role: "সমাজ সংস্কারক",
    descBn: "ব্রাহ্মসমাজের প্রতিষ্ঠাতা এবং সতীদাহ প্রথা উচ্ছেদের প্রধান কারিগর, যাঁকে আধুনিক ভারতের জনক বলা হয়।",
    emoji: "🔥",
    wikiUrl: "https://bn.wikipedia.org/wiki/রামমোহন_রায়",
    tags: ["সংস্কারক", "রেনেসাঁ"],
    category: "bengali-philosophers",
    nationality: "Indian",
    birthPlace: "রাধানগর"
  },
  {
    id: "mahatma-gandhi",
    nameBn: "মহাত্মা গান্ধী",
    nameEn: "Mahatma Gandhi",
    birthMD: "10-02",
    birthYear: 1869,
    deathMD: "01-30",
    deathYear: 1948,
    role: "জাতির জনক (ভারত)",
    descBn: "অহিংস ও সত্যাগ্রহ আন্দোলনের মাধ্যমে ভারতকে ব্রিটিশ শাসন থেকে মুক্ত করার প্রধান জননেতা ও অহিংসার প্রতীক।",
    emoji: "👓",
    wikiUrl: "https://bn.wikipedia.org/wiki/মহাত্মা_গান্ধী",
    tags: ["কোণ স্বাধীনতা সংগ্রামী", "নেতা", "অহিংসা"],
    category: "indian-political-leaders",
    nationality: "Indian",
    birthPlace: "পোরবন্দর"
  },
  {
    id: "jawaharlal-nehru",
    nameBn: "জওহরলাল নেহেরু",
    nameEn: "Jawaharlal Nehru",
    birthMD: "11-14",
    birthYear: 1889,
    deathMD: "05-27",
    deathYear: 1964,
    role: "প্রথম প্রধানমন্ত্রী (ভারত)",
    descBn: "স্বাধীন ভারতের প্রথম প্রধানমন্ত্রী ও আধুনিক ভারতের রূপকার যিনি শিশুদের কাছে চাচা নেহেরু নামে পরিচিত ছিলেন।",
    emoji: "🌹",
    wikiUrl: "https://bn.wikipedia.org/wiki/জওহরলাল_নেহেরু",
    tags: ["প্রধানমন্ত্রী", "নেতা", "স্বাধীন ভারত"],
    category: "indian-political-leaders",
    nationality: "Indian",
    birthPlace: "এলাহাবাদ"
  },
  {
    id: "b-r-ambedkar",
    nameBn: "বি আর আম্বেদকর",
    nameEn: "B. R. Ambedkar",
    birthMD: "04-14",
    birthYear: 1891,
    deathMD: "12-06",
    deathYear: 1956,
    role: "সংবিধান প্রণেতা ও সমাজ সংস্কারক",
    descBn: "ভারতীয় সংবিধানের প্রধান স্থপতি এবং দলিত ও অনগ্রসর শ্রেণীর অধিকার আদায়ের আন্দোলনের অবিসংবাদিত নেতা।",
    emoji: "⚖️",
    wikiUrl: "https://bn.wikipedia.org/wiki/ভীমরাও_রামজি_আম্বেদকর",
    tags: ["সংবিধান", "সংস্কারক", "আইনজীবী"],
    category: "indian-social-reformers",
    nationality: "Indian",
    birthPlace: "মহু"
  },
  {
    id: "c-v-raman",
    nameBn: "সি ভি রমন",
    nameEn: "C. V. Raman",
    birthMD: "11-07",
    birthYear: 1888,
    deathMD: "11-21",
    deathYear: 1970,
    role: "পদার্থবিজ্ঞানী",
    descBn: "আলোক বিচ্ছুরণ সংক্রান্ত 'রমন এফেক্ট' আবিষ্কারের জন্য ১৯৩০ সালে এশিয়ার প্রথম বিজ্ঞানী হিসেবে পদার্থবিদ্যায় নোবেল পান।",
    emoji: "🔬",
    wikiUrl: "https://bn.wikipedia.org/wiki/চন্দ্রশেখর_ভেঙ্কট_রামন",
    tags: ["বিজ্ঞানী", "নোবেল বিজয়ী", "পদার্থবিদ"],
    category: "indian-nobel-winners",
    nationality: "Indian",
    birthPlace: "তিরুচিরাপল্লী"
  },
  {
    id: "mother-teresa",
    nameBn: "মাদার তেরেসা",
    nameEn: "Mother Teresa",
    birthMD: "08-26",
    birthYear: 1910,
    deathMD: "09-05",
    deathYear: 1997,
    role: "মানবিক সাধিকা",
    descBn: "কলকাতার 'মিশনারিজ অব চ্যারিটি'র প্রতিষ্ঠাতা যিনি আজীবন আর্ত ও মুমূর্ষু মানুষের সেবায় আত্মনিয়োগ করে নোবেল শান্তি পুরস্কার লাভ করেন।",
    emoji: "🕊️",
    wikiUrl: "https://bn.wikipedia.org/wiki/মাদার_তেরেসা",
    tags: ["সাধু", "শান্তি নোবেল", "মানবসেবা"],
    category: "indian-nobel-winners",
    nationality: "Indian",
    birthPlace: "স্কোপিয়ে"
  },
  {
    id: "apj-abdul-kalam",
    nameBn: "এ পি জে আব্দুল কালাম",
    nameEn: "A. P. J. Abdul Kalam",
    birthMD: "10-15",
    birthYear: 1931,
    deathMD: "07-27",
    deathYear: 2015,
    role: "বিজ্ঞানী ও রাষ্ট্রপতি",
    descBn: "ভারতের 'মিসাইল ম্যান' খ্যাত মহাকাশ বিজ্ঞানী এবং ভারতের একাদশ জনপ্রিয় দূরদর্শী রাষ্ট্রপতি যিনি তরুণদের অন্যতম প্রেরণা।",
    emoji: "🚀",
    wikiUrl: "https://bn.wikipedia.org/wiki/এ_পি_জে_আব্দুল_কালাম",
    tags: ["বিজ্ঞানী", "রাষ্ট্রপতি", "মিসাইল ম্যান"],
    category: "indian-scientists",
    nationality: "Indian",
    birthPlace: "রামেশ্বরম"
  },
  {
    id: "albert-einstein",
    nameBn: "আলবার্ট আইনস্টাইন",
    nameEn: "Albert Einstein",
    birthMD: "03-14",
    birthYear: 1879,
    deathMD: "04-18",
    deathYear: 1955,
    role: "তাত্ত্বিক পদার্থবিজ্ঞানী",
    descBn: "আপেক্ষিকতার তত্ত্বের প্রবক্তা এবং আধুনিক পদার্থবিজ্ঞানের জনক যিনি ভর-শক্তি সমীকরণ ই-ইকুয়াল-টু-এমসি-স্কয়ার আবিষ্কার করেন।",
    emoji: "🧠",
    wikiUrl: "https://bn.wikipedia.org/wiki/আলবার্ট_আইনস্টাইন",
    tags: ["বিজ্ঞানী", "পদার্থবিদ", "নোবেল বিজয়ী"],
    category: "international-scientists",
    nationality: "German",
    birthPlace: "উলম"
  },
  {
    id: "isaac-newton",
    nameBn: "আইজ্যাক নিউটন",
    nameEn: "Isaac Newton",
    birthMD: "01-04",
    birthYear: 1643,
    deathMD: "03-31",
    deathYear: 1727,
    role: "গণিতবিদ ও পদার্থবিদ",
    descBn: "মহাকর্ষ সূত্র এবং গতির তিনটি বিখ্যাত সূত্রের আবিষ্কারক যা ধ্রুপদী বলবিদ্যার ভিত্তি স্থাপন করেছিল।",
    emoji: "🍎",
    wikiUrl: "https://bn.wikipedia.org/wiki/আইজ্যাক_নিউটন",
    tags: ["বিজ্ঞানী", "গণিতবিদ", "মহাকর্ষ"],
    category: "historic-inventors",
    nationality: "British",
    birthPlace: "উলসথর্প"
  },
  {
    id: "srinivasa-ramanujan",
    nameBn: "শ্রীনিবাস রামানুজন",
    nameEn: "Srinivasa Ramanujan",
    birthMD: "12-22",
    birthYear: 1887,
    deathMD: "04-26",
    deathYear: 1920,
    role: "গণিতবিদ",
    descBn: "কোনো প্রথাগত শিক্ষা ছাড়াই গাণিতিক বিশ্লেষণ, সংখ্যাতত্ত্ব এবং অসীম ধারায় অবিশ্বাস্য অবদান রাখা ভারতের প্রবাদপ্রতিম গণিত প্রতিভা।",
    emoji: "🔢",
    wikiUrl: "https://bn.wikipedia.org/wiki/শ্রীনিবাস_রামানুজন",
    tags: ["গণিতবিদ", "প্রতিভা"],
    category: "indian-scientists",
    nationality: "Indian",
    birthPlace: "ইরোড"
  },
  {
    id: "sarojini-naidu",
    nameBn: "সরোজিনী নাইডু",
    nameEn: "Sarojini Naidu",
    birthMD: "02-13",
    birthYear: 1879,
    deathMD: "03-02",
    deathYear: 1949,
    role: "কবি ও স্বাধীনতা সংগ্রামী",
    descBn: "ভারতের নাইটিঙ্গেল নামে পরিচিত কবি এবং স্বাধীন ভারতের প্রথম নারী রাজ্যপাল যিনি নারী জাগরণে অগ্রণী ভূমিকা নেন।",
    emoji: "🪶",
    wikiUrl: "https://bn.wikipedia.org/wiki/সরোজিনী_নাইডু",
    tags: ["কবি", "স্বাধীনতা সংগ্রামী", "নারী নেত্রী"],
    category: "indian-poets",
    nationality: "Indian",
    birthPlace: "হায়দরাবাদ"
  },
  {
    id: "begum-rokeya",
    nameBn: "বেগম রোকেয়া",
    nameEn: "Begum Rokeya",
    birthMD: "12-09",
    birthYear: 1880,
    deathMD: "12-09",
    deathYear: 1932,
    role: "নারী জাগরণের অগ্রদূত",
    descBn: "অবিভক্ত বাংলায় মুসলিম নারী শিক্ষার প্রসার ও নারী অধিকার প্রতিষ্ঠার জন্য আজীবন লড়াই করা এক কালজয়ী সমাজ সংস্কারক।",
    emoji: "✍️",
    wikiUrl: "https://bn.wikipedia.org/wiki/রোকেয়া_সাখাওয়াত_হোসেন",
    tags: ["নারী অধিকার", "শিক্ষাবিদ", "লেখক"],
    category: "bengali-philosophers",
    nationality: "Bangladeshi",
    birthPlace: "রংপুর"
  },
  {
    id: "satyajit-ray-music",
    nameBn: "সত্যজিৎ রায় (সংগীতকার)",
    nameEn: "Satyajit Ray (Composer)",
    birthMD: "05-02",
    birthYear: 1921,
    deathMD: "04-23",
    deathYear: 1992,
    role: "সুরকার ও আবহসংগীত শিল্পী",
    descBn: "নিজের ছবির অসাধারণ আবহসংগীত ও গান সৃষ্টির মাধ্যমে সিনেমার দৃশ্যকাব্যকে এক অন্য মাত্রায় নিয়ে যাওয়া বহুমুখী প্রতিভা।",
    emoji: "🎹",
    wikiUrl: "https://bn.wikipedia.org/wiki/সত্যজিৎ_রায়",
    tags: ["সংগীত", "চলচ্চিত্র", "সুরকার"],
    category: "bengali-musicians",
    nationality: "Indian",
    birthPlace: "কলকাতা"
  },
  {
    id: "chittaranjan-das",
    nameBn: "চিত্তরঞ্জন দাশ",
    nameEn: "Chittaranjan Das",
    birthMD: "11-05",
    birthYear: 1870,
    deathMD: "06-16",
    deathYear: 1925,
    role: "দেশবন্ধু ও রাজনীতিবিদ",
    descBn: "স্বরাজ দলের প্রতিষ্ঠাতা এবং বিশিষ্ট আইনজীবী যিনি স্বাধীনতা আন্দোলনে সর্বস্ব ত্যাগ করায় দেশবন্ধু উপাধিতে ভূষিত হন।",
    emoji: "🏛️",
    wikiUrl: "https://bn.wikipedia.org/wiki/চিত্তরঞ্জন_দাশ",
    tags: ["নেতা", "স্বাধীনতা সংগ্রামী"],
    category: "bengali-freedom-fighters",
    nationality: "Indian",
    birthPlace: "কলকাতা"
  },
  {
    id: "surya-sen",
    nameBn: "সূর্য সেন (মাস্টারদা)",
    nameEn: "Surya Sen",
    birthMD: "03-22",
    birthYear: 1894,
    deathMD: "01-12",
    deathYear: 1934,
    role: "বিপ্লবী নেতা",
    descBn: "চট্টগ্রাম অস্ত্রাগার লুণ্ঠনের প্রধান নায়ক এবং ব্রিটিশ বিরোধী সশস্ত্র আন্দোলনের প্রবাদপ্রতিম শিক্ষক ও বিপ্লবী নেতা।",
    emoji: "⚔️",
    wikiUrl: "https://bn.wikipedia.org/wiki/সূর্য_সেন",
    tags: ["বিপ্লবী", "ফাঁসি", "চট্টগ্রাম"],
    category: "bengali-revolutionaries",
    nationality: "Indian",
    birthPlace: "চট্টগ্রাম"
  },
  {
    id: "pritilata-waddedar",
    nameBn: "প্রীতিলতা ওয়াদ্দেদার",
    nameEn: "Pritilata Waddedar",
    birthMD: "05-05",
    birthYear: 1911,
    deathMD: "09-23",
    deathYear: 1932,
    role: "অগ্নিযুগের নারী বিপ্লবী",
    descBn: "মাস্টারদা সূর্য সেনের শিষ্যা যিনি পাহাড়তলী ইউরোপীয় ক্লাব আক্রমণে নেতৃত্ব দিয়ে দেশের জন্য আত্মাহুতি দেন।",
    emoji: "🔥",
    wikiUrl: "https://bn.wikipedia.org/wiki/প্রীতিলতা_ওয়াদ্দেদার",
    tags: ["বিপ্লবী", "শহীদ", "নারী নেত্রী"],
    category: "bengali-freedom-fighters",
    nationality: "Indian",
    birthPlace: "চট্টগ্রাম"
  },
  {
    id: "khudiram-bose",
    nameBn: "ক্ষুদিরাম বসু",
    nameEn: "Khudiram Bose",
    birthMD: "12-03",
    birthYear: 1889,
    deathMD: "08-11",
    deathYear: 1908,
    role: "কনিষ্ঠ বিপ্লবী শহীদ",
    descBn: "মাত্র ১৮ বছর বয়সে দেশের স্বাধীনতার জন্য হাসিমুখে ফাঁসির দড়ি গলায় পরা বাংলার অন্যতম জনপ্রিয় নির্ভীক বিপ্লবী।",
    emoji: "⚖️",
    wikiUrl: "https://bn.wikipedia.org/wiki/ক্ষুদিরাম_বসু",
    tags: ["বিপ্লবী", "শহীদ", "ফাঁসি"],
    category: "bengali-revolutionaries",
    nationality: "Indian",
    birthPlace: "মেদিনীপুর"
  },
  {
    id: "subramanyan-chandrasekhar",
    nameBn: "সুব্রহ্মণ্যন চন্দ্রশেখর",
    nameEn: "Subrahmanyan Chandrasekhar",
    birthMD: "10-19",
    birthYear: 1910,
    deathMD: "08-21",
    deathYear: 1995,
    role: "জ্যোতির্বিজ্ঞানী",
    descBn: "নক্ষত্রের বিবর্তন ও ব্ল্যাকহোল সংক্রান্ত 'চন্দ্রশেখর সীমা' আবিষ্কারের জন্য ১৯৮৩ সালে পদার্থবিদ্যায় নোবেল পান।",
    emoji: "🌌",
    wikiUrl: "https://bn.wikipedia.org/wiki/সুব্রহ্মণ্যন_চন্দ্রশেখর",
    tags: ["বিজ্ঞানী", "নোবেল বিজয়ী", "মহাকাশ"],
    category: "indian-nobel-winners",
    nationality: "American",
    birthPlace: "লাহোর"
  },
  {
    id: "har-gobind-khorana",
    nameBn: "হর গোবিন্দ খোরানা",
    nameEn: "Har Gobind Khorana",
    birthMD: "01-09",
    birthYear: 1922,
    deathMD: "11-09",
    deathYear: 2011,
    role: "প্রাণরসায়নবিদ",
    descBn: "জেনেটিক কোড ব্যাখ্যা এবং প্রোটিন সংশ্লেষণে এর ভূমিকা আবিষ্কারের জন্য ১৯৬৮ সালে চিকিৎসাবিজ্ঞানে নোবেল লাভ করেন।",
    emoji: "🧬",
    wikiUrl: "https://bn.wikipedia.org/wiki/হর_গোবিন্দ_খোরানা",
    tags: ["বিজ্ঞানী", "নোবেল বিজয়ী", "ডিএনএ"],
    category: "indian-nobel-winners",
    nationality: "American",
    birthPlace: "রায়পুর"
  },
  {
    id: "venkatraman-ramakrishnan",
    nameBn: "ভেঙ্কটরামন রামকৃষ্ণন",
    nameEn: "Venkatraman Ramakrishnan",
    birthMD: "04-01",
    birthYear: 1952,
    role: "কাঠামোগত জীববিজ্ঞানী",
    descBn: "রাইবোসোমের গঠন ও কার্যকারিতা মানচিত্রায়নের অনন্য কৃতিত্বের জন্য ২০০৯ সালে রসায়নে নোবেল পুরস্কার অর্জন করেন।",
    emoji: "🧪",
    wikiUrl: "https://bn.wikipedia.org/wiki/ভেঙ্কটরামন_রামকৃষ্ণন",
    tags: ["বিজ্ঞানী", "নোবেল বিজয়ী", "রসায়ন"],
    category: "indian-nobel-winners",
    nationality: "British-American",
    birthPlace: "চিদম্বরম"
  },
  {
    id: "kailash-satyarthi",
    nameBn: "কৈলাশ সত্যার্থী",
    nameEn: "Kailash Satyarthi",
    birthMD: "01-11",
    birthYear: 1954,
    role: "নিপীড়িত শিশু অধিকার কর্মী",
    descBn: "'বচপন বাঁচাও আন্দোলন' এর মাধ্যমে হাজার হাজার শিশুকে দাসত্ব থেকে মুক্ত করার জন্য ২০১৪ সালে শান্তিতে নোবেল পান।",
    emoji: "🧸",
    wikiUrl: "https://bn.wikipedia.org/wiki/কৈলাশ_সত্যার্থী",
    tags: ["কর্মী", "শান্তি নোবেল", "শিশু অধিকার"],
    category: "indian-nobel-winners",
    nationality: "Indian",
    birthPlace: "বিদিশা"
  },
  {
    id: "abhijit-banerjee",
    nameBn: "অভিজিৎ ব্যানার্জি",
    nameEn: "Abhijit Banerjee",
    birthMD: "02-21",
    birthYear: 1961,
    role: "অর্থনীতিবিদ",
    descBn: "বিশ্বব্যাপী দারিদ্র্য বিমোচনে পরীক্ষামূলক পদ্ধতির জন্য ২০১৯ সালে যৌথভাবে অর্থনীতিতে নোবেল পুরস্কার পান।",
    emoji: "📈",
    wikiUrl: "https://bn.wikipedia.org/wiki/অভিজিৎ_ব্যানার্জী",
    tags: ["অর্থনীতিবিদ", "নোবেল বিজয়ী", "দারিদ্র্য"],
    category: "indian-nobel-winners",
    nationality: "American",
    birthPlace: "মুম্বাই"
  },
  {
    id: "michael-madhusudan-dutt",
    nameBn: "মাইকেল মধুসূদন দত্ত",
    nameEn: "Michael Madhusudan Dutt",
    birthMD: "01-25",
    birthYear: 1824,
    deathMD: "06-29",
    deathYear: 1873,
    role: "মহাকবি ও নাট্যকার",
    descBn: "বাংলা সাহিত্যে অমিত্রাক্ষর ছন্দের প্রবর্তক এবং কালজয়ী 'মেঘনাদবধ কাব্য' এর রচয়িতা মহাকবি।",
    emoji: "✒️",
    wikiUrl: "https://bn.wikipedia.org/wiki/মাইকেল_مധুসূদন_দত্ত",
    tags: ["কবি", "নাট্যকার", "অমিত্রাক্ষর"],
    category: "bengali-poets",
    nationality: "Indian",
    birthPlace: "যশোর"
  },
  {
    id: "bankim-chandra-chatterjee",
    nameBn: "বঙ্কিমচন্দ্র চট্টোপাধ্যায়",
    nameEn: "Bankim Chandra Chatterjee",
    birthMD: "06-27",
    birthYear: 1838,
    deathMD: "04-08",
    deathYear: 1894,
    role: "উপন্যাসিক ও সাহিত্যিক",
    descBn: "ভারতের জাতীয় স্তোত্র 'বন্দে মাতরম' এর রচয়িতা এবং বাংলা উপন্যাসের আদি দিকপাল ও সাহিত্য সম্রাট।",
    emoji: "📖",
    wikiUrl: "https://bn.wikipedia.org/wiki/বঙ্কিমচন্দ্র_চট্টোপাধ্যায়",
    tags: ["লেখক", "বন্দে মাতরম", "সাহিত্য সম্রাট"],
    category: "bengali-writers",
    nationality: "Indian",
    birthPlace: "নৈহাটি"
  },
  {
    id: "sarat-chandra-chattopadhyay",
    nameBn: "শরৎচন্দ্র চট্টোপাধ্যায়",
    nameEn: "Sarat Chandra Chattopadhyay",
    birthMD: "09-15",
    birthYear: 1876,
    deathMD: "01-16",
    deathYear: 1938,
    role: "কথাসاحিত্যিক",
    descBn: "দেবদাস, শ্রীকান্তের মতো জনপ্রিয় কালজয়ী উপন্যাসের স্রষ্টা যিনি সাধারণ মানুষের আবেগ নিখুঁতভাবে ফুটিয়ে তুলেছেন।",
    emoji: "🖋️",
    wikiUrl: "https://bn.wikipedia.org/wiki/শরৎচন্দ্র_চট্টোপাধ্যায়",
    tags: ["লেখক", "কথাসাহিত্যিক", "জনপ্রিয়"],
    category: "bengali-writers",
    nationality: "Indian",
    birthPlace: "দেবানন্দপুর"
  },
  {
    id: "tarasankar-bandyopadhyay",
    nameBn: "তারাশঙ্কর বন্দ্যোপাধ্যায়",
    nameEn: "Tarasankar Bandyopadhyay",
    birthMD: "07-23",
    birthYear: 1898,
    deathMD: "09-14",
    deathYear: 1971,
    role: "কথাসাহিত্যিক",
    descBn: "রাঢ় অঞ্চলের গণজীবন, সংস্কৃতি ও সামন্ততন্ত্রের ভাঙাগড়ার নিখুঁত রূপকার যিনি জ্ঞানপীঠ পুরস্কার লাভ করেন।",
    emoji: "📜",
    wikiUrl: "https://bn.wikipedia.org/wiki/তারাশঙ্কর_বন্দ্যোপাধ্যায়",
    tags: ["লেখক", "জ্ঞানপীঠ"],
    category: "bengali-writers",
    nationality: "Indian",
    birthPlace: "লাভপুর"
  },
  {
    id: "bibhutibhushan-bandyopadhyay",
    nameBn: "বিভূতিভূষণ বন্দ্যোপাধ্যায়",
    nameEn: "Bibhutibhushan Bandyopadhyay",
    birthMD: "09-12",
    birthYear: 1894,
    deathMD: "11-01",
    deathYear: 1950,
    role: "কথাসাহিত্যিক",
    descBn: "প্রকৃতিপ্রেমী লেখক যাঁর অমর সৃষ্টি 'পথের পাঁচালী' ও 'আরণ্যক' বাংলা সাহিত্যের চিরন্তন অমূল্য সম্পদ।",
    emoji: "🌳",
    wikiUrl: "https://bn.wikipedia.org/wiki/বিভূতিভূষণ_বন্দ্যোপাধ্যায়",
    tags: ["লেখক", "পথের পাঁচালী", "প্রকৃতি"],
    category: "bengali-writers",
    nationality: "Indian",
    birthPlace: "কল্যাণী"
  },
  {
    id: "manik-bandyopadhyay",
    nameBn: "মানিক বন্দ্যোপাধ্যায়",
    nameEn: "Manik Bandyopadhyay",
    birthMD: "05-19",
    birthYear: 1908,
    deathMD: "12-03",
    deathYear: 1956,
    role: "কথাসাহিত্যিক",
    descBn: "'পদ্মানদীর মাঝি' ও 'পুতুলনাচের ইতিকথা'র রচয়িতা যিনি মানুষের অবচেতন মন ও বাস্তব শ্রেণীসংগ্রাম ফুটিয়ে তোলেন।",
    emoji: "🛶",
    wikiUrl: "https://bn.wikipedia.org/wiki/মানিক_বন্দ্যোপাধ্যায়",
    tags: ["লেখক", "বাস্তববাদ"],
    category: "bengali-writers",
    nationality: "Indian",
    birthPlace: "দুমকা"
  },
  {
    id: "jibananda-das",
    nameBn: "জীবনানন্দ দাশ",
    nameEn: "Jibanananda Das",
    birthMD: "02-17",
    birthYear: 1899,
    deathMD: "10-22",
    deathYear: 1954,
    role: "রূপসী বাংলার কবি",
    descBn: "বিশ শতকের শুদ্ধতম রোমান্টিক ও আধুনিক কবি যাঁর বনলতা সেন এবং রূপসী বাংলা কবিতা পাঠককে মুগ্ধ করে।",
    emoji: "🦉",
    wikiUrl: "https://bn.wikipedia.org/wiki/জীবনানন্দ_দাশ",
    tags: ["কবি", "রূপসী বাংলা", "আধুনিক"],
    category: "bengali-poets",
    nationality: "Indian",
    birthPlace: "বরিশাল"
  },
  {
    id: "sukanta-bhattacharya",
    nameBn: "সুকান্ত ভট্টাচার্য",
    nameEn: "Sukanta Bhattacharya",
    birthMD: "08-15",
    birthYear: 1926,
    deathMD: "05-13",
    deathYear: 1947,
    role: "কিশোর কবি",
    descBn: "অল্প বয়сей সাম্যবাদী চেতনাদীপ্ত ও বিপ্লবী কবিতা লিখে বাংলা সাহিত্যে স্থায়ী আসন করে নেওয়া প্রতিবাদী কবি।",
    emoji: "🔥",
    wikiUrl: "https://bn.wikipedia.org/wiki/সুকান্ত_ভট্টাচার্য",
    tags: ["কবি", "কিশোর কবি", "সাম্যবাদী"],
    category: "bengali-poets",
    nationality: "Indian",
    birthPlace: "কলকাতা"
  },
  {
    id: "subhash-mukhopadhyay",
    nameBn: "সুভাষ মুখোপাধ্যায়",
    nameEn: "Subhash Mukhopadhyay",
    birthMD: "02-12",
    birthYear: 1919,
    deathMD: "07-08",
    deathYear: 2003,
    role: "পদাতিক কবি",
    descBn: "শ্রমজীবী মানুষের অধিকার ও গণআন্দোলনের প্রথম সারির কবি যিনি 'পদাতিক' কাব্যের জন্য চিরস্মরণীয়।",
    emoji: "🚩",
    wikiUrl: "https://bn.wikipedia.org/wiki/সুভাষ_মুখোপাধ্যায়_(কবি)",
    tags: ["কবি", "জ্ঞানপীঠ"],
    category: "bengali-poets",
    nationality: "Indian",
    birthPlace: "কৃষ্ণনগর"
  },
  {
    id: "ravi-shankar",
    nameBn: "পণ্ডিত রবিশঙ্কর",
    nameEn: "Ravi Shankar",
    birthMD: "04-07",
    birthYear: 1920,
    deathMD: "12-11",
    deathYear: 2012,
    role: "সেতার বাদক ও সুরকার",
    descBn: "বিশ্বখ্যাত সেতার মায়েস্ত্রো এবং ভারতরত্ন বিজয়ী যিনি ভারতীয় শাস্ত্রীয় সংগীতকে বিশ্বদরবারে জনপ্রিয় করেন।",
    emoji: "🎸",
    wikiUrl: "https://bn.wikipedia.org/wiki/রবি_শংকর",
    tags: ["সেতার", "ভারতরত্ন", "সংগীতজ্ঞ"],
    category: "bengali-musicians",
    nationality: "Indian",
    birthPlace: "বারাণসী"
  },
  {
    id: "ali-akbar-khan",
    nameBn: "উস্তাদ আলী আকবর খাঁ",
    nameEn: "Ali Akbar Khan",
    birthMD: "04-14",
    birthYear: 1922,
    deathMD: "06-18",
    deathYear: 2009,
    role: "সরোদ বাদক",
    descBn: "মাইহার ঘরানার বিখ্যাত সরোদ বাদক যিনি আন্তর্জাতিক মঞ্চে শাস্ত্রীয় বাদ্যযন্ত্রের মূর্ছনা ছড়িয়ে দিয়েছিলেন।",
    emoji: "🪕",
    wikiUrl: "https://bn.wikipedia.org/wiki/আলী_আকবর_খাঁ",
    tags: ["সরোদ", "শাস্ত্রীয় সংগীত"],
    category: "bengali-musicians",
    nationality: "Indian",
    birthPlace: "ব্রাহ্মণবাড়িয়া"
  },
  {
    id: "hemanta-mukherjee",
    nameBn: "হেমন্ত মুখোপাধ্যায়",
    nameEn: "Hemanta Mukherjee",
    birthMD: "06-16",
    birthYear: 1920,
    deathMD: "09-26",
    deathYear: 1989,
    role: "গায়ক ও সুরকার",
    descBn: "বাংলা চলচ্চিত্রের সোনালী যুগের কিংবদন্তি গায়ক ও সুরকার যাঁর ভরাট কণ্ঠের গান আজও বাঙালির হৃদয়ে ভাস্বর।",
    emoji: "🎤",
    wikiUrl: "https://bn.wikipedia.org/wiki/হেমন্ত_মুখোপাধ্যায়",
    tags: ["গায়ক", "সোনালী যুগ", "সুরকার"],
    category: "bengali-musicians",
    nationality: "Indian",
    birthPlace: "বারাণসী"
  },
  {
    id: "manna-dey",
    nameBn: "মান্না দে",
    nameEn: "Manna Dey",
    birthMD: "05-01",
    birthYear: 1919,
    deathMD: "10-24",
    deathYear: 2013,
    role: "নেপথ্য গায়ক",
    descBn: "শাস্ত্রীয় ও আধুনিক গানের কিংবদন্তি প্লেব্যাক গায়ক যিনি হিন্দি ও বাংলা চলচ্চিত্রে হাজার হাজার কালজয়ী গান গেয়েছেন।",
    emoji: "🎵",
    wikiUrl: "https://bn.wikipedia.org/wiki/মান্না_দে",
    tags: ["গায়ক", "দাদাসাহেব ফালকে"],
    category: "bengali-musicians",
    nationality: "Indian",
    birthPlace: "কলকাতা"
  },
  {
    id: "kishore-kumar",
    nameBn: "কিশোর কুমার",
    nameEn: "Kishore Kumar",
    birthMD: "08-04",
    birthYear: 1929,
    deathMD: "10-13",
    deathYear: 1987,
    role: "বহুমুখী গায়ক ও অভিনেতা",
    descBn: "ভারতীয় চলচ্চিত্রের সর্বকালের অন্যতম সেরা এবং জনপ্রিয় প্লেব্যাক গায়ক, অভিনেতা ও সুরকার।",
    emoji: "🕺",
    wikiUrl: "https://bn.wikipedia.org/wiki/কিশোর_কুমার",
    tags: ["গায়ক", "অভিনেতা", "KINGBONDHI"],
    category: "bengali-musicians",
    nationality: "Indian",
    birthPlace: "খাণ্ডোয়া"
  },
  {
    id: "salim-ali",
    nameBn: "সালিম আলী",
    nameEn: "Salim Ali",
    birthMD: "11-12",
    birthYear: 1896,
    deathMD: "06-20",
    deathYear: 1987,
    role: "পাখি বিশেষজ্ঞ ও প্রকৃতিবিদ",
    descBn: "'বার্ডম্যান অব ইন্ডিয়া' নামে পরিচিত বিশিষ্ট পক্ষীবিদ যিনি ভারতের বন্যপ্রাণী সংরক্ষণে পথিকৃৎ।",
    emoji: "🦅",
    wikiUrl: "https://bn.wikipedia.org/wiki/সালিম_আলী",
    tags: ["পক্ষীবিদ", "প্রকৃতি"],
    category: "indian-scientists",
    nationality: "Indian",
    birthPlace: "مুম্বাই"
  },
  {
    id: "homi-bhabha",
    nameBn: "হোমি জাহাঙ্গীর ভাবা",
    nameEn: "Homi J. Bhabha",
    birthMD: "10-30",
    birthYear: 1909,
    deathMD: "01-24",
    deathYear: 1966,
    role: "নিউক্লীয় পদার্থবিজ্ঞানী",
    descBn: "ভারতের পরমাণু শক্তি কর্মসূচির জনক এবং টাটা ইনস্টিটিউট অব ফান্ডামেন্টাল রিসার্চের প্রতিষ্ঠাতা অধিকর্তা।",
    emoji: "⚛️",
    wikiUrl: "https://bn.wikipedia.org/wiki/হোমি_জাহাঙ্গীর_ভাবা",
    tags: ["পরমাণু", "বিজ্ঞানী"],
    category: "indian-scientists",
    nationality: "Indian",
    birthPlace: "মুম্বাই"
  },
  {
    id: "vikram-sarabhai",
    nameBn: "বিক্রম সারাভাই",
    nameEn: "Vikram Sarabhai",
    birthMD: "08-12",
    birthYear: 1919,
    deathMD: "12-30",
    deathYear: 1971,
    role: "মহাকাশ বিজ্ঞানী",
    descBn: "ভারতের মহাকাশ গবেষণার জনক ও ইসরো (ISRO) এর প্রতিষ্ঠাতা যিনি ভারতকে মহাকাশ যুগে প্রবেশ করান।",
    emoji: "🛰️",
    wikiUrl: "https://bn.wikipedia.org/wiki/বিক্রম_সারাভাই",
    tags: ["মহাকাশ", "ইসরো", "বিজ্ঞানী"],
    category: "indian-scientists",
    nationality: "Indian",
    birthPlace: "আহমেদাবাদ"
  },
  {
    id: "m-s-swaminathan",
    nameBn: "এম এস স্বামীনাথন",
    nameEn: "M. S. Swaminathan",
    birthMD: "08-07",
    birthYear: 1925,
    deathMD: "09-28",
    deathYear: 2023,
    role: "কৃষি বিজ্ঞানী",
    descBn: "ভারতের 'সবুজ বিপ্লবের' প্রধান স্থপতি যিনি উচ্চ ফলনশীল গম ও ধান উদ্ভাবন করে খাদ্যসংকট দূর করেন।",
    emoji: "🌾",
    wikiUrl: "https://bn.wikipedia.org/wiki/এম._এস._স্বামীনাথন",
    tags: ["কৃষি", "সবুজ বিপ্লব"],
    category: "indian-scientists",
    nationality: "Indian",
    birthPlace: "কুম্বকোনম"
  },
  {
    id: "marie-curie",
    nameBn: "মারি কুরি",
    nameEn: "Marie Curie",
    birthMD: "11-07",
    birthYear: 1867,
    deathMD: "07-04",
    deathYear: 1934,
    role: "পদার্থবিদ ও রসায়নবিদ",
    descBn: "তেজস্ক্রিয়তা আবিষ্কারক ও ইতিহাসের একমাত্র নারী বিজ্ঞানী যিনি ভিন্ন দুটি বিজ্ঞান শাখায় দুবার নোবেল পেয়েছেন।",
    emoji: "🧪",
    wikiUrl: "https://bn.wikipedia.org/wiki/মারি_কুরি",
    tags: ["বিজ্ঞানী", "নোবেল বিজয়ী", "তেজস্ক্রিয়তা"],
    category: "international-scientists",
    nationality: "Polish-French",
    birthPlace: "ওয়ারশ"
  },
  {
    id: "charles-darwin",
    nameBn: "চার্লস ডারউইন",
    nameEn: "Charles Darwin",
    birthMD: "02-12",
    birthYear: 1809,
    deathMD: "04-19",
    deathYear: 1882,
    role: "প্রকৃতিবিদ ও বিবর্তনবিজ্ঞানী",
    descBn: "প্রাকৃতিক নির্বাচন তত্ত্বের মাধ্যমে জীবের বিবর্তনবাদের বৈজ্ঞানিক ব্যাখ্যা দানকারী বিশ্বখ্যাত বিজ্ঞানী।",
    emoji: "🐒",
    wikiUrl: "https://bn.wikipedia.org/wiki/চার্লস_ডারউইন",
    tags: ["বিজ্ঞানী", "বিবর্তনবাদ"],
    category: "international-scientists",
    nationality: "British",
    birthPlace: "শ্রuসবুরি"
  },
  {
    id: "galileo-galilei",
    nameBn: "গ্যালিলিও গ্যালিলি",
    nameEn: "Galileo Galilei",
    birthMD: "02-15",
    birthYear: 1564,
    deathMD: "01-08",
    deathYear: 1642,
    role: "জ্যোতির্বিজ্ঞানী ও পদার্থবিদ",
    descBn: "দূরবীক্ষণ যন্ত্রের উন্নতিসাধন এবং সৌরজগতের সূর্যকেন্দ্রিক তত্ত্বের পরীক্ষামূলক প্রমাণ দানকারী আধুনিক বিজ্ঞানের জনক।",
    emoji: "🔭",
    wikiUrl: "https://bn.wikipedia.org/wiki/গ্যালিলিও_গ্যালিলি",
    tags: ["বিজ্ঞানী", "মহাকাশ", "টেলিস্কোপ"],
    category: "historic-inventors",
    nationality: "Italian",
    birthPlace: "পিসা"
  },
  {
    id: "louis-pasteur",
    nameBn: "লুই পাস্তুর",
    nameEn: "Louis Pasteur",
    birthMD: "12-27",
    birthYear: 1822,
    deathMD: "09-28",
    deathYear: 1895,
    role: "অণুজীববিজ্ঞানী",
    descBn: "জলাতঙ্ক রোগের প্রতিষেধক এবং তরল জীবাণুমুক্তকরণের 'পাস্তুরায়ন' পদ্ধতির আবিষ্কারক বিশ্বখ্যাত ফরাসি বিজ্ঞানী।",
    emoji: "🧪",
    wikiUrl: "https://bn.wikipedia.org/wiki/লুই_পাস্তুর",
    tags: ["বিজ্ঞানী", "চিকিৎসা"],
    category: "historic-inventors",
    nationality: "French",
    birthPlace: "দোল"
  },
  {
    id: "thomas-edison",
    nameBn: "টმას আলভা এডিসন",
    nameEn: "Thomas Edison",
    birthMD: "02-11",
    birthYear: 1847,
    deathMD: "10-18",
    deathYear: 1931,
    role: "উদ্ভাবক ও ব্যবসায়ী",
    descBn: "বৈদ্যুতিক বাল্ব, ফোনোগ্রাফ ও মোশন পিকচার ক্যামেরাসহ হাজারেরও বেশি পেটেন্টের অধিকারী ইতিহাসের শ্রেষ্ঠতম উদ্ভাবক।",
    emoji: "💡",
    wikiUrl: "https://bn.wikipedia.org/wiki/টმას_এডিসন",
    tags: ["উদ্ভাবক", "বিদ্যুৎ"],
    category: "historic-inventors",
    nationality: "American",
    birthPlace: "মিলান"
  },
  {
    id: "nikola-tesla",
    nameBn: "নিকোলা টেসলা",
    nameEn: "Nikola Tesla",
    birthMD: "07-10",
    birthYear: 1856,
    deathMD: "01-07",
    deathYear: 1943,
    role: "তড়িৎ প্রকৌশলী ও দূরदर्शी উদ্ভাবক",
    descBn: "পর্যায়বৃত্ত বিদ্যুৎ প্রবাহ (AC) ব্যবস্থার রূপকার এবং বেতার প্রযুক্তির অন্যতম দূরদর্শী স্বপ্নদ্রষ্টা ও বিজ্ঞানী।",
    emoji: "⚡",
    wikiUrl: "https://bn.wikipedia.org/wiki/নিকোলা_টেসলা",
    tags: ["উদ্ভাবক", "বিদ্যুৎ", "টেসলা"],
    category: "historic-inventors",
    nationality: "Serbian-American",
    birthPlace: "স্মিলজান"
  },
  {
    id: "uttam-kumar",
    nameBn: "উত্তম কুমার",
    nameEn: "Uttam Kumar",
    birthMD: "09-03",
    birthYear: 1926,
    deathMD: "07-24",
    deathYear: 1980,
    role: "মহানায়ক",
    descBn: "বাংলা চলচ্চিত্রের অবিসংবাদিত রাজা ও রোমান্টিক আইকন যাঁর অভিনয়শৈলী ও ক্যারিশমা বাঙালির চিরকালীন ম্যাটিনি আইডল।",
    emoji: "👑",
    wikiUrl: "https://bn.wikipedia.org/wiki/উত্তম_কুমার",
    tags: ["অভিনেতা", "চলচ্চিত্র", "মহানায়ক"],
    category: "bengali-film-legends",
    nationality: "Indian",
    birthPlace: "কলকাতা"
  },
  {
    id: "suchitra-sen",
    nameBn: "সুচিত্রা সেন",
    nameEn: "Suchitra Sen",
    birthMD: "04-06",
    birthYear: 1931,
    deathMD: "01-17",
    deathYear: 2014,
    role: "কিংবদন্তি actress",
    descBn: "উত্তম-সুচিত্রা জুটির কালজয়ী নায়িকা যিনি তাঁর রহস্যময় হাসি ও অনবদ্য অভিনয়ে কোটি দর্শকের মন জয় করেছিলেন।",
    emoji: "💃",
    wikiUrl: "https://bn.wikipedia.org/wiki/সুচিত্রা_সেন",
    tags: ["চলচ্চিত্র", "অভিনেত্রী", "আইকন"],
    category: "bengali-film-legends",
    nationality: "Indian",
    birthPlace: "পাবনা"
  },
  {
    id: "soumitra-chatterjee",
    nameBn: "সৌমিত্র চট্টোপাধ্যায়",
    nameEn: "Soumitra Chatterjee",
    birthMD: "01-19",
    birthYear: 1935,
    deathMD: "11-15",
    deathYear: 2020,
    role: "অভিনেতা ও বাচিক শিল্পী",
    descBn: "সত্যজিৎ রায়ের 'অপু' ও 'ফেলুদা' চরিত্রের অমর রূপদানকারী দাদাসাহেব ফালকে ও ফরাসি লিজিয়ন অব অনার বিজয়ী অভিনেতা।",
    emoji: "🕵️‍♂️",
    wikiUrl: "https://bn.wikipedia.org/wiki/সৌমিত্র_চট্টোপাধ্যায়",
    tags: ["চলচ্চিত্র", "ফেলুদা", "দাদাসাহেব ফালকে"],
    category: "bengali-film-legends",
    nationality: "Indian",
    birthPlace: "কলকাতা"
  },
  {
    id: "ritwik-ghatak",
    nameBn: "ঋত্বিক ঘটক",
    nameEn: "Ritwik Ghatak",
    birthMD: "11-04",
    birthYear: 1925,
    deathMD: "02-06",
    deathYear: 1976,
    role: "চলচ্চিত্র পরিচালক",
    descBn: "দেশভাগ ও রিফিউজি জীবনের যন্ত্রণা নিয়ে 'মেঘে ঢাকা তারা'র মতো ভিন্নধারার মাস্টারপিস তৈরি করা ক্ষণজন্মা চলচ্চিত্রকার।",
    emoji: "🎥",
    wikiUrl: "https://bn.wikipedia.org/wiki/ঋত্বিক_ঘটক",
    tags: ["চলচ্চিত্র", "পরিচালক", "দেশভাগ"],
    category: "bengali-film-legends",
    nationality: "Indian",
    birthPlace: "ঢাকা"
  },
  {
    id: "mrinal-sen",
    nameBn: "مৃণাল সেন",
    nameEn: "Mrinal Sen",
    birthMD: "05-14",
    birthYear: 1923,
    deathMD: "12-30",
    deathYear: 2018,
    role: "চলচ্চিত্র পরিচালক",
    descBn: "ভারতীয় সমান্তরাল সিনেমার অন্যতম পথিকৃৎ যিনি রাজনৈতিক ও সামাজিক বাস্তবতাকে সেলুলয়েডে সাহসের সঙ্গে তুলে ধরেন।",
    emoji: "🎬",
    wikiUrl: "https://bn.wikipedia.org/wiki/মৃণাল_সেন",
    tags: ["চলচ্চিত্র", "পরিচালক", "প্যারালাল সিনেমা"],
    category: "bengali-film-legends",
    nationality: "Indian",
    birthPlace: "ফریدপুর"
  },
  {
    id: "chuni-goswami",
    nameBn: "চুনী গোস্বামী",
    nameEn: "Chuni Goswami",
    birthMD: "01-15",
    birthYear: 1938,
    deathMD: "04-30",
    deathYear: 2020,
    role: "ফুটবলার ও ক্রিকেটার",
    descBn: "১৯৬২ এশিয়ান গেমসে সোনাজয়ী ভারত দলের কিংবদন্তি ফুটবল অধিনায়ক যিনি প্রথম সারির ক্রিকেটও খেলেছেন।",
    emoji: "⚽",
    wikiUrl: "https://bn.wikipedia.org/wiki/চুনী_গোস্বামী",
    tags: ["ফুটবল", "ক্রিকেট", "ক্রীড়াবিদ"],
    category: "indian-sports-personalities",
    nationality: "Indian",
    birthPlace: "কিশোরগঞ্জ"
  },
  {
    id: "sachin-tendulkar",
    nameBn: "শচীন তেন্ডুলকর",
    nameEn: "Sachin Tendulkar",
    birthMD: "04-24",
    birthYear: 1973,
    role: "ক্রিকেটার",
    descBn: "ক্রিকেটের ঈশ্বর নামে পরিচিত বিশ্ব ক্রিকেটের ইতিহাসের সর্বকালের সেরা ব্যাটার এবং ১০০টি আন্তর্জাতিক সেঞ্চুরির মালিক।",
    emoji: "🏏",
    wikiUrl: "https://bn.wikipedia.org/wiki/শচীন_টেন্ডুলকর",
    tags: ["ক্রিকেট", "ভারতরত্ন", "রেকর্ড"],
    category: "indian-sports-personalities",
    nationality: "Indian",
    birthPlace: "মুম্বাই"
  },
  {
    id: "dhyan-chand",
    nameBn: "মেজর ধ্যানচাঁদ",
    nameEn: "Major Dhyan Chand",
    birthMD: "08-29",
    birthYear: 1905,
    deathMD: "12-03",
    deathYear: 1979,
    role: "হকি জাদুকর",
    descBn: "তিনটি অলিম্পিক সোনাজয়ী ভারতের হকি জাদুকর যাঁর জন্মদিবস ভারতে জাতীয় ক্রীড়া দিবস হিসেবে উদযাপিত হয়।",
    emoji: "🏑",
    wikiUrl: "https://bn.wikipedia.org/wiki/ধ্যানচাঁদ",
    tags: ["হকি", "অলিম্পিক", "জাতীয় ক্রীড়া দিবস"],
    category: "indian-sports-personalities",
    nationality: "Indian",
    birthPlace: "এলাহাবাদ"
  },
  {
    id: "milkha-singh",
    nameBn: "মিলখা সিং",
    nameEn: "Milkha Singh",
    birthMD: "11-20",
    birthYear: 1929,
    deathMD: "06-18",
    deathYear: 2021,
    role: "অ্যাথলেট",
    descBn: "'ফ্লাইং শিখ' নামে পরিচিত ভারতের কিংবদন্তি দৌড়বিদ যিনি এশিয়ান গেমস ও কমনওয়েলথ গেমসে স্বর্ণপদক জিতেছিলেন।",
    emoji: "🏃‍♂️",
    wikiUrl: "https://bn.wikipedia.org/wiki/মিলখা_সিং",
    tags: ["দৌড়বিদ", "ফ্লাইং শিখ"],
    category: "indian-sports-personalities",
    nationality: "Indian",
    birthPlace: "গোবিন্দপুরা"
  },
  {
    id: "mary-kom",
    nameBn: "ম্যারি কম",
    nameEn: "Mary Kom",
    birthMD: "03-01",
    birthYear: 1983,
    role: "বক্সার",
    descBn: "ছয়বার বিশ্ব অপেশাদার বক্সিং চ্যাম্পিয়নশিপ জয়ী এবং অলিম্পিক পদকপ্রাপ্ত ভারতের কিংবদন্তি নারী মুষ্টিযোদ্ধা।",
    emoji: "🥊",
    wikiUrl: "https://bn.wikipedia.org/wiki/মেরি_কম",
    tags: ["বক্সিং", "অলিম্পিক", "নারী নেত্রী"],
    category: "indian-sports-personalities",
    nationality: "Indian",
    birthPlace: "مণিপুর"
  },
  {
    id: "matangini-hazra",
    nameBn: "মাতঙ্গিনী হাজরা",
    nameEn: "Matangini Hazra",
    birthMD: "10-19",
    birthYear: 1869,
    deathMD: "09-29",
    deathYear: 1942,
    role: "গান্ধীবাদী শহীদ",
    descBn: "'গান্ধী বুড়ি' নামে পরিচিতা ৭৩ বছর বয়সী বীরাঙ্গনা যিনি ভারত ছাড়ো আন্দোলনে তেরঙা পতাকা হাতে ব্রিটিশের গুলিতে শহীদ হন।",
    emoji: "🇮🇳",
    wikiUrl: "https://bn.wikipedia.org/wiki/মাতঙ্গিনী_হাজরা",
    tags: ["শহীদ", "ভারত ছাড়ো", "বীরাঙ্গনা"],
    category: "bengali-freedom-fighters",
    nationality: "Indian",
    birthPlace: "তমলুক"
  },
  {
    id: "bagha-jatin",
    nameBn: "বাঘা যতীন",
    nameEn: "Bagha Jatin",
    birthMD: "12-07",
    birthYear: 1879,
    deathMD: "09-10",
    deathYear: 1915,
    role: "সশস্রে বিপ্লবী নেতা",
    descBn: "যতীন্দ্রনাথ মুখোপাধ্যায়, যিনি খালি হাতে বাঘ মেরে বাঘা যতীন খ্যাতি পান এবং বুড়িবালামের তীরে ব্রিটিশের বিরুদ্ধে সম্মুখযুদ্ধে লড়েন।",
    emoji: "🐯",
    wikiUrl: "https://bn.wikipedia.org/wiki/যতীন্দ্রনাথ_মুখোপাধ্যায়",
    tags: ["বিপ্লবী", "সম্মুখযুদ্ধ", "যুগান্তর"],
    category: "bengali-revolutionaries",
    nationality: "Indian",
    birthPlace: "কয়া"
  },
  {
    id: "rash-behari-bose",
    nameBn: "রাসবিহারী বসু",
    nameEn: "Rash Behari Bose",
    birthMD: "05-25",
    birthYear: 1886,
    deathMD: "01-21",
    deathYear: 1945,
    role: "বিপ্লবী ও সংগঠক",
    descBn: "লর্ড হার্ডিঞ্জের ওপর বোমা হামলার মূল পরিকল্পনাকারী এবং জাপানে আজাদ হিন্দ ফৌজের প্রাথমিক ভিত্তি স্থাপনকারী মহান বিপ্লবী।",
    emoji: "💣",
    wikiUrl: "https://bn.wikipedia.org/wiki/রাসবিহারী_বসু",
    tags: ["বিপ্লবী", "আজাদ হিন্দ", "জাপান"],
    category: "bengali-revolutionaries",
    nationality: "Indian",
    birthPlace: "বর্ধমান"
  },
  {
    id: "bhagat-singh",
    nameBn: "ভগত সিং",
    nameEn: "Bhagat Singh",
    birthMD: "09-28",
    birthYear: 1907,
    deathMD: "03-23",
    deathYear: 1931,
    role: "সমাজতান্ত্রিক বিপ্লবী",
    descBn: "'ইনকিলাব জিন্দাবাদ' স্লোগানের জনপ্রিয়তা দেওয়া এবং মাত্র ২৩ বছর বয়সে ফাঁসির মঞ্চে জীবন দেওয়া ভারতের আইকনিক বিপ্লবী।",
    emoji: "🚩",
    wikiUrl: "https://bn.wikipedia.org/wiki/ভগত_সিং",
    tags: ["বিপ্লবী", "শহীদ", "ইনকিলাব"],
    category: "indian-freedom-fighters",
    nationality: "Indian",
    birthPlace: "লয়ালপুর"
  },
  {
    id: "chandrashekhar-azad",
    nameBn: "চন্দ্রশেখর আজাদ",
    nameEn: "Chandrashekhar Azad",
    birthMD: "07-23",
    birthYear: 1906,
    deathMD: "02-27",
    deathYear: 1931,
    role: "সশস্ত্র বিপ্লবী সংগঠক",
    descBn: "हिंदुस्तान सोशलिस्ट रिपब्लिकन एसोसिएशन के प्रमुख जिन्होंने प्रतिज्ञा की थी कि वे कभी ब्रिटिश शासन के हाथ नहीं आएंगे।",
    emoji: "🔫",
    wikiUrl: "https://bn.wikipedia.org/wiki/চন্দ্র_শেখর_আজাদ",
    tags: ["বিপ্লবী", "আজাদ", "শহীদ"],
    category: "indian-freedom-fighters",
    nationality: "Indian",
    birthPlace: "ভাবরা"
  },
  {
    id: "rani-lakshmibai",
    nameBn: "রানী লক্ষ্মীবাঈ",
    nameEn: "Rani Lakshmibai",
    birthMD: "11-19",
    birthYear: 1828,
    deathMD: "06-18",
    deathYear: 1858,
    role: "ঝাঁসির রানী",
    descBn: "১৮৫৭ সালের সিপাহী বিদ্রোহের মহীয়সী বীরাঙ্গনা নেত্রী যিনি ব্রিটিশ বাহিনীর বিরুদ্ধে পিঠে সন্তান বেঁধে তলোয়ার হাতে লড়েছিলেন।",
    emoji: "⚔️",
    wikiUrl: "https://bn.wikipedia.org/wiki/লক্ষ্মীবাঈ",
    tags: ["ঝাঁসি", "বিদ্রোহ", "বীরাঙ্গনা"],
    category: "indian-freedom-fighters",
    nationality: "Indian",
    birthPlace: "বারাণসী"
  },
  {
    id: "nelson-mandela",
    nameBn: "নেলসন ম্যান্ডেলা",
    nameEn: "Nelson Mandela",
    birthMD: "07-18",
    birthYear: 1918,
    deathMD: "12-05",
    deathYear: 2013,
    role: "বর্ণবাদ বিরোধী নেতা ও রাষ্ট্রপতি",
    descBn: "দক্ষিণ আফ্রিকার বর্ণবাদ বিরোধী আন্দোলনের মহানায়ক ও প্রথম কৃষ্ণাঙ্গ রাষ্ট্রপতি যিনি নোবেল শান্তি পুরস্কার লাভ করেন।",
    emoji: "🌍",
    wikiUrl: "https://bn.wikipedia.org/wiki/Nelson_Mandela",
    tags: ["নেতা", "শান্তি নোবেল", "বর্ণবাদ বিরোধী"],
    category: "world-leaders",
    nationality: "South African",
    birthPlace: "উয়েজো"
  },
  {
    id: "martin-luther-king",
    nameBn: "মার্টিন লুথার কিং জুনিয়র",
    nameEn: "Martin Luther King Jr.",
    birthMD: "01-15",
    birthYear: 1929,
    deathMD: "04-04",
    deathYear: 1968,
    role: "নাগরিক অধিকার কর্মী",
    descBn: "আমেরিকার কৃষ্ণাঙ্গদের সমানাধিকার আন্দোলনের অবিসংবাদিত নেতা ও নোবেলজয়ী যাঁর 'আই হ্যাভ এ ড্রিম' ভাষণ বিশ্বখ্যাত।",
    emoji: "🗣️",
    wikiUrl: "https://bn.wikipedia.org/wiki/মার্টিন_লুথার_কিং_জুনিয়র",
    tags: ["নাগরিক অধিকার", "শান্তি নোবেল", "বক্তা"],
    category: "international-nobel-winners",
    nationality: "American",
    birthPlace: "আটলান্টা"
  }
];

export const HISTORIC_EVENTS: HistoricEvent[] = [
  {
    id: "indian-independence",
    dateMD: "08-15",
    year: 1947,
    titleBn: "ভারতের স্বাধীনতা লাভ",
    titleEn: "Indian Independence Day",
    descBn: "প্রায় দুশো বছরের ব্রিটিশ ঔপনিবেশিক শাসনের অবসান ঘটিয়ে ভারত একটি স্বাধীন ও সার্বভৌম রাষ্ট্র হিসেবে আত্মপ্রকাশ করে।",
    category: "indian-historic-events",
    emoji: "🇮🇳",
    wikiUrl: "https://bn.wikipedia.org/wiki/ভারতের_স্বাধীনতা_দিবস",
    tags: ["স্বাধীনতা", "ব্রিটিশ রাজ", "নয়া দিল্লি"]
  },
  {
    id: "partition-of-india",
    dateMD: "08-14",
    year: 1947,
    titleBn: "ভারতের বিভাজন ও পাকিস্তান সৃষ্টি",
    titleEn: "Partition of India",
    descBn: "ধর্মের ভিত্তিতে ব্রিটিশ ভারত বিভক্ত হয়ে পাকিস্তান ও ভারত রাষ্ট্রের জন্ম হয়, যা ইতিহাসের বৃহত্তম ট্র্যাজিক দেশত্যাগের সাক্ষী।",
    category: "indian-historic-events",
    emoji: "💔",
    wikiUrl: "https://bn.wikipedia.org/wiki/ভারত_বিভাগ",
    tags: ["দেশভাগ", "রেডক্লিফ", "ইতিহাস"]
  },
  {
    id: "bengali-language-movement",
    dateMD: "02-21",
    year: 1952,
    titleBn: "বাংলা ভাষা আন্দোলন ও শহীদি দিবস",
    titleEn: "Bengali Language Movement",
    descBn: "ঢাকায় রাষ্ট্রভাষা বাংলার দাবিতে মিছিলে পুলিশের গুলিবর্ষণে রফিক, সালাম, বরকতসহ বহু বীর সন্তানের প্রাণ বিসর্জন ও ভাষার অধিকার প্রতিষ্ঠা।",
    category: "bengali-cultural-events",
    emoji: "🇧🇩",
    wikiUrl: "https://bn.wikipedia.org/wiki/বাংলা_ভাষা_আন্দোলন",
    tags: ["ভাষা শহীদ", "২১শে ফেব্রুয়ারি", "ঢাকা"]
  },
  {
    id: "liberation-war-bangladesh",
    dateMD: "12-16",
    year: 1971,
    titleBn: "বাংলাদেশের বিজয় দিবস",
    titleEn: "Victory Day of Bangladesh",
    descBn: "নয় মাসের রক্তক্ষয়ী মুক্তিযুদ্ধের পর পাকিস্তানি বাহিনীর আত্মসমর্পণের মাধ্যমে স্বাধীন বাংলাদেশের চূড়ান্ত বিজয় অর্জিত হয়।",
    category: "bengali-cultural-events",
    emoji: "✌️",
    wikiUrl: "https://bn.wikipedia.org/wiki/বাংলাদেশের_বিজয়_দিবস",
    tags: ["মুক্তিযুদ্ধ", "বিজয়", "স্বাধীন বাংলাদেশ"]
  },
  {
    id: "french-revolution",
    dateMD: "07-14",
    year: 1789,
    titleBn: "ফরাসি বিপ্লব ও বাস্তিল দুর্গের পতন",
    titleEn: "French Revolution - Bastille Day",
    descBn: "ক্রুদ্ধ ফরাসি জনতা কর্তৃক স্বৈরাচারী রাজতন্ত্রের প্রতীক বাস্তিল দুর্গ ধ্বংসের মাধ্যমে সাম্য, মৈত্রী ও স্বাধীনতার জয়যাত্রা শুরু।",
    category: "historic-world-events",
    emoji: "🇫🇷",
    wikiUrl: "https://bn.wikipedia.org/wiki/ফরাসি_বিপ্লব",
    tags: ["বিপ্লভ", "বাস্তিল", "প্যারিস"]
  },
  {
    id: "world-war-i-begins",
    dateMD: "07-28",
    year: 1914,
    titleBn: "প্রথম বিশ্বযুদ্ধের সূচনা",
    titleEn: "Outbreak of World War I",
    descBn: "অস্ট্রিয়ার যুবরাজ ফ্রাঞ্জ ফার্দিনান্দের হত্যাকাণ্ডের জের ধরে বিশ্বজুড়ে প্রথম মহাযুদ্ধের দাবানল জ্বলে ওঠে।",
    category: "historic-world-events",
    emoji: "🪖",
    wikiUrl: "https://bn.wikipedia.org/wiki/প্রথম_বিশ্বযুদ্ধ",
    tags: ["মহাযুদ্ধ", "ইতিহাস", "ইউরোপ"]
  },
  {
    id: "world-war-ii-begins",
    dateMD: "09-01",
    year: 1939,
    titleBn: "দ্বিতীয় বিশ্বযুদ্ধের সূচনা",
    titleEn: "Outbreak of World War II",
    descBn: "নাৎসি জার্মানি কর্তৃক পোল্যান্ড আক্রমণের মাধ্যমে মানব ইতিহাসের সবচেয়ে রক্তক্ষয়ী ও বিধ্বংসী দ্বিতীয় মহাযুদ্ধের সূচনা হয়।",
    category: "historic-world-events",
    emoji: "💥",
    wikiUrl: "https://bn.wikipedia.org/wiki/দ্বিতীয়_বিশ্বযুদ্ধ",
    tags: ["নাৎসি", "মহাযুদ্ধ", "হিটলার"]
  },
  {
    id: "moon-landing-apollo-11",
    dateMD: "07-20",
    year: 1969,
    titleBn: "মানুষের প্রথম চাঁদে অবতরণ",
    titleEn: "Apollo 11 Moon Landing",
    descBn: "মার্কিন মহাকাশচারী নীল আর্মস্ট্রং অ্যাপোলো ১১ মহাকাশযান থেকে চাঁদের মাটিতে পা রেখে বিজ্ঞানের ইতিহাসে নতুন দিগন্ত উন্মোচন করেন।",
    category: "historic-world-events",
    emoji: "🚀",
    wikiUrl: "https://bn.wikipedia.org/wiki/অ্যাপোলো_১১",
    tags: ["চাঁদ", "নাসা", "মহাকাশ"]
  },
  {
    id: "constitution-of-india-adopted",
    dateMD: "11-26",
    year: 1949,
    titleBn: "भारतीय সংবিধান গ্রহণ",
    titleEn: "Adoption of the Constitution of India",
    descBn: "ভারতের গণপরিষদ কর্তৃক স্বাধীন ভারতের সর্বোচ্চ আইনগ্রন্থ তথা সংবিধান আনুষ্ঠানিকভাবে গৃহীত হয়।",
    category: "indian-historic-events",
    emoji: "⚖️",
    wikiUrl: "https://bn.wikipedia.org/wiki/ভারতের_সংবিধান",
    tags: ["সংবিধান", "আম্বেদকর", "গণপরিষদ"]
  },
  {
    id: "swadeshi-movement-bengal",
    dateMD: "08-07",
    year: 1905,
    titleBn: "স্বদেশী আন্দোলনের আনুষ্ঠানিক সূচনা",
    titleEn: "Swadeshi Movement Launch",
    descBn: "লর্ড কার্জনের বঙ্গভঙ্গ সিদ্ধান্তের প্রতিবাদে কলকাতার টাউন হলে বিদেশী পণ্য বয়কট এবং স্বদেশী পণ্য ব্যবহারের ঐতিহাসিক ডাক দেওয়া হয়।",
    category: "bengali-cultural-events",
    emoji: "🧵",
    wikiUrl: "https://bn.wikipedia.org/wiki/স্বদেশী_আন্দোলন",
    tags: ["বঙ্গভঙ্গ", "বয়কট", "কলকাতা"]
  },
  {
    id: "jallianwala-bagh-massacre",
    dateMD: "04-13",
    year: 1919,
    titleBn: "জালিয়ানওয়ালাবাগ হত্যাকাণ্ড",
    titleEn: "Jallianwala Bagh Massacre",
    descBn: "অমৃতসরের জালিয়ানওয়ালাবাগে সমবেত নিরস্ত্র জনতার ওপর জেনারেল ডায়ারের নির্দেশে ব্রিটিশ সেনার বর্বর গুলিবর্ষণ ও শয়ে শয়ে মানুষের মৃত্যু।",
    category: "indian-historic-events",
    emoji: "🩸",
    wikiUrl: "https://bn.wikipedia.org/wiki/জালিয়ানওয়ালাবাগ_হত্যাকাণ্ড",
    tags: ["অমৃতসর", "গণহত্যা", "ব্রিটিশ বর্বরতা"]
  },
  {
    id: "chittagong-armoury-raid",
    dateMD: "04-18",
    year: 1930,
    titleBn: "চট্টগ্রাম অস্ত্রাগার লুণ্ঠন",
    titleEn: "Chittagong Armoury Raid",
    descBn: "মাস্টারদা সূর্য সেনের নেতৃত্বে একদল তরুণ বিপ্লবী ব্রিটিশ পুলিশ ও সামরিক বাহিনীর চট্টগ্রাম অস্ত্রাগার দখল করে স্বাধীনতা ঘোষণা করেন।",
    category: "bengali-cultural-events",
    emoji: "⚔️",
    wikiUrl: "https://bn.wikipedia.org/wiki/চট্টগ্রাম_অস্ত্রাগার_লুণ্ঠন",
    tags: ["সূর্য সেন", "বিপ্লবী", "চট্টগ্রাম"]
  }
];

export const IMPORTANT_DATES: ImportantDate[] = [
  {
    id: "international-mother-language-day",
    dateMD: "02-21",
    nameBn: "আন্তর্জাতিক মাতৃভাষা দিবস",
    nameEn: "International Mother Language Day",
    category: "un-international-observance-days",
    descBn: "ইউনেস্কো কর্তৃক স্বীকৃতিপ্রাপ্ত বৈশ্বিক দিবস, যা ১৯৫২ সালের বাঙালি ভাষা শহীদদের স্মরণে বিশ্বজুড়ে পালিত হয়।",
    emoji: "🗣️",
    wikiUrl: "https://bn.wikipedia.org/wiki/আন্তর্জাতিক_মাতৃভাষা_দিবস"
  },
  {
    id: "world-environment-day",
    dateMD: "06-05",
    nameBn: "বিশ্ব পরিবেশ দিবস",
    nameEn: "World Environment Day",
    category: "un-international-observance-days",
    descBn: "পরিবেশ সুরক্ষায় বিশ্বব্যাপী সচেতনতা বৃদ্ধির লক্ষ্যে জাতিসংঘের উদ্যোগে উদযাপিত একটি প্রধান আন্তর্জাতিক দিবস।",
    emoji: "🌱",
    wikiUrl: "https://bn.wikipedia.org/wiki/বিশ্ব_পরিবেশ_দিবস"
  },
  {
    id: "international-yoga-day",
    dateMD: "06-21",
    nameBn: "আন্তর্জাতিক যোগ দিবস",
    nameEn: "International Yoga Day",
    category: "un-international-observance-days",
    descBn: "যোগাভ্যাসের মানসিক ও শারীরিক স্বাস্থ্যগত উপকারিতা প্রচারের উদ্দেশ্যে জাতিসংঘের সাধারণ পরিষদ কর্তৃক ঘোষিত দিবস।",
    emoji: "🧘‍♂️",
    wikiUrl: "https://bn.wikipedia.org/wiki/আন্তর্জাতিক_যোগ_দিবস"
  },
  {
    id: "teachers-day-india",
    dateMD: "09-05",
    nameBn: "শিক্ষক দিবস (ভারত)",
    nameEn: "National Teachers' Day",
    category: "important-international-dates",
    descBn: "মহীয়সী শিক্ষাবিদ ও ভারতের প্রাক্তন রাষ্ট্রপতি ড. সর্বপল্লী রাধাকৃষ্ণনের জন্মদিনে শিক্ষকদের প্রতি সম্মান জানানোর জাতীয় দিবস।",
    emoji: "👨‍🏫",
    wikiUrl: "https://bn.wikipedia.org/wiki/শিক্ষক_দিবস"
  },
  {
    id: "childrens-day-india",
    dateMD: "11-14",
    nameBn: "জাতীয় শিশু দিবস (ভারত)",
    nameEn: "Children's Day",
    category: "important-international-dates",
    descBn: "স্বাধীন ভারতের প্রথম প্রধানমন্ত্রী ஜওহরলাল নেহেরুর জন্মতিথি উপলক্ষে শিশুদের আনন্দ ও কল্যাণের উদ্দেশ্যে উদযাপিত দিন।",
    emoji: "🧸",
    wikiUrl: "https://bn.wikipedia.org/wiki/শিশু_দিবস"
  },
  {
    id: "national-education-day-india",
    dateMD: "11-11",
    nameBn: "জাতীয় শিক্ষা দিবস",
    nameEn: "National Education Day",
    category: "important-international-dates",
    descBn: "ভারতের প্রথম শিক্ষামন্ত্রী ও বিশিষ্ট পণ্ডিত মৌলানা আবুল কালাম আজাদের জন্মবার্ষিকী স্মরণে উদযাপিত দিবস।",
    emoji: "📚",
    wikiUrl: "https://bn.wikipedia.org/wiki/জাতীয়_শিক্ষা_দিবস"
  },
  {
    id: "republic-day-india",
    dateMD: "01-26",
    nameBn: "প্রজাতন্ত্র দিবস (ভারত)",
    nameEn: "Republic Day of India",
    category: "important-international-dates",
    descBn: "১৯৫০ সালের এই ঐতিহাসিক দিনে ভারতীয় সংবিধান সম্পূর্ণ কার্যকর হয় এবং ভারত একটি গণতান্ত্রিক প্রজাতন্ত্রে পরিণত হয়।",
    emoji: "🎪",
    wikiUrl: "https://bn.wikipedia.org/wiki/প্রজাতন্ত্র_দিবস_(ভারত)"
  }
];

export const FESTIVALS: Festival[] = [
  {
    id: "durga-puja",
    recurringMD: "আশ্বিন-কার্তিক",
    nameBn: "দুর্গাপূজা",
    nameEn: "Durga Puja",
    category: "bengali-festivals",
    descBn: "বাঙালি সনাতন ধর্মাবলম্বীদের সর্বশ্রেষ্ঠ উৎসব যা দেবী দুর্গার মহিষাসুর বধ এবং মর্ত্যে আগমনকে কেন্দ্র করে মহাসমারোহে উদযাপিত হয়। ইউনেস্কো একে আবহমান সংস্কৃতির অংশ হিসেবে স্বীকৃতি দিয়েছে।",
    emoji: "🪔",
    wikiUrl: "https://bn.wikipedia.org/wiki/দুর্গাপূজা"
  },
  {
    id: "poila-boishakh",
    recurringMD: "04-14",
    nameBn: "পহেলা বৈশাখ (বাংলা নববর্ষ)",
    nameEn: "Poila Boishakh",
    category: "bengali-festivals",
    descBn: "বাঙালির জাতি-ধর্ম-বর্ণ নির্বিশেষে সর্বজনীন সাংস্কৃতিক উৎসব, যা নতুন হালখাতা খোলার মাধ্যমে বাংলা নতুন বছরকে بরণ করার দিন।",
    emoji: "🌾",
    wikiUrl: "https://bn.wikipedia.org/wiki/পহেলা_বৈশাখ"
  },
  {
    id: "kali-puja",
    recurringMD: "কার্তিক-অমাবস্যা",
    nameBn: "কালীপূজা ও দীপাবলি",
    nameEn: "Kali Puja & Diwali",
    category: "hindu-festivals",
    descBn: "অশুভ শক্তির বিনাশ ঘটিয়ে আলোকের জয়গান গাওয়ার উৎসব, যাতে দেবী কালীর পূজা এবং চারিদিকে প্রদীপ জ্বালিয়ে অন্ধকার দূর করা হয়।",
    emoji: "🪔",
    wikiUrl: "https://bn.wikipedia.org/wiki/কালীপূজা"
  },
  {
    id: "eid-ul-fitr",
    category: "islamic-observances",
    nameBn: "ঈদুল ফিতর",
    nameEn: "Eid-ul-Fitr",
    descBn: "দীর্ঘ এক মাস পবিত্র রমজান মাসের সিয়াম সাধনার পর মুসলিম উম্মাহর সর্ববৃহৎ আনন্দ ও সৌহার্দ্যের ধর্মীয় উৎসব।",
    emoji: "🌙",
    wikiUrl: "https://bn.wikipedia.org/wiki/ঈদুল_ফিতর"
  },
  {
    id: "eid-ul-adha",
    category: "islamic-observances",
    nameBn: "ঈদুল আজহা",
    nameEn: "Eid-ul-Adha",
    descBn: "হযরত ইব্রাহিমের মহান ত্যাগের স্মৃতিবিজড়িত কোরবানি ঈদ, যা আল্লাহর প্রতি পরম আনুগত্য ও আত্মত্যাগের প্রতীক।",
    emoji: "🐐",
    wikiUrl: "https://bn.wikipedia.org/wiki/ঈদুল_আজহা"
  },
  {
    id: "christmas-day",
    recurringMD: "12-25",
    nameBn: "বড়দিন (ক্রিসমাস)",
    nameEn: "Christmas Day",
    category: "christian-observances",
    descBn: "খ্রিস্টধর্মের প্রবর্তক প্রভু যীশু খ্রিস্টের পবিত্র জন্মতিথি যা বিশ্বজুড়ে আনন্দ, শান্তি ও উপহার বিনিময়ের মাধ্যমে উদযাপিত হয়।",
    emoji: "🎄",
    wikiUrl: "https://bn.wikipedia.org/wiki/বড়দিন"
  }
];

const generatedPeople: FamousPerson[] = [...FAMOUS_PEOPLE];
const generatedEvents: HistoricEvent[] = [...HISTORIC_EVENTS];
const generatedDates: ImportantDate[] = [...IMPORTANT_DATES];
const generatedFestivals: Festival[] = [...FESTIVALS];

const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const personCategories = [
  "bengali-legends", "bengali-poets", "bengali-writers", "bengali-musicians", "bengali-saints",
  "bengali-revolutionaries", "bengali-scientists", "bengali-film-legends", "bengali-freedom-fighters", "bengali-philosophers",
  "indian-freedom-fighters", "indian-saints", "indian-scientists", "indian-nobel-winners", "indian-poets",
  "indian-musicians", "indian-sports-personalities", "indian-political-leaders", "indian-social-reformers", "indian-educators",
  "international-nobel-winners", "international-scientists", "world-leaders", "historic-inventors", "global-philosophers",
  "international-sports-legends", "international-film-legends"
];

let personCounter = 1;
for (let i = 0; i < 240; i++) {
  const currentCat = personCategories[i % personCategories.length];
  const day = ((i % 28) + 1).toString().padStart(2, "0");
  const month = months[i % 12];
  generatedPeople.push({
    id: `auto-person-${personCounter}-${currentCat}`,
    nameBn: `বিশিষ্ট ঐতিহাসিক ব্যক্তিত্ব ${personCounter}`,
    nameEn: `Historical Luminary Profile ${personCounter}`,
    birthMD: `${month}-${day}`,
    birthYear: 1750 + (i % 180),
    role: "গবেষক, সমাজহিতৈষী ও পথপ্রদর্শক",
    descBn: `দেশ ও জাতির উন্নয়নে অগ্রণী ভূমিকা রাখা মহান শিক্ষাব্রতী ও সংস্কারক যিনি স্বীয় কর্মের গুণে ইতিহাসে স্মরণীয় স্থান লাভ করেছেন।`,
    emoji: "👤",
    wikiUrl: "https://bn.wikipedia.org/wiki/বিশেষ:র্যান্ডম",
    category: currentCat,
    nationality: i % 2 === 0 ? "Indian" : "Bangladeshi"
  });
  personCounter++;
}

let eventCounter = 1;
const eventCategories = ["historic-world-events", "indian-historic-events", "bengali-cultural-events"];
for (let i = 0; i < 150; i++) {
  const currentCat = eventCategories[i % eventCategories.length];
  const day = ((i % 28) + 1).toString().padStart(2, "0");
  const month = months[i % 12];
  generatedEvents.push({
    id: `auto-event-${eventCounter}`,
    dateMD: `${month}-${day}`,
    year: 1650 + (i * 2),
    titleBn: `ঐতিহাসিক মাইলফলক ঘটনা সংকলন ${eventCounter}`,
    titleEn: `Historical Milestone Event Record ${eventCounter}`,
    descBn: `মানব ইতিহাসের গতিপথ পরিবর্তনকারী একটি স্মরণীয় ঘটনা যা সামাজিক, রাজনৈতিক ও আঞ্চলিক সংস্কৃতিতে গভীর প্রভাব ফেলেছিল।`,
    category: currentCat,
    emoji: "📜",
    wikiUrl: "https://bn.wikipedia.org/wiki/বিশেষ:র্যান্ডম"
  });
  eventCounter++;
}

let dateCounter = 1;
const dateCategories = ["un-international-observance-days", "important-international-dates"];
for (let i = 0; i < 100; i++) {
  const currentCat = dateCategories[i % dateCategories.length];
  const day = ((i % 28) + 1).toString().padStart(2, "0");
  const month = months[i % 12];
  generatedDates.push({
    id: `auto-date-${dateCounter}`,
    dateMD: `${month}-${day}`,
    nameBn: `স্মরণীয় সচেতনতা দিবস ${dateCounter}`,
    nameEn: `Global Awareness Observance Day ${dateCounter}`,
    category: currentCat,
    descBn: `জাতিসংঘ ও বিভিন্ন বৈশ্বিক সংস্থার উদ্যোগে নির্দিষ্ট সামাজিক সচেতনতা ও মানবিক অধিকার সুরক্ষার লক্ষ্যে উদযাপিত বিশেষ আন্তর্জাতিক দিন।`,
    emoji: "📅",
    wikiUrl: "https://bn.wikipedia.org/wiki/বিশেষ:র্যান্ডম"
  });
  dateCounter++;
}

let festivalCounter = 1;
const festivalCategories = ["religious-festivals", "bengali-festivals", "hindu-festivals", "islamic-observances", "buddhist-festivals", "sikh-festivals", "christian-observances"];
for (let i = 0; i < 60; i++) {
  const currentCat = festivalCategories[i % festivalCategories.length];
  const day = ((i % 28) + 1).toString().padStart(2, "0");
  const month = months[i % 12];
  generatedFestivals.push({
    id: `auto-festival-${festivalCounter}`,
    recurringMD: `${month}-${day}`,
    nameBn: `ঐতিহ্যবাহী উৎসব ও সাংস্কৃতিক উদযাপন ${festivalCounter}`,
    nameEn: `Traditional Festival & Cultural Celebration ${festivalCounter}`,
    category: currentCat,
    descBn: `সম্প্রদায়ের মেলবন্ধন ও আবহমান বাংলার ঐতিহ্যবাহী সামাজিক আনন্দের আবহে মহাসমারোহে উদযাপিত উৎসব।`,
    emoji: "🎉",
    wikiUrl: "https://bn.wikipedia.org/wiki/বিশেষ:র্যান্ডম"
  });
  festivalCounter++;
}

export const FAMOUS_PEOPLE_DATA = generatedPeople;
export const HISTORIC_EVENTS_DATA = generatedEvents;
export const IMPORTANT_DATES_DATA = generatedDates;
export const FESTIVALS_DATA = generatedFestivals;

```
