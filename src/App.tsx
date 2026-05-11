import { lazy, Suspense } from "react";

const TodayBengaliDate = lazy(() => import("./pages/TodayBengaliDate"));
const DatePage         = lazy(() => import("./pages/DatePage"));
const MonthPage        = lazy(() => import("./pages/MonthPage"));
const RashifalPage     = lazy(() => import("./pages/RashifalPage"));
const NewsPage         = lazy(() => import("./pages/NewsPage"));
const PanjikaPage      = lazy(() => import("./pages/PanjikaPage"));
const WeatherPage      = lazy(() => import("./pages/WeatherPage"));
const FestivalPage     = lazy(() => import("./pages/FestivalPage"));
const NotFound         = lazy(() => import("./pages/not-found"));

import SeoContent from "./components/SeoContent";
import { useState } from "react";
import { Route, Switch, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthContext";

import { useCalendar } from "@/hooks/useCalendar";
import { useTodayInfo } from "@/hooks/useTodayInfo";

import { Header } from "@/components/Header";
import { LiveClock } from "@/components/LiveClock";
import { MonthNavigator } from "@/components/MonthNavigator";
import { CalendarGrid } from "@/components/CalendarGrid";
import { DateConverter } from "@/components/DateConverter";
import { MuhurtaCalc } from "@/components/MuhurtaCalc";
import { RahuKalamCard } from "@/components/RahuKalamCard";
import { WeatherWidget } from "@/components/WeatherWidget";
import { FestivalSpotlight } from "@/components/FestivalSpotlight";
import { LoginPage } from "@/components/LoginPage";
import { DayDetailsModal } from "@/components/DayDetailsModal";
import { AstronomicalFooter } from "@/components/AstronomicalFooter";

const queryClient = new QueryClient();

function Home() {
  const {
    selectedYear,
    selectedMonth,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    setMonth,
    setYear,
  } = useCalendar();

  const { now } = useTodayInfo();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [, navigate] = useLocation();

  const todayY = now.getFullYear();
  const todayM = now.getMonth() + 1;
  const todayD = now.getDate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <div className="flex-1" />
          <Header onLoginClick={() => setShowLoginModal(true)} />
        </div>

        <LiveClock />

        {/* SEO navigation links */}
        <nav aria-label="Quick links" className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-sm font-bengali font-semibold text-primary">
          <Link href={`/date/${todayY}/${todayM}/${todayD}`}>
            আজকের বাংলা তারিখ ও পঞ্জিকা দেখুন
          </Link>
          <Link href="/today-bengali-date">
            আজকের বাংলা তারিখ
          </Link>
          <Link href="/month/jaistha/2026">
            জ্যৈষ্ঠ ২০২৬
          </Link>
          <Link href="/month/boishakh/2026">
            বৈশাখ ২০২৬
          </Link>
        </nav>

        {/* Page links */}
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {[
            { href: "/panjika",  label: "📖 পঞ্জিকা" },
            { href: "/rashifal", label: "🔮 রাশিফল" },
            { href: "/news",     label: "📰 সংবাদ" },
            { href: "/weather",  label: "🌤️ আবহাওয়া" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground px-4 py-1.5 rounded-full transition-colors font-bengali font-semibold"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Festival spotlight */}
        <div className="mt-5">
          <FestivalSpotlight />
        </div>

        {/* Weather widget */}
        <div className="mt-3">
          <WeatherWidget />
        </div>

        <div className="mt-8">
          <MonthNavigator
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            setYear={setYear}
            setMonth={setMonth}
            goToPrevMonth={goToPrevMonth}
            goToNextMonth={goToNextMonth}
            goToToday={goToToday}
          />

          <CalendarGrid
            year={selectedYear}
            month={selectedMonth}
            todayDate={now}
            onDateClick={(date) => {
              setSelectedDate(date);
              navigate(
                `/date/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
              );
            }}
          />

          <div className="mt-6">
            <RahuKalamCard />
          </div>

          <div className="mt-6">
            <DateConverter />
          </div>

          <div className="mt-6">
            <MuhurtaCalc />
          </div>

          <div className="mt-10">
            <SeoContent />
          </div>
        </div>
      </div>

      {/* Day details modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedDate(null)}
          />
          <div className="relative z-50 w-full max-w-md">
            <DayDetailsModal
              date={selectedDate}
              onClose={() => setSelectedDate(null)}
            />
          </div>
        </div>
      )}

      {/* Login modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          />
          <div className="relative z-50 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold font-bengali">সাইন ইন / সাইন আপ</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-muted-foreground hover:text-foreground text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <LoginPage onSuccess={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}

      <AstronomicalFooter />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="bangla-calendar-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Switch>
                <Route path="/">
                  <Home />
                </Route>

                <Route path="/today-bengali-date">
                  <TodayBengaliDate />
                </Route>

                <Route path="/date/:year/:month/:day">
                  <DatePage />
                </Route>

                <Route path="/month/:month/:year">
                  <MonthPage />
                </Route>

                <Route path="/panjika">
                  <PanjikaPage />
                </Route>

                <Route path="/rashifal">
                  <RashifalPage />
                </Route>

                <Route path="/news">
                  <NewsPage />
                </Route>

                <Route path="/weather">
                  <WeatherPage />
                </Route>

                <Route path="/festival/:slug">
                  <FestivalPage />
                </Route>

                <Route>
                  <NotFound />
                </Route>
              </Switch>
              </Suspense>
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
