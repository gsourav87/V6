import { useState, useEffect, useMemo } from "react";
import { getTithiAtSunrise, getSunTimes, getNakshatraAtSunrise, getYogaAtSunrise, getKaranaAtSunrise, TithiInfo, SunTimes, NakshatraInfo, YogaInfo, KaranaInfo } from "@/lib/panjika";
import { toBengaliDate, BengaliDate } from "@/lib/bengali-calendar";

export function useTodayInfo() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Memoize heavy calculations — only re-run if the calendar date changes
  const todayDateObj = useMemo(() => new Date(), []);

  const bengaliDate    = useMemo<BengaliDate>(() => toBengaliDate(now), [now.getDate()]);
  const tithiInfo      = useMemo<TithiInfo>(() => getTithiAtSunrise(todayDateObj), [todayDateObj]);
  const sunTimes       = useMemo<SunTimes>(() => getSunTimes(todayDateObj), [todayDateObj]);
  const nakshatraInfo  = useMemo<NakshatraInfo>(() => getNakshatraAtSunrise(todayDateObj), [todayDateObj]);
  const yogaInfo       = useMemo<YogaInfo>(() => getYogaAtSunrise(todayDateObj), [todayDateObj]);
  const karanaInfo     = useMemo<KaranaInfo>(() => getKaranaAtSunrise(todayDateObj), [todayDateObj]);

  return {
    now,
    bengaliDate,
    tithiInfo,
    sunTimes,
    nakshatraInfo,
    yogaInfo,
    karanaInfo,
  };
}
