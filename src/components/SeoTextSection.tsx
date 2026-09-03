"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/lib/i18n";
import { seoContent, type SeoBlock } from "@/data/seo-content";

function renderBlock(block: SeoBlock, i: number) {
  if (block.type === "h") {
    return <h3 key={i} dangerouslySetInnerHTML={{ __html: block.text }} />;
  }
  if (block.type === "ul") {
    return (
      <ul key={i}>
        {block.items.map((item, j) => (
          <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    );
  }
  return <p key={i} dangerouslySetInnerHTML={{ __html: block.text }} />;
}

export default function SeoTextSection() {
  const { lang } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const article = seoContent[lang] ?? seoContent.pl;

  // Show the intro plus the first chapter; the rest sits behind "read more".
  // All of it stays in the DOM, so search engines see the full article.
  const headings = article.blocks
    .map((b, i) => (b.type === "h" ? i : -1))
    .filter((i) => i >= 0);
  const splitAt = headings.length > 1 ? headings[1] : article.blocks.length;
  const visible = article.blocks.slice(0, splitAt);
  const hidden = article.blocks.slice(splitAt);

  return (
    <section
      id="o-wieczorze-panienskim"
      className="relative overflow-hidden"
      style={{
        padding: "clamp(2rem, 4vw, 3rem) 0 var(--section-padding)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-[min(900px,92vw)] mx-auto">
        <ScrollReveal type="fade-up">
          <h2
            className="font-[family-name:var(--font-display)] font-semibold text-center"
            style={{
              fontSize: "clamp(1.6rem, 3.6vw, 2.5rem)",
              lineHeight: 1.25,
              marginBottom: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            {article.title}
          </h2>
        </ScrollReveal>

        <div
          className="seo-article"
          style={{
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.8,
          }}
        >
          {visible.map(renderBlock)}

          {hidden.length > 0 && (
            <>
              <div
                style={{
                  position: "relative",
                  maxHeight: expanded ? "none" : "14rem",
                  overflow: "hidden",
                }}
              >
                {hidden.map((b, i) => renderBlock(b, splitAt + i))}
                {!expanded && (
                  <div
                    className="absolute inset-x-0 bottom-0 pointer-events-none"
                    style={{
                      height: "8rem",
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 60%, #000 100%)",
                    }}
                  />
                )}
              </div>

              <div className="text-center" style={{ marginTop: "1.5rem" }}>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="px-7 py-2.5 rounded-full text-sm font-semibold border border-pink-500/40 text-pink-400 hover:bg-pink-500/10 hover:border-pink-500 transition-colors"
                  style={{ fontFamily: "var(--font-body)", letterSpacing: "0.02em" }}
                >
                  {expanded ? article.less : article.more}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
