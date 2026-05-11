import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { CITIES, fetchWeather, WeatherData, describeCode } from "@/lib/weather";
import { toBengaliNumerals } from "@/lib/bengali-calendar";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const DEFAULT_CITY = CITIES[0]; // Kolkata

export function WeatherWidget() {
  const { data, isLoading, isError } = useQuery<WeatherData>({
    queryKey: ["weather", DEFAULT_CITY.lat, DEFAULT_CITY.lon],
    queryFn: () => fetchWeather(DEFAULT_CITY.lat, DEFAULT_CITY.lon),
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  if (isError) return null;

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl h-20 animate-pulse" />
    );
  }

  if (!data) return null;

  const c = data.current;
  const desc = describeCode(c.code);
  const today = data.daily[0];

  return (
    <Link href="/weather" className="block">
      <div className={cn(
        "rounded-2xl p-4 text-white bg-gradient-to-br shadow-md hover:shadow-lg transition-shadow cursor-pointer",
        desc.bg
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{desc.emoji}</div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold font-bengali leading-none">
                  {toBengaliNumerals(c.temp)}°
                </span>
                <span className="text-white/70 text-sm font-bengali">
                  {toBengaliNumerals(today?.tempMax ?? c.temp)}° / {toBengaliNumerals(today?.tempMin ?? c.temp)}°
                </span>
              </div>
              <div className="font-bengali text-sm text-white/90 mt-0.5">{desc.label}</div>
              <div className="font-bengali text-xs text-white/60">{DEFAULT_CITY.nameBn}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full text-xs font-bengali font-semibold">
            ১৫ দিন <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
