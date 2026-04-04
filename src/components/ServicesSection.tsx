"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/lib/i18n";

const services = [
  {
    titleKey: "services.s1.title",
    descKey: "services.s1.desc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
        <path d="M8 17h8M12 17v4M6.5 13h11l1.5-6H5l1.5 6zM5 7l1-4h12l1 4" />
      </svg>
    ),
  },
  {
    titleKey: "services.s2.title",
    descKey: "services.s2.desc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
        <path d="M9 19V6l12-3v13M9 19c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2zm12-3c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2z" />
      </svg>
    ),
  },
  {
    titleKey: "services.s3.title",
    descKey: "services.s3.desc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
        <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
  {
    titleKey: "services.s4.title",
    descKey: "services.s4.desc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    titleKey: "services.s5.title",
    descKey: "services.s5.desc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
      </svg>
    ),
  },
  {
    titleKey: "services.s6.title",
    descKey: "services.s6.desc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section id="uslugi" className="relative overflow-hidden" style={{ padding: "var(--section-padding) 0" }}>
      <div className="glow-orb absolute" style={{ width: "500px", height: "500px", background: "radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%)", top: "-100px", right: "-150px" }} />

      <div className="max-w-[min(1200px,92vw)] mx-auto">
        <ScrollReveal type="fade-up">
          <div className="text-center" style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
            <span className="section-tag">{t("services.tag")}</span>
            <h2
              className="font-[family-name:var(--font-display)] font-semibold"
              style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", marginBottom: "1rem" }}
              dangerouslySetInnerHTML={{ __html: t("services.title") }}
            />
            <p style={{ fontSize: "1rem", color: "rgba(249, 168, 212, 0.85)", maxWidth: "520px", margin: "0 auto" }}>
              {t("services.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal type="stagger-cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "1.5rem" }}>
            {services.map((svc, i) => (
              <div key={i} className="glass-card relative overflow-hidden" style={{ padding: "2rem" }}>
                <div
                  className="flex items-center justify-center text-pink-400"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "14px",
                    background: "rgba(236, 72, 153, 0.1)",
                    marginBottom: "1.2rem",
                  }}
                >
                  {svc.icon}
                </div>
                <h3
                  className="font-[family-name:var(--font-display)] font-semibold"
                  style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}
                >
                  {t(svc.titleKey)}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "rgba(249, 168, 212, 0.85)", lineHeight: 1.6 }}>
                  {t(svc.descKey)}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
