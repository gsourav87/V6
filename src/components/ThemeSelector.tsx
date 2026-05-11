import { useEffect, useRef, useState } from "react";
import { Palette, Check } from "lucide-react";
import { useTheme, type Theme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";

const THEMES: { id: Theme; labelBn: string; bg: string; accent: string }[] = [
  { id: "light",  labelBn: "আলো",    bg: "#e8d9c0", accent: "#bb511b" },
  { id: "dark",   labelBn: "রাত",    bg: "#201810", accent: "#de8a48" },
  { id: "forest", labelBn: "বন",     bg: "#bed4be", accent: "#2c854b" },
  { id: "ocean",  labelBn: "সমুদ্র", bg: "#baccde", accent: "#1b6aba" },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = THEMES.find(t => t.id === theme);

  return (
    <div ref={ref} className="relative shrink-0">
      <Button
        variant="ghost"
        onClick={() => setOpen(o => !o)}
        className="rounded-full gap-1.5 px-2.5 h-8 text-xs font-bengali font-medium"
        aria-label="থিম পরিবর্তন করুন"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Palette className="h-4 w-4 shrink-0" />
        <span>{current?.labelBn ?? "থিম"}</span>
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 bg-popover border border-border rounded-xl shadow-lg p-3 w-44">
          <p className="text-xs font-bengali font-semibold text-muted-foreground mb-2.5 px-0.5">
            থিম বেছে নিন
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                aria-label={`${t.labelBn} থিম`}
                className={`relative flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all ${
                  theme === t.id
                    ? "border-primary bg-primary/8"
                    : "border-transparent hover:border-border hover:bg-accent/40"
                }`}
              >
                {/* Swatch circle */}
                <div
                  className="w-9 h-9 rounded-full border border-black/10 overflow-hidden shrink-0"
                  style={{ background: t.bg }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(135deg, ${t.bg} 50%, ${t.accent} 50%)`,
                    }}
                  />
                </div>
                <span className="text-[11px] font-bengali font-medium text-foreground leading-none">
                  {t.labelBn}
                </span>
                {theme === t.id && (
                  <span className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
