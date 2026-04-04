"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/lib/i18n";

const steps = [
  { number: "01", titleKey: "hiw.s1.title", descKey: "hiw.s1.desc" },
  { number: "02", titleKey: "hiw.s2.title", descKey: "hiw.s2.desc" },
  { number: "03", titleKey: "hiw.s3.title", descKey: "hiw.s3.desc" },
];

export default function HowItWorksSection() {
  const { t } = useLanguage();

  return (
    <section id="jak-to-dziala" className="relative overflow-hidden" style={{ padding: "var(--section-padding) 0" }}>
      <div className="light-rays" />

      <div className="max-w-[min(1200px,92vw)] mx-auto relative z-10">
        <ScrollReveal type="fade-up">
          <div className="text-center" style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
            <span className="section-tag">{t("hiw.tag")}</span>
            <h2
              className="font-[family-name:var(--font-display)] font-semibold"
              style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", marginBottom: "1rem" }}
              dangerouslySetInnerHTML={{ __html: t("hiw.title") }}
            />
          </div>
        </ScrollReveal>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-center" style={{ gap: 0 }}>
          {steps.map((step, i) => (
            <div key={step.number} className="flex flex-col md:flex-row items-center" style={{ flex: i < steps.length - 1 ? "1" : "1" }}>
              <ScrollReveal type="step-alternate" index={i}>
                <div className="text-center" style={{ padding: "0 2rem", flex: 1 }}>
                  <div
                    className="font-[family-name:var(--font-display)]"
                    style={{
                      fontSize: "3.5rem",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #f472b6, #db2777)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: 1,
                      marginBottom: "1.2rem",
                    }}
                  >
                    {step.number}
                  </div>
                  <h3
                    className="font-[family-name:var(--font-display)] font-semibold"
                    style={{ fontSize: "1.3rem", marginBottom: "0.6rem" }}
                  >
                    {t(step.titleKey)}
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "rgba(249, 168, 212, 0.85)", lineHeight: 1.6 }}>
                    {t(step.descKey)}
                  </p>
                </div>
              </ScrollReveal>
              {i < steps.length - 1 && (
                <>
                  {/* Desktop connector */}
                  <div
                    className="hidden md:block shrink-0"
                    style={{
                      width: "80px",
                      height: "1px",
                      background: "linear-gradient(90deg, transparent, #ec4899, transparent)",
                      marginTop: "2rem",
                    }}
                  />
                  {/* Mobile connector */}
                  <div
                    className="md:hidden"
                    style={{
                      width: "1px",
                      height: "40px",
                      background: "linear-gradient(to bottom, transparent, #ec4899, transparent)",
                      margin: "1rem 0",
                    }}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
