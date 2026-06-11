import { useCallback, useEffect, useState } from "react";

// The beforeinstallprompt event is captured in index.html (before React mounts)
// and stashed on window.__installEvt, with an "installable-change" event fired.

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
}

export function useInstall() {
  const [evt, setEvt] = useState<any>(() => (typeof window !== "undefined" ? (window as any).__installEvt : null));
  const [installed, setInstalled] = useState<boolean>(isStandalone());

  useEffect(() => {
    const update = () => {
      setEvt((window as any).__installEvt);
      setInstalled(isStandalone());
    };
    update();
    window.addEventListener("installable-change", update);
    return () => window.removeEventListener("installable-change", update);
  }, []);

  const promptInstall = useCallback(async (): Promise<"accepted" | "dismissed" | "unavailable"> => {
    const e = (window as any).__installEvt;
    if (!e) return "unavailable";
    await e.prompt();
    const choice = await e.userChoice;
    (window as any).__installEvt = null;
    setEvt(null);
    return choice.outcome;
  }, []);

  return {
    canInstall: !!evt && !installed,   // Android/Chromium/desktop, native prompt available
    iosInstall: isIOS() && !installed, // iOS: must Add-to-Home-Screen manually
    installed,
    promptInstall,
  };
}
