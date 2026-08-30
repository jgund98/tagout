"use client";

import { useEffect } from "react";

/**
 * Horizontal strips vs. vertical page scrolling, settled for good.
 *
 * iOS Safari decides a gesture's scroll axis at touch-start, so flipping
 * overflow mid-gesture can't stop a diagonal page-scroll from briefly
 * dragging a carousel. The only reliable fix: strips get
 * `touch-action: pan-y`, which means the browser NEVER horizontally
 * scrolls them natively on touch — vertical pans always belong to the
 * page. Horizontal swipes are re-implemented here by hand: direct drag,
 * momentum on release, then a settle onto the nearest card.
 */
export default function StripGuard() {
  useEffect(() => {
    const isStrip = (el: Element): el is HTMLElement =>
      el instanceof HTMLElement && el.className.includes?.("overflow-x-auto");

    const arm = (root: ParentNode) => {
      root.querySelectorAll('[class*="overflow-x-auto"]').forEach((el) => {
        if (el instanceof HTMLElement) el.style.touchAction = "pan-y";
      });
    };
    arm(document);
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) {
            if (isStrip(n)) n.style.touchAction = "pan-y";
            arm(n);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    let strip: HTMLElement | null = null;
    let x0 = 0, y0 = 0, sl0 = 0;
    let lastX = 0, lastT = 0, vx = 0;
    let axis: "x" | "y" | null = null;
    let raf = 0;

    const settle = (el: HTMLElement) => {
      // glide to a stop, then ease onto the nearest card edge
      const glide = () => {
        if (Math.abs(vx) > 0.08) {
          el.scrollLeft -= vx * 16;
          vx *= 0.94;
          raf = requestAnimationFrame(glide);
          return;
        }
        const kids = Array.from(el.children) as HTMLElement[];
        if (kids.length) {
          let best = 0, bestDist = Infinity;
          for (const k of kids) {
            const d = Math.abs(k.offsetLeft - el.scrollLeft);
            if (d < bestDist) { bestDist = d; best = k.offsetLeft; }
          }
          const max = el.scrollWidth - el.clientWidth;
          el.scrollTo({ left: Math.min(best, max), behavior: "smooth" });
        }
      };
      raf = requestAnimationFrame(glide);
    };

    const onMove = (e: TouchEvent) => {
      if (!strip) return;
      const t = e.touches[0];
      if (axis === null) {
        const dx = Math.abs(t.clientX - x0);
        const dy = Math.abs(t.clientY - y0);
        if (dx < 7 && dy < 7) return;
        axis = dx > dy ? "x" : "y";
      }
      if (axis === "x") {
        if (e.cancelable) e.preventDefault();
        strip.scrollLeft = sl0 - (t.clientX - x0);
        const now = performance.now();
        if (now - lastT > 0) vx = ((t.clientX - lastX) / (now - lastT)) * 16;
        lastX = t.clientX;
        lastT = now;
      }
    };

    const onEnd = () => {
      if (strip && axis === "x") settle(strip);
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
      cancelAnimationFrame(raf);
      strip = hit;
      axis = null;
      x0 = lastX = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      sl0 = hit.scrollLeft;
      lastT = performance.now();
      vx = 0;
      // non-passive only while a strip gesture is possible
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd, { passive: true });
      document.addEventListener("touchcancel", onEnd, { passive: true });
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  return null;
}
