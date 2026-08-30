"use client";

import { useEffect } from "react";

/**
 * Horizontal strips vs. vertical page scrolling, v3.
 *
 * The `touch-action: pan-y` that makes vertical pans un-hijackable lives in
 * globals.css now, so it applies at first paint with no hydration gap.
 * This component only supplies the horizontal gesture: 1:1 drag with CSS
 * snap suspended (so the browser can't fight the drag), then one native
 * smooth scroll to the card the throw was headed for. No frame loops.
 */
export default function StripGuard() {
  useEffect(() => {
    let strip: HTMLElement | null = null;
    let snapWas = "";
    let x0 = 0, y0 = 0, sl0 = 0;
    let lastX = 0, lastT = 0, vx = 0; // px per ms, negative = swiping left
    let axis: "x" | "y" | null = null;

    const settle = (el: HTMLElement) => {
      // project the throw ~180ms out, then land on the nearest card edge
      const projected = el.scrollLeft - vx * 180;
      const kids = Array.from(el.children) as HTMLElement[];
      let target = projected;
      if (kids.length) {
        let bestDist = Infinity;
        for (const k of kids) {
          const d = Math.abs(k.offsetLeft - projected);
          if (d < bestDist) { bestDist = d; target = k.offsetLeft; }
        }
      }
      const max = el.scrollWidth - el.clientWidth;
      el.scrollTo({ left: Math.max(0, Math.min(target, max)), behavior: "smooth" });
      // give the smooth scroll time to finish before snap comes back
      const restoreTo = el;
      const was = snapWas;
      setTimeout(() => { restoreTo.style.scrollSnapType = was; }, 450);
    };

    const onMove = (e: TouchEvent) => {
      if (!strip) return;
      const t = e.touches[0];
      if (axis === null) {
        const dx = Math.abs(t.clientX - x0);
        const dy = Math.abs(t.clientY - y0);
        if (dx < 6 && dy < 6) return;
        axis = dx > dy ? "x" : "y";
        if (axis === "x") {
          snapWas = strip.style.scrollSnapType;
          strip.style.scrollSnapType = "none"; // snap can't fight the drag
        }
      }
      if (axis === "x") {
        if (e.cancelable) e.preventDefault();
        strip.scrollLeft = sl0 - (t.clientX - x0);
        const now = performance.now();
        const dt = now - lastT;
        if (dt > 0) vx = 0.8 * vx + 0.2 * ((t.clientX - lastX) / dt);
        lastX = t.clientX;
        lastT = now;
      }
    };

    const onEnd = () => {
      if (strip && axis === "x") settle(strip);
      else if (strip) strip.style.scrollSnapType = snapWas;
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
      strip = null;
      axis = null;
    };

    const onStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      const hit = target?.closest?.('[class*="overflow-x-auto"]') as HTMLElement | null;
      if (!hit || hit.scrollWidth <= hit.clientWidth + 4) return;
      strip = hit;
      axis = null;
      snapWas = hit.style.scrollSnapType;
      x0 = lastX = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      sl0 = hit.scrollLeft;
      lastT = performance.now();
      vx = 0;
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd, { passive: true });
      document.addEventListener("touchcancel", onEnd, { passive: true });
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  return null;
}
