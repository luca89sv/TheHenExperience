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
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="relative overflow-hidden" style={{ padding: "var(--section-padding) 0" }}>
      <div className="max-w-[min(800px,92vw)] mx-auto">
        <ScrollReveal type="fade-up">
          <div className="text-center" style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
            <span className="section-tag">{t("faq.tag")}</span>
            <h2
              className="font-[family-name:var(--font-display)] font-semibold"
              style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", marginBottom: "1rem" }}
              dangerouslySetInnerHTML={{ __html: t("faq.title") }}
            />
          </div>
        </ScrollReveal>

        <ScrollReveal type="faq-stagger">
          <div className="flex flex-col" style={{ gap: 0 }}>
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
                <div
                  style={{
                    maxHeight: openIndex === i ? "300px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <p
                    style={{
                      paddingBottom: "1.4rem",
                      fontSize: "0.92rem",
                      color: "rgba(249, 168, 212, 0.85)",
                      lineHeight: 1.7,
                    }}
                  >
                    {t(faq.aKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
