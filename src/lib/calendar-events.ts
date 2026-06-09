import { Festival, getFestivalsForDate } from "./festivals";
import { getAnniversariesForDate, Anniversary } from "./famous-people";
import { getObservancesForDate } from "./observances";

export type { Anniversary };

/**
 * Returns all events for a date — static festivals, recurring observances/events,
 * PLUS famous-people anniversaries. Anniversaries already covered by a static
 * festival entry (inFestivals: true) are excluded to avoid calendar-cell duplication.
 */
export function getAllEventsForDate(date: Date): Festival[] {
  const festivals = getFestivalsForDate(date);
  const observances = getObservancesForDate(date);
  const anniversaries = getAnniversariesForDate(date)
    .filter(a => !a.person.inFestivals);
  return [...festivals, ...observances, ...anniversaries];
}

/**
 * Returns ALL anniversaries for a date (including those already in festivals.ts),
 * used by DayDetailsModal to show the Wikipedia-linked person cards.
 */
export function getAllAnniversariesForDate(date: Date): Anniversary[] {
  return getAnniversariesForDate(date);
}
