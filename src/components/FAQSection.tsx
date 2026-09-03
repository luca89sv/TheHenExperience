"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/lib/i18n";

const faqKeys = [
  { qKey: "faq.q1", aKey: "faq.a1" },
  { qKey: "faq.q2", aKey: "faq.a2" },
  { qKey: "faq.q3", aKey: "faq.a3" },
  { qKey: "faq.q4", aKey: "faq.a4" },
  { qKey: "faq.q5", aKey: "faq.a5" },
  { qKey: "faq.q6", aKey: "faq.a6" },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="relative overflow-hidden" style={{ padding: "clamp(2rem, 4vw, 3rem) 0 var(--section-padding)" }}>
      <div className="max-w-[min(800px,92vw)] mx-auto">
        <ScrollReveal type="fade-up">
          <div className="text-center" style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
            <span className="section-tag" style={{ color: "rgba(255,255,255,0.45)" }}>{t("faq.tag")}</span>
            <h2
              className="font-[family-name:var(--font-display)] font-semibold"
              style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", marginBottom: "1rem" }}
              dangerouslySetInnerHTML={{ __html: t("faq.title") }}
            />
          </div>
        </ScrollReveal>

        <ScrollReveal type="faq-stagger">
          <div className="faq-list flex flex-col" style={{ gap: 0 }}>
            {faqKeys.map((faq, i) => (
              <div
                key={i}
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between text-left text-white hover:text-pink-400 transition-colors"
                  style={{ padding: "1.4rem 0", fontSize: "1.05rem", fontWeight: 500 }}
                >
                  <span>{t(faq.qKey)}</span>
                  <span
                    className="shrink-0 transition-transform duration-[400ms]"
                    style={{
                      fontSize: "1.4rem",
                      color: "#f472b6",
                      marginLeft: "1rem",
                      transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>
                {/* grid-rows 0fr→1fr animates to the answer's natural height, so
                    multi-paragraph answers are never clipped by a fixed max-height */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: openIndex === i ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <div
                      className="faq-answer"
                      style={{
                        paddingBottom: "1.4rem",
                        fontSize: "0.92rem",
                        color: "rgba(255, 255, 255, 0.45)",
                        lineHeight: 1.7,
                      }}
                      dangerouslySetInnerHTML={{ __html: t(faq.aKey) }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
