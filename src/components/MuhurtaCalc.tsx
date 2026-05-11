import { useState, useMemo } from "react";
import { computeMuhurta, ACTIVITIES, ActivityType, MuhurtaDay } from "@/lib/muhurta";

function Stars({ count }: { count: number }) {
  return (
    <span aria-label={`${count} out of 5 stars`} className="tracking-tight">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? "text-yellow-400" : "text-muted-foreground/30"}>
          {i < count ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

function DayRow({ day, isBest }: { day: MuhurtaDay; isBest: boolean }) {
  const [expanded, setExpanded] = useState(false);

  const rowClass =
    day.stars >= 4
      ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
      : day.stars === 3
      ? "bg-background border-border"
      : "bg-muted/30 border-muted";

  return (
    <div
      className={`rounded-xl border p-3 cursor-pointer select-none transition-shadow hover:shadow-sm ${rowClass} ${isBest ? "ring-2 ring-primary/50" : ""}`}
      onClick={() => setExpanded((e) => !e)}
    >
      <div className="flex items-center gap-2 flex-wrap">
        {isBest && (
          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bengali shrink-0">
            সেরা
          </span>
        )}
        <span className="font-semibold text-sm w-28 shrink-0">{day.engDate}</span>
        <span className="font-bengali text-sm text-muted-foreground w-20 shrink-0">{day.bnDate}</span>
        <Stars count={day.stars} />
        <span className="text-xs text-muted-foreground font-bengali ml-auto shrink-0">{day.vara}</span>
        <span className="text-muted-foreground/50 text-xs ml-1">{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bengali">
          <div>
            <div className="text-muted-foreground mb-0.5">তিথি</div>
            <div className="font-medium leading-tight">{day.tithiBn}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-0.5">নক্ষত্র</div>
            <div className="font-medium">{day.nakshatraBn}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-0.5">যোগ</div>
            <div className={`font-medium ${day.yogaNature === "good" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
              {day.yogaBn} {day.yogaNature === "good" ? "✓" : "✗"}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-0.5">করণ</div>
            <div className={`font-medium ${day.karanaNature === "good" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
              {day.karanaBn} {day.karanaNature === "good" ? "✓" : "✗"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MuhurtaCalc() {
  const [activity, setActivity] = useState<ActivityType>("যাত্রা");

  const days = useMemo(
    () => computeMuhurta(activity, new Date(), 10),
    [activity]
  );

  const bestScore = Math.max(...days.map((d) => d.score));

  return (
    <div className="bg-card border border-card-border p-6 rounded-2xl shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold font-bengali text-card-foreground">
          শুভ মুহূর্ত
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Shubha Muhurta — best days for your activity (next 10 days, Kolkata sunrise)
        </p>
      </div>

      {/* Activity selector */}
      <div className="flex flex-wrap gap-2 mb-5">
        {ACTIVITIES.map((a) => (
          <button
            key={a.id}
            onClick={() => setActivity(a.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-bengali border transition-all
              ${activity === a.id
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted/40"
              }`}
          >
            <span className="mr-1">{a.icon}</span>
            {a.id}
            <span className="text-xs opacity-60 ml-1">({a.en})</span>
          </button>
        ))}
      </div>

      {/* Score legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="text-green-500">★★★★★</span> অতি শুভ
        </span>
        <span className="flex items-center gap-1">
          <span className="text-yellow-400">★★★★☆</span> শুভ
        </span>
        <span className="flex items-center gap-1">
          <span className="text-yellow-300">★★★☆☆</span> মধ্যম
        </span>
        <span className="flex items-center gap-1">
          <span className="text-muted-foreground/50">★★☆☆☆</span> অশুভ
        </span>
        <span className="ml-auto text-xs font-bengali italic">ক্লিক করুন বিস্তারিত দেখতে</span>
      </div>

      {/* Day rows */}
      <div className="space-y-2">
        {days.map((d, i) => (
          <DayRow key={i} day={d} isBest={d.score === bestScore} />
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-5 font-bengali leading-relaxed">
        * তিথি, নক্ষত্র, যোগ ও করণ সূর্যোদয়ের সময় অনুযায়ী গণনা করা হয়েছে।
        গুরুত্বপূর্ণ অনুষ্ঠানের জন্য বিশেষজ্ঞ পণ্ডিতের পরামর্শ নিন।
      </p>
    </div>
  );
}
