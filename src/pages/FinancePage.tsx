import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { applyPageSEO } from "@/lib/seo";

// ── Fuel prices (Kolkata) ─────────────────────────────────────────
// NOTE: India has no reliable free live fuel-price API, so these are entered by
// hand. To keep them accurate, update the prices AND the FUEL_UPDATED date below
// whenever rates change (typically rare — petrol/diesel revise occasionally).
const FUEL_UPDATED = "১১ জুন ২০২৬"; // ← update this date when you edit prices
const FUEL: { icon: string; label: string; price: number; unit: string }[] = [
  { icon: "⛽", label: "পেট্রোল",             price: 105.41, unit: "প্রতি লিটার" },
  { icon: "🛢️", label: "ডিজেল",              price: 92.02,  unit: "প্রতি লিটার" },
  { icon: "🔵", label: "এলপিজি (১৪.২ কেজি)", price: 879.00, unit: "প্রতি সিলিন্ডার" },
  { icon: "💨", label: "সিএনজি",             price: 89.43,  unit: "প্রতি কেজি" },
];

const STOCK_META: Record<string, { nameBn: string; icon: string }> = {
  "^BSESN":      { nameBn: "সেনসেক্স",          icon: "📊" },
  "^NSEI":       { nameBn: "নিফটি ৫০",           icon: "📈" },
  "HDFCBANK.NS": { nameBn: "HDFC ব্যাংক",        icon: "🏦" },
  "TCS.NS":      { nameBn: "টাটা কনসালটেন্সি",   icon: "💻" },
  "RELIANCE.NS": { nameBn: "রিলায়েন্স",          icon: "🏭" },
  "INFY.NS":     { nameBn: "ইনফোসিস",            icon: "🖥️" },
};

const CURRENCIES = [
  { key: "usdinr" as const, flag: "🇺🇸", nameBn: "ডলার",  code: "USD", unit: "প্রতি ডলার" },
  { key: "gbpinr" as const, flag: "🇬🇧", nameBn: "পাউন্ড", code: "GBP", unit: "প্রতি পাউন্ড" },
  { key: "eurinr" as const, flag: "🇪🇺", nameBn: "ইউরো",  code: "EUR", unit: "প্রতি ইউরো" },
  { key: "bdtinr" as const, flag: "🇧🇩", nameBn: "টাকা",  code: "BDT", unit: "প্রতি ১০০ টাকা" },
];

// ── API types ─────────────────────────────────────────────────────
interface FinanceData {
  rates: { usdinr: number; gbpinr: number; eurinr: number; bdtinr: number };
  stocks: Record<string, { price: number; change: number; pct: number }>;
  ts: number;
  dataUpdatedAt?: number;
  stockUpdatedAt?: number;
}

function isMarketOpen(): boolean {
  const ist = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = ist.getDay();
  if (day === 0 || day === 6) return false;
  const mins = ist.getHours() * 60 + ist.getMinutes();
  return mins >= 9 * 60 + 15 && mins <= 15 * 60 + 30;
}

