import { useQuery } from "@tanstack/react-query";

interface FestivalData {
  date: string;
  title: string;
  calendar: string;
  importance: "high" | "medium" | "low";
  region: string;
  description?: string;
}

export function useMonthFestivals(year: number, month: number) {
  const { data: allFestivals = [], isLoading, error } = useQuery({
    queryKey: ["festivals", year, month],
    queryFn: async () => {
      const API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
      
      if (!API_KEY) {
        console.error("API key missing");
        return [];
      }

      const festivals: FestivalData[] = [];
      
      const calendars = [
        {
          id: "indian-holidays@group.calendar.google.com",
          name: "Indian Holidays",
          region: "India",
        },
        {
          id: "hindu-festivals@group.calendar.google.com",
          name: "Hindu Festivals",
          region: "India",
        },
      ];

      for (const calendar of calendars) {
        try {
          const startDate = new Date(year, month - 1, 1).toISOString();
          const endDate = new Date(year, month, 0).toISOString();

          const url = new URL(
            "https://www.googleapis.com/calendar/v3/calendars/" +
            encodeURIComponent(calendar.id) +
            "/events"
          );
          url.searchParams.append("key", API_KEY);
          url.searchParams.append("timeMin", startDate);
          url.searchParams.append("timeMax", endDate);
          url.searchParams.append("singleEvents", "true");
          url.searchParams.append("maxResults", "100");

          const response = await fetch(url.toString());
          
          if (!response.ok) continue;

          const data = await response.json();

          if (data.items) {
            data.items.forEach((event: any) => {
              festivals.push({
                date: event.start.date || event.start.dateTime,
                title: event.summary,
                calendar: calendar.name,
                importance: getImportance(event.summary),
                region: calendar.region,
                description: event.description,
              });
            });
          }

          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error("Error:", error);
        }
      }

      return festivals;
    },
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  const festivals = allFestivals || [];
  
  return {
    festivals,
    isLoading,
    error,
    totalFestivals: festivals.length,
    highPriority: festivals.filter(f => f.importance === "high"),
    mediumPriority: festivals.filter(f => f.importance === "medium"),
    lowPriority: festivals.filter(f => f.importance === "low"),
  };
}

function getImportance(title: string): "high" | "medium" | "low" {
  const highPriority = [
    "durga puja",
    "diwali",
    "holi",
    "eid",
    "christmas",
  ];

  const titleLower = title.toLowerCase();

  if (highPriority.some(keyword => titleLower.includes(keyword))) {
    return "high";
  }

  if (titleLower.includes("puja") || titleLower.includes("festival")) {
    return "medium";
  }

  return "low";
}

export { FestivalData };
