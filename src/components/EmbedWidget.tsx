import { useState } from "react";
import { Copy, Check, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmbedWidget() {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined"
    ? window.location.origin + window.location.pathname.replace(/\/$/, "")
    : "https://your-app.replit.app";

  const iframeCode =
`<iframe
  src="${url}"
  width="100%"
  height="750"
  frameborder="0"
  title="সঠিক বাংলা ক্যালেন্ডার"
  loading="lazy"
  style="border-radius:12px;box-shadow:0 2px 16px rgba(0,0,0,.12)"
></iframe>`;

  const copy = () => {
    navigator.clipboard.writeText(iframeCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="bg-card border border-card-border p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <Code2 className="h-5 w-5 text-primary shrink-0" />
        <h2 className="text-xl font-bold font-bengali text-card-foreground">
          ওয়েবসাইটে যোগ করুন (Embed)
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4 font-bengali">
        নিচের কোডটি আপনার যেকোনো ওয়েবসাইট বা ব্লগে পেস্ট করুন — ক্যালেন্ডারটি সেখানে সরাসরি দেখা যাবে।
      </p>

      <div className="relative group">
        <pre className="bg-muted text-muted-foreground text-xs p-4 pr-20 rounded-xl overflow-x-auto border border-border font-mono leading-relaxed whitespace-pre-wrap break-all">
{iframeCode}
        </pre>
        <Button
          size="sm"
          variant="secondary"
          onClick={copy}
          className="absolute top-2 right-2 gap-1.5 shadow-sm"
        >
          {copied
            ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
            : <><Copy className="h-3.5 w-3.5" /> Copy</>
          }
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Works on WordPress, Wix, Blogger, and any site that allows HTML embedding.
      </p>
    </div>
  );
}
