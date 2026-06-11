import { Link, useLocation } from "wouter";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "@/components/ThemeSelector";
import { useInstall } from "@/hooks/useInstall";

const NAV_LINKS = [
  { href: "/",                  label: "ক্যালেন্ডার", icon: "📅" },
  { href: "/panjika",           label: "পঞ্জিকা",     icon: "📖" },
  { href: "/rashifal",          label: "রাশিফল",      icon: "🔮" },
  { href: "/news",              label: "সংবাদ",       icon: "📰" },
  { href: "/weather",           label: "আবহাওয়া",    icon: "🌤️" },
  { href: "/today-bengali-date",label: "আজকের তারিখ", icon: "🗓" },
  { href: "/finance",           label: "বাজার",       icon: "💰" },
];

export function NavBar() {
  const [location] = useLocation();
  const { canInstall, promptInstall } = useInstall();

  return (
    <nav className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border mb-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-1">
        <Link href="/" aria-label="সঠিক বাংলা ক্যালেন্ডার — হোম" className="shrink-0 mr-2">
          <img
            src="/logo-128.png"
            alt="সঠিক বাংলা ক্যালেন্ডার"
            width={52}
            height={52}
            className="w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full object-cover ring-1 ring-border"
          />
        </Link>
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none flex-1 min-w-0">
          {NAV_LINKS.map(({ href, label, icon }) => {
            const isActive = href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-base font-bengali font-medium whitespace-nowrap transition-colors shrink-0",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
        <div className="shrink-0 flex items-center gap-1 pl-1 border-l border-border ml-1">
          {canInstall && (
            <button
              onClick={() => promptInstall()}
              className="flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-sm font-bengali font-semibold whitespace-nowrap hover:opacity-90 transition-opacity"
              title="অ্যাপ ইনস্টল করুন"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">ইনস্টল</span>
            </button>
          )}
          <ThemeSelector />
        </div>
      </div>
    </nav>
  );
}
