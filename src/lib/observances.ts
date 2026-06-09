/**
 * Recurring annual observances + Bengal historical events.
 * Each entry recurs every year on its MM-DD. Surfaced through
 * getObservancesForDate() and merged into the calendar via calendar-events.ts.
 *
 * Bengali names + one-line significance are translated/expanded from the
 * source datasets (UN/India observances, Bengal milestones).
 */
import { Festival, FestivalCategory } from "./festivals";

export interface RecurringDate {
  md: string;            // "MM-DD"
  nameBn: string;
  nameEn: string;
  category: FestivalCategory;
  icon: string;
  descBn: string;        // one-line Bengali significance
  yearRef?: number;      // source year (historical events)
  slug?: string;         // links to a /festival/:slug detail page
}

export const OBSERVANCES: RecurringDate[] = [
  // ── Bengal historical events (recur on their anniversary) ───────────────
  { md: "01-20", nameBn: "হিন্দু কলেজ প্রতিষ্ঠা", nameEn: "Hindu College Established", category: "cultural", icon: "🏛️", yearRef: 1817, descBn: "১৮১৭ সালে কলকাতায় প্রতিষ্ঠিত হয় হিন্দু কলেজ (বর্তমান প্রেসিডেন্সি বিশ্ববিদ্যালয়), বাংলায় আধুনিক ইংরেজি শিক্ষার অন্যতম সূতিকাগার।" , slug: "hindu-college" },
  { md: "01-24", nameBn: "কলকাতা বিশ্ববিদ্যালয় প্রতিষ্ঠা", nameEn: "University of Calcutta Founded", category: "cultural", icon: "🎓", yearRef: 1857, descBn: "১৮৫৭ সালে প্রতিষ্ঠিত হয় কলকাতা বিশ্ববিদ্যালয়, দক্ষিণ এশিয়ার অন্যতম প্রথম আধুনিক বিশ্ববিদ্যালয়।" , slug: "calcutta-university" },
  { md: "07-26", nameBn: "ভারত সভা প্রতিষ্ঠা", nameEn: "Formation of Indian Association", category: "national", icon: "🏛️", yearRef: 1876, descBn: "১৮৭৬ সালে সুরেন্দ্রনাথ বন্দ্যোপাধ্যায়ের নেতৃত্বে গঠিত হয় ভারত সভা, ভারতের অন্যতম প্রথম রাজনৈতিক সংগঠন।" , slug: "indian-association" },
  { md: "08-20", nameBn: "ব্রাহ্মসভা প্রতিষ্ঠা", nameEn: "Brahmo Sabha Founded", category: "cultural", icon: "🪔", yearRef: 1828, descBn: "১৮২৮ সালে রাজা রামমোহন রায় ব্রাহ্মসভা প্রতিষ্ঠা করেন, যা পরে ব্রাহ্মসমাজে রূপ নিয়ে বাংলার নবজাগরণে গুরুত্বপূর্ণ ভূমিকা রাখে।" , slug: "brahmo-sabha" },
  { md: "10-16", nameBn: "বঙ্গভঙ্গ", nameEn: "Partition of Bengal", category: "national", icon: "✊", yearRef: 1905, descBn: "১৯০৫ সালে লর্ড কার্জন বাংলাকে বিভক্ত করেন, যা স্বদেশি আন্দোলনের সূচনা ঘটায়; রবীন্দ্রনাথ দিনটিকে রাখিবন্ধন হিসেবে পালনের আহ্বান জানান।" , slug: "partition-of-bengal" },
  { md: "12-12", nameBn: "বঙ্গভঙ্গ রদ", nameEn: "Annulment of Partition of Bengal", category: "national", icon: "🤝", yearRef: 1911, descBn: "১৯১১ সালে ব্যাপক জনআন্দোলনের চাপে ব্রিটিশ সরকার ১৯০৫ সালের বঙ্গভঙ্গ রদ করতে বাধ্য হয়।" , slug: "partition-of-bengal-annulled" },
  { md: "11-13", nameBn: "রবীন্দ্রনাথের নোবেল প্রাপ্তি", nameEn: "Tagore Receives Nobel Prize", category: "cultural", icon: "🏅", yearRef: 1913, descBn: "১৯১৩ সালে 'গীতাঞ্জলি'র জন্য রবীন্দ্রনাথ ঠাকুর সাহিত্যে নোবেল পুরস্কার পান — প্রথম এশীয় হিসেবে এই সম্মান অর্জন।" , slug: "tagore-nobel-prize" },
  { md: "12-23", nameBn: "বিশ্বভারতী প্রতিষ্ঠা", nameEn: "Visva-Bharati Founded", category: "cultural", icon: "🎓", yearRef: 1921, descBn: "১৯২১ সালে রবীন্দ্রনাথ ঠাকুর শান্তিনিকেতনে বিশ্বভারতী বিশ্ববিদ্যালয় আনুষ্ঠানিকভাবে প্রতিষ্ঠা করেন।" , slug: "visva-bharati" },
  { md: "04-18", nameBn: "চট্টগ্রাম অস্ত্রাগার লুণ্ঠন", nameEn: "Chittagong Armoury Raid", category: "national", icon: "⚔️", yearRef: 1930, descBn: "১৯৩০ সালে মাস্টারদা সূর্য সেনের নেতৃত্বে বিপ্লবীরা চট্টগ্রাম অস্ত্রাগার আক্রমণ করেন, যা সশস্ত্র স্বাধীনতা সংগ্রামের ইতিহাসে স্মরণীয়।" , slug: "chittagong-armoury-raid" },
  { md: "03-26", nameBn: "বাংলাদেশের মুক্তিযুদ্ধের সূচনা", nameEn: "Bangladesh Liberation War Begins", category: "national", icon: "🇧🇩", yearRef: 1971, descBn: "১৯৭১ সালের ২৬ মার্চ বাংলাদেশের মুক্তিযুদ্ধ শুরু হয়; দিনটি বাংলাদেশে স্বাধীনতা দিবস হিসেবে পালিত হয়।" , slug: "bangladesh-liberation-war" },
  { md: "12-16", nameBn: "বিজয় দিবস (বাংলাদেশ)", nameEn: "Victory Day of Bangladesh", category: "national", icon: "🇧🇩", yearRef: 1971, descBn: "১৯৭১ সালের ১৬ ডিসেম্বর মুক্তিযুদ্ধে বিজয়ের মধ্য দিয়ে স্বাধীন বাংলাদেশের জন্ম হয়।" , slug: "bangladesh-victory-day" },

  // ── January ─────────────────────────────────────────────────────────────
  { md: "01-04", nameBn: "বিশ্ব ব্রেইল দিবস", nameEn: "World Braille Day", category: "observance", icon: "👁️", descBn: "ব্রেইল লিপির উদ্ভাবক লুই ব্রেইলের জন্মদিনে দৃষ্টিহীনদের তথ্যাধিকার নিয়ে সচেতনতার দিন।" },
  { md: "01-09", nameBn: "প্রবাসী ভারতীয় দিবস", nameEn: "Pravasi Bharatiya Divas", category: "national", icon: "🌐", descBn: "ভারতের উন্নয়নে প্রবাসী ভারতীয়দের অবদান স্মরণে পালিত দিবস।" },
  { md: "01-10", nameBn: "বিশ্ব হিন্দি দিবস", nameEn: "World Hindi Day", category: "cultural", icon: "🗣️", descBn: "আন্তর্জাতিক স্তরে হিন্দি ভাষার প্রসার উপলক্ষে পালিত দিবস।" },
  { md: "01-12", nameBn: "জাতীয় যুব দিবস", nameEn: "National Youth Day", category: "national", icon: "🔥", descBn: "স্বামী বিবেকানন্দের জন্মদিনে ভারতের তরুণসমাজকে উৎসর্গ করা দিবস।" },
  { md: "01-15", nameBn: "সেনা দিবস", nameEn: "Army Day", category: "national", icon: "🪖", descBn: "ভারতীয় স্থলসেনার সাহস ও আত্মত্যাগকে সম্মান জানানোর দিন।" },
  { md: "01-24", nameBn: "আন্তর্জাতিক শিক্ষা দিবস", nameEn: "International Day of Education", category: "observance", icon: "📚", descBn: "শান্তি ও উন্নয়নে শিক্ষার ভূমিকা তুলে ধরতে জাতিসংঘ ঘোষিত দিবস।" },
  { md: "01-24", nameBn: "জাতীয় কন্যাশিশু দিবস", nameEn: "National Girl Child Day", category: "observance", icon: "👧", descBn: "কন্যাশিশুর অধিকার ও কল্যাণ নিয়ে সচেতনতার দিন।" },
  { md: "01-25", nameBn: "জাতীয় ভোটার দিবস", nameEn: "National Voters' Day", category: "national", icon: "🗳️", descBn: "গণতন্ত্রে ভোটাধিকারের গুরুত্ব স্মরণে পালিত দিবস।" },
  { md: "01-25", nameBn: "জাতীয় পর্যটন দিবস", nameEn: "National Tourism Day", category: "cultural", icon: "🧳", descBn: "অর্থনীতি ও সংস্কৃতিতে পর্যটনের গুরুত্ব তুলে ধরার দিন।" },
  { md: "01-27", nameBn: "হলোকস্ট স্মরণ দিবস", nameEn: "Holocaust Remembrance Day", category: "observance", icon: "🕯️", descBn: "দ্বিতীয় বিশ্বযুদ্ধে হলোকস্টের শিকার লক্ষ লক্ষ মানুষের স্মরণে আন্তর্জাতিক দিবস।" },
  { md: "01-30", nameBn: "শহিদ দিবস", nameEn: "Martyrs' Day", category: "national", icon: "🕊️", descBn: "মহাত্মা গান্ধীর প্রয়াণ দিবসে দেশের শহিদদের প্রতি শ্রদ্ধা জ্ঞাপন।" },
  { md: "01-30", nameBn: "বিশ্ব অবহেলিত ক্রান্তীয় রোগ দিবস", nameEn: "World NTD Day", category: "observance", icon: "🦟", descBn: "অবহেলিত ক্রান্তীয় রোগ প্রতিরোধে সচেতনতার আন্তর্জাতিক দিন।" },

  // ── February ────────────────────────────────────────────────────────────
  { md: "02-02", nameBn: "বিশ্ব জলাভূমি দিবস", nameEn: "World Wetlands Day", category: "observance", icon: "🦆", descBn: "জলাভূমি সংরক্ষণের গুরুত্ব নিয়ে সচেতনতার আন্তর্জাতিক দিন।" },
  { md: "02-04", nameBn: "বিশ্ব ক্যান্সার দিবস", nameEn: "World Cancer Day", category: "observance", icon: "🎗️", descBn: "ক্যান্সার প্রতিরোধ ও সচেতনতা বৃদ্ধিতে পালিত আন্তর্জাতিক দিবস।" },
  { md: "02-06", nameBn: "নারী যৌনাঙ্গচ্ছেদ-বিরোধী আন্তর্জাতিক দিবস", nameEn: "Day of Zero Tolerance for FGM", category: "observance", icon: "♀️", descBn: "নারী যৌনাঙ্গচ্ছেদ প্রথার বিরুদ্ধে সচেতনতার আন্তর্জাতিক দিন।" },
  { md: "02-10", nameBn: "বিশ্ব ডাল দিবস", nameEn: "World Pulses Day", category: "observance", icon: "🫘", descBn: "পুষ্টি ও টেকসই কৃষিতে ডালজাতীয় শস্যের গুরুত্ব নিয়ে দিবস।" },
  { md: "02-11", nameBn: "বিজ্ঞানে নারী ও কন্যা দিবস", nameEn: "Day of Women and Girls in Science", category: "observance", icon: "🔬", descBn: "বিজ্ঞানে নারীর সমান অংশগ্রহণ উৎসাহিত করতে আন্তর্জাতিক দিবস।" },
  { md: "02-13", nameBn: "বিশ্ব বেতার দিবস", nameEn: "World Radio Day", category: "cultural", icon: "📻", descBn: "তথ্য ও যোগাযোগে বেতারের ভূমিকা উদযাপনে পালিত দিবস।" },
  { md: "02-13", nameBn: "জাতীয় নারী দিবস", nameEn: "National Women's Day", category: "observance", icon: "🌺", descBn: "কবি ও স্বাধীনতা সংগ্রামী সরোজিনী নাইডুর জন্মদিনে ভারতের নারী দিবস।" },
  { md: "02-20", nameBn: "বিশ্ব সামাজিক ন্যায় দিবস", nameEn: "World Day of Social Justice", category: "observance", icon: "⚖️", descBn: "সামাজিক ন্যায় ও সমতার প্রসারে পালিত আন্তর্জাতিক দিবস।" },
  { md: "02-20", nameBn: "অরুণাচল প্রদেশ প্রতিষ্ঠা দিবস", nameEn: "Arunachal Pradesh Foundation Day", category: "national", icon: "🏔️", descBn: "অরুণাচল প্রদেশ রাজ্যের প্রতিষ্ঠা দিবস।" },
  { md: "02-21", nameBn: "আন্তর্জাতিক মাতৃভাষা দিবস", nameEn: "International Mother Language Day", category: "cultural", icon: "🗣️", descBn: "১৯৫২ সালের ভাষা আন্দোলনের শহিদদের স্মরণে ইউনেস্কো ঘোষিত মাতৃভাষার আন্তর্জাতিক দিবস।" },
  { md: "02-28", nameBn: "জাতীয় বিজ্ঞান দিবস", nameEn: "National Science Day", category: "observance", icon: "🔬", descBn: "স্যার সি. ভি. রামনের 'রামন এফেক্ট' আবিষ্কার স্মরণে পালিত বিজ্ঞান দিবস।" },

  // ── March ───────────────────────────────────────────────────────────────
  { md: "03-01", nameBn: "বিশ্ব সিগ্রাস দিবস", nameEn: "World Seagrass Day", category: "observance", icon: "🌊", descBn: "সামুদ্রিক বাস্তুতন্ত্রে সিগ্রাসের গুরুত্ব নিয়ে সচেতনতার দিন।" },
  { md: "03-03", nameBn: "বিশ্ব বন্যপ্রাণী দিবস", nameEn: "World Wildlife Day", category: "observance", icon: "🐾", descBn: "বন্যপ্রাণী ও উদ্ভিদ সংরক্ষণে পালিত আন্তর্জাতিক দিবস।" },
  { md: "03-04", nameBn: "জাতীয় নিরাপত্তা দিবস", nameEn: "National Safety Day", category: "observance", icon: "🦺", descBn: "কর্মক্ষেত্রে নিরাপত্তা ও দুর্ঘটনা প্রতিরোধে সচেতনতার দিন।" },
  { md: "03-08", nameBn: "আন্তর্জাতিক নারী দিবস", nameEn: "International Women's Day", category: "observance", icon: "♀️", descBn: "নারীর অধিকার ও সাফল্য উদযাপনে পালিত আন্তর্জাতিক দিবস।" },
  { md: "03-20", nameBn: "আন্তর্জাতিক সুখ দিবস", nameEn: "International Day of Happiness", category: "observance", icon: "😊", descBn: "মানুষের জীবনে সুখ ও কল্যাণের গুরুত্ব তুলে ধরতে পালিত দিবস।" },
  { md: "03-21", nameBn: "বর্ণবৈষম্য বিলোপ দিবস", nameEn: "Day for Elimination of Racial Discrimination", category: "observance", icon: "✊", descBn: "বর্ণবৈষম্য দূরীকরণে পালিত আন্তর্জাতিক দিবস।" },
  { md: "03-21", nameBn: "বিশ্ব কবিতা দিবস", nameEn: "World Poetry Day", category: "cultural", icon: "📝", descBn: "কবিতা ও কাব্যচর্চা উদযাপনে পালিত আন্তর্জাতিক দিবস।" },
  { md: "03-21", nameBn: "আন্তর্জাতিক বন দিবস", nameEn: "International Day of Forests", category: "observance", icon: "🌳", descBn: "বন ও বনজ সম্পদ সংরক্ষণের গুরুত্ব নিয়ে দিবস।" },
  { md: "03-22", nameBn: "বিশ্ব জল দিবস", nameEn: "World Water Day", category: "observance", icon: "💧", descBn: "মিষ্টি জলের গুরুত্ব ও সংরক্ষণ নিয়ে সচেতনতার আন্তর্জাতিক দিবস।" },
  { md: "03-23", nameBn: "বিশ্ব আবহাওয়া দিবস", nameEn: "World Meteorological Day", category: "observance", icon: "🌦️", descBn: "আবহাওয়া ও জলবায়ু বিজ্ঞানে সচেতনতার আন্তর্জাতিক দিবস।" },
  { md: "03-23", nameBn: "শহিদ দিবস (ভগৎ সিং)", nameEn: "Shaheed Diwas", category: "national", icon: "🕊️", descBn: "ভগৎ সিং, রাজগুরু ও সুখদেবের আত্মত্যাগ স্মরণে পালিত শহিদ দিবস।" },
  { md: "03-24", nameBn: "বিশ্ব যক্ষ্মা দিবস", nameEn: "World Tuberculosis Day", category: "observance", icon: "🫁", descBn: "যক্ষ্মা রোগ প্রতিরোধে সচেতনতার আন্তর্জাতিক দিবস।" },

  // ── April ───────────────────────────────────────────────────────────────
  { md: "04-02", nameBn: "বিশ্ব অটিজম সচেতনতা দিবস", nameEn: "World Autism Awareness Day", category: "observance", icon: "🧩", descBn: "অটিজম সম্পর্কে সচেতনতা ও সহমর্মিতা বৃদ্ধিতে পালিত দিবস।" },
  { md: "04-05", nameBn: "জাতীয় নৌ দিবস", nameEn: "National Maritime Day", category: "national", icon: "🚢", descBn: "ভারতের সামুদ্রিক বাণিজ্য ও নৌপরিবহণের গুরুত্ব স্মরণে দিবস।" },
  { md: "04-06", nameBn: "ক্রীড়া দিবস (উন্নয়ন ও শান্তি)", nameEn: "Day of Sport for Development & Peace", category: "observance", icon: "🤝", descBn: "উন্নয়ন ও শান্তিতে খেলাধুলার ভূমিকা তুলে ধরতে আন্তর্জাতিক দিবস।" },
  { md: "04-07", nameBn: "বিশ্ব স্বাস্থ্য দিবস", nameEn: "World Health Day", category: "observance", icon: "🩺", descBn: "বিশ্বব্যাপী স্বাস্থ্য সচেতনতা বৃদ্ধিতে পালিত আন্তর্জাতিক দিবস।" },
  { md: "04-11", nameBn: "জাতীয় নিরাপদ মাতৃত্ব দিবস", nameEn: "National Safe Motherhood Day", category: "observance", icon: "🤱", descBn: "নিরাপদ মাতৃত্ব ও মাতৃস্বাস্থ্য নিয়ে সচেতনতার দিন।" },
  { md: "04-12", nameBn: "মানব মহাকাশ উড্ডয়ন দিবস", nameEn: "Day of Human Space Flight", category: "observance", icon: "🚀", descBn: "মানুষের প্রথম মহাকাশ যাত্রা স্মরণে পালিত আন্তর্জাতিক দিবস।" },
  { md: "04-21", nameBn: "জাতীয় সিভিল সার্ভিস দিবস", nameEn: "Civil Services Day", category: "national", icon: "🏛️", descBn: "জনসেবায় নিয়োজিত প্রশাসনিক কর্মকর্তাদের অবদান স্মরণে দিবস।" },
  { md: "04-22", nameBn: "আন্তর্জাতিক ধরিত্রী দিবস", nameEn: "International Mother Earth Day", category: "observance", icon: "🌍", descBn: "পৃথিবী ও পরিবেশ রক্ষায় সচেতনতার আন্তর্জাতিক দিবস।" },
  { md: "04-23", nameBn: "বিশ্ব বই ও কপিরাইট দিবস", nameEn: "World Book and Copyright Day", category: "cultural", icon: "📖", descBn: "বই পড়া ও লেখকস্বত্ব উদযাপনে পালিত আন্তর্জাতিক দিবস।" },
  { md: "04-25", nameBn: "বিশ্ব ম্যালেরিয়া দিবস", nameEn: "World Malaria Day", category: "observance", icon: "🦟", descBn: "ম্যালেরিয়া প্রতিরোধে সচেতনতার আন্তর্জাতিক দিবস।" },
  { md: "04-26", nameBn: "বিশ্ব মেধাস্বত্ব দিবস", nameEn: "World Intellectual Property Day", category: "observance", icon: "💡", descBn: "উদ্ভাবন ও মেধাস্বত্বের গুরুত্ব নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "04-29", nameBn: "আন্তর্জাতিক নৃত্য দিবস", nameEn: "International Dance Day", category: "cultural", icon: "💃", descBn: "নৃত্যকলা উদযাপনে পালিত আন্তর্জাতিক দিবস।" },

  // ── May ─────────────────────────────────────────────────────────────────
  { md: "05-01", nameBn: "আন্তর্জাতিক শ্রমিক দিবস", nameEn: "International Workers' Day", category: "observance", icon: "✊", descBn: "শ্রমজীবী মানুষের অধিকার ও অবদান উদযাপনে আন্তর্জাতিক দিবস।" },
  { md: "05-01", nameBn: "মহারাষ্ট্র দিবস", nameEn: "Maharashtra Day", category: "national", icon: "🏵️", descBn: "মহারাষ্ট্র রাজ্যের প্রতিষ্ঠা দিবস।" },
  { md: "05-01", nameBn: "গুজরাট দিবস", nameEn: "Gujarat Day", category: "national", icon: "🏵️", descBn: "গুজরাট রাজ্যের প্রতিষ্ঠা দিবস।" },
  { md: "05-03", nameBn: "বিশ্ব সংবাদপত্র স্বাধীনতা দিবস", nameEn: "World Press Freedom Day", category: "cultural", icon: "📰", descBn: "সংবাদমাধ্যমের স্বাধীনতার গুরুত্ব তুলে ধরতে আন্তর্জাতিক দিবস।" },
  { md: "05-08", nameBn: "বিশ্ব রেডক্রস দিবস", nameEn: "World Red Cross Day", category: "observance", icon: "➕", descBn: "মানবিক সেবায় রেডক্রস ও রেডক্রিসেন্টের অবদান স্মরণে দিবস।" },
  { md: "05-11", nameBn: "জাতীয় প্রযুক্তি দিবস", nameEn: "National Technology Day", category: "observance", icon: "⚙️", descBn: "ভারতের বৈজ্ঞানিক ও প্রযুক্তিগত অর্জন উদযাপনে দিবস।" },
  { md: "05-12", nameBn: "আন্তর্জাতিক নার্স দিবস", nameEn: "International Nurses Day", category: "observance", icon: "🩹", descBn: "ফ্লোরেন্স নাইটিঙ্গেলের জন্মদিনে সেবিকাদের অবদান স্মরণে দিবস।" },
  { md: "05-15", nameBn: "আন্তর্জাতিক পরিবার দিবস", nameEn: "International Day of Families", category: "observance", icon: "👪", descBn: "পরিবার ও পারিবারিক বন্ধনের গুরুত্ব নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "05-17", nameBn: "বিশ্ব টেলিযোগাযোগ দিবস", nameEn: "World Telecommunication Day", category: "observance", icon: "📡", descBn: "তথ্যপ্রযুক্তি ও টেলিযোগাযোগের গুরুত্ব নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "05-20", nameBn: "বিশ্ব মৌমাছি দিবস", nameEn: "World Bee Day", category: "observance", icon: "🐝", descBn: "পরিবেশ ও কৃষিতে মৌমাছির গুরুত্ব নিয়ে সচেতনতার দিন।" },
  { md: "05-21", nameBn: "সাংস্কৃতিক বৈচিত্র্য দিবস", nameEn: "Day for Cultural Diversity", category: "cultural", icon: "🌐", descBn: "সংস্কৃতির বৈচিত্র্য ও সংলাপের গুরুত্ব নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "05-21", nameBn: "সন্ত্রাসবিরোধী দিবস", nameEn: "Anti-Terrorism Day", category: "national", icon: "🕊️", descBn: "সন্ত্রাসবাদের বিরুদ্ধে সচেতনতা ও শান্তির বার্তা ছড়াতে পালিত দিবস।" },
  { md: "05-22", nameBn: "জৈববৈচিত্র্য দিবস", nameEn: "Day for Biological Diversity", category: "observance", icon: "🦋", descBn: "জীববৈচিত্র্য সংরক্ষণের গুরুত্ব নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "05-31", nameBn: "বিশ্ব তামাকমুক্ত দিবস", nameEn: "World No Tobacco Day", category: "observance", icon: "🚭", descBn: "তামাকের ক্ষতি নিয়ে সচেতনতা বৃদ্ধিতে আন্তর্জাতিক দিবস।" },

  // ── June ────────────────────────────────────────────────────────────────
  { md: "06-01", nameBn: "বিশ্ব পিতামাতা দিবস", nameEn: "Global Day of Parents", category: "observance", icon: "👪", descBn: "সন্তানের জীবনে পিতামাতার ত্যাগ ও অবদান স্মরণে দিবস।" },
  { md: "06-05", nameBn: "বিশ্ব পরিবেশ দিবস", nameEn: "World Environment Day", category: "observance", icon: "🌳", descBn: "পরিবেশ সুরক্ষায় বিশ্বব্যাপী সচেতনতার সবচেয়ে বড় দিবস।" },
  { md: "06-08", nameBn: "বিশ্ব মহাসাগর দিবস", nameEn: "World Oceans Day", category: "observance", icon: "🌊", descBn: "মহাসাগর সংরক্ষণের গুরুত্ব নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "06-12", nameBn: "বিশ্ব শিশুশ্রম-বিরোধী দিবস", nameEn: "Day Against Child Labour", category: "observance", icon: "🧒", descBn: "শিশুশ্রম বন্ধে সচেতনতার আন্তর্জাতিক দিবস।" },
  { md: "06-14", nameBn: "বিশ্ব রক্তদাতা দিবস", nameEn: "World Blood Donor Day", category: "observance", icon: "🩸", descBn: "স্বেচ্ছায় রক্তদানের গুরুত্ব নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "06-20", nameBn: "বিশ্ব শরণার্থী দিবস", nameEn: "World Refugee Day", category: "observance", icon: "🏕️", descBn: "শরণার্থীদের অধিকার ও দুর্দশা নিয়ে সচেতনতার দিন।" },
  { md: "06-21", nameBn: "আন্তর্জাতিক যোগ দিবস", nameEn: "International Day of Yoga", category: "observance", icon: "🧘", descBn: "শরীর ও মনের সুস্থতায় যোগব্যায়ামের গুরুত্ব নিয়ে আন্তর্জাতিক দিবস।" },

  // ── July ────────────────────────────────────────────────────────────────
  { md: "07-01", nameBn: "জাতীয় চিকিৎসক দিবস", nameEn: "National Doctors' Day", category: "observance", icon: "🩺", descBn: "ডা. বিধানচন্দ্র রায়ের জন্ম ও প্রয়াণ দিবসে চিকিৎসকদের অবদান স্মরণে দিবস।" },
  { md: "07-11", nameBn: "বিশ্ব জনসংখ্যা দিবস", nameEn: "World Population Day", category: "observance", icon: "👥", descBn: "জনসংখ্যা সম্পর্কিত বিষয়ে সচেতনতার আন্তর্জাতিক দিবস।" },
  { md: "07-18", nameBn: "নেলসন ম্যান্ডেলা আন্তর্জাতিক দিবস", nameEn: "Nelson Mandela International Day", category: "observance", icon: "✊", descBn: "শান্তি ও মানবাধিকারের প্রতীক নেলসন ম্যান্ডেলার সম্মানে দিবস।" },
  { md: "07-23", nameBn: "জাতীয় সম্প্রচার দিবস", nameEn: "National Broadcasting Day", category: "cultural", icon: "📻", descBn: "ভারতে বেতার সম্প্রচারের সূচনা স্মরণে পালিত দিবস।" },
  { md: "07-26", nameBn: "কার্গিল বিজয় দিবস", nameEn: "Kargil Vijay Diwas", category: "national", icon: "🎖️", descBn: "১৯৯৯ সালের কার্গিল যুদ্ধে ভারতের বিজয় ও শহিদ সেনাদের স্মরণে দিবস।" },
  { md: "07-30", nameBn: "আন্তর্জাতিক বন্ধুত্ব দিবস", nameEn: "International Day of Friendship", category: "observance", icon: "🤝", descBn: "বন্ধুত্ব ও সম্প্রীতির গুরুত্ব নিয়ে আন্তর্জাতিক দিবস।" },

  // ── August ──────────────────────────────────────────────────────────────
  { md: "08-07", nameBn: "জাতীয় তাঁত দিবস", nameEn: "National Handloom Day", category: "cultural", icon: "🧵", descBn: "ভারতের তাঁতশিল্প ও তাঁতিদের অবদান স্মরণে পালিত দিবস।" },
  { md: "08-09", nameBn: "বিশ্ব আদিবাসী দিবস", nameEn: "Day of the World's Indigenous Peoples", category: "observance", icon: "🪶", descBn: "আদিবাসী জনগোষ্ঠীর অধিকার ও সংস্কৃতি নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "08-09", nameBn: "ভারত ছাড়ো আন্দোলন দিবস", nameEn: "Quit India Movement Day", category: "national", icon: "✊", descBn: "১৯৪২ সালে মহাত্মা গান্ধীর নেতৃত্বে শুরু হওয়া ভারত ছাড়ো আন্দোলন স্মরণে দিবস।" },
  { md: "08-12", nameBn: "আন্তর্জাতিক যুব দিবস", nameEn: "International Youth Day", category: "observance", icon: "🧑", descBn: "তরুণদের ভূমিকা ও সম্ভাবনা উদযাপনে আন্তর্জাতিক দিবস।" },
  { md: "08-19", nameBn: "বিশ্ব মানবিক দিবস", nameEn: "World Humanitarian Day", category: "observance", icon: "🤲", descBn: "মানবিক সহায়তায় নিয়োজিত কর্মীদের সম্মানে আন্তর্জাতিক দিবস।" },
  { md: "08-20", nameBn: "সদ্ভাবনা দিবস", nameEn: "Sadbhavana Diwas", category: "national", icon: "🕊️", descBn: "রাজীব গান্ধীর জন্মদিনে জাতীয় সম্প্রীতি ও সদ্ভাবনার বার্তা ছড়াতে দিবস।" },
  { md: "08-23", nameBn: "দাসপ্রথা বিলোপ স্মরণ দিবস", nameEn: "Day for Remembrance of the Slave Trade", category: "observance", icon: "⛓️", descBn: "দাসব্যবসা ও তার বিলোপ স্মরণে আন্তর্জাতিক দিবস।" },
  { md: "08-29", nameBn: "জাতীয় ক্রীড়া দিবস", nameEn: "National Sports Day", category: "observance", icon: "🏑", descBn: "হকির জাদুকর মেজর ধ্যানচাঁদের জন্মদিনে ভারতের ক্রীড়া দিবস।" },

  // ── September ───────────────────────────────────────────────────────────
  { md: "09-05", nameBn: "শিক্ষক দিবস", nameEn: "Teachers' Day", category: "observance", icon: "👨‍🏫", descBn: "ডা. সর্বপল্লী রাধাকৃষ্ণনের জন্মদিনে শিক্ষকদের প্রতি শ্রদ্ধা জ্ঞাপনের দিন।" },
  { md: "09-08", nameBn: "আন্তর্জাতিক সাক্ষরতা দিবস", nameEn: "International Literacy Day", category: "observance", icon: "📖", descBn: "সর্বজনীন সাক্ষরতার গুরুত্ব নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "09-14", nameBn: "হিন্দি দিবস", nameEn: "Hindi Diwas", category: "cultural", icon: "🗣️", descBn: "ভারতের রাজভাষা হিসেবে হিন্দির স্বীকৃতি স্মরণে পালিত দিবস।" },
  { md: "09-15", nameBn: "আন্তর্জাতিক গণতন্ত্র দিবস", nameEn: "International Day of Democracy", category: "observance", icon: "🗳️", descBn: "গণতান্ত্রিক মূল্যবোধের গুরুত্ব নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "09-17", nameBn: "হায়দরাবাদ মুক্তি দিবস", nameEn: "Hyderabad Liberation Day", category: "national", icon: "🏛️", descBn: "১৯৪৮ সালে হায়দরাবাদ ভারতের সঙ্গে যুক্ত হওয়ার দিন স্মরণে পালিত।" },
  { md: "09-21", nameBn: "আন্তর্জাতিক শান্তি দিবস", nameEn: "International Day of Peace", category: "observance", icon: "🕊️", descBn: "বিশ্বশান্তির বার্তা ছড়াতে পালিত আন্তর্জাতিক দিবস।" },
  { md: "09-27", nameBn: "বিশ্ব পর্যটন দিবস", nameEn: "World Tourism Day", category: "cultural", icon: "🧳", descBn: "পর্যটনের সামাজিক ও সাংস্কৃতিক গুরুত্ব নিয়ে আন্তর্জাতিক দিবস।" },

  // ── October ─────────────────────────────────────────────────────────────
  { md: "10-01", nameBn: "আন্তর্জাতিক প্রবীণ দিবস", nameEn: "Day of Older Persons", category: "observance", icon: "👴", descBn: "প্রবীণ নাগরিকদের সম্মান ও অধিকার নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "10-05", nameBn: "বিশ্ব শিক্ষক দিবস", nameEn: "World Teachers' Day", category: "observance", icon: "👩‍🏫", descBn: "শিক্ষকদের অবদান উদযাপনে পালিত আন্তর্জাতিক দিবস।" },
  { md: "10-08", nameBn: "ভারতীয় বিমানবাহিনী দিবস", nameEn: "Indian Air Force Day", category: "national", icon: "✈️", descBn: "ভারতীয় বিমানবাহিনীর প্রতিষ্ঠা ও সাহস স্মরণে পালিত দিবস।" },
  { md: "10-10", nameBn: "বিশ্ব মানসিক স্বাস্থ্য দিবস", nameEn: "World Mental Health Day", category: "observance", icon: "🧠", descBn: "মানসিক স্বাস্থ্য নিয়ে সচেতনতা বৃদ্ধিতে আন্তর্জাতিক দিবস।" },
  { md: "10-11", nameBn: "জাতীয় ডাক দিবস", nameEn: "National Postal Day", category: "observance", icon: "📮", descBn: "ভারতীয় ডাকব্যবস্থার ভূমিকা স্মরণে পালিত দিবস।" },
  { md: "10-16", nameBn: "বিশ্ব খাদ্য দিবস", nameEn: "World Food Day", category: "observance", icon: "🍚", descBn: "ক্ষুধামুক্তি ও খাদ্য নিরাপত্তা নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "10-24", nameBn: "জাতিসংঘ দিবস", nameEn: "United Nations Day", category: "observance", icon: "🇺🇳", descBn: "জাতিসংঘ প্রতিষ্ঠার দিন স্মরণে পালিত আন্তর্জাতিক দিবস।" },
  { md: "10-31", nameBn: "জাতীয় ঐক্য দিবস", nameEn: "National Unity Day", category: "national", icon: "🧱", descBn: "সর্দার বল্লভভাই প্যাটেলের জন্মদিনে জাতীয় ঐক্য ও অখণ্ডতার বার্তা ছড়াতে দিবস।" },

  // ── November ────────────────────────────────────────────────────────────
  { md: "11-07", nameBn: "জাতীয় ক্যান্সার সচেতনতা দিবস", nameEn: "National Cancer Awareness Day", category: "observance", icon: "🎗️", descBn: "ক্যান্সার প্রতিরোধ ও সচেতনতায় ভারতে পালিত দিবস।" },
  { md: "11-10", nameBn: "শান্তি ও উন্নয়নে বিজ্ঞান দিবস", nameEn: "World Science Day for Peace", category: "observance", icon: "🔬", descBn: "শান্তি ও উন্নয়নে বিজ্ঞানের ভূমিকা নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "11-14", nameBn: "শিশু দিবস", nameEn: "Children's Day", category: "national", icon: "🧒", descBn: "জওহরলাল নেহরুর জন্মদিনে ভারতে পালিত শিশু দিবস।" },
  { md: "11-16", nameBn: "আন্তর্জাতিক সহিষ্ণুতা দিবস", nameEn: "International Day for Tolerance", category: "observance", icon: "🤝", descBn: "সামাজিক সহিষ্ণুতা ও সম্প্রীতির গুরুত্ব নিয়ে দিবস।" },
  { md: "11-19", nameBn: "বিশ্ব শৌচাগার দিবস", nameEn: "World Toilet Day", category: "observance", icon: "🚽", descBn: "স্যানিটেশন ও স্বাস্থ্যবিধি নিয়ে সচেতনতার আন্তর্জাতিক দিবস।" },
  { md: "11-20", nameBn: "বিশ্ব শিশু দিবস", nameEn: "World Children's Day", category: "observance", icon: "🧒", descBn: "শিশুদের অধিকার ও কল্যাণ নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "11-26", nameBn: "সংবিধান দিবস", nameEn: "Constitution Day", category: "national", icon: "📜", descBn: "১৯৪৯ সালে ভারতের সংবিধান গৃহীত হওয়ার দিন স্মরণে পালিত দিবস।" },

  // ── December ────────────────────────────────────────────────────────────
  { md: "12-01", nameBn: "বিশ্ব এইডস দিবস", nameEn: "World AIDS Day", category: "observance", icon: "🎗️", descBn: "এইচআইভি/এইডস নিয়ে সচেতনতা বৃদ্ধিতে আন্তর্জাতিক দিবস।" },
  { md: "12-03", nameBn: "আন্তর্জাতিক প্রতিবন্ধী দিবস", nameEn: "Day of Persons with Disabilities", category: "observance", icon: "♿", descBn: "প্রতিবন্ধী ব্যক্তিদের অধিকার ও মর্যাদা নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "12-04", nameBn: "ভারতীয় নৌবাহিনী দিবস", nameEn: "Indian Navy Day", category: "national", icon: "⚓", descBn: "ভারতীয় নৌবাহিনীর সাহস ও অর্জন স্মরণে পালিত দিবস।" },
  { md: "12-05", nameBn: "আন্তর্জাতিক স্বেচ্ছাসেবক দিবস", nameEn: "International Volunteer Day", category: "observance", icon: "🙌", descBn: "স্বেচ্ছাসেবকদের অবদান স্মরণে পালিত আন্তর্জাতিক দিবস।" },
  { md: "12-07", nameBn: "সশস্ত্র বাহিনী পতাকা দিবস", nameEn: "Armed Forces Flag Day", category: "national", icon: "🎗️", descBn: "সশস্ত্র বাহিনীর সেনা ও তাঁদের পরিবারের কল্যাণে পালিত দিবস।" },
  { md: "12-10", nameBn: "মানবাধিকার দিবস", nameEn: "Human Rights Day", category: "observance", icon: "⚖️", descBn: "সর্বজনীন মানবাধিকার ঘোষণাপত্র স্মরণে পালিত আন্তর্জাতিক দিবস।" },
  { md: "12-14", nameBn: "জাতীয় শক্তি সংরক্ষণ দিবস", nameEn: "National Energy Conservation Day", category: "observance", icon: "💡", descBn: "শক্তির অপচয় রোধ ও সংরক্ষণে সচেতনতার দিন।" },
  { md: "12-18", nameBn: "আন্তর্জাতিক অভিবাসী দিবস", nameEn: "International Migrants Day", category: "observance", icon: "🧳", descBn: "অভিবাসী মানুষের অধিকার ও অবদান নিয়ে আন্তর্জাতিক দিবস।" },
  { md: "12-23", nameBn: "জাতীয় কৃষক দিবস", nameEn: "National Farmers' Day", category: "national", icon: "🌾", descBn: "প্রাক্তন প্রধানমন্ত্রী চৌধুরী চরণ সিংহের জন্মদিনে কৃষকদের অবদান স্মরণে দিবস।" },
];

/** Observances/events recurring on the given date's MM-DD, as Festival objects. */
export function getObservancesForDate(date: Date): Festival[] {
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const md = `${mm}-${dd}`;
  const yyyy = date.getUTCFullYear();
  return OBSERVANCES.filter(o => o.md === md).map(o => ({
    date: `${yyyy}-${md}`,
    nameBn: o.nameBn,
    nameEn: o.nameEn,
    category: o.category,
    icon: o.icon,
    descBn: o.descBn,
    yearRef: o.yearRef,
    slug: o.slug,
  }));
}

/** Next `count` annual occurrences of a slugged observance/event, as Festival objects. */
export function getObservanceDatesForSlug(slug: string, fromDate: Date, count = 4): Festival[] {
  const o = OBSERVANCES.find(x => x.slug === slug);
  if (!o) return [];
  const from = fromDate.toISOString().slice(0, 10);
  const startYear = fromDate.getUTCFullYear();
  const out: Festival[] = [];
  for (let y = startYear; out.length < count; y++) {
    const date = `${y}-${o.md}`;
    if (date >= from) {
      out.push({
        date, nameBn: o.nameBn, nameEn: o.nameEn, category: o.category,
        icon: o.icon, descBn: o.descBn, yearRef: o.yearRef, slug: o.slug,
      });
    }
  }
  return out;
}
