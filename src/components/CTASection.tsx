"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/lib/i18n";

export default function CTASection() {
  const { t } = useLanguage();

  return (
    <section
      id="kontakt"
      className="relative text-center overflow-hidden"
      style={{ padding: "clamp(6rem, 12vw, 10rem) 0" }}
    >
      <div className="light-rays" />
      <div
        className="glow-orb absolute"
        style={{
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="max-w-[min(1200px,92vw)] mx-auto relative z-10">
        <ScrollReveal type="cta-dramatic">
          <div>
            <span className="section-tag">{t("cta.tag")}</span>
            <h2
              className="font-[family-name:var(--font-display)] font-semibold"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", marginBottom: "1.2rem" }}
              dangerouslySetInnerHTML={{ __html: t("cta.title") }}
            />
            <p
              style={{
                fontSize: "1.05rem",
                color: "rgba(249, 168, 212, 0.85)",
                maxWidth: "480px",
                margin: "0 auto 2.5rem",
              }}
            >
              {t("cta.desc")}
            </p>
            <div className="flex flex-wrap items-center justify-center" style={{ gap: "1rem" }}>
              <a
                href="tel:+48537048777"
                className="btn-primary btn-lg"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                {t("cta.phone")}
              </a>
              <a
                href="mailto:atrakcjenapanienski@gmail.com"
                className="btn-outline btn-lg"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {t("cta.email")}
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
