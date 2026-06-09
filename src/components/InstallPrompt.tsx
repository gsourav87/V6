import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "sbc-install-dismissed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

/**
 * Floating "Install app" banner. Appears once the browser fires
 * `beforeinstallprompt` (Android/Chromium/desktop). On iOS — which has no such
 * event — it shows a short Add-to-Home-Screen hint instead. Dismissal is
 * remembered so we never nag.
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const onInstalled = () => {
      setShow(false);
      localStorage.setItem(DISMISS_KEY, "1");
    };
    window.addEventListener("appinstalled", onInstalled);

    // iOS has no beforeinstallprompt — offer a manual hint after a short delay.
    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua);
    let t: number | undefined;
    if (isIOS && isSafari) {
      t = window.setTimeout(() => { setIosHint(true); setShow(true); }, 3500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      if (t) clearTimeout(t);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISS_KEY, "1");
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setShow(false);
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
          {iosHint ? (
            <div className="font-bengali text-[11px] text-muted-foreground mt-0.5 leading-snug">
              Share <span className="font-sans">⎋</span> চেপে “Add to Home Screen” বেছে নিন।
            </div>
          ) : (
            <div className="font-bengali text-[11px] text-muted-foreground mt-0.5 leading-snug">
              প্রতিদিন এক ট্যাপে আজকের বাংলা তারিখ ও পঞ্জিকা।
            </div>
          )}
        </div>
        {!iosHint && (
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