async function fetchFinance(): Promise<FinanceData> {
  // 1. Try server-side proxy
  try {
    const res = await fetch("/api/finance", { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const d = await res.json();
      if (d?.rates?.usdinr > 0) return d;
    }
  } catch { /* fall through */ }

  // 2. Browser fallback: open.er-api.com is CORS-enabled and free — always has INR/GBP/EUR/BDT
  const erRes = await fetch("https://open.er-api.com/v6/latest/USD", {
    signal: AbortSignal.timeout(12000),
  });
  if (!erRes.ok) throw new Error(`ExchangeRate API: HTTP ${erRes.status}`);
  const erData = await erRes.json() as any;
  const r = erData.rates ?? {};
  if (!r.INR) throw new Error("মুদ্রার তথ্য পাওয়া যায়নি");

  const usdinr = r.INR ?? 84.0;
  return {
    rates: {
      usdinr,
      gbpinr: r.GBP ? r.INR / r.GBP : 0,
      eurinr: r.EUR ? r.INR / r.EUR : 0,
      bdtinr: r.BDT ? r.INR / r.BDT : 0,
    },
    stocks: {},
    ts: Date.now(),
    dataUpdatedAt: (erData.time_last_update_unix ?? 0) * 1000,
  };
}

// ── Helpers ───────────────────────────────────────────────────────
function fmt(n: number, dec = 2) {
  return n.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function ChangeBadge({ pct }: { pct: number }) {
  const up = pct > 0.005;
  const dn = pct < -0.005;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
      up ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400"
        : dn ? "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400"
          : "bg-muted text-muted-foreground"
    }`}>
      {up ? <TrendingUp className="w-3 h-3" /> : dn ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
      {up ? "+" : ""}{pct.toFixed(2)}%
    </span>
  );
}

// ── Sub-components ────────────────────────────────────────────────
function CurrencyCard({
  flag, nameBn, code, rate, unit, isLoading,
}: {
  flag: string; nameBn: string; code: string; rate: number; unit: string; isLoading: boolean;
}) {
  // BDT: show per 100 taka for readability
  const displayRate = code === "BDT" ? rate * 100 : rate;

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xl">{flag}</span>
        <div className="min-w-0">
          <span className="text-xs font-bengali font-semibold text-muted-foreground leading-tight">{nameBn}</span>
          <span className="text-[10px] text-muted-foreground ml-1.5 font-mono">{code}</span>
        </div>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-foreground font-mono">
        {isLoading
          ? <div className="h-6 w-20 bg-muted animate-pulse rounded" />
          : rate > 0
            ? `₹${fmt(displayRate, 2)}`
            : "—"}
      </div>
      <div className="text-xs text-muted-foreground font-bengali">{unit}</div>
    </div>
  );
}

function StockCard({ symbol, data }: { symbol: string; data: { price: number; change: number; pct: number } }) {
  const meta = STOCK_META[symbol];
  const isIndex = symbol.startsWith("^");
  return (
    <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-lg shrink-0">{meta?.icon ?? "📊"}</span>
        <div className="min-w-0">
          <div className="font-bengali font-bold text-sm text-foreground truncate">{meta?.nameBn ?? symbol}</div>
          <div className="text-[11px] text-muted-foreground">{symbol.replace(".NS", "").replace("^", "")}</div>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-bold text-foreground text-sm font-mono">
          {isIndex ? fmt(data.price, 0) : `₹${fmt(data.price, 2)}`}
        </div>
        <ChangeBadge pct={data.pct} />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function FinancePage() {
  useEffect(() => {
    applyPageSEO({
      title: "বাজারের দাম — মুদ্রা, জ্বালানি ও শেয়ার বাজার | সঠিক বাংলা ক্যালেন্ডার",
      description: "আজকের ডলার, পাউন্ড, ইউরো ও টাকার দাম, পেট্রোল-ডিজেলের দাম, এবং সেনসেক্স-নিফটি সহ শেয়ার বাজারের লাইভ আপডেট।",
      path: "/finance",
    });
  }, []);

  const { data, isLoading, isError, refetch, isFetching } = useQuery<FinanceData>({
    queryKey: ["finance"],
    queryFn: fetchFinance,
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
    retry: 1,
  });

  const rates  = data?.rates;
  const stocks = data?.stocks ?? {};
  const hasStocks = Object.keys(stocks).length > 0;
  const marketOpen = isMarketOpen();

  const dataDate = data?.dataUpdatedAt && data.dataUpdatedAt > 0
    ? new Date(data.dataUpdatedAt).toLocaleDateString("bn-IN", { day: "numeric", month: "long" })
    : null;

  const stockDate = data?.stockUpdatedAt && data.stockUpdatedAt > 0
    ? new Date(data.stockUpdatedAt).toLocaleDateString("bn-IN", { day: "numeric", month: "long", weekday: "short" })
    : null;

  return (
    <div className="min-h-screen pb-16">
      <NavBar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-bengali text-foreground">বাজারের দাম</h1>
            <p className="text-xs text-muted-foreground font-bengali mt-0.5">
              মুদ্রা · জ্বালানি · শেয়ার বাজার
              {dataDate && ` · দর: ${dataDate}`}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50"
            aria-label="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>

        {isError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm font-bengali text-red-700 dark:text-red-400">
            বাজার তথ্য লোড করতে সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন অথবা পুনরায় চেষ্টা করুন।
          </div>
        )}

        {/* ── Currency rates ── */}
        <section className="mb-6">
          <h2 className="text-sm font-bold font-bengali text-muted-foreground uppercase tracking-widest mb-3">
            💱 মুদ্রার দর (ভারতীয় রুপি)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CURRENCIES.map(({ key, flag, nameBn, code, unit }) => (
              <CurrencyCard
                key={code}
                flag={flag}
                nameBn={nameBn}
                code={code}
                rate={rates?.[key] ?? 0}
                unit={unit}
                isLoading={isLoading}
              />
            ))}
          </div>
          {!isLoading && rates?.usdinr && (
            <p className="text-[11px] text-muted-foreground font-bengali mt-2">
              * মিড-মার্কেট রেফারেন্স দর (open.er-api.com)। দৈনিক একবার আপডেট হয়।
              {dataDate && ` সর্বশেষ: ${dataDate}।`} ব্যাংক ও Google-এর দরের সাথে সামান্য পার্থক্য থাকতে পারে।
            </p>
          )}
        </section>

        {/* ── Fuel ── */}
        <section className="mb-6">
          <h2 className="flex items-center gap-2 text-sm font-bold font-bengali text-muted-foreground uppercase tracking-widest mb-3">
            ⛽ জ্বালানির দাম (কলকাতা)
            <span className="normal-case tracking-normal text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
              আনুমানিক
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FUEL.map(f => (
              <div key={f.label} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{f.icon}</span>
                  <span className="text-xs font-bengali font-semibold text-muted-foreground leading-tight">{f.label}</span>
                </div>
                <div className="text-xl font-bold text-foreground font-mono">₹{fmt(f.price, 2)}</div>
                <div className="text-xs text-muted-foreground font-bengali">{f.unit}</div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground font-bengali mt-2">
            * আনুমানিক দর (কলকাতা) — হাতে হালনাগাদ করা, {FUEL_UPDATED} অনুযায়ী। দাম এলাকাভেদে কিছুটা ভিন্ন হতে পারে; সঠিক দরের জন্য স্থানীয় পেট্রোল পাম্পে যোগাযোগ করুন।
          </p>
        </section>

        {/* ── Stocks ── */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold font-bengali text-muted-foreground uppercase tracking-widest">
                📈 শেয়ার বাজার
              </h2>
              {stockDate && !isLoading && (
                <p className="text-[11px] text-muted-foreground font-bengali mt-0.5">
                  শেষ দর: {stockDate}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isFetching
                ? <span className="text-[11px] text-muted-foreground font-bengali animate-pulse">আপডেট হচ্ছে…</span>
                : (
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    marketOpen
                      ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${marketOpen ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
                    {marketOpen ? "বাজার খোলা" : "বাজার বন্ধ"}
                  </span>
                )
              }
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-3 h-14 animate-pulse" />
              ))}
            </div>
          ) : hasStocks ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.keys(STOCK_META).map(sym => {
                const d = stocks[sym];
                if (!d) return null;
                return <StockCard key={sym} symbol={sym} data={d} />;
              })}
            </div>
          ) : (
            <div className="p-4 bg-muted/50 rounded-xl text-sm font-bengali text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">শেয়ার বাজারের তথ্য পাওয়া যাচ্ছে না</p>
              <p>সার্ভার সংযোগ পরীক্ষা করুন বা পৃষ্ঠা রিফ্রেশ করুন। বাজার বন্ধ থাকাকালীন Yahoo Finance থেকে শেষ বন্ধের দর দেখানো হয়।</p>
            </div>
          )}
          {!isLoading && hasStocks && (
            <p className="text-[11px] text-muted-foreground font-bengali mt-2">
              * Yahoo Finance থেকে নেওয়া। Google বা ব্রোকারের লাইভ দরের সাথে কিছুটা পার্থক্য থাকতে পারে।
            </p>
          )}
        </section>

        {/* ── Market guide ── */}
        <section className="mb-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
          <h2 className="text-sm font-bold font-bengali text-primary mb-3">📌 বাজার গাইড</h2>
          <ul className="space-y-2 text-xs font-bengali text-foreground/80 leading-relaxed">
            <li className="flex gap-2"><span className="text-primary shrink-0">•</span>মুদ্রার দর মিড-মার্কেট রেফারেন্স রেট — দৈনিক একবার আপডেট হয়। Google বা ব্যাংকের দরের সাথে সামান্য পার্থক্য স্বাভাবিক।</li>
            <li className="flex gap-2"><span className="text-primary shrink-0">•</span>জ্বালানির দাম এখানে হাতে হালনাগাদ করা আনুমানিক দর (কলকাতা) — লাইভ নয়। প্রকৃত দাম পেট্রোল পাম্পে যাচাই করুন।</li>
            <li className="flex gap-2"><span className="text-primary shrink-0">•</span>শেয়ার বাজারের তথ্য Yahoo Finance থেকে আনা হয়, ৫ মিনিট অন্তর আপডেট হয়।</li>
            <li className="flex gap-2"><span className="text-primary shrink-0">•</span>NSE/BSE বাজার সোমবার–শুক্রবার সকাল ৯:১৫ থেকে বিকেল ৩:৩০ পর্যন্ত খোলা থাকে।</li>
          </ul>
        </section>

        <p className="text-center text-[11px] text-muted-foreground font-bengali pb-4">
          তথ্যসূত্র: মুদ্রা — ExchangeRate-API (দৈনিক) · শেয়ার — Yahoo Finance · জ্বালানি — হাতে হালনাগাদ। বিনিয়োগের আগে বিশেষজ্ঞের পরামর্শ নিন।
        </p>
      </main>
    </div>
  );
}
