"use client";

import { useEffect, useRef } from "react";

export default function PageLoader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fade out after React hydrates and language is settled
    requestAnimationFrame(() => {
      el.classList.add("fade-out");
    });
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
