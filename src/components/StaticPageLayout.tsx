import { useEffect } from "react";
import type { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { applyPageSEO, removeSchema, SITE_URL } from "@/lib/seo";

interface StaticPageLayoutProps {
  path: string;
  crumb: string;
  title: string;
  description: string;
  children: ReactNode;
}

/** Shared shell for simple static-content pages (About, Contact, Privacy, Disclaimer). */
export function StaticPageLayout({ path, crumb, title, description, children }: StaticPageLayoutProps) {
  const schemaId = `static-page-schema-${path}`;

  useEffect(() => {
    applyPageSEO({
      title: `${title} | সঠিক বাংলা ক্যালেন্ডার`,
      description,
      path,
      schemaId,
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "name": title,
            "description": description,
            "url": `${SITE_URL}${path}`,
            "inLanguage": "bn",
            "isPartOf": { "@type": "WebSite", "url": SITE_URL, "name": "সঠিক বাংলা ক্যালেন্ডার" },
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "সঠিক বাংলা ক্যালেন্ডার", "item": SITE_URL },
              { "@type": "ListItem", "position": 2, "name": crumb, "item": `${SITE_URL}${path}` },
            ],
          },
        ],
      },
    });
    return () => removeSchema(schemaId);
  }, [path, title, description, crumb, schemaId]);

  return (
    <div className="min-h-screen pb-20">
      <NavBar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-bengali">মূল ক্যালেন্ডারে ফিরুন</span>
        </Link>

        <div className="bg-card border border-card-border rounded-2xl shadow-premium p-5 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-bengali text-card-foreground mb-6">{title}</h1>
          <div className="font-bengali text-foreground/90 leading-relaxed space-y-4 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-card-foreground [&_h2]:mt-6 [&_h2]:mb-2 [&_a]:text-primary [&_a]:hover:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
