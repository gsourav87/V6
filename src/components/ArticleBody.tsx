import { Fragment } from "react";
import { Link } from "wouter";
import type { Block, Inline } from "@/lib/article-parser";

/**
 * Renders parsed article blocks as React elements. Internal links use wouter's
 * <Link> for SPA navigation; external links open in a new tab.
 */

function InlineSegments({ segments }: { segments: Inline[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        switch (seg.type) {
          case "bold":
            return <strong key={i} className="font-semibold text-foreground"><InlineSegments segments={seg.children} /></strong>;
          case "italic":
            return <em key={i}><InlineSegments segments={seg.children} /></em>;
          case "link":
            return seg.internal ? (
              <Link key={i} href={seg.href} className="text-primary font-medium hover:underline underline-offset-2">
                {seg.text}
              </Link>
            ) : (
              <a
                key={i}
                href={seg.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline underline-offset-2"
              >
                {seg.text}
              </a>
            );
          default:
            return <Fragment key={i}>{seg.text}</Fragment>;
        }
      })}
    </>
  );
}

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="font-bengali text-foreground/90 text-sm sm:text-base leading-relaxed space-y-4">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading": {
            const Tag = `h${b.level}` as const;
            return (
              <Tag
                key={i}
                className={
                  b.level === 2
                    ? "text-xl sm:text-2xl font-bold text-foreground pt-4"
                    : "text-lg sm:text-xl font-bold text-foreground pt-2"
                }
              >
                <InlineSegments segments={b.inline} />
              </Tag>
            );
          }
          case "paragraph":
            return (
              <p key={i}>
                <InlineSegments segments={b.inline} />
              </p>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-4 border-primary/40 bg-primary/5 rounded-r-xl px-4 py-3 italic">
                <InlineSegments segments={b.inline} />
              </blockquote>
            );
          case "image":
            return (
              <img
                key={i}
                src={b.src}
                alt={b.alt}
                loading="lazy"
                className="w-full rounded-2xl border border-border"
              />
            );
          case "hr":
            return <hr key={i} className="border-border my-6" />;
          case "list": {
            const ListTag = b.ordered ? "ol" : "ul";
            return (
              <ListTag key={i} className={`${b.ordered ? "list-decimal" : "list-disc"} pl-6 space-y-1.5`}>
                {b.items.map((item, j) => (
                  <li key={j}>
                    <InlineSegments segments={item} />
                  </li>
                ))}
              </ListTag>
            );
          }
        }
      })}
    </div>
  );
}
