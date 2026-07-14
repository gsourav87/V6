import { cn } from "@/lib/utils";

export const WHATSAPP_URL = "https://whatsapp.com/channel/0029Vb8cqx329759a4GL3M3f";

/** WhatsApp glyph (brand mark). */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 0C5.44 0 .06 5.38.06 12c0 2.11.55 4.18 1.6 6L0 24l6.17-1.62a11.94 11.94 0 0 0 5.87 1.5h.01c6.6 0 11.98-5.38 11.98-12S18.64 0 12.04 0zm0 21.94h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.66.96.98-3.57-.24-.37a9.9 9.9 0 0 1-1.52-5.3c0-5.48 4.46-9.94 9.95-9.94 2.66 0 5.15 1.04 7.03 2.92a9.87 9.87 0 0 1 2.91 7.03c0 5.48-4.46 9.94-9.94 9.94zm5.46-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.5-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.47 0 1.45 1.06 2.86 1.21 3.06.15.2 2.09 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.22 1.35.19 1.86.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z"/>
    </svg>
  );
}

interface WhatsAppCTAProps {
  className?: string;
  /** Compact pill (e.g. footer) vs. full banner card. */
  variant?: "banner" | "pill";
}

/**
 * "Join our WhatsApp channel" call-to-action. Used on the homepage, festival
 * pages, article pages, and (as a pill) in the footer to funnel site traffic
 * into the channel.
 */
export function WhatsAppCTA({ className, variant = "banner" }: WhatsAppCTAProps) {
  const onClick = () => {
    (window as any).gtag?.("event", "whatsapp_join_click", { variant });
  };

  if (variant === "pill") {
    return (
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-bengali font-semibold text-sm px-4 py-2 transition-colors",
          className,
        )}
      >
        <WhatsAppIcon className="w-4 h-4" />
        হোয়াটসঅ্যাপে যোগ দিন
      </a>
    );
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 sm:gap-4 rounded-2xl p-4 sm:p-5",
        "bg-gradient-to-br from-[#25D366] to-[#20BD5A] text-white shadow-premium",
        "hover:brightness-105 transition-all",
        className,
      )}
    >
      <span className="grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 shrink-0">
        <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-bengali font-bold text-base sm:text-lg leading-tight">
          হোয়াটসঅ্যাপে আমাদের চ্যানেলে যোগ দিন
        </div>
        <div className="font-bengali text-white/85 text-xs sm:text-sm mt-0.5 leading-snug">
          প্রতিদিন সকালে আজকের তিথি, নক্ষত্র ও পঞ্জিকা সরাসরি হোয়াটসঅ্যাপে পান।
        </div>
      </div>
      <span className="shrink-0 inline-flex items-center rounded-full bg-white text-[#20BD5A] font-bengali font-bold text-sm px-4 py-2 group-hover:scale-105 transition-transform">
        যোগ দিন
      </span>
    </a>
  );
}
