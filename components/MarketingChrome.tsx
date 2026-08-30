"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Marketing header/footer/dock hide inside the app surfaces. */
const APP_PREFIXES = ["/portal", "/login", "/admin", "/onboarding"];

export default function MarketingChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (APP_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  return <>{children}</>;
}
