"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReset() {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Force full page reload when navigating BACK to homepage.
    // Next.js caches the page component and freezes it completely —
    // no re-render, no useEffect, no event handlers. Only a reload fixes it.
    if (pathname === "/" && prevPathRef.current !== "/") {
      window.location.reload();
      return;
    }
    prevPathRef.current = pathname;

    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
