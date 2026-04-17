"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

/* ── Mobile hero: video + timed phase overlays ── */
function MobileVideoHero({ PHASES, PHASE_POSITIONS, t }: {
  PHASES: { id: string; start: number; end: number; label: string; title: string; desc: string }[];
  PHASE_POSITIONS: Record<string, React.CSSProperties>[];
  t: (key: string) => string;
}) {
  const [activePhase, setActivePhase] = useState(-1);
  const [heroCTAVisible, setHeroCTAVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const breakpoint = typeof window !== "undefined" && window.innerWidth <= 480 ? "mobile" : "tablet";

  useEffect(() => {
    // Cycle phases: show CTA for 2s, then each phase for 3s, then loop
    const PHASE_DURATION = 3000;
    const CTA_DURATION = 2500;
    let timer: ReturnType<typeof setTimeout>;
    let currentIdx = -1;

    const cycle = () => {
      currentIdx++;
      if (currentIdx > PHASES.length) currentIdx = 0;

      if (currentIdx === 0) {
        // Show CTA, hide phases
        setHeroCTAVisible(true);
        setActivePhase(-1);
        timer = setTimeout(cycle, CTA_DURATION);
      } else {
        // Show phase, hide CTA
        setHeroCTAVisible(false);
        setActivePhase(currentIdx - 1);
        timer = setTimeout(cycle, PHASE_DURATION);
      }
    };

    // Start after a brief delay
    timer = setTimeout(cycle, 1500);
    return () => clearTimeout(timer);
  }, [PHASES.length]);

  return (
    <section className="relative z-10 md:hidden" style={{ height: "100dvh" }}>
      <div className="relative overflow-hidden flex items-center justify-center bg-black" style={{ height: "100dvh" }}>
        {/* Video background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            maskImage: "radial-gradient(ellipse 85% 75% at 50% 48%, black 35%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 48%, black 35%, transparent 72%)",
          }}
        >
          <source src="/bachelorretteParty.mp4" type="video/mp4" />
        </video>

        {/* Phase overlay boxes */}
        {PHASES.map((phase, i) => {
          const pos = PHASE_POSITIONS[i][breakpoint] as React.CSSProperties;
          return (
            <div
              key={phase.id}
              className={`absolute z-[5] transition-all duration-[550ms] pointer-events-none hero-overlay-border ${
                activePhase === i
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{
                ...pos,
                maxWidth: breakpoint === "mobile" ? "170px" : "200px",
                padding: breakpoint === "mobile" ? "0.6rem 0.8rem" : "0.8rem 1rem",
                background: "rgba(8, 8, 12, 0.65)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "20px",
              }}
            >
              <span
                className="block uppercase tracking-[0.2em] text-pink-400"
                style={{
                  fontSize: breakpoint === "mobile" ? "0.5rem" : "0.55rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  marginBottom: breakpoint === "mobile" ? "0.2rem" : "0.3rem",
                }}
              >
                {phase.label}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: breakpoint === "mobile" ? "0.85rem" : "1rem",
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                {phase.title}
              </h2>
            </div>
          );
        })}

        {/* Hero CTA buttons */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-[6] transition-all duration-[800ms] ${
            heroCTAVisible
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          style={{
            bottom: breakpoint === "mobile" ? "7.5rem" : "9rem",
            gap: breakpoint === "mobile" ? "0.4rem" : "0.5rem",
          }}
        >
          <a
            href="/#pakiety"
            className="btn-primary whitespace-nowrap"
            style={{
              padding: breakpoint === "mobile" ? "0.5rem 1.3rem" : "0.55rem 1.5rem",
              fontSize: breakpoint === "mobile" ? "0.75rem" : "0.8rem",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={breakpoint === "mobile" ? 14 : 15} height={breakpoint === "mobile" ? 14 : 15}>
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            {t('hero.cta.packages')}
          </a>
          <a
            href="/#kontakt"
            className="btn-outline whitespace-nowrap"
            style={{
              padding: breakpoint === "mobile" ? "0.5rem 1.3rem" : "0.55rem 1.5rem",
              fontSize: breakpoint === "mobile" ? "0.75rem" : "0.8rem",
              background: "rgba(0, 0, 0, 0.55)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={breakpoint === "mobile" ? 14 : 15} height={breakpoint === "mobile" ? 14 : 15}>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            {t('hero.cta.contact')}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Desktop hero: scroll-driven frame animation (unchanged) ── */
export default function HeroSection() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const drawnFrameRef = useRef(-1);
  const currentFrameRef = useRef(0);
  const targetRotationRef = useRef(0);
  const actualRotationRef = useRef(0);
  const rafRef = useRef<number>(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const PHASES = [
    { id: "phase-1", start: 0.05, end: 0.22, label: t('hero.p1.label'), title: t('hero.p1.title'), desc: t('hero.p1.desc') },
    { id: "phase-2", start: 0.26, end: 0.44, label: t('hero.p2.label'), title: t('hero.p2.title'), desc: t('hero.p2.desc') },
    { id: "phase-3", start: 0.48, end: 0.66, label: t('hero.p3.label'), title: t('hero.p3.title'), desc: t('hero.p3.desc') },
    { id: "phase-4", start: 0.70, end: 0.90, label: t('hero.p4.label'), title: t('hero.p4.title'), desc: t('hero.p4.desc') },
  ];

  /* Exact positions from old-static/css/style.css — 4 breakpoints */
  const PHASE_POSITIONS: Record<string, React.CSSProperties>[] = [
    { desktop: { left: "6%", top: "25%" }, laptop: { left: "4%", top: "20%" }, tablet: { left: "3%", top: "38%" }, mobile: { left: "3%", top: "40%" } },
    { desktop: { right: "6%", top: "35%" }, laptop: { right: "4%", top: "30%" }, tablet: { right: "3%", top: "48%" }, mobile: { right: "3%", top: "50%" } },
    { desktop: { left: "6%", bottom: "22%" }, laptop: { left: "4%", bottom: "20%" }, tablet: { left: "3%", bottom: "30%" }, mobile: { left: "3%", bottom: "32%" } },
    { desktop: { right: "6%", bottom: "18%" }, laptop: { right: "4%", bottom: "15%" }, tablet: { right: "3%", bottom: "25%" }, mobile: { right: "3%", bottom: "26%" } },
  ];

  const [activePhases, setActivePhases] = useState<boolean[]>([false, false, false, false]);
  const [heroCTAVisible, setHeroCTAVisible] = useState(true);
  const [scrollHintVisible, setScrollHintVisible] = useState(true);
  const [breakpoint, setBreakpoint] = useState<"desktop" | "laptop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const getConfig = useCallback((mobile: boolean) => ({
    totalFrames: mobile ? 61 : 121,
    batchSize: 15,
    framePath: (i: number) =>
      mobile
        ? `/frames-mobile/frame-${String(i).padStart(4, "0")}.webp`
        : `/frames/frame-${String(i).padStart(4, "0")}.webp`,
    frameWidth: mobile ? 862 : 1724,
    frameHeight: mobile ? 600 : 1200,
  }), []);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mobile = vw <= 768;
    const config = getConfig(mobile);

    const frameAspect = config.frameWidth / config.frameHeight;
    const viewAspect = vw / vh;

    let displayW: number, displayH: number;
    if (frameAspect > viewAspect) {
      displayW = vw;
      displayH = vw / frameAspect;
    } else {
      displayH = vh;
      displayW = vh * frameAspect;
    }

    canvas.style.width = displayW + "px";
    canvas.style.height = displayH + "px";
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    ctx.scale(dpr, dpr);

    const frame = framesRef.current[currentFrameRef.current];
    if (frame) {
      ctx.drawImage(frame, 0, 0, displayW, displayH);
      drawnFrameRef.current = currentFrameRef.current;
    }
  }, [getConfig]);

  useEffect(() => {
    const vw = window.innerWidth;
    const mobile = vw <= 480;
    const tablet = vw <= 768 && !mobile;
    const laptop = vw <= 1024 && !tablet && !mobile;
    setBreakpoint(mobile ? "mobile" : tablet ? "tablet" : laptop ? "laptop" : "desktop");

    const isMobileFrames = vw <= 768;
    const config = getConfig(isMobileFrames);

    framesRef.current = new Array(config.totalFrames).fill(null);

    const loadFrame = (index: number): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          framesRef.current[index] = img;
          resolve(img);
        };
        img.onerror = () => resolve(null);
        img.src = config.framePath(index + 1);
      });
    };

    const preloadAllFrames = async () => {
      for (let i = 0; i < config.totalFrames; i += config.batchSize) {
        const batch: Promise<HTMLImageElement | null>[] = [];
        for (let j = i; j < Math.min(i + config.batchSize, config.totalFrames); j++) {
          batch.push(loadFrame(j));
        }
        await Promise.all(batch);
      }
    };

    const getScrollProgress = () => {
      const section = sectionRef.current;
      if (!section) return 0;
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.max(0, Math.min(1, -rect.top / scrollable));
    };

    const onScroll = () => {
      const progress = getScrollProgress();
      currentFrameRef.current = Math.max(
        0,
        Math.min(
          Math.floor(progress * config.totalFrames),
          config.totalFrames - 1
        )
      );
      targetRotationRef.current = -2 + progress * 6;

      setActivePhases(
        PHASES.map((p) => progress >= p.start && progress <= p.end)
      );
      setHeroCTAVisible(progress < 0.05);
      setScrollHintVisible(progress < 0.03);

      // Update progress bar directly (no re-render)
      if (progressBarRef.current) {
        progressBarRef.current.style.width = (progress * 100) + "%";
      }
    };

    const tick = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const frameIdx = currentFrameRef.current;
      if (frameIdx !== drawnFrameRef.current && framesRef.current[frameIdx]) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(framesRef.current[frameIdx]!, 0, 0, w, h);
        drawnFrameRef.current = frameIdx;
      }

      actualRotationRef.current +=
        (targetRotationRef.current - actualRotationRef.current) * 0.08;
      canvas.style.transform = `translate(-50%, -50%) rotate(${actualRotationRef.current.toFixed(3)}deg)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    const init = async () => {
      setupCanvas();
      await preloadAllFrames();

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx && framesRef.current[0]) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        ctx.drawImage(framesRef.current[0]!, 0, 0, w, h);
        drawnFrameRef.current = 0;
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      tick();
    };

    init();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const vw = window.innerWidth;
        const mobile = vw <= 480;
        const tablet = vw <= 768 && !mobile;
        const laptop = vw <= 1024 && !tablet && !mobile;
        setBreakpoint(mobile ? "mobile" : tablet ? "tablet" : laptop ? "laptop" : "desktop");
        setupCanvas();
        drawnFrameRef.current = -1;
      }, 200);
    };
    window.addEventListener("resize", onResize);

    // Do NOT clean up RAF or listeners. Next.js caches components on navigation
    // and restores them without re-running effects. If we kill the animation
    // here, it never restarts. Keeping it alive is harmless — tick() checks
    // if canvas exists before drawing.
    return () => {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const scrollHeight = breakpoint === "mobile" ? "150vh" : breakpoint === "tablet" ? "220vh" : "400vh";

  if (isMobile) {
    return <MobileVideoHero PHASES={PHASES} PHASE_POSITIONS={PHASE_POSITIONS} t={t} />;
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative z-10"
      style={{ height: scrollHeight }}
    >
      <div
        className="sticky top-0 overflow-hidden flex items-center justify-center bg-black"
        style={{ height: "100dvh" }}
      >
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute top-1/2 left-1/2 will-change-transform"
          style={{
            maxWidth: "100vw",
            maxHeight: "100vh",
            maskImage: "radial-gradient(ellipse 70% 65% at 50% 48%, black 35%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 48%, black 35%, transparent 72%)",
          }}
        />

        {/* Scroll progress bar */}
        <div
          ref={progressBarRef}
          className="absolute top-0 left-0 h-[2px] z-10"
          style={{
            width: "0%",
            background: "linear-gradient(90deg, #db2777, #f472b6)",
            transition: "width 0.05s linear",
          }}
        />

        {/* Phase overlay boxes */}
        {PHASES.map((phase, i) => {
          const pos = PHASE_POSITIONS[i][breakpoint] as React.CSSProperties;
          const isDesktop = breakpoint === "desktop" || breakpoint === "laptop";
          const showDesc = breakpoint === "desktop" || breakpoint === "laptop";

          return (
            <div
              key={phase.id}
              className={`absolute z-[5] transition-all duration-[550ms] pointer-events-none hero-overlay-border ${
                activePhases[i]
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-6"
              }`}
              style={{
                ...pos,
                maxWidth: breakpoint === "desktop" ? "380px" : breakpoint === "laptop" ? "320px" : breakpoint === "tablet" ? "200px" : "170px",
                padding: breakpoint === "desktop" ? "1.8rem 2.2rem" : breakpoint === "laptop" ? "1.5rem 1.8rem" : breakpoint === "tablet" ? "0.8rem 1rem" : "0.6rem 0.8rem",
                background: "rgba(8, 8, 12, 0.65)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "20px",
              }}
            >
              <span
                className="block uppercase tracking-[0.2em] text-pink-400"
                style={{
                  fontSize: isDesktop ? "0.65rem" : breakpoint === "tablet" ? "0.55rem" : "0.5rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  marginBottom: isDesktop ? "0.6rem" : breakpoint === "tablet" ? "0.3rem" : "0.2rem",
                }}
              >
                {phase.label}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: isDesktop
                    ? "clamp(1.3rem, 2.5vw, 1.7rem)"
                    : breakpoint === "tablet"
                    ? "1rem"
                    : "0.85rem",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  marginBottom: showDesc ? "0.6rem" : 0,
                }}
              >
                {phase.title}
              </h2>
              {showDesc && (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(249, 168, 212, 0.85)",
                    lineHeight: 1.55,
                  }}
                >
                  {phase.desc}
                </p>
              )}
            </div>
          );
        })}

        {/* Hero CTA buttons */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 flex z-[6] transition-all duration-[800ms] ${
            breakpoint === "tablet" || breakpoint === "mobile" ? "flex-col items-center" : ""
          } ${
            heroCTAVisible
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          style={{
            bottom: breakpoint === "mobile" ? "7.5rem" : breakpoint === "tablet" ? "9rem" : "9rem",
            gap: breakpoint === "mobile" ? "0.4rem" : breakpoint === "tablet" ? "0.5rem" : "1rem",
          }}
        >
          <a
            href="/#pakiety"
            className="btn-primary whitespace-nowrap"
            style={{
              padding: breakpoint === "mobile" ? "0.5rem 1.3rem" : breakpoint === "tablet" ? "0.55rem 1.5rem" : "0.75rem 1.8rem",
              fontSize: breakpoint === "mobile" ? "0.75rem" : breakpoint === "tablet" ? "0.8rem" : "0.88rem",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={breakpoint === "mobile" ? 14 : breakpoint === "tablet" ? 15 : 18} height={breakpoint === "mobile" ? 14 : breakpoint === "tablet" ? 15 : 18}>
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            {t('hero.cta.packages')}
          </a>
          <a
            href="/#kontakt"
            className="btn-outline whitespace-nowrap"
            style={{
              padding: breakpoint === "mobile" ? "0.5rem 1.3rem" : breakpoint === "tablet" ? "0.55rem 1.5rem" : "0.75rem 1.8rem",
              fontSize: breakpoint === "mobile" ? "0.75rem" : breakpoint === "tablet" ? "0.8rem" : "0.88rem",
              background: "rgba(0, 0, 0, 0.55)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={breakpoint === "mobile" ? 14 : breakpoint === "tablet" ? 15 : 18} height={breakpoint === "mobile" ? 14 : breakpoint === "tablet" ? 15 : 18}>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            {t('hero.cta.contact')}
          </a>
        </div>

        {/* Scroll hint */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-[5] transition-opacity duration-600 ${
            scrollHintVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ bottom: "2.5rem", gap: "0.8rem" }}
        >
          <div
            className="flex justify-center"
            style={{
              width: "24px",
              height: "38px",
              border: "2px solid rgba(255, 255, 255, 0.35)",
              borderRadius: "12px",
              paddingTop: "6px",
            }}
          >
            <div className="scroll-hint-wheel" />
          </div>
          <span
            className="uppercase"
            style={{
              color: "rgba(255, 255, 255, 0.55)",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.18em",
            }}
          >
            {t('hero.scroll')}
          </span>
        </div>
      </div>
    </section>
  );
}
