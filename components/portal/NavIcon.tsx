/**
 * One consistent line-icon set for the portal chrome (18px grid, 1.8 stroke).
 * Replaces the emoji nav: same warmth, none of the prototype feel.
 */
export function NavIcon({ name, size = 18 }: { name: string; size?: number }) {
  const p: Record<string, React.ReactNode> = {
    home: (
      <>
        <path d="M3 8.5 9 3l6 5.5V15a1 1 0 0 1-1 1h-3.2v-4.2H7.2V16H4a1 1 0 0 1-1-1V8.5Z" />
      </>
    ),
    spark: (
      <>
        <path d="M9 2.5c.5 3.4 1.6 4.5 5 5-3.4.5-4.5 1.6-5 5-.5-3.4-1.6-4.5-5-5 3.4-.5 4.5-1.6 5-5Z" />
        <path d="M14.5 12.5c.25 1.7.8 2.25 2.5 2.5-1.7.25-2.25.8-2.5 2.5-.25-1.7-.8-2.25-2.5-2.5 1.7-.25 2.25-.8 2.5-2.5Z" />
      </>
    ),
    chat: (
      <>
        <path d="M15.5 8.6c0 3-2.9 5.4-6.5 5.4-.8 0-1.6-.1-2.3-.3L3 15l1-2.6c-.9-1-1.5-2.3-1.5-3.8 0-3 2.9-5.4 6.5-5.4s6.5 2.4 6.5 5.4Z" />
      </>
    ),
    calendar: (
      <>
        <rect x="2.8" y="4" width="12.4" height="11.2" rx="2" />
        <path d="M2.8 7.6h12.4M6.2 2.4V5M11.8 2.4V5" />
      </>
    ),
    people: (
      <>
        <circle cx="6.7" cy="6.4" r="2.6" />
        <path d="M2.4 15.2c.5-2.5 2.2-3.9 4.3-3.9s3.8 1.4 4.3 3.9" />
        <path d="M11.6 4.3a2.6 2.6 0 0 1 0 4.2M13.1 11.6c1.4.5 2.3 1.7 2.6 3.4" />
      </>
    ),
    clock: (
      <>
        <circle cx="9" cy="9" r="6.4" />
        <path d="M9 5.6V9l2.4 1.6" />
      </>
    ),
    inbox: (
      <>
        <path d="M3 10.2 4.6 4.4A1 1 0 0 1 5.6 3.6h6.8a1 1 0 0 1 1 .8L15 10.2v3.2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3.2Z" />
        <path d="M3 10.4h3.4c.3 1.2 1.3 2 2.6 2s2.3-.8 2.6-2H15" />
      </>
    ),
    floor: (
      <>
        <circle cx="6" cy="6" r="2.8" />
        <rect x="10.6" y="3.2" width="5" height="5" rx="1.2" />
        <rect x="3.2" y="10.6" width="5" height="5" rx="1.2" />
        <circle cx="13.1" cy="13.1" r="2.8" />
      </>
    ),
    shield: (
      <>
        <path d="M9 2.4 14.6 4.6v4.2c0 3.4-2.3 5.8-5.6 6.8-3.3-1-5.6-3.4-5.6-6.8V4.6L9 2.4Z" />
        <path d="m6.6 8.8 1.7 1.7 3.1-3.3" />
      </>
    ),
    gear: (
      <>
        <circle cx="9" cy="9" r="2.4" />
        <path d="M9 2.6v2M9 13.4v2M2.6 9h2M13.4 9h2M4.5 4.5l1.4 1.4M12.1 12.1l1.4 1.4M13.5 4.5l-1.4 1.4M5.9 12.1l-1.4 1.4" />
      </>
    ),
    logout: (
      <>
        <path d="M7.4 3H4.6A1.6 1.6 0 0 0 3 4.6v8.8A1.6 1.6 0 0 0 4.6 15h2.8" />
        <path d="M11 5.8 14.2 9 11 12.2M14 9H7" />
      </>
    ),
    more: (
      <>
        <circle cx="4" cy="9" r="1.15" fill="currentColor" stroke="none" />
        <circle cx="9" cy="9" r="1.15" fill="currentColor" stroke="none" />
        <circle cx="14" cy="9" r="1.15" fill="currentColor" stroke="none" />
      </>
    ),
    swap: (
      <>
        <path d="M5.4 7H14l-2.6-2.6M12.6 11H4l2.6 2.6" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {p[name]}
    </svg>
  );
}
