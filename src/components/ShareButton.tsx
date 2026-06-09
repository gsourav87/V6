import { useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  /** Plain-text message (already includes the salient info). */
  text: string;
  /** Canonical URL to share. Defaults to the current page. */
  url?: string;
  /** Layout: "bar" = full row of actions, "compact" = single WhatsApp+share pill. */
  variant?: "bar" | "compact";
  className?: string;
}

const WHATSAPP_GREEN = "#25D366";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.515 5.26l-.999 3.648 3.464-.92zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

export function ShareButton({ text, url, variant = "bar", className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const fullText = `${text}\n\n📲 ${shareUrl}`;

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(fullText)}`, "_blank", "noopener,noreferrer");
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "সঠিক বাংলা ক্যালেন্ডার", text, url: shareUrl });
      } catch { /* user cancelled */ }
    } else {
      shareWhatsApp();
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked */ }
  };

  if (variant === "compact") {
    return (
      <button
        onClick={shareWhatsApp}
        className={cn(
          "inline-flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm transition-transform hover:scale-105 font-bengali",
          className
        )}
        style={{ backgroundColor: WHATSAPP_GREEN }}
        aria-label="WhatsApp-এ শেয়ার করুন"
      >
        <WhatsAppIcon className="w-4 h-4" />
        শেয়ার
      </button>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={shareWhatsApp}
        className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm transition-transform hover:scale-[1.03] font-bengali"
        style={{ backgroundColor: WHATSAPP_GREEN }}
      >
        <WhatsAppIcon className="w-4 h-4" />
        WhatsApp-এ শেয়ার
      </button>

      <button
        onClick={shareNative}
        className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground text-sm font-semibold px-3.5 py-2 rounded-full hover:bg-accent transition-colors font-bengali"
        aria-label="শেয়ার করুন"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">শেয়ার</span>
      </button>

      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground text-sm font-semibold px-3.5 py-2 rounded-full hover:bg-accent transition-colors font-bengali"
        aria-label="লিঙ্ক কপি করুন"
      >
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4" />}
        <span className="hidden sm:inline">{copied ? "কপি হয়েছে" : "লিঙ্ক"}</span>
      </button>
    </div>
  );
}
