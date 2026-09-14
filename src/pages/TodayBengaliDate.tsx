import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import {
  getTithiAtSunrise, getNakshatraAtSunrise,
  getYogaAtSunrise, getKaranaAtSunrise,
  getSunTimes, formatKolkataTime,
} from "@/lib/panjika";
import { toBengaliDate, toBengaliNumerals } from "@/lib/bengali-calendar";
import { getFestivalsForDate } from "@/lib/festivals";
import { getObservancesForDate } from "@/lib/observances";
import { getAllAnniversariesForDate } from "@/lib/calendar-events";
import { getPersonalityDetail } from "@/lib/personality-details";
import { applyPageSEO, injectSchema, removeSchema, SITE_URL } from "@/lib/seo";
import { format } from "date-fns";

export default function TodayBengaliDate() {
  const today = useMemo(() => new Date(), []);

  const bnDate    = useMemo(() => toBengaliDate(today), [today]);
  const tithi     = useMemo(() => getTithiAtSunrise(today), [today]);
  const nakshatra = useMemo(() => getNakshatraAtSunrise(today), [today]);
  const yoga      = useMemo(() => getYogaAtSunrise(today), [today]);
  const karana    = useMemo(() => getKaranaAtSunrise(today), [today]);
  const sunTimes  = useMemo(() => getSunTimes(today), [today]);

  const utcToday    = useMemo(() => new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())), [today]);
  const todayEvents = useMemo(() => [...getFestivalsForDate(utcToday), ...getObservancesForDate(utcToday)], [utcToday]);
  const anniversaries = useMemo(() => getAllAnniversariesForDate(utcToday), [utcToday]);
  const births = useMemo(() => anniversaries.filter(a => a.anniversaryType === "birth"), [anniversaries]);
  const deaths = useMemo(() => anniversaries.filter(a => a.anniversaryType === "death"), [anniversaries]);

  const bnDateStr = `${toBengaliNumerals(bnDate.day)} ${bnDate.monthNameBn} ${toBengaliNumerals(bnDate.year)} বঙ্গাব্দ`;

  const title = `আজকের বাংলা তারিখ: ${bnDateStr} — তিথি ${tithi.nameBn} | সঠিক বাংলা ক্যালেন্ডার`;
  const description = `আজকের বাংলা তারিখ ${bnDateStr}। আজকের তিথি: ${tithi.nameBn} (${tithi.pakshaBn}), নক্ষত্র: ${nakshatra.nameBn}, যোগ: ${yoga.nameBn}। সূর্যোদয়: ${formatKolkataTime(sunTimes.sunrise)}, সূর্যাস্ত: ${formatKolkataTime(sunTimes.sunset)}।`;

  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "আজকের বাংলা তারিখ কত?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `আজকের বাংলা তারিখ ${bnDateStr} (${bnDate.dayNameBn})।`
          }
        },
        {
          "@type": "Question",
          "name": "আজকের তিথি কী?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `আজকের তিথি ${tithi.nameBn} (${tithi.pakshaBn})।`
          }
        },
        {
          "@type": "Question",
          "name": "আজকের নক্ষত্র কী?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `আজকের নক্ষত্র ${nakshatra.nameBn} (${nakshatra.nameEn})।`
          }
        },
        {
          "@type": "Question",
          "name": "আজকের সূর্যোদয় ও সূর্যাস্তের সময় কত?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `কলকাতায় আজকের সূর্যোদয়: ${formatKolkataTime(sunTimes.sunrise)}, সূর্যাস্ত: ${formatKolkataTime(sunTimes.sunset)}।`
          }
        }
      ]
    };

    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "সঠিক বাংলা ক্যালেন্ডার", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "আজকের বাংলা তারিখ", "item": `${SITE_URL}/today-bengali-date` }
      ]
    };

    applyPageSEO({ title, description, path: "/today-bengali-date" });
    injectSchema("today-faq-schema", faqSchema);
    injectSchema("today-breadcrumb-schema", breadcrumb);

    const personEntities = anniversaries.map(a => ({
      "@type": "Person",
      "name": a.person.nameBn,
      "alternateName": a.person.nameEn,
      "birthDate": `${String(a.person.birthYear).padStart(4, "0")}-${a.person.birthMD}`,
      ...(a.person.deathYear
        ? { "deathDate": a.person.deathMD ? `${String(a.person.deathYear).padStart(4, "0")}-${a.person.deathMD}` : String(a.person.deathYear) }
        : {}),
      "jobTitle": a.person.role,
      "description": a.person.descBn,
      "sameAs": a.person.wikiUrl,
      "nationality": "Indian",
    }));
    const eventEntities = todayEvents.map(f => ({
      "@type": "Event",
      "name": f.nameEn,
      "alternateName": f.nameBn,
      "startDate": f.date,
      ...(f.descBn ? { "description": f.descBn } : {}),
      "inLanguage": "bn",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "url": f.slug ? `${SITE_URL}/festival/${f.slug}` : `${SITE_URL}/today-bengali-date`,
    }));
    const graph = [...personEntities, ...eventEntities];
    if (graph.length > 0) {
      injectSchema("today-entities-schema", { "@context": "https://schema.org", "@graph": graph });
    }

    return () => {
      removeSchema("today-faq-schema");
      removeSchema("today-breadcrumb-schema");
      removeSchema("today-entities-schema");
    };
  }, [title, description, bnDateStr, bnDate, tithi, nakshatra, yoga, sunTimes, todayEvents, anniversaries]);

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground font-bengali">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link href="/" className="hover:text-foreground transition-colors">হোম</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-semibold">আজকের বাংলা তারিখ</li>
          </ol>
        </nav>

        {/* Hero date display */}
        <div className="bg-primary text-primary-foreground rounded-3xl p-8 text-center shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 rounded-full scale-150 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="text-xs font-bengali text-primary-foreground/60 uppercase tracking-widest mb-3">
              আজকের বাংলা তারিখ — {format(today, "d MMMM yyyy")}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-bengali leading-tight mb-2">
              {toBengaliNumerals(bnDate.day)} {bnDate.monthNameBn}
            </h1>
            <div className="text-primary-foreground/80 font-bengali text-xl mt-1">
              {toBengaliNumerals(bnDate.year)} বঙ্গাব্দ
            </div>
            <div className="mt-3 inline-block bg-primary-foreground/15 px-4 py-1.5 rounded-full font-bengali text-sm">
              {bnDate.dayNameBn} · {tithi.icon} {tithi.nameBn}
            </div>
          </div>
        </div>

        {/* Panchang grid */}
        <section aria-labelledby="panchang-heading">
          <h2 id="panchang-heading" className="text-lg font-bold font-bengali mb-4 text-foreground">
            আজকের পঞ্জিকা
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "তিথি", value: tithi.nameBn, sub: tithi.pakshaBn, icon: tithi.icon },
              { label: "নক্ষত্র", value: nakshatra.nameBn, sub: nakshatra.nameEn, icon: "🌙" },
              { label: "যোগ", value: yoga.nameBn, sub: yoga.nameEn, icon: yoga.nature === "good" ? "✨" : "⚠️" },
              { label: "করণ", value: karana.nameBn, sub: karana.nameEn, icon: "🔆" },
              { label: "সূর্যোদয়", value: formatKolkataTime(sunTimes.sunrise), sub: "কলকাতা", icon: "☀️" },
              { label: "সূর্যাস্ত", value: formatKolkataTime(sunTimes.sunset), sub: "কলকাতা", icon: "🌅" },
            ].map(({ label, value, sub, icon }) => (
              <div key={label} className="bg-card border border-card-border rounded-xl p-4">
                <div className="text-xs text-muted-foreground font-bengali uppercase tracking-wide mb-1">{label}</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <div className="font-bold font-bengali text-foreground">{value}</div>
                    {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why today matters */}
        {(todayEvents.length > 0 || births.length > 0 || deaths.length > 0) && (
          <section aria-labelledby="today-special-heading" className="mt-8">
            <h2 id="today-special-heading" className="text-lg font-bold font-bengali mb-4 text-foreground">
              আজকের দিনটি কেন বিশেষ?
            </h2>

            {todayEvents.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-bold font-bengali text-muted-foreground mb-2">আজকের উৎসব ও বিশেষ দিন</h3>
                <div className="flex flex-wrap gap-2">
                  {todayEvents.map(f =>
                    f.slug ? (
                      <Link
                        key={f.slug}
                        href={`/festival/${f.slug}`}
                        className="inline-flex items-center gap-1.5 bg-card hover:bg-accent border border-card-border text-foreground text-xs font-bengali font-medium px-3 py-1.5 rounded-full transition-colors"
                      >
                        <span>{f.icon}</span><span>{f.nameBn}</span>
                      </Link>
                    ) : (
                      <span key={f.nameBn} className="inline-flex items-center gap-1.5 bg-card border border-card-border text-foreground text-xs font-bengali font-medium px-3 py-1.5 rounded-full">
                        <span>{f.icon}</span><span>{f.nameBn}</span>
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {births.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-bold font-bengali text-muted-foreground mb-2">আজ জন্মদিন</h3>
                <div className="space-y-2">
                  {births.map(a => {
                    const cardClass = "block bg-card border border-card-border rounded-xl p-3 hover:bg-accent transition-colors";
                    const cardContent = (
                      <>
                        <div className="font-bold font-bengali text-foreground text-sm">
                          {a.person.emoji} {a.person.nameBn} <span className="text-muted-foreground font-normal">({a.yearsSince} তম জন্মজয়ন্তী)</span>
                        </div>
                        <div className="text-xs text-muted-foreground font-bengali mt-1">{a.person.role} — {a.person.descBn}</div>
                      </>
                    );
                    return getPersonalityDetail(a.person.id) ? (
                      <Link key={a.person.nameEn} href={`/personality/${a.person.id}`} className={cardClass}>
                        {cardContent}
                      </Link>
                    ) : (
                      <a key={a.person.nameEn} href={a.person.wikiUrl} target="_blank" rel="noopener noreferrer" className={cardClass}>
                        {cardContent}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {deaths.length > 0 && (
              <div>
                <h3 className="text-sm font-bold font-bengali text-muted-foreground mb-2">আজ মৃত্যুবার্ষিকী</h3>
                <div className="space-y-2">
                  {deaths.map(a => {
                    const cardClass = "block bg-card border border-card-border rounded-xl p-3 hover:bg-accent transition-colors";
                    const cardContent = (
                      <>
                        <div className="font-bold font-bengali text-foreground text-sm">
                          {a.person.emoji} {a.person.nameBn} <span className="text-muted-foreground font-normal">({a.yearsSince} তম মৃত্যুবার্ষিকী)</span>
                        </div>
                        <div className="text-xs text-muted-foreground font-bengali mt-1">{a.person.role} — {a.person.descBn}</div>
                      </>
                    );
                    return getPersonalityDetail(a.person.id) ? (
                      <Link key={a.person.nameEn} href={`/personality/${a.person.id}`} className={cardClass}>
                        {cardContent}
                      </Link>
                    ) : (
                      <a key={a.person.nameEn} href={a.person.wikiUrl} target="_blank" rel="noopener noreferrer" className={cardClass}>
                        {cardContent}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* SEO FAQ section */}
        <section className="mt-8 space-y-4 font-bengali text-sm text-foreground/80 leading-relaxed">
          <h2 className="text-base font-bold text-foreground">আজকের বাংলা তারিখ সম্পর্কে প্রশ্ন ও উত্তর</h2>

          <div className="space-y-3">
            <div className="bg-card border border-card-border rounded-xl p-4">
              <p className="font-semibold text-foreground">আজকের বাংলা তারিখ কত?</p>
              <p className="mt-1 text-muted-foreground">{bnDateStr} ({bnDate.dayNameBn})।</p>
            </div>

            <div className="bg-card border border-card-border rounded-xl p-4">
              <p className="font-semibold text-foreground">আজকের তিথি কী?</p>
              <p className="mt-1 text-muted-foreground">আজকের তিথি {tithi.nameBn} ({tithi.pakshaBn})।</p>
            </div>

            <div className="bg-card border border-card-border rounded-xl p-4">
              <p className="font-semibold text-foreground">আজকের নক্ষত্র কী?</p>
              <p className="mt-1 text-muted-foreground">আজকের নক্ষত্র {nakshatra.nameBn} ({nakshatra.nameEn})।</p>
            </div>

            <div className="bg-card border border-card-border rounded-xl p-4">
              <p className="font-semibold text-foreground">কলকাতায় আজকের সূর্যোদয় ও সূর্যাস্ত কখন?</p>
              <p className="mt-1 text-muted-foreground">
                সূর্যোদয়: {formatKolkataTime(sunTimes.sunrise)}, সূর্যাস্ত: {formatKolkataTime(sunTimes.sunset)} (IST)।
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link
            href={`/date/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`}
            className="inline-block bg-primary text-primary-foreground font-bengali font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            আজকের সম্পূর্ণ পঞ্জিকা দেখুন
          </Link>
          <div className="mt-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-bengali">
              ← মূল ক্যালেন্ডারে ফিরে যান
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
