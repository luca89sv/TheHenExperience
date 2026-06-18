"use client";

import { usePathname } from "next/navigation";
import PageLoader from "./PageLoader";

// The loader only belongs on the home page (it waits for the hero's first frame
// via `hero:ready`). Rendering it at the body level — instead of inside <main> —
// keeps it in the same stacking context as the navbar, so its z-index actually
// covers the navbar while loading.
export default function PageLoaderGate() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <PageLoader />;
}
