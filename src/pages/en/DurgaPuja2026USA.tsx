import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Clock } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { applyPageSEO, removeSchema, SITE_URL } from "@/lib/seo";

const PATH = "/en/durga-puja-2026-usa-uk-canada-dates-times";
const TITLE = "Durga Puja 2026 Dates & Times in USA, UK, Canada & Australia (EST/PST/GMT/AEDT)";
const DESC = "Durga Puja 2026 falls October 16-20. Exact Sandhi Puja and daily ritual times converted to US Eastern, Pacific, UK, and Australian time zones — accurate for the Bengali diaspora.";
const SCHEMA_ID = "durga-puja-en-schema";

interface DaySchedule {
  heading: string;
  note?: string;
  rows: { label: string; ist: string }[];
  zones: { label: string; value: string }[];
}

const SCHEDULE: DaySchedule[] = [
  {
    heading: "Maha Shashthi — Bodhon (Friday, October 16)",
    rows: [{ label: "Evening rituals begin", ist: "~6:00 PM IST" }],
    zones: [
      { label: "US Eastern (EDT)", value: "Friday, 8:30 AM" },
      { label: "US Pacific (PDT)", value: "Friday, 5:30 AM" },
      { label: "UK (BST)", value: "Friday, 1:30 PM" },
      { label: "Sydney (AEDT)", value: "Friday, 11:30 PM" },
    ],
  },
  {
    heading: "Maha Saptami — Navapatrika (Saturday, October 17)",
    rows: [{ label: "Navapatrika entry begins", ist: "7:04 AM IST" }],
    zones: [
      { label: "US Eastern (EDT)", value: "Friday, 9:34 PM" },
      { label: "US Pacific (PDT)", value: "Friday, 6:34 PM" },
      { label: "UK (BST)", value: "Saturday, 2:34 AM" },
      { label: "Sydney (AEDT)", value: "Saturday, 12:34 PM" },
    ],
  },
  {
    heading: "Maha Ashtami (Sunday, October 18)",
    rows: [{ label: "Puja begins", ist: "7:05 AM IST" }],
    zones: [
      { label: "US Eastern (EDT)", value: "Saturday, 9:35 PM" },
      { label: "US Pacific (PDT)", value: "Saturday, 6:35 PM" },
      { label: "UK (BST)", value: "Sunday, 2:35 AM" },
      { label: "Sydney (AEDT)", value: "Sunday, 12:35 PM" },
    ],
  },
  {
    heading: "Sandhi Puja — the exact 48-minute window (Monday, October 19)",
    note: "Sandhi Puja marks the precise junction of Ashtami and Navami tithis — traditionally the most powerful moment of Durga Puja, when the Goddess is believed to have taken the form of Chamunda. Exact timing matters more here than for any other ritual.",
    rows: [
      { label: "Begins", ist: "7:26 AM IST" },
      { label: "Balidan (peak moment)", ist: "7:50 AM IST" },
      { label: "Ends", ist: "8:14 AM IST" },
    ],
    zones: [
      { label: "US Eastern (EDT)", value: "Sun Oct 18, 9:56–10:44 PM (peak 10:20 PM)" },
      { label: "US Pacific (PDT)", value: "Sun Oct 18, 6:56–7:44 PM (peak 7:20 PM)" },
      { label: "UK (BST)", value: "Mon Oct 19, 2:56–3:44 AM (peak 3:20 AM)" },
      { label: "Sydney (AEDT)", value: "Mon Oct 19, 12:56–1:44 PM (peak 1:20 PM)" },
    ],
  },
  {
    heading: "Maha Navami (Monday, October 19)",
    rows: [{ label: "Navami tithi begins", ist: "7:50 AM IST" }],
    zones: [
      { label: "US Eastern (EDT)", value: "Sunday, 10:20 PM" },
      { label: "US Pacific (PDT)", value: "Sunday, 7:20 PM" },
      { label: "UK (BST)", value: "Monday, 3:20 AM" },
      { label: "Sydney (AEDT)", value: "Monday, 1:20 PM" },
    ],
  },
  {
    heading: "Vijaya Dashami — Visarjan (Tuesday, October 20)",
    rows: [{ label: "Puja completion & visarjan by", ist: "8:31 AM IST" }],
    zones: [
      { label: "US Eastern (EDT)", value: "Monday, 11:01 PM" },
      { label: "US Pacific (PDT)", value: "Monday, 8:01 PM" },
      { label: "UK (BST)", value: "Tuesday, 4:01 AM" },
      { label: "Sydney (AEDT)", value: "Tuesday, 2:01 PM" },
    ],
  },
];

