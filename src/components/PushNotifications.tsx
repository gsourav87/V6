import { useState, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pushSupported, pushEnabledLocally, enablePush, markPushDisabled } from "@/lib/firebase-messaging";

/**
 * Real FCM web-push toggle. Tapping it asks permission, gets an FCM token and
 * subscribes the device for the daily Bengali panchang notifications.
 */
export function PushNotifications() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled]     = useState(false);
  const [busy, setBusy]           = useState(false);

  useEffect(() => {
    setSupported(pushSupported());
    setEnabled(pushEnabledLocally() && (typeof Notification !== "undefined" && Notification.permission === "granted"));
  }, []);

  if (!supported) return null;

  const toggle = async () => {
    if (enabled) {
      markPushDisabled();
      setEnabled(false);
      return;
    }
    setBusy(true);
    try {
      const token = await enablePush();
      if (token) {
        setEnabled(true);
        new Notification("🔔 বিজ্ঞপ্তি চালু হয়েছে", {
          body: "প্রতিদিন সকালে আজকের তিথি, সূর্যোদয় ও বিশেষ দিনের খবর পাবেন।",
          icon: "/icon-192.png",
        });
      } else if (typeof Notification !== "undefined" && Notification.permission === "denied") {
        alert("বিজ্ঞপ্তির অনুমতি বন্ধ আছে। ব্রাউজার সেটিংস থেকে অনুমতি দিন।");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant={enabled ? "default" : "outline"}
      size="sm"
      onClick={toggle}
      disabled={busy}
      className="gap-1.5 font-bengali"
      title={enabled ? "বিজ্ঞপ্তি চালু — বন্ধ করতে ক্লিক করুন" : "প্রতিদিনের পঞ্জিকা বিজ্ঞপ্তি চালু করুন"}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
      <span className="hidden sm:inline">{enabled ? "বিজ্ঞপ্তি চালু" : "বিজ্ঞপ্তি"}</span>
    </Button>
  );
}
