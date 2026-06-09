# Important-Dates Dataset — Input Spec

This is the structure to produce the dataset in. **Provide English only** — the
Bengali translation, expanded descriptions, slugs, icons, schema.org markup, and
de-duplication are generated during integration. Keep entries factual and include
a Wikipedia link wherever possible (it's used to ground the expanded description).

Output one JSON file (or keep your 5 files) as an **array of entries** in this shape.

---

## TypeScript schema (canonical)

```ts
type EntryType = "festival" | "observance" | "person" | "historical";
type Category  = "religious" | "national" | "cultural" | "observance" | "historical";

interface ImportantDateInput {
  type: EntryType;
  nameEn: string;                 // English name, e.g. "Durga Puja (Maha Ashtami)"
  category: Category;

  // ── WHEN — provide what fits the type ───────────────────────────────
  // Festivals / observances / historical days that move each year OR are date-specific:
  dates?: string[];               // ["2026-10-18", "2027-10-07"] — Gregorian YYYY-MM-DD, one or more
  // Civil days that fall on the SAME calendar date every year (alternative to `dates`):
  fixedMonthDay?: string;         // "01-26" (MM-DD)
  // Persons only:
  birthDate?: string;             // "1861-05-07" (YYYY-MM-DD)
  deathDate?: string;             // "1941-08-07" (optional)

  // ── CONTENT (English; will be translated + expanded to Bengali) ─────
  shortDescriptionEn: string;     // 1–2 lines is enough; it gets expanded into full paragraphs
  roleEn?: string;                // persons only, e.g. "Poet & Nobel laureate"

  // ── HELP WITH ACCURACY + DE-DUPING ──────────────────────────────────
  wikiUrl?: string;               // English or Bengali Wikipedia URL (grounds the expansion)
  aliasesEn?: string[];           // alternate names/spellings, helps detect duplicates

  // ── OPTIONAL ────────────────────────────────────────────────────────
  importance?: "major" | "minor"; // optional priority hint
}
```

### Fields YOU provide vs. fields I GENERATE

| You provide (English)                               | I generate                                            |
|-----------------------------------------------------|-------------------------------------------------------|
| type, nameEn, category, date(s)/birth/death         | nameBn (proper Bengali spelling)                      |
| shortDescriptionEn, roleEn                           | descBn — translated **and expanded** to full paragraphs |
| wikiUrl, aliasesEn, importance                      | tagline (one-line Bengali significance)               |
|                                                     | slug, icon/emoji, header gradient                     |
|                                                     | schema.org JSON-LD (Event / Person)                   |
|                                                     | de-duplication (within data + against existing app)   |

---

## Example JSON (copy this shape)

```json
[
  {
    "type": "festival",
    "nameEn": "Durga Puja (Maha Ashtami)",
    "category": "religious",
    "dates": ["2026-10-18", "2027-10-07"],
    "shortDescriptionEn": "The most sacred day of Durga Puja; Kumari Puja and Sandhi Puja are performed.",
    "wikiUrl": "https://en.wikipedia.org/wiki/Durga_Puja",
    "aliasesEn": ["Maha Ashtami", "Durgashtami"],
    "importance": "major"
  },
  {
    "type": "observance",
    "nameEn": "Republic Day",
    "category": "national",
    "fixedMonthDay": "01-26",
    "shortDescriptionEn": "Marks the day the Constitution of India came into effect, in 1950.",
    "wikiUrl": "https://en.wikipedia.org/wiki/Republic_Day_(India)"
  },
  {
    "type": "person",
    "nameEn": "Rabindranath Tagore",
    "category": "cultural",
    "birthDate": "1861-05-07",
    "deathDate": "1941-08-07",
    "roleEn": "Poet, writer & Nobel laureate",
    "shortDescriptionEn": "First non-European to win the Nobel Prize in Literature, in 1913.",
    "wikiUrl": "https://en.wikipedia.org/wiki/Rabindranath_Tagore",
    "aliasesEn": ["Tagore", "Gurudev", "Kabiguru"]
  },
  {
    "type": "historical",
    "nameEn": "Language Movement Day (Ekushey February)",
    "category": "historical",
    "fixedMonthDay": "02-21",
    "shortDescriptionEn": "Commemorates those killed in 1952 defending the Bengali language; now International Mother Language Day.",
    "wikiUrl": "https://en.wikipedia.org/wiki/International_Mother_Language_Day"
  }
]
```

---

## Rules of thumb

- **Dates:** for festivals that move yearly (tithi-based), list the actual Gregorian
  dates per year in `dates`. For same-date-every-year civil days, just use `fixedMonthDay`.
- **Persons:** always give full `birthDate`; `deathDate` only if the death anniversary
  is commonly commemorated.
- **shortDescriptionEn:** keep it short and **factual** — accuracy matters more than length,
  since it will be expanded. A wrong fact here becomes a wrong paragraph.
- **Don't** fill any Bengali, slug, icon, or schema fields — those are generated.
- **Duplicates are fine** — list them anyway; they get merged. `aliasesEn` helps the merge.
