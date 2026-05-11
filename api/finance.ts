// Vercel Edge Function — currency rates from open.er-api.com + stocks from Yahoo Finance v8
const ER_API = "https://open.er-api.com/v6/latest/USD";
const UA     = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const STOCK_SYMS = ["^BSESN", "^NSEI", "HDFCBANK.NS", "TCS.NS", "RELIANCE.NS", "INFY.NS"];

async function fetchStock(sym: string): Promise<{ sym: string; price: number; change: number; pct: number; updatedAt: number } | null> {
  try {
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`;
    const r = await fetch(url, {
      headers: { "User-Agent": UA, "Accept": "application/json", "Referer": "https://finance.yahoo.com/" },
      signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) return null;
    const d = await r.json() as any;
    const meta = d?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price: number = meta.regularMarketPrice ?? 0;
    const prev: number  = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = price - prev;
    const updatedAt: number = (meta.regularMarketTime ?? 0) * 1000;
    return { sym, price, change, pct: prev ? (change / prev) * 100 : 0, updatedAt };
  } catch { return null; }
}

export default async function handler(): Promise<Response> {
  const erRes = await fetch(ER_API, {
    headers: { "User-Agent": "BengaliCalendar/1.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (!erRes.ok) {
    return new Response(JSON.stringify({ error: `rates API: HTTP ${erRes.status}` }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const erData = await erRes.json() as any;
  const r      = erData.rates ?? {};
  const usdinr = r.INR ?? 84.0;

  const rates = {
    usdinr,
    gbpinr: r.GBP ? r.INR / r.GBP : 0,
    eurinr: r.EUR ? r.INR / r.EUR : 0,
    bdtinr: r.BDT ? r.INR / r.BDT : 0,
  };

  const stockResults = await Promise.all(STOCK_SYMS.map(sym => fetchStock(sym)));
  const stocks: Record<string, { price: number; change: number; pct: number }> = {};
  let stockUpdatedAt = 0;
  for (const s of stockResults) {
    if (s) {
      stocks[s.sym] = { price: s.price, change: s.change, pct: s.pct };
      if (s.updatedAt > stockUpdatedAt) stockUpdatedAt = s.updatedAt;
    }
  }

  const dataUpdatedAt: number = (erData.time_last_update_unix ?? 0) * 1000;

  return new Response(JSON.stringify({ rates, stocks, ts: Date.now(), dataUpdatedAt, stockUpdatedAt }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}

export const config = { runtime: "edge" };