const FAQ = [
  { q: "What are the Durga Puja 2026 dates?", a: "Durga Puja 2026 runs from Maha Shashthi on Friday, October 16 through Vijaya Dashami on Tuesday, October 20, all dates as observed in Kolkata (India Standard Time)." },
  { q: "What time is Sandhi Puja 2026 in the USA (EST/PST)?", a: "Sandhi Puja's peak moment (Balidan) at 7:50 AM IST on October 19 falls at 10:20 PM EDT and 7:20 PM PDT on Sunday, October 18 — the US East/West Coast is a full calendar day behind due to the time difference." },
  { q: "What time is Sandhi Puja 2026 in the UK?", a: "Sandhi Puja's peak moment (7:50 AM IST, October 19) falls at 3:20 AM BST on Monday, October 19 in the UK." },
  { q: "Why do Puja dates and times differ between Bengali panjikas?", a: "Different panjika publishers occasionally use slightly different traditional calculation methods, which can shift exact tithi transition times by a few hours — enough to occasionally affect which calendar day a ritual falls on. This page uses times verified against a published Bengali panjika." },
];

export default function DurgaPuja2026USA() {
  useEffect(() => {
    document.documentElement.lang = "en";

    applyPageSEO({
      title: TITLE,
      description: DESC,
      path: PATH,
      schemaId: SCHEMA_ID,
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "name": TITLE,
            "description": DESC,
            "url": `${SITE_URL}${PATH}`,
            "inLanguage": "en",
            "isPartOf": { "@type": "WebSite", "url": SITE_URL, "name": "Sothik Bangla Calendar" },
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Sothik Bangla Calendar", "item": SITE_URL },
              { "@type": "ListItem", "position": 2, "name": "Durga Puja 2026 — International Times", "item": `${SITE_URL}${PATH}` },
            ],
          },
          {
            "@type": "FAQPage",
            "mainEntity": FAQ.map(({ q, a }) => ({
              "@type": "Question",
              "name": q,
              "acceptedAnswer": { "@type": "Answer", "text": a },
            })),
          },
        ],
      },
    });

    return () => {
      document.documentElement.lang = "bn";
      removeSchema(SCHEMA_ID);
    };
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <NavBar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>

        <div className="bg-card border border-card-border rounded-2xl shadow-premium p-5 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-3">
            Durga Puja 2026 — Dates &amp; Times for the Bengali Diaspora
          </h1>
          <p className="text-foreground/90 leading-relaxed mb-6">
            <strong>Durga Puja 2026 runs from Friday, October 16 (Maha Shashthi) through Tuesday, October 20 (Vijaya Dashami)</strong>,
            as observed in Kolkata, India. If you're celebrating from the USA, UK, Canada, or Australia, here are the exact ritual
            times converted to your local time zone — including the precise 48-minute Sandhi Puja window, the most time-sensitive
            moment of the entire festival.
          </p>

          <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Full Schedule — IST vs. Your Time Zone
          </h2>

          <div className="space-y-5">
            {SCHEDULE.map((day, i) => (
              <div key={i} className="bg-muted/40 border border-border rounded-xl p-4">
                <h3 className="font-bold text-card-foreground mb-2">{day.heading}</h3>
                {day.note && <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{day.note}</p>}
                <div className="text-sm text-foreground/90 mb-2">
                  {day.rows.map((r, j) => (
                    <div key={j}><strong>{r.label}:</strong> {r.ist}</div>
                  ))}
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-3 pt-3 border-t border-border/60">
                  {day.zones.map((z, j) => (
                    <div key={j} className="flex justify-between text-sm">
                      <dt className="text-muted-foreground">{z.label}</dt>
                      <dd className="font-semibold text-card-foreground text-right">{z.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-card-foreground mt-8 mb-3">About Durga Puja</h2>
          <p className="text-foreground/90 leading-relaxed mb-6">
            Durga Puja is Bengal's largest religious and cultural festival, commemorating the goddess Durga's victory over the
            buffalo demon Mahishasura. Celebrated over five main days from Shashthi to Vijaya Dashami, it was recognized by
            UNESCO in 2021 as an "Intangible Cultural Heritage of Humanity." For the Bengali diaspora, Durga Puja is often the
            year's biggest gathering — community pujas run by Bengali associations in most major US, UK, Canadian, and
            Australian cities recreate the full five-day ritual calendar, frequently on the nearest weekend for practical
            reasons, though the traditional dates and tithi-based timings remain as listed above.
          </p>

          <h2 className="text-xl font-bold text-card-foreground mb-3">Frequently Asked Questions</h2>
          <div className="space-y-4 mb-6">
            {FAQ.map(({ q, a }, i) => (
              <div key={i}>
                <h3 className="font-bold text-card-foreground text-sm mb-1">{q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 text-sm border-t border-border pt-4">
            <Link href="/festival/durga-puja" className="text-primary hover:underline font-bengali">
              বাংলায় সম্পূর্ণ দুর্গাপূজার নির্ঘণ্ট দেখুন
            </Link>
            <Link href="/" className="text-primary hover:underline">সঠিক বাংলা ক্যালেন্ডার home</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
