import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTodayInfo } from "@/hooks/useTodayInfo";
import { formatKolkataTime, getRahuKalamInfo } from "@/lib/panjika";
import { toBengaliNumerals } from "@/lib/bengali-calendar";

const STORAGE_KEY   = "bangla-cal-notif-enabled";
const LAST_DATE_KEY = "bangla-cal-notif-last-date";

export function PushNotifications() {
  const { bengaliDate, tithiInfo, sunTimes, nakshatraInfo } = useTodayInfo();
  const [enabled, setEnabled]       = useState(() => localStorage.getItem(STORAGE_KEY) === "true");
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) setPermission(Notification.permission);
  }, []);

  // Fire once per calendar day when the page opens
  useEffect(() => {
    if (!enabled || permission !== "granted" || !("Notification" in window)) return;
    const today = new Date().toDateString();
    if (localStorage.getItem(LAST_DATE_KEY) === today) return;
    localStorage.setItem(LAST_DATE_KEY, today);

    const todayUTC = new Date(Date.UTC(
      new Date().getFullYear(), new Date().getMonth(), new Date().getDate()
    ));
    const rahu = getRahuKalamInfo(todayUTC);

    new Notification("🗓 আজকের পঞ্চাঙ্গ — সঠিক বাংলা ক্যালেন্ডার", {
      body:
        `${toBengaliNumerals(bengaliDate.day)} ${bengaliDate.monthNameBn}, ${toBengaliNumerals(bengaliDate.year)} বঙ্গাব্দ\n` +
        `তিথি: ${tithiInfo.nameBn} (${tithiInfo.pakshaBn})\n` +
        `নক্ষত্র: ${nakshatraInfo.nameBn}\n` +
        `☀️ সূর্যোদয়: ${formatKolkataTime(sunTimes.sunrise)}\n` +
        `⚠ রাহু কাল: ${formatKolkataTime(rahu.rahuKalam.start)} – ${formatKolkataTime(rahu.rahuKalam.end)}`,
      icon:  "/favicon.ico",
      badge: "/favicon.ico",
      tag:   "daily-panjika",
    });
  }, [enabled, permission]);

  if (!("Notification" in window)) return null;

  const toggle = async () => {
    if (enabled) {
      localStorage.setItem(STORAGE_KEY, "false");
      setEnabled(false);
      return;
    }
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm === "granted") {
      localStorage.setItem(STORAGE_KEY, "true");
      localStorage.removeItem(LAST_DATE_KEY);
      setEnabled(true);
      new Notification("✅ বিজ্ঞপ্তি চালু হয়েছে", {
        body: "প্রতিদিন পেজ খুললেই আজকের পঞ্চাঙ্গ ও রাহু কাল জানতে পারবেন।",
        icon: "/favicon.ico",
        tag:  "notif-enabled",
      });
    } else {
      alert("Notification permission was denied. Please allow it in your browser settings.");
    }
  };

  return (
    <Button
      variant={enabled ? "default" : "outline"}
      size="sm"
      onClick={toggle}
      className="gap-1.5 font-bengali"
      title={enabled ? "Notifications on — click to disable" : "Enable daily panchang notifications"}
    >
      {enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
      <span className="hidden sm:inline">{enabled ? "বিজ্ঞপ্তি চালু" : "বিজ্ঞপ্তি"}</span>
    </Button>
  );
}
