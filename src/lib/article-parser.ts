/**
 * Article content pipeline — pure functions, no browser or Vite APIs, so the
 * same code runs in the client bundle AND in scripts/prerender.ts (node/tsx).
 *
 * Articles live in src/content/articles/*.md with a simple frontmatter block:
 *
 *   ---
 *   title: নিবন্ধের শিরোনাম
 *   slug: url-slug
 *   date: 2026-07-05
 *   category: festival | person | history | observance
 *   excerpt: এক-দুই বাক্যের সারাংশ (তালিকা কার্ড ও meta description-এ ব্যবহৃত)
 *   image: /articles/slug.jpg          (optional featured image, hosted in public/)
 *   imageAlt: ছবির বিবরণ               (optional)
 *   tags: ট্যাগ১, ট্যাগ২                (optional, comma-separated)
 *   related: লেবেল | /path, লেবেল | /path   (optional "label | internal-path" pairs)
 *   ---
 *
 * The body supports a small, safe markdown subset: ## / ### headings,
 * paragraphs, **bold**, *italic*, [links](url), - lists, 1. lists,
 * > blockquotes, and standalone images ![alt](src).
 */

export type ArticleCategory = "festival" | "person" | "history" | "observance" | "facts";

export const ARTICLE_CATEGORIES: Record<ArticleCategory, { labelBn: string; icon: string; tile: string }> = {
  festival:   { labelBn: "উৎসব",       icon: "🎉", tile: "from-orange-500 to-rose-600" },
  person:     { labelBn: "ব্যক্তিত্ব",  icon: "🌟", tile: "from-violet-500 to-indigo-600" },
  history:    { labelBn: "ইতিহাস",     icon: "🏛️", tile: "from-amber-500 to-yellow-600" },
  observance: { labelBn: "বিশেষ দিন",  icon: "📅", tile: "from-sky-500 to-blue-600" },
  facts:      { labelBn: "অজানা তথ্য",  icon: "💡", tile: "from-fuchsia-500 to-purple-600" },
};

export type Inline =
  | { type: "text"; text: string }
  | { type: "bold"; children: Inline[] }
  | { type: "italic"; children: Inline[] }
  | { type: "link"; text: string; href: string; internal: boolean };

export type Block =
  | { type: "heading"; level: 2 | 3 | 4; inline: Inline[] }
  | { type: "paragraph"; inline: Inline[] }
  | { type: "list"; ordered: boolean; items: Inline[][] }
  | { type: "quote"; inline: Inline[] }
  | { type: "image"; src: string; alt: string }
  | { type: "hr" };

export interface ArticleLink {
  label: string;
  href: string;
}

export interface Article {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD publish date
  category: ArticleCategory;
  excerpt: string;
  image?: string;
  imageAlt: string;
  tags: string[];
  related: ArticleLink[];
  blocks: Block[];
  readMinutes: number;
}

// ── inline markdown ───────────────────────────────────────────────────────

const INLINE_RE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/;

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let rest = src;
  const pushText = (t: string) => { if (t) out.push({ type: "text", text: t }); };

  while (rest) {
    const m = INLINE_RE.exec(rest);
    if (!m) { pushText(rest); break; }
    pushText(rest.slice(0, m.index));
    if (m[1] !== undefined) {
      out.push({ type: "link", text: m[1], href: m[2], internal: m[2].startsWith("/") });
    } else if (m[3] !== undefined) {
      out.push({ type: "bold", children: parseInline(m[3]) });
    } else {
      out.push({ type: "italic", children: parseInline(m[4]) });
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
}

// ── block markdown ────────────────────────────────────────────────────────

export function parseBlocks(md: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) { blocks.push({ type: "paragraph", inline: parseInline(para.join(" ")) }); para = []; }
  };
  const flushList = () => {
    if (list) { blocks.push({ type: "list", ordered: list.ordered, items: list.items.map(parseInline) }); list = null; }
  };

  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) { flushPara(); flushList(); continue; }

    if (/^(-{3,}|\*{3,})$/.test(line)) { flushPara(); flushList(); blocks.push({ type: "hr" }); continue; }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flushPara(); flushList();
      const level = Math.min(4, Math.max(2, h[1].length)) as 2 | 3 | 4;
      blocks.push({ type: "heading", level, inline: parseInline(h[2]) });
      continue;
    }

    const img = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (img) { flushPara(); flushList(); blocks.push({ type: "image", alt: img[1], src: img[2] }); continue; }

    if (line.startsWith(">")) {
      flushPara(); flushList();
      blocks.push({ type: "quote", inline: parseInline(line.replace(/^>\s?/, "")) });
      continue;
    }

    const ul = line.match(/^[-*]\s+(.*)$/);
    const ol = line.match(/^\d+[.)]\s+(.*)$/);
    if (ul || ol) {
      flushPara();
      const ordered = !!ol;
      if (!list || list.ordered !== ordered) { flushList(); list = { ordered, items: [] }; }
      list.items.push((ul ?? ol)![1]);
      continue;
    }

    flushList();
    para.push(line);
  }
  flushPara(); flushList();
  return blocks;
}

