"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

/**
 * Renders <Header /> on every route except /studio (the embedded Sanity Studio
 * uses its own chrome). Reads the route from `usePathname()` so the call is
 * cheap, SSR-safe, and never causes a header flash on the first paint.
 */
export default function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;
  return <Header />;
}
