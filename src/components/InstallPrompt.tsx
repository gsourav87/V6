import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { useInstall } from "@/hooks/useInstall";

const DISMISS_KEY = "sbc-install-dismissed-at";
const RESHOW_AFTER = 3 * 24 * 3600 * 1000; // re-offer after 3 days

/**
 * Floating "Install app" banner. Uses the install event captured early in
 * index.html (so it never misses it). On iOS it shows an Add-to-Home-Screen hint.
 * Dismissal is temporary — it re-offers after a few days.
 */
export function InstallPrompt() {
  const { canInstall, iosInstall, promptInstall } = useInstall();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!canInstall && !iosInstall) return;
    const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (Date.now() - at < RESHOW_AFTER) return;
    const t = window.setTimeout(() => setShow(true), iosInstall ? 4000 : 1500);
    return () => clearTimeout(t);
  }, [canInstall, iosInstall]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  };

  const install = async () => {
    const r = await promptInstall();
    if (r !== "unavailable") dismiss();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-md glow-focus animate-fade-up bg-card border border-primary/20 rounded-2xl p-3 sm:p-4 flex items-center gap-3">
        <img src="/icon-192.png" alt="" className="w-12 h-12 rounded-xl shadow-md shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-bengali font-bold text-foreground text-sm leading-tight">
            অ্যাপ হিসেবে ইনস্টল করুন
          </div>
          {iosInstall ? (
            <div className="font-bengali text-[11px] text-muted-foreground mt-0.5 leading-snug">
              Share <span className="font-sans">⎋</span> চেপে “Add to Home Screen” বেছে নিন।
            </div>
          ) : (
            <div className="font-bengali text-[11px] text-muted-foreground mt-0.5 leading-snug">
              প্রতিদিন এক ট্যাপে আজকের বাংলা তারিখ ও পঞ্জিকা।
            </div>
          )}
        </div>
        {!iosInstall && (
          <button
            onClick={install}
            className="shrink-0 inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-bengali font-semibold text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" /> ইনস্টল
          </button>
        )}
        <button onClick={dismiss} aria-label="বন্ধ করুন" className="shrink-0 text-muted-foreground hover:text-foreground p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
