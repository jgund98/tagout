import Link from "next/link";
import { site } from "@/lib/site";

/** The Tagout bubble — an SMS bubble with a check. Used as favicon, logo mark, avatar. */
export function BubbleMark({ size = 30, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M24 4C12.4 4 3 12.3 3 22.6c0 5.9 3.1 11.2 8 14.6-.3 2.5-1.3 4.7-3.1 6.5-.5.5-.1 1.4.6 1.3 3.9-.4 7.3-1.8 9.9-3.7 1.8.4 3.7.7 5.6.7 11.6 0 21-8.3 21-18.7S35.6 4 24 4Z"
        fill="currentColor"
      />
      <path
        d="m15.5 23.5 5.5 5.5L33 17.5"
        stroke="#fff"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Wordmark({
  className = "",
  markClass = "text-green",
  textClass = "text-ink",
  size = 30,
}: {
  className?: string;
  markClass?: string;
  textClass?: string;
  size?: number;
}) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 select-none ${className}`}
      aria-label={`${site.name} home`}
    >
      <BubbleMark size={size} className={markClass} />
      <span
        className={`font-display font-extrabold tracking-[-0.045em] leading-none ${textClass}`}
        style={{ fontSize: size * 0.98 }}
      >
        {site.wordmark}
      </span>
    </Link>
  );
}
