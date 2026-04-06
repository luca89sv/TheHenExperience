"use client";

import { useState, useEffect } from "react";
// Using <a> tags for navigation to avoid GSAP/canvas reinit issues
import { useLanguage, T } from "@/lib/i18n";

const NAV_LINK_KEYS = [
  { href: "/#pakiety", key: "nav.packages" },
  { href: "/#atrakcje", key: "nav.activities" },
  { href: "/#jak-to-dziala", key: "nav.howItWorks" },
  { href: "/#opinie", key: "nav.reviews" },
  { href: "/#faq", key: "nav.faq" },
  { href: "/#kontakt", key: "nav.contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSmall, setIsSmall] = useState(false); // ≤480px
  const [isMobile, setIsMobile] = useState(false); // ≤768px
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsSmall(w <= 480);
      setIsMobile(w <= 768);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Top contact bar — 36px (32px on ≤480px), pink gradient */}
      <div
        className="fixed top-0 left-0 right-0 z-[1001] flex items-center"
        style={{
          height: isSmall ? "36px" : isMobile ? "40px" : "36px",
          background: "linear-gradient(90deg, #be185d, #db2777, #ec4899)",
        }}
      >
        <div className="max-w-[min(1200px,92vw)] mx-auto w-full flex items-center justify-between relative">
          <div className="flex items-center" style={{ gap: isMobile ? "0" : "1.8rem", ...(isMobile ? { justifyContent: "space-between", width: "100%" } : {}) }}>
            <a
              href="mailto:atrakcjenapanienski@gmail.com"
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
              style={{ fontSize: isMobile ? "1.05rem" : "0.78rem", fontWeight: 500 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={isMobile ? 18 : 14} height={isMobile ? 18 : 14} style={{ opacity: 0.8, flexShrink: 0 }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {!isSmall && "atrakcjenapanienski@gmail.com"}
            </a>
            <a
              href="tel:+48537048777"
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
              style={{ fontSize: isMobile ? "1.05rem" : "0.78rem", fontWeight: 500 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={isMobile ? 16 : 14} height={isMobile ? 16 : 14} style={{ opacity: 0.8, flexShrink: 0 }}>
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              {!isSmall && "+48 537 048 777"}
            </a>
          </div>
          {/* Centered tagline */}
          <span
            className="hidden md:block absolute left-1/2 -translate-x-1/2 text-white/75 uppercase"
            style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em" }}
          >
            <T k="topbar.tagline" />
          </span>
          {/* Social icons — hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 ml-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              className="flex items-center justify-center text-white/70 hover:text-white hover:scale-[1.2] transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15">
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
              className="flex items-center justify-center text-white/70 hover:text-white hover:scale-[1.2] transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation — fixed below top bar */}
      <nav
        className="fixed left-0 right-0 z-[1000] transition-all duration-200"
        style={{
          top: isSmall ? "36px" : isMobile ? "40px" : "36px",
          background: scrolled ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.06)"}`,
        }}
      >
        <div
          className="mx-auto flex items-center justify-between"
          style={{ width: "min(1200px, 92vw)", height: "64px" }}
        >
          {/* Logo */}
          <a
            href="/"
            className="font-[family-name:var(--font-display)] whitespace-nowrap"
            style={{ fontSize: "1.35rem", fontWeight: 700, letterSpacing: "0.01em" }}
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
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center" style={{ gap: "2rem" }}>
            {NAV_LINK_KEYS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-[rgba(255,255,255,0.45)] hover:text-white transition-colors after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-pink-500 hover:after:w-full after:transition-all after:duration-[400ms]"
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                }}
              >
                {t(link.key)}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center" style={{ gap: "1rem" }}>
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "pl" ? "en" : "pl")}
              className="flex items-center transition-colors border border-[rgba(255,255,255,0.06)] hover:border-[rgba(236,72,153,0.35)]"
              style={{
                gap: "0.3rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                padding: "0.35rem 0.7rem",
                borderRadius: "8px",
              }}
              aria-label="Switch language"
            >
              <span style={{ color: lang === "pl" ? "#f472b6" : "rgba(255,255,255,0.3)" }}>PL</span>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
              <span style={{ color: lang === "en" ? "#f472b6" : "rgba(255,255,255,0.3)" }}>EN</span>
            </button>


            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col justify-center"
              style={{ gap: "5px", padding: "8px" }}
              aria-label="Menu"
            >
              <span
                className="block rounded-sm transition-all duration-[400ms]"
                style={{
                  width: "22px",
                  height: "1.5px",
                  background: "#f472b6",
                  transform: mobileOpen ? "translateY(6.5px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block rounded-sm transition-all duration-200"
                style={{
                  width: "22px",
                  height: "1.5px",
                  background: "#f472b6",
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                className="block rounded-sm transition-all duration-[400ms]"
                style={{
                  width: "22px",
                  height: "1.5px",
                  background: "#f472b6",
                  transform: mobileOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center transition-all duration-[400ms]"
        style={{
          background: "rgba(0, 0, 0, 0.95)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          opacity: mobileOpen ? 1 : 0,
          visibility: mobileOpen ? "visible" : "hidden",
          gap: 0,
        }}
      >
        {NAV_LINK_KEYS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="transition-colors text-[rgba(255,255,255,0.45)] hover:text-pink-400"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.15rem",
              fontWeight: 500,
              letterSpacing: "0.04em",
              padding: "1rem 0",
              width: "80%",
              textAlign: "center",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            {t(link.key)}
          </a>
        ))}
        <a
          href="/#kontakt"
          onClick={() => setMobileOpen(false)}
          className="text-white"
          style={{
            marginTop: "1.5rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            fontWeight: 600,
            padding: "0.8rem 2.5rem",
            borderRadius: "100px",
            background: "linear-gradient(135deg, #db2777, #ec4899)",
          }}
        >
          <T k="nav.cta" />
        </a>
      </div>
    </>
  );
}
