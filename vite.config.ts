import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: false },
  },
  configureServer(server) {

    // ── Finance: open.er-api.com for currency rates (free, CORS-enabled) + Yahoo v8 for stocks ──
    server.middlewares.use("/api/finance", async (_req, res) => {
      try {
        const STOCK_SYMS = ["^BSESN", "^NSEI", "HDFCBANK.NS", "TCS.NS", "RELIANCE.NS", "INFY.NS"];

        async function yahooStock(sym: string) {
          try {
            const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`;
            const r = await fetch(url, { headers: { "User-Agent": BROWSER_UA, "Accept": "application/json", "Referer": "https://finance.yahoo.com/" }, signal: AbortSignal.timeout(6000) });
            if (!r.ok) return null;
            const d: any = await r.json();
            const meta = d?.chart?.result?.[0]?.meta;
            if (!meta) return null;
            const price: number = meta.regularMarketPrice ?? 0;
            const prev: number = meta.chartPreviousClose ?? meta.previousClose ?? price;
            const change = price - prev;
            const updatedAt: number = (meta.regularMarketTime ?? 0) * 1000;
            return { sym, price, change, pct: prev ? (change / prev) * 100 : 0, updatedAt };
          } catch { return null; }
        }

        const erRes = await fetch("https://open.er-api.com/v6/latest/USD", {
          headers: { "User-Agent": "BengaliCalendar/1.0" },
          signal: AbortSignal.timeout(8000),
        });
        if (!erRes.ok) throw new Error(`rates API HTTP ${erRes.status}`);
        const erData: any = await erRes.json();
        const r = erData.rates ?? {};
        const usdinr: number = r.INR ?? 84.0;

        const rates = {
          usdinr,
          gbpinr: r.GBP ? r.INR / r.GBP : 0,
          eurinr: r.EUR ? r.INR / r.EUR : 0,
          bdtinr: r.BDT ? r.INR / r.BDT : 0,
        };

        const stockResults = await Promise.all(STOCK_SYMS.map(sym => yahooStock(sym)));
        const stocks: Record<string, any> = {};
        let stockUpdatedAt = 0;
        for (const s of stockResults) {
          if (s) {
            stocks[s.sym] = { price: s.price, change: s.change, pct: s.pct };
            if (s.updatedAt > stockUpdatedAt) stockUpdatedAt = s.updatedAt;
          }
        }

        const dataUpdatedAt: number = (erData.time_last_update_unix ?? 0) * 1000;

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(JSON.stringify({ rates, stocks, ts: Date.now(), dataUpdatedAt, stockUpdatedAt }));
      } catch (e) {
        res.statusCode = 502;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: String(e) }));
      }
    });

    // ── News: Google News Bengali (most reliable) + BBC + ABP + Anandabazar ──
    const NEWS_SOURCES = [
      "https://news.google.com/rss/search?q=%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE+%E0%A6%96%E0%A6%AC%E0%A6%B0&hl=bn-IN&gl=IN&ceid=IN:bn",
      "https://feeds.bbci.co.uk/bengali/rss.xml",
      "https://bengali.abplive.com/rss/news",
      "https://www.anandabazar.com/rss/rss_national.xml",
    ];
    server.middlewares.use("/api/news", async (_req, res) => {
      const results = await Promise.allSettled(
        NEWS_SOURCES.map(url =>
          fetch(url, {
            headers: { "User-Agent": BROWSER_UA, "Accept": "application/rss+xml, application/xml, text/xml, */*" },
            signal: AbortSignal.timeout(8000),
          }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
        )
      );
      const allItems: string[] = [];
      for (const r of results) {
        if (r.status === "fulfilled") {
          allItems.push(...(r.value.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? []));
        }
      }
      const seen = new Set<string>();
      const unique = allItems.filter(item => {
        const raw = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1] ?? "";
        const key = raw.replace(/\s+/g, " ").trim().slice(0, 60).toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      const body = [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">`,
        `<channel><title>Bengali News</title>`,
        unique.join("\n"),
        `</channel></rss>`,
      ].join("\n");
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("X-Items-Count", String(unique.length));
      res.end(body);
    });
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
