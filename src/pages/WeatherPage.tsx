import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavBar } from "@/components/NavBar";
import { applyPageSEO, removeSchema, SITE_URL } from "@/lib/seo";
import {
  CITIES, City, fetchWeather, WeatherData, describeCode, uvLabel, formatDateBn,
} from "@/lib/weather";
import { toBengaliNumerals } from "@/lib/bengali-calendar";
import { RefreshCw, Droplets, Wind, Thermometer, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

function BnNum({ n, unit }: { n: number; unit?: string }) {
  return <>{toBengaliNumerals(n)}{unit}</>;
}

function CurrentWeatherCard({ data, city }: { data: WeatherData; city: City }) {
  const c = data.current;
  const desc = describeCode(c.code);
  return (
    <div className={cn("rounded-2xl p-5 text-white bg-gradient-to-br shadow-lg", desc.bg)}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-4xl font-bold font-bengali leading-none">
            <BnNum n={c.temp} unit="°" />
          </div>
          <div className="text-white/80 font-bengali text-sm mt-1">
            অনুভূতি <BnNum n={c.feelsLike} unit="°C" />
          </div>
          <div className="font-bengali font-semibold text-lg mt-2">{desc.label}</div>
          <div className="font-bengali text-white/70 text-sm">{city.nameBn}</div>
        </div>
        <div className="text-6xl">{desc.emoji}</div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-white/20 rounded-xl p-2.5 text-center">
          <Droplets className="w-4 h-4 mx-auto mb-1 opacity-80" />
          <div className="font-bold text-sm font-bengali"><BnNum n={c.humidity} unit="%" /></div>
          <div className="text-xs text-white/70 font-bengali">আর্দ্রতা</div>
        </div>
        <div className="bg-white/20 rounded-xl p-2.5 text-center">
          <Wind className="w-4 h-4 mx-auto mb-1 opacity-80" />
          <div className="font-bold text-sm font-bengali"><BnNum n={c.wind} unit=" km/h" /></div>
          <div className="text-xs text-white/70 font-bengali">বাতাস</div>
        </div>
        <div className="bg-white/20 rounded-xl p-2.5 text-center">
          <Thermometer className="w-4 h-4 mx-auto mb-1 opacity-80" />
          <div className="font-bold text-sm font-bengali"><BnNum n={c.feelsLike} unit="°" /></div>
          <div className="text-xs text-white/70 font-bengali">অনুভূতি</div>
        </div>
      </div>
    </div>
  );
}

function DayForecastCard({ day }: { day: WeatherData["daily"][number] }) {
  const desc = describeCode(day.code);
  const { day: dayLabel, full, isToday } = formatDateBn(day.date);
  const uv = uvLabel(day.uvIndex);

  return (
    <div className={cn(
      "bg-card border border-border rounded-xl p-3 flex flex-col gap-2",
      isToday && "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
    )}>
      <div className="flex items-center justify-between">
        <div>
          <div className={cn("font-bold font-bengali text-sm", isToday && "text-primary")}>
            {isToday ? "আজ" : dayLabel}
          </div>
          <div className="text-xs text-muted-foreground font-bengali">{full}</div>
        </div>
        <div className="text-2xl">{desc.emoji}</div>
      </div>

      <div className="font-bengali text-xs text-muted-foreground leading-snug">{desc.label}</div>

      <div className="flex items-center justify-between mt-auto">
        <div className="font-bold font-bengali text-base text-foreground">
          <BnNum n={day.tempMax} unit="°" />
          <span className="text-muted-foreground font-normal text-sm ml-1">/ <BnNum n={day.tempMin} unit="°" /></span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground font-bengali mt-1 border-t border-border/50 pt-2">
        {day.precipitation > 0 && (
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3 text-blue-500 shrink-0" />
            <span><BnNum n={day.precipitation} unit=" মিমি" /></span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3 shrink-0" />
          <span><BnNum n={day.windMax} unit=" km/h" /></span>
        </div>
        {day.uvIndex > 0 && (
          <div className="flex items-center gap-1 col-span-2">
            <Eye className="w-3 h-3 shrink-0" />
            <span>UV: <span className={uv.color}>{uv.label}</span> (<BnNum n={day.uvIndex} />)</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return <div className="bg-card border border-border rounded-xl h-40 animate-pulse" />;
}

export default function WeatherPage() {
  const [cityId, setCityId] = useState<string>(() => {
    return localStorage.getItem("weather-city") ?? "kolkata";
  });

  const city = CITIES.find(c => c.id === cityId) ?? CITIES[0];

  const { data, isLoading, isError, refetch, isFetching } = useQuery<WeatherData>({
    queryKey: ["weather", city.lat, city.lon],
    queryFn: () => fetchWeather(city.lat, city.lon),
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });

  useEffect(() => {
    localStorage.setItem("weather-city", cityId);
  }, [cityId]);

  const SCHEMA_ID = "weather-schema";

  useEffect(() => {
    applyPageSEO({
      title: "আবহাওয়া পূর্বাভাস — ১৫ দিনের আবহাওয়া বাংলায় | সঠিক বাংলা ক্যালেন্ডার",
      description: "কলকাতা, ঢাকা, চট্টগ্রাম সহ প্রধান শহরের ১৫ দিনের আবহাওয়া পূর্বাভাস বাংলায়। তাপমাত্রা, বৃষ্টি, বায়ু ও UV সূচক।",
      path: "/weather",
      schemaId: SCHEMA_ID,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "url": `${SITE_URL}/weather`,
        "name": "আবহাওয়া পূর্বাভাস — ১৫ দিনের আবহাওয়া বাংলায়",
        "description": "কলকাতা, ঢাকা, চট্টগ্রাম সহ প্রধান শহরের ১৫ দিনের আবহাওয়া পূর্বাভাস।",
        "inLanguage": "bn",
        "isPartOf": { "@type": "WebSite", "url": SITE_URL },
      },
    });
    return () => removeSchema(SCHEMA_ID);
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <NavBar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-bengali flex items-center gap-2">
              🌤️ আবহাওয়া পূর্বাভাস
            </h1>
            <p className="text-muted-foreground text-sm font-bengali mt-0.5">১৫ দিনের পূর্বাভাস</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bengali hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin")} />
            আপডেট
          </button>
        </div>

        {/* City selector */}
        <div className="flex flex-wrap gap-2 mb-5">
          {CITIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCityId(c.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-bengali font-medium transition-colors",
                cityId === c.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground hover:bg-primary/10"
              )}
            >
              {c.nameBn}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl h-44 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {isError && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-8 text-center font-bengali">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-destructive font-bold text-lg mb-2">আবহাওয়া লোড করা যায়নি</p>
            <p className="text-sm text-muted-foreground mb-4">
              ইন্টারনেট সংযোগ পরীক্ষা করুন অথবা কিছুক্ষণ পর আবার চেষ্টা করুন।
            </p>
            <button
              onClick={() => refetch()}
              className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {data && (
          <div className="space-y-5">
            <CurrentWeatherCard data={data} city={city} />

            <div>
              <h2 className="font-bold font-bengali text-lg mb-3">১৫ দিনের পূর্বাভাস</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {data.daily.map(day => (
                  <DayForecastCard key={day.date} day={day} />
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8 font-bengali">
          তথ্যসূত্র: Open-Meteo (open-meteo.com) · স্বয়ংক্রিয়ভাবে আপডেট হয়
        </p>
      </main>
    </div>
  );
}
