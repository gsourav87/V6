/**
 * IndexNow submission script.
 *
 * Finds the IndexNow key file in public/ (a <key>.txt file whose content is
 * the key itself, as downloaded from Bing Webmaster Tools), reads every <loc>
 * from dist/sitemap.xml, and POSTs the whole batch to api.indexnow.org so
 * Bing/Yandex/etc. recrawl the site immediately.
 *
 * Run: tsx scripts/indexnow-submit.ts   (after build + deploy)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const DIST = path.join(ROOT, "dist");
const SITE = "https://www.sothikbanglacalendar.live";
const HOST = "www.sothikbanglacalendar.live";

// ── locate the key file ─────────────────────────────────────────────────────
// IndexNow keys are 8–128 chars of [a-f0-9A-F-]; the file must be named
// <key>.txt and contain exactly the key.

const keyFile = fs.readdirSync(PUBLIC).find(f => {
  if (!/^[a-fA-F0-9-]{8,128}\.txt$/.test(f)) return false;
  const content = fs.readFileSync(path.join(PUBLIC, f), "utf-8").trim();
  return content === path.basename(f, ".txt");
});

if (!keyFile) {
  console.error(
    "No IndexNow key file found in public/.\n" +
      "Download the key file from Bing Webmaster Tools (Settings → API access → IndexNow)\n" +
      "and save it as public/<your-key>.txt — the file content must be the key itself.",
  );
  process.exit(1);
}

const key = path.basename(keyFile, ".txt");

// ── collect URLs from the built sitemap ─────────────────────────────────────

const sitemapPath = path.join(DIST, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  console.error("dist/sitemap.xml not found — run `npm run build` first.");
  process.exit(1);
}

const urlList = [...fs.readFileSync(sitemapPath, "utf-8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  m => m[1],
);

if (urlList.length === 0) {
  console.error("No <loc> entries found in dist/sitemap.xml.");
  process.exit(1);
}

// ── submit ──────────────────────────────────────────────────────────────────
// One POST handles up to 10,000 URLs and is fanned out to all IndexNow
// engines (Bing, Yandex, Seznam, Naver).

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `${SITE}/${keyFile}`,
    urlList,
  }),
});

if (res.ok) {
  console.log(`Submitted ${urlList.length} URLs to IndexNow (HTTP ${res.status}).`);
} else {
  console.error(`IndexNow submission failed: HTTP ${res.status} ${res.statusText}`);
  console.error(await res.text());
  process.exit(1);
}
