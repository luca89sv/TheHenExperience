"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      style={{
        background: "#0c0c10",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        padding: "4rem 0 2rem",
      }}
    >
      <div className="max-w-[min(1200px,92vw)] mx-auto">
        <div
          className="grid grid-cols-1 text-center md:grid-cols-2 md:text-left lg:grid-cols-[1.5fr_1fr_1fr_1fr]"
          style={{ gap: "clamp(2rem, 4vw, 3rem)" }}
        >
          {/* Brand */}
          <div>
            <div
              className="font-[family-name:var(--font-display)]"
              style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem" }}
            >
              The{" "}
              <span
                style={{
                  color: "#f472b6",
                  fontWeight: 700,
                  fontSize: "1.15em",
                  textShadow: "0 0 20px rgba(236, 72, 153, 0.3), 0 0 40px rgba(236, 72, 153, 0.15)",
                }}
              >
                Hen
              </span>{" "}
              Experience
            </div>
            <p className="mx-auto md:mx-0 md:max-w-[280px]" style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.45)", lineHeight: 1.6 }}>
              {t("footer.desc")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="uppercase"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "#f472b6",
                marginBottom: "1.2rem",
              }}
            >
              {t("footer.links")}
            </h4>
            <div className="flex flex-col" style={{ gap: 0 }}>
              {[
                { href: "/#pakiety", label: "Pakiety" },
                { href: "/#atrakcje", label: "Pojedyncze atrakcje" },
                { href: "/#jak-to-dziala", label: "Jak to działa" },
                { href: "/#opinie", label: "Opinie" },
                { href: "/#faq", label: "FAQ" },
                { href: "/#kontakt", label: "Formularz kontaktowy" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/45 hover:text-pink-400 transition-colors"
                  style={{ fontSize: "0.88rem", marginBottom: "0.6rem", display: "block" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="uppercase"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "#f472b6",
                marginBottom: "1.2rem",
              }}
            >
              {t("footer.contact")}
            </h4>
            <div className="flex flex-col" style={{ gap: 0 }}>
              <a
                href="tel:+48537048777"
                className="text-white/45 hover:text-pink-400 transition-colors flex items-center gap-2 justify-center md:justify-start"
                style={{ fontSize: "0.88rem", marginBottom: "0.6rem" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14" className="shrink-0">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                +48 537 048 777
              </a>
              <a
                href="mailto:atrakcjenapanienski@gmail.com"
                className="text-white/45 hover:text-pink-400 transition-colors flex items-center gap-2 justify-center md:justify-start"
                style={{ fontSize: "0.88rem", marginBottom: "0.6rem" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14" className="shrink-0">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                atrakcjenapanienski@gmail.com
              </a>
              <div
                className="text-white/45 flex items-center gap-2 justify-center md:justify-start"
                style={{ fontSize: "0.88rem", marginBottom: "0.6rem" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14" className="shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Warszawa, Polska
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4
              className="uppercase"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "#f472b6",
                marginBottom: "1.2rem",
              }}
            >
              {t("footer.social")}
            </h4>
            <div className="flex justify-center md:justify-start" style={{ gap: "1rem" }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="flex items-center justify-center transition-colors border border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.45)] hover:border-[rgba(236,72,153,0.35)] hover:text-pink-400"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className="flex items-center justify-center transition-colors border border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.45)] hover:border-[rgba(236,72,153,0.35)] hover:text-pink-400"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener"
                aria-label="TikTok"
                className="flex items-center justify-center transition-colors border border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.45)] hover:border-[rgba(236,72,153,0.35)] hover:text-pink-400"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.11v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46v-7.1a8.16 8.16 0 005.58 2.18V11.3a4.84 4.84 0 01-3.77-1.84V6.69z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="text-center"
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.3)" }}>
            &copy; 2026 The Hen Experience. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
