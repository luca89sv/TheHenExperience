"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 73;
const BATCH_SIZE = 15;
const FRAME_WIDTH = 1176;
const FRAME_HEIGHT = 724;
const SKIP_FRAMES = 14;
const USABLE_FRAMES = TOTAL_FRAMES - SKIP_FRAMES;

function getFramePath(index: number): string {
  const num = String(index + 1).padStart(4, "0");
  return `/frames-beam/frame-${num}.webp`;
}

export default function TransitionBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const drawnFrameRef = useRef(-1);
  const progressRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = FRAME_WIDTH;
    canvas.height = FRAME_HEIGHT;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT);

    let cancelled = false;

    async function loadAllFrames() {
      const frames: HTMLImageElement[] = new Array(TOTAL_FRAMES);

      for (let i = 0; i < TOTAL_FRAMES; i += BATCH_SIZE) {
        if (cancelled) return;
        const batch: Promise<void>[] = [];
        for (let j = i; j < Math.min(i + BATCH_SIZE, TOTAL_FRAMES); j++) {
          const idx = j;
          batch.push(
            new Promise<void>((resolve) => {
              const img = new Image();
              img.src = getFramePath(idx);
              img.onload = () => {
                frames[idx] = img;
                resolve();
              };
              img.onerror = () => resolve();
            })
          );
        }
        await Promise.all(batch);
      }

      if (!cancelled) {
        framesRef.current = frames;
        setLoaded(true);
      }
    }

    loadAllFrames();

    function onScroll() {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scrollDistance = rect.height - window.innerHeight;
      if (scrollDistance <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
      progressRef.current = progress;

      const frameIndex = SKIP_FRAMES + Math.min(
        Math.floor(progress * USABLE_FRAMES),
        USABLE_FRAMES - 1
      );
      currentFrameRef.current = frameIndex;
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    let rafId: number;

    function tick() {
      const current = currentFrameRef.current;
      const progress = progressRef.current;

      // Canvas visibility: hidden at 0 progress, fade in from 3-10%
      if (canvas) {
        const fadeStart = 0.03;
        const fadeEnd = 0.10;
        const canvasOpacity = progress <= fadeStart
          ? 0
          : progress >= fadeEnd
            ? 1
            : (progress - fadeStart) / (fadeEnd - fadeStart);
        canvas.style.opacity = String(canvasOpacity);
      }

      if (current !== drawnFrameRef.current && framesRef.current[current] && ctx) {
        ctx.drawImage(framesRef.current[current], 0, 0, FRAME_WIDTH, FRAME_HEIGHT);
        drawnFrameRef.current = current;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div ref={containerRef} style={{ height: "130vh", marginTop: "-50vh", position: "relative", zIndex: 1 }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#000",
        }}
      >
        {/* Black-to-transparent gradient at top to blend seamlessly with hero */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "25%",
            background: "linear-gradient(to bottom, #000000 0%, transparent 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Canvas — anchored to bottom, hidden until scroll starts */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "140%",
            height: "80%",
            mixBlendMode: "screen",
            opacity: 0,
          }}
        />

        {/* Bottom gradient — eliminates hard border with packages section */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30%",
            background: "linear-gradient(to top, #000000 15%, transparent 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

      </div>
    </div>
  );
}
