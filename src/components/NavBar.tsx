import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",                  label: "ক্যালেন্ডার", icon: "📅" },
  { href: "/panjika",           label: "পঞ্জিকা",     icon: "📖" },
  { href: "/rashifal",          label: "রাশিফল",      icon: "🔮" },
  { href: "/news",              label: "সংবাদ",       icon: "📰" },
  { href: "/weather",           label: "আবহাওয়া",    icon: "🌤️" },
  { href: "/today-bengali-date",label: "আজকের তারিখ", icon: "🗓" },
];

export function NavBar() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border mb-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {NAV_LINKS.map(({ href, label, icon }) => {
            const isActive = href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bengali font-medium whitespace-nowrap transition-colors shrink-0",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
