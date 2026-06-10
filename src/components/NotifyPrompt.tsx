import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { pushSupported, pushEnabledLocally, enablePush } from "@/lib/firebase-messaging";

const DISMISS_KEY = "sbc-notify-dismissed";

/**
 * Friendly first-visit prompt to enable daily panchang notifications. Shown once,
 * after a short delay, only if push is supported and not already enabled/dismissed.
 * Tapping "চালু করুন" triggers the real browser permission flow.
 */
export function NotifyPrompt() {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!pushSupported()) return;
    if (pushEnabledLocally()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;
    if (typeof Notification !== "undefined" && Notification.permission === "denied") return;
    const t = window.setTimeout(() => setShow(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  const allow = async () => {
    setBusy(true);
    try {
      const token = await enablePush();
      localStorage.setItem(DISMISS_KEY, "1");
      setShow(false);
      if (token) {
        new Notification("🔔 বিজ্ঞপ্তি চালু হয়েছে", {
          body: "প্রতিদিন সকালে আজকের তিথি, সূর্যোদয় ও বিশেষ দিনের খবর পাবেন।",
          icon: "/icon-192.png",
        });
      }
    } finally {
      setBusy(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-md glow-focus animate-fade-up bg-card border border-primary/20 rounded-2xl p-3 sm:p-4 flex items-center gap-3">
        <div className="grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 shrink-0">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bengali font-bold text-foreground text-sm leading-tight">
            আজকের পঞ্জিকা বিজ্ঞপ্তি পান
          </div>
          <div className="font-bengali text-[11px] text-muted-foreground mt-0.5 leading-snug">
            প্রতিদিন সকালে তিথি, সূর্যোদয় ও বিশেষ দিনের খবর সরাসরি আপনার ফোনে।
          </div>
        </div>
        <button
          onClick={allow}
          disabled={busy}
          className="shrink-0 inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-bengali font-semibold text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          <Bell className="w-4 h-4" /> চালু করুন
        </button>
        <button onClick={dismiss} aria-label="বন্ধ করুন" className="shrink-0 text-muted-foreground hover:text-foreground p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
