"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/lib/i18n";

const testimonials = [
  { textKey: "test.t1.text", name: "Anna K.", roleKey: "test.t1.role", initials: "AK" },
  { textKey: "test.t2.text", name: "Marta J.", roleKey: "test.t2.role", initials: "MJ" },
  { textKey: "test.t3.text", name: "Karolina W.", roleKey: "test.t3.role", initials: "KW" },
];

export default function TestimonialsSection() {
  const { t } = useLanguage();

  return (
    <section id="opinie" className="relative overflow-hidden" style={{ padding: "var(--section-padding) 0" }}>
      <div className="max-w-[min(1200px,92vw)] mx-auto">
        <ScrollReveal type="fade-up">
          <div className="text-center" style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
            <span className="section-tag">{t("test.tag")}</span>
            <h2
              className="font-[family-name:var(--font-display)] font-semibold"
              style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", marginBottom: "1rem" }}
              dangerouslySetInnerHTML={{ __html: t("test.title") }}
            />
          </div>
        </ScrollReveal>

        <ScrollReveal type="scale-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "1.5rem" }}>
            {testimonials.map((tm, i) => (
              <div
                key={i}
                className={`glass-card flex flex-col ${i === testimonials.length - 1 ? "md:col-span-2 md:max-w-[500px] md:mx-auto lg:col-span-1 lg:max-w-none" : ""}`}
                style={{ padding: "2rem" }}
              >
                <div
                  className="font-[family-name:var(--font-display)]"
                  style={{ fontSize: "3.5rem", lineHeight: 1, color: "#ec4899", opacity: 0.4, marginBottom: "-0.5rem" }}
                >
                  &ldquo;
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(249, 168, 212, 0.85)",
                    lineHeight: 1.7,
                    flex: 1,
                    marginBottom: "1.5rem",
                    fontStyle: "italic",
                  }}
                >
                  {t(tm.textKey)}
                </p>
                <div className="flex items-center" style={{ gap: "0.8rem" }}>
                  <div
                    className="flex items-center justify-center text-white shrink-0"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #db2777, #f472b6)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {tm.initials}
                  </div>
                  <div>
                    <strong className="block" style={{ fontSize: "0.88rem" }}>{tm.name}</strong>
                    <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.45)" }}>
                      {t(tm.roleKey)}
                    </span>
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
