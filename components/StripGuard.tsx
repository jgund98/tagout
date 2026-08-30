"use client";

import { useEffect } from "react";

/**
 * Axis lock for horizontal swipe strips. Browsers happily let a slightly
 * diagonal page-scroll gesture also drag a nested horizontal scroller a few
 * pixels, which reads as the strip "wiggling" while you scroll the page.
 * This watches every touch gesture: the moment it reads as vertical, the
 * strip under the finger has its horizontal scrolling frozen until the
 * finger lifts. Genuinely horizontal swipes are untouched.
 */
export default function StripGuard() {
  useEffect(() => {
    let strip: HTMLElement | null = null;
    let x0 = 0;
    let y0 = 0;
    let decided = false;

    const onStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      strip =
        (target?.closest?.('[class*="overflow-x-auto"]') as HTMLElement | null) ??
        null;
      if (!strip) return;
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      decided = false;
    };

    const onMove = (e: TouchEvent) => {
      if (!strip || decided) return;
      const dx = Math.abs(e.touches[0].clientX - x0);
      const dy = Math.abs(e.touches[0].clientY - y0);
      if (dx < 6 && dy < 6) return; // not enough travel to call it yet
      decided = true;
      if (dy > dx) strip.style.overflowX = "hidden"; // vertical intent: freeze the strip
    };

    const onEnd = () => {
      if (strip) strip.style.overflowX = "";
      strip = null;
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    document.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  return null;
}
