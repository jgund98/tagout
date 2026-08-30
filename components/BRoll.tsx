"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lazy, self-managing b-roll: loads only near the viewport, plays only while
 * visible, always muted and looping. If the device blocks autoplay (e.g. iOS
 * Low Power Mode), a play badge appears and a tap starts it.
 */
export default function BRoll({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.src) el.src = src; // defer the download until it matters
          el.play()
            .then(() => setBlocked(false))
            .catch(() => setBlocked(true));
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  const tapPlay = () => {
    const el = ref.current;
    if (!el) return;
    if (!el.src) el.src = src;
    el.play()
      .then(() => setBlocked(false))
      .catch(() => {});
  };

  return (
    <div className="relative h-full w-full" onClick={blocked ? tapPlay : undefined}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        aria-hidden="true"
        className={className}
      />
      {blocked && (
        <button
          aria-label="Play video"
          onClick={tapPlay}
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-paper backdrop-blur-sm"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M4 2.5v11l9-5.5-9-5.5Z" />
          </svg>
        </button>
      )}
    </div>
  );
}
