import { useMonthFestivals } from "@/hooks/useMassiveFestivals";
import { ChevronDown, Zap, Database } from "lucide-react";
import { useState } from "react";

interface FestivalListProps {
  year: number;
  month: number;
}

export function FestivalList({ year, month }: FestivalListProps) {
  const { festivals, isLoading, totalFestivals, highPriority, mediumPriority, lowPriority, error } =
    useMonthFestivals(year, month);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterImportance, setFilterImportance] = useState<"all" | "high" | "medium" | "low">("all");

  const getEventIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("durga") || lower.includes("puja")) return "🙏";
    if (lower.includes("diwali")) return "🪔";
    if (lower.includes("holi")) return "🎨";
    if (lower.includes("eid")) return "🌙";
    if (lower.includes("christmas")) return "🎄";
    if (lower.includes("birthday")) return "🎂";
    if (lower.includes("new year")) return "🎉";
    if (lower.includes("independence")) return "🇮🇳";
    return "📍";
  };

  // Filter by importance
  let displayFestivals = festivals;
  if (filterImportance === "high") displayFestivals = highPriority;
  if (filterImportance === "medium") displayFestivals = mediumPriority;
  if (filterImportance === "low") displayFestivals = lowPriority;

  if (isLoading) {
    return (
      <div className="mt-6 bg-card border border-card-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 animate-pulse text-yellow-500" />
          <h3 className="text-lg font-bold font-bengali">ডেটা লোড হচ্ছে...</h3>
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded animate-pulse"
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          💡 প্রথম লোডে ডেটা ডাউনলোড হচ্ছে... (ক্যাশ হবে ৩০ দিনের জন্য)
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 bg-card border border-red-200 dark:border-red-800 rounded-xl p-6">
        <p className="text-sm text-red-600 dark:text-red-400 font-bengali">
          ⚠️ ইভেন্ট লোড করতে সমস্যা হয়েছে।
        </p>
        <p className="text-xs text-red-500 dark:text-red-300 mt-2">
          Google Calendar API চেক করুন বা পরে আবার চেষ্টা করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-card border border-card-border rounded-2xl p-6 animate-fade-in">
      {/* Header with stats */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold font-bengali text-card-foreground">
              উৎসব ও অনুষ্ঠান
            </h3>
            <p className="text-sm text-muted-foreground mt-1 font-bengali">
              এই মাসে {displayFestivals.length} ইভেন্ট
              {totalFestivals > 0 && (
                <span className="ml-2 text-xs text-primary">
                  (সর্বমোট ডেটা: {totalFestivals.toLocaleString()} 
                  <Database className="h-3 w-3 inline ml-1" />)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "সব", count: festivals.length },
            { key: "high", label: "গুরুত্বপূর্ণ", count: highPriority.length },
            { key: "medium", label: "মধ্যম", count: mediumPriority.length },
            { key: "low", label: "অন্যান্য", count: lowPriority.length },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() =>
                setFilterImportance(
                  filter.key as "all" | "high" | "medium" | "low"
                )
              }
              className={`px-3 py-1 rounded-full text-xs font-bengali font-semibold transition-all ${
                filterImportance === filter.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Events list */}
      {displayFestivals.length > 0 ? (
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {displayFestivals.map((event, idx) => (
            <div
              key={`${event.date}-${idx}`}
              data-stagger-child
              className={`
                rounded-lg border-2 p-4 transition-all duration-200 cursor-pointer
                ${
                  event.importance === "high"
                    ? "border-red-400 bg-red-50 dark:bg-red-950/30 hover:shadow-lg"
                    : event.importance === "medium"
                    ? "border-green-400 bg-green-50 dark:bg-green-950/30"
                    : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950/20"
                }
              `}
              onClick={() =>
                setExpandedId(
                  expandedId === `${event.date}-${idx}`
                    ? null
                    : `${event.date}-${idx}`
                )
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">
                      {getEventIcon(event.title)}
                    </span>
                    <h4 className="font-bold font-bengali text-foreground">
                      {event.title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground font-bengali">
                    📅{" "}
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    {" | "}
                    📍 {event.calendar}
                  </p>
                </div>

                {event.importance === "high" && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bengali font-bold">
                    গুরু
                  </span>
                )}

                <ChevronDown
                  className={`h-4 w-4 ml-2 transition-transform ${
                    expandedId === `${event.date}-${idx}` ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Expanded details */}
              {expandedId === `${event.date}-${idx}` && (
                <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                  {event.description && (
                    <p className="text-xs text-foreground/80 leading-relaxed mb-2">
                      {event.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    অঞ্চল: {event.region}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground font-bengali">
            এই মাসে নির্বাচিত ফিল্টারে কোনো উৎসব নেই
          </p>
        </div>
      )}

      {/* Footer with data source info */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-900 dark:text-blue-200 font-bengali mb-2">
            <strong>📊 ডেটা উৎস:</strong> Google Calendar API
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-300 mb-2">
            ✅ ৫০ বছরের ডেটা (২০০০-২০৫০)
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-300 mb-2">
            ✅ ৬টি ক্যালেন্ডার সোর্স
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-300">
            ✅ ৩০ দিনের জন্য ক্যাশড (অটো-রিফ্রেশ)
          </p>
        </div>
      </div>
    </div>
  );
}
