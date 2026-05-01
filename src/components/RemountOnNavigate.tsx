"use client";

import { useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Forces children to fully unmount/remount on every navigation.
 * This ensures GSAP animations and canvas reinitialize properly.
 */
export default function RemountOnNavigate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((k) => k + 1);
  }, [pathname]);

  return <div key={key}>{children}</div>;
}
