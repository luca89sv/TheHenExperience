"use client";

import { useEffect, useRef } from "react";

export default function PageLoader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const MIN_VISIBLE = 700; // bar always plays one clean pass — fast, but no flicker
    const MAX_WAIT = 6000;   // safety net: never stay stuck (slow net, frame errors)
    const start = performance.now();

    let done = false;
    const fade = () => {
      if (done) return;
      done = true;
      el.classList.add("fade-out");
    };

    // Fade once the hero has painted AND the bar has been visible long enough,
    // so it neither flashes away instantly nor reveals a black hero.
    let pending: ReturnType<typeof setTimeout> | undefined;
    const requestFade = () => {
      if (done || pending) return;
      pending = setTimeout(fade, Math.max(0, MIN_VISIBLE - (performance.now() - start)));
    };

    window.addEventListener("hero:ready", requestFade, { once: true });
    if ((window as Window & { __heroReady?: boolean }).__heroReady) requestFade();
    const fallback = window.setTimeout(fade, MAX_WAIT);

    return () => {
      window.removeEventListener("hero:ready", requestFade);
      clearTimeout(fallback);
      if (pending) clearTimeout(pending);
    };
  }, []);

  return (
    <div ref={ref} id="page-loader">
      <div className="loader-title">
        The Hen <em>Experience</em>
      </div>
      <div className="loader-bar">
        <div className="loader-bar-inner" />
      </div>
    </div>
  );
}
