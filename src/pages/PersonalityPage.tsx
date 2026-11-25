import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { NavBar } from "@/components/NavBar";
import { ShareButton } from "@/components/ShareButton";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { applyPageSEO, injectSchema, removeSchema, SITE_URL } from "@/lib/seo";
import { getPersonalityDetail } from "@/lib/personality-details";
import { getFestivalDetail } from "@/lib/festival-details";
import { FAMOUS_PEOPLE } from "@/lib/famous-people";
import { cn } from "@/lib/utils";
import { ArrowLeft, ExternalLink, BookOpen } from "lucide-react";

export default function PersonalityPage() {
  const [, params] = useRoute("/personality/:slug");
  const slug = params?.slug ?? "";
  const detail = getPersonalityDetail(slug);
  const person = FAMOUS_PEOPLE.find(p => p.id === slug);
  const festival = detail?.festivalSlug ? getFestivalDetail(detail.festivalSlug) : undefined;

  const SCHEMA_ID = `personality-${slug}-schema`;

  useEffect(() => {
    if (!detail || !person) return;

    applyPageSEO({
      title: `${detail.nameBn} — জীবনী, জন্মতারিখ ও অবদান | সঠিক বাংলা ক্যালেন্ডার`,
      description: `${detail.tagline}। ${detail.descBn[0].slice(0, 120)}…`,
      path: `/personality/${slug}`,
      schemaId: SCHEMA_ID,
      schema: {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": detail.nameBn,
        "alternateName": detail.nameEn,
        "description": detail.descBn[0],
        "url": `${SITE_URL}/personality/${slug}`,
        "birthDate": `${String(person.birthYear).padStart(4, "0")}-${person.birthMD}`,
        ...(person.deathYear
          ? { "deathDate": person.deathMD ? `${String(person.deathYear).padStart(4, "0")}-${person.deathMD}` : String(person.deathYear) }
          : {}),
        "jobTitle": person.role,
        "sameAs": detail.wikiUrl,
        "nationality": "Indian",
      },
    });

    injectSchema(`personality-${slug}-breadcrumb`, {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "সঠিক বাংলা ক্যালেন্ডার", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": detail.nameBn, "item": `${SITE_URL}/personality/${slug}` },
      ],
    });

    return () => {
      removeSchema(SCHEMA_ID);
      removeSchema(`personality-${slug}-breadcrumb`);
    };
  }, [slug, detail, person]);

  if (!detail || !person) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center font-bengali">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">তথ্য পাওয়া যায়নি</h1>
          <p className="text-muted-foreground mb-6">এই ব্যক্তির জীবনী এখনও যোগ করা হয়নি।</p>
          <Link href="/" className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold">
            ক্যালেন্ডারে ফিরুন
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <NavBar />

      {/* Hero header */}
      <div className={cn("bg-gradient-to-br text-white py-10 px-4", detail.headerGradient)}>
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bengali">ক্যালেন্ডারে ফিরুন</span>
          </Link>

          <div className="text-6xl mb-3">{detail.emoji}</div>
          <h1 className="text-3xl sm:text-4xl font-bold font-bengali leading-tight">{detail.nameBn}</h1>
          <p className="text-white/80 font-bengali mt-2 text-sm sm:text-base leading-relaxed">{detail.tagline}</p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="text-xs font-bengali font-semibold px-3 py-1 rounded-full bg-white/20">
              জন্ম: {person.birthYear}{person.deathYear ? ` · মৃত্যু: ${person.deathYear}` : ""}
            </span>
            <a
              href={detail.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Wikipedia
            </a>
            <ShareButton variant="compact" text={`${detail.emoji} ${detail.nameBn}\n${detail.tagline}`} />
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-8 space-y-8">

        {/* Biography */}
        <section>
          <h2 className="font-bold font-bengali text-xl mb-4">জীবনী</h2>
          <div className="space-y-3">
            {detail.descBn.map((para, i) => (
              <p key={i} className="font-bengali text-foreground/90 leading-relaxed text-sm sm:text-base">
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* Notable works */}
        {detail.works && detail.works.length > 0 && (
          <section>
            <h2 className="font-bold font-bengali text-xl mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              উল্লেখযোগ্য কীর্তি
            </h2>
            <div className="flex flex-wrap gap-2">
              {detail.works.map(w => (
                <span key={w} className="bg-card border border-card-border text-foreground text-xs font-bengali font-medium px-3 py-1.5 rounded-full">
                  {w}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Related festival */}
        {festival && (
          <section>
            <h2 className="font-bold font-bengali text-xl mb-4">পালিত দিবস</h2>
            <Link
              href={`/festival/${festival.slug}`}
              className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 hover:bg-primary/10 text-foreground px-4 py-3 rounded-xl text-sm font-bengali font-medium transition-colors"
            >
              <span>{festival.icon}</span>
              <span>{festival.nameBn} সম্পর্কে বিস্তারিত দেখুন</span>
            </Link>
          </section>
        )}

        {/* Related personalities */}
        {detail.relatedSlugs.length > 0 && (
          <section>
            <h2 className="font-bold font-bengali text-xl mb-4">সম্পর্কিত ব্যক্তিত্ব</h2>
            <div className="flex flex-wrap gap-2">
              {detail.relatedSlugs.map(rs => {
                const r = getPersonalityDetail(rs);
                if (!r) return null;
                return (
                  <Link
                    key={rs}
                    href={`/personality/${rs}`}
                    className="inline-flex items-center gap-1.5 bg-accent hover:bg-primary hover:text-primary-foreground text-accent-foreground px-4 py-2 rounded-full text-sm font-bengali font-medium transition-colors"
                  >
                    <span>{r.emoji}</span>
                    <span>{r.nameBn}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* WhatsApp channel CTA */}
        <WhatsAppCTA />

        {/* Internal nav */}
        <section className="border-t border-border pt-6">
          <div className="flex flex-wrap gap-3 font-bengali text-sm">
            <Link href="/" className="text-primary hover:underline">📅 ক্যালেন্ডার</Link>
            <Link href="/panjika" className="text-primary hover:underline">📖 পঞ্জিকা</Link>
            <Link href="/today-bengali-date" className="text-primary hover:underline">🗓 আজকের তারিখ</Link>
          </div>
        </section>

      </main>
    </div>
  );
}
