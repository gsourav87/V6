export const SITE_URL = "https://www.sothikbanglacalendar.live";
export const OG_IMAGE_URL = `${SITE_URL}/og-image.svg`;
export const DEFAULT_TITLE =
  "আজকের বাংলা তারিখ, তিথি ও বাংলা ক্যালেন্ডার ২০২৬ | সঠিক বাংলা ক্যালেন্ডার";
export const DEFAULT_DESCRIPTION =
  "আজকের বাংলা তারিখ, তিথি, নক্ষত্র ও সম্পূর্ণ পঞ্জিকা দেখুন। বিশুদ্ধ সিদ্ধান্ত মতে প্রতিদিন আপডেট হওয়া সঠিক বাংলা ক্যালেন্ডার ২০২৬।";

function upsertMeta(selector: string, attr: string, attrVal: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, attrVal);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

export function injectSchema(id: string, schema: object) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.setAttribute("type", "application/ld+json");
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schema);
}

export function removeSchema(id: string) {
  document.getElementById(id)?.remove();
}

export interface PageSEO {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  schemaId?: string;
  schema?: object;
}

export function applyPageSEO({ title, description, path, ogImage, schemaId, schema }: PageSEO) {
  const canonical = `${SITE_URL}${path}`;
  const image = ogImage ?? OG_IMAGE_URL;

  document.title = title;

  upsertMeta('meta[name="description"]', "name", "description", description);

  upsertMeta('meta[property="og:title"]', "property", "og:title", title);
  upsertMeta('meta[property="og:description"]', "property", "og:description", description);
  upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
  upsertMeta('meta[property="og:image"]', "property", "og:image", image);
  upsertMeta('meta[property="og:image:width"]', "property", "og:image:width", "1200");
  upsertMeta('meta[property="og:image:height"]', "property", "og:image:height", "630");

  upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
  upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
  upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
  upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);

  upsertCanonical(canonical);

  if (schema && schemaId) injectSchema(schemaId, schema);
}
