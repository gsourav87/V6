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
    rollupOptions: {
      output: {
        // Split heavy vendor libs into their own cached chunks so the main
        // app bundle is smaller and the browser can fetch them in parallel.
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("/react/") || id.includes("scheduler")) return "react-vendor";
            if (id.includes("@tanstack")) return "query";
            if (id.includes("lucide-react")) return "icons";
            if (id.includes("date-fns")) return "date";
            if (id.includes("wouter")) return "router";
          }
        },
      },
    },
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

  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
