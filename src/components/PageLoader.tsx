"use client";

import { useEffect, useRef } from "react";

export default function PageLoader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let done = false;
    const hide = () => {
      if (done) return;
      done = true;
      el.classList.add("fade-out");
    };

    // Keep the loader up until the hero has painted its first frame...
    window.addEventListener("hero:ready", hide, { once: true });
    // ...or if the hero already signalled before this listener attached...
    if ((window as Window & { __heroReady?: boolean }).__heroReady) hide();
    // ...with a safety net so it never gets stuck (slow network, frame errors).
    const fallback = window.setTimeout(hide, 6000);

    return () => {
      window.removeEventListener("hero:ready", hide);
      clearTimeout(fallback);
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
