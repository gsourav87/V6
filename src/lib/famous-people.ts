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
    wikiUrl: "[https://bn.wikipedia.org/wiki/রব](https://bn.wikipedia.org/wiki/রব)ীন্দ্রনাথ_ঠাকুর",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/ক](https://bn.wikipedia.org/wiki/ক)াজী_নজরুল_ইসলাম",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/ঈশ](https://bn.wikipedia.org/wiki/ঈশ)্বরচন্দ্র_বিদ্যাসাগর",
    tags: ["সংস্কারক", "শিক্ষাবিদ", "রেনেসাঁ"],
    category: "bengali-philosophers",
    nationality: "Indian",
    birthPlace: "वीरसिंह"
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/স](https://bn.wikipedia.org/wiki/স)্বামী_বিবেকানন্দ",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/জগদ](https://bn.wikipedia.org/wiki/জগদ)ীশ_চন্দ্র_বসু",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/সত](https://bn.wikipedia.org/wiki/সত)্যজিৎ_রায়",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/স](https://bn.wikipedia.org/wiki/স)ুভাষচন্দ্র_বসু",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/সত](https://bn.wikipedia.org/wiki/সত)্যেন্দ্রনাথ_বসু",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/অমর](https://bn.wikipedia.org/wiki/অমর)্ত্য_সেন",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/ল](https://bn.wikipedia.org/wiki/ল)ালন",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/শ](https://bn.wikipedia.org/wiki/শ)্রী_অরবিন্দ",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/র](https://bn.wikipedia.org/wiki/র)ামমোহন_রায়",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/মহ](https://bn.wikipedia.org/wiki/মহ)াত্মা_গান্ধী",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/জওহরল](https://bn.wikipedia.org/wiki/জওহরল)াল_নেহেরু",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/ভ](https://bn.wikipedia.org/wiki/ভ)ীমরাও_রামজি_আম্বেদকর",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/চন](https://bn.wikipedia.org/wiki/চন)্দ্রশেখর_ভেঙ্কট_রামন",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/ম](https://bn.wikipedia.org/wiki/ম)াদার_তেরেসা",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/এ_প](https://bn.wikipedia.org/wiki/এ_প)ি_জে_আব্দুল_কালাম",
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
    descBn: "আপেক্ষিকতার তত্ত্বের প্রবক্তা এবং आधुनिक পদার্থবিজ্ঞানের জনক যিনি ভর-শক্তি সমীকরণ ই-ইকুয়াল-টু-এমসি-স্কয়ার আবিষ্কার করেন।",
    emoji: "🧠",
    wikiUrl: "[https://bn.wikipedia.org/wiki/আলব](https://bn.wikipedia.org/wiki/আলব)ার্ট_আইনস্টাইন",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/আইজ](https://bn.wikipedia.org/wiki/আইজ)্যাক_নিউটন",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/শ](https://bn.wikipedia.org/wiki/শ)্রীনিবাস_রামানুজন",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/সর](https://bn.wikipedia.org/wiki/সর)োজিনী_নাইডু",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/র](https://bn.wikipedia.org/wiki/র)োকেয়া_সাখাওয়াত_হোসেন",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/সত](https://bn.wikipedia.org/wiki/সত)্যজিৎ_রায়",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/চ](https://bn.wikipedia.org/wiki/চ)িত্তরঞ্জন_দাশ",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/স](https://bn.wikipedia.org/wiki/স)ূর্য_সেন",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/প](https://bn.wikipedia.org/wiki/প)্রীতিলতা_ওয়াদ্দেদার",
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
    wikiUrl: "[https://bn.wikipedia.org/wiki/ক](https://bn.wikipedia.org/wiki/ক)্ষুদিরাম_বসু",
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