// ── frontmatter ───────────────────────────────────────────────────────────

export function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: raw.slice(m[0].length) };
}

// ── article assembly ──────────────────────────────────────────────────────

function inlineWords(inline: Inline[]): number {
  return inline.reduce((n, seg) => {
    if (seg.type === "bold" || seg.type === "italic") return n + inlineWords(seg.children);
    return n + seg.text.split(/\s+/).filter(Boolean).length;
  }, 0);
}

function countWords(blocks: Block[]): number {
  return blocks.reduce((n, b) => {
    if (b.type === "image" || b.type === "hr") return n;
    if (b.type === "list") return n + b.items.reduce((m, it) => m + inlineWords(it), 0);
    return n + inlineWords(b.inline);
  }, 0);
}

// ── FAQ extraction (for FAQPage JSON-LD) ──────────────────────────────────

export function inlineToText(inline: Inline[]): string {
  return inline
    .map(seg => (seg.type === "bold" || seg.type === "italic" ? inlineToText(seg.children) : seg.text))
    .join("");
}

/**
 * Collects question–answer pairs from a "## সাধারণ প্রশ্ন / FAQ" section:
 * each ### heading is a question, the paragraphs until the next heading form
 * its answer. Used to emit FAQPage structured data.
 */
export function extractFaq(blocks: Block[]): Array<{ q: string; a: string }> {
  const faqStart = blocks.findIndex(
    b => b.type === "heading" && b.level === 2 && /সাধারণ প্রশ্ন|FAQ/i.test(inlineToText(b.inline))
  );
  if (faqStart === -1) return [];

  const faq: Array<{ q: string; a: string }> = [];
  let current: { q: string; a: string } | null = null;

  for (const b of blocks.slice(faqStart + 1)) {
    if (b.type === "heading" && b.level === 2) break; // FAQ section ended
    if (b.type === "heading") {
      if (current?.a) faq.push(current);
      current = { q: inlineToText(b.inline), a: "" };
    } else if (current && (b.type === "paragraph" || b.type === "quote")) {
      current.a = current.a ? `${current.a} ${inlineToText(b.inline)}` : inlineToText(b.inline);
    } else if (b.type === "hr") {
      break;
    }
  }
  if (current?.a) faq.push(current);
  return faq;
}

const CATEGORY_KEYS = Object.keys(ARTICLE_CATEGORIES) as ArticleCategory[];

export function parseArticle(raw: string, fallbackSlug: string): Article {
  const { meta, body } = parseFrontmatter(raw);
  const blocks = parseBlocks(body);

  const csv = (v?: string) => (v ? v.split(",").map(s => s.trim()).filter(Boolean) : []);
  const related: ArticleLink[] = csv(meta.related)
    .map(pair => {
      const [label, href] = pair.split("|").map(s => s.trim());
      return label && href ? { label, href } : null;
    })
    .filter((l): l is ArticleLink => l !== null);

  const category = CATEGORY_KEYS.includes(meta.category as ArticleCategory)
    ? (meta.category as ArticleCategory)
    : "history";

  return {
    slug: meta.slug || fallbackSlug,
    title: meta.title || fallbackSlug,
    date: meta.date || "",
    category,
    excerpt: meta.excerpt || "",
    image: meta.image || undefined,
    imageAlt: meta.imageAlt || meta.title || "",
    tags: csv(meta.tags),
    related,
    blocks,
    readMinutes: Math.max(1, Math.round(countWords(blocks) / 180)),
  };
}

// ── HTML rendering (prerender / SEO body) ─────────────────────────────────

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inlineToHtml(inline: Inline[]): string {
  return inline
    .map(seg => {
      switch (seg.type) {
        case "bold":   return `<strong>${inlineToHtml(seg.children)}</strong>`;
        case "italic": return `<em>${inlineToHtml(seg.children)}</em>`;
        case "link":   return seg.internal
          ? `<a href="${escHtml(seg.href)}">${escHtml(seg.text)}</a>`
          : `<a href="${escHtml(seg.href)}" target="_blank" rel="noopener noreferrer">${escHtml(seg.text)}</a>`;
        default:       return escHtml(seg.text);
      }
    })
    .join("");
}

export function renderBlocksToHtml(blocks: Block[]): string {
  return blocks
    .map(b => {
      switch (b.type) {
        case "heading":   return `<h${b.level}>${inlineToHtml(b.inline)}</h${b.level}>`;
        case "paragraph": return `<p>${inlineToHtml(b.inline)}</p>`;
        case "quote":     return `<blockquote>${inlineToHtml(b.inline)}</blockquote>`;
        case "image":     return `<img src="${escHtml(b.src)}" alt="${escHtml(b.alt)}" loading="lazy" />`;
        case "hr":        return `<hr />`;
        case "list": {
          const tag = b.ordered ? "ol" : "ul";
          return `<${tag}>${b.items.map(it => `<li>${inlineToHtml(it)}</li>`).join("")}</${tag}>`;
        }
      }
    })
    .join("\n");
}
