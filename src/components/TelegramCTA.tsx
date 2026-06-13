import { cn } from "@/lib/utils";

export const TELEGRAM_URL = "https://t.me/sothikbanglacalendar";

/** Telegram paper-plane logo (brand mark). */
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

interface TelegramCTAProps {
  className?: string;
  /** Compact pill (e.g. footer) vs. full banner card. */
  variant?: "banner" | "pill";
}

/**
 * "Join our Telegram channel" call-to-action. Links to the public channel that
 * posts the daily panjika each morning. Used on the homepage, festival pages,
 * and (as a pill) in the footer to funnel site traffic into the channel.
 */
export function TelegramCTA({ className, variant = "banner" }: TelegramCTAProps) {
  const onClick = () => {
    (window as any).gtag?.("event", "telegram_join_click", { variant });
  };

  if (variant === "pill") {
    return (
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-2 rounded-full bg-[#2AABEE] hover:bg-[#229ED9] text-white font-bengali font-semibold text-sm px-4 py-2 transition-colors",
          className,
        )}
      >
        <TelegramIcon className="w-4 h-4" />
        টেলিগ্রামে যোগ দিন
      </a>
    );
  }

  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 sm:gap-4 rounded-2xl p-4 sm:p-5",
        "bg-gradient-to-br from-[#2AABEE] to-[#229ED9] text-white shadow-premium",
        "hover:brightness-105 transition-all",
        className,
      )}
    >
      <span className="grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 shrink-0">
        <TelegramIcon className="w-7 h-7 sm:w-8 sm:h-8" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-bengali font-bold text-base sm:text-lg leading-tight">
          টেলিগ্রামে আমাদের চ্যানেলে যোগ দিন
        </div>
        <div className="font-bengali text-white/85 text-xs sm:text-sm mt-0.5 leading-snug">
          প্রতিদিন সকালে আজকের তিথি, নক্ষত্র ও পঞ্জিকা সরাসরি টেলিগ্রামে পান।
        </div>
      </div>
      <span className="shrink-0 inline-flex items-center rounded-full bg-white text-[#229ED9] font-bengali font-bold text-sm px-4 py-2 group-hover:scale-105 transition-transform">
        যোগ দিন
      </span>
    </a>
  );
}
