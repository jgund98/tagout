"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Staff } from "@/lib/portal/data";

/* ---------- avatar: photo when they have one, warm initials while onboarding ---------- */

export function Avatar({
  person,
  size = 40,
  ring = false,
  className = "",
}: {
  person: Pick<Staff, "name" | "photo" | "color"> | null;
  size?: number;
  ring?: boolean;
  className?: string;
}) {
  const s = { width: size, height: size };
  if (!person) {
    return (
      <div
        style={s}
        className={`flex shrink-0 items-center justify-center rounded-full bg-green text-white ${className}`}
      >
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 48 48" fill="currentColor" aria-hidden>
          <path d="M24 4C12.4 4 3 12.3 3 22.6c0 5.9 3.1 11.2 8 14.6-.3 2.5-1.3 4.7-3.1 6.5-.5.5-.1 1.4.6 1.3 3.9-.4 7.3-1.8 9.9-3.7 1.8.4 3.7.7 5.6.7 11.6 0 21-8.3 21-18.7S35.6 4 24 4Z" />
        </svg>
      </div>
    );
  }
  const initials = person.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return person.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={person.photo}
      alt={person.name}
      style={s}
      className={`shrink-0 rounded-full object-cover ${ring ? "ring-2 ring-white shadow-pop" : ""} ${className}`}
    />
  ) : (
    <div
      style={{ ...s, background: person.color }}
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-extrabold text-white ${ring ? "ring-2 ring-white shadow-pop" : ""} ${className}`}
    >
      <span style={{ fontSize: size * 0.38 }}>{initials}</span>
    </div>
  );
}

export function AvatarStack({ people, size = 30 }: { people: (Pick<Staff, "name" | "photo" | "color"> | null)[]; size?: number }) {
  return (
    <div className="flex">
      {people.slice(0, 5).map((p, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -size * 0.3 }}>
          <Avatar person={p} size={size} ring />
        </div>
      ))}
      {people.length > 5 && (
        <div
          style={{ width: size, height: size, marginLeft: -size * 0.3 }}
          className="z-10 flex items-center justify-center rounded-full bg-ink text-[11px] font-extrabold text-paper ring-2 ring-white"
        >
          +{people.length - 5}
        </div>
      )}
    </div>
  );
}

/* ---------- the tag chip: same clipped-corner bubble as the site ---------- */

export function Chip({
  children,
  tone = "mint",
  className = "",
}: {
  children: ReactNode;
  tone?: "mint" | "lav" | "butter" | "blush" | "ink" | "white";
  className?: string;
}) {
  const tones: Record<string, string> = {
    mint: "bg-mint text-green-dark",
    lav: "bg-lav text-violet-mid",
    butter: "bg-butter text-[#9a6a00]",
    blush: "bg-blush text-coral",
    ink: "bg-ink text-paper",
    white: "bg-white text-ink shadow-[0_1px_3px_rgb(15_21_18/0.08)]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg rounded-bl-[4px] px-2.5 py-1 text-[12px] font-extrabold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function LiveDot({ className = "" }: { className?: string }) {
  return <span className={`inline-block h-2 w-2 rounded-full bg-green tg-pulse ${className}`} />;
}

/* ---------- stat tile ---------- */

export function StatTile({
  label,
  value,
  sub,
  tone = "white",
  live = false,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  tone?: "white" | "mint" | "lav" | "butter";
  live?: boolean;
}) {
  const tones: Record<string, string> = {
    white: "bg-white",
    mint: "bg-mint/70",
    lav: "bg-lav/60",
    butter: "bg-butter/50",
  };
  return (
    <div className={`rounded-3xl p-4 shadow-pop sm:p-5 ${tones[tone]}`}>
      <p className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-extrabold uppercase tracking-wide text-ink/45 sm:text-[11.5px]">
        {live && <LiveDot />}
        <span className="truncate">{label}</span>
      </p>
      <p className="mt-1.5 truncate font-display text-[26px] font-extrabold leading-none tracking-tight text-ink sm:text-[32px]">
        {value}
      </p>
      {sub && <p className="mt-1.5 truncate text-[12.5px] font-semibold text-ink/50 sm:text-[13px]">{sub}</p>}
    </div>
  );
}

/* ---------- page heading ---------- */

export function PageTitle({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[30px] font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {sub && <p className="mt-1.5 max-w-xl text-[15.5px] font-medium text-ink/55">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/* ---------- toggle that means it ---------- */

export function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label?: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-green" : "bg-ink/15"}`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-pop ${on ? "right-0.5" : "left-0.5"}`}
      />
    </button>
  );
}

/* ---------- SMS bubbles (portal flavor) ---------- */

export function TagBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-start">
      <p className="max-w-[85%] rounded-[16px] rounded-bl-md bg-white px-3.5 py-2 text-[13.5px] leading-snug text-ink shadow-[0_1px_2px_rgb(15_21_18/0.08)]">
        {children}
      </p>
    </div>
  );
}

export function ThemBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] rounded-[16px] rounded-br-md bg-green px-3.5 py-2 text-[13.5px] font-medium leading-snug text-white">
        {children}
      </p>
    </div>
  );
}

/* ---------- buttons ---------- */

export function GreenBtn({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full bg-green px-5 py-3 text-[15px] font-extrabold text-ink transition-all hover:bg-green-deep hover:text-white disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostBtn({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border-2 border-ink/12 px-5 py-3 text-[15px] font-extrabold text-ink transition-colors hover:border-ink ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------- demo-mode marker for credential-gated actions ---------- */

export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 flex items-start gap-1.5 text-[12px] font-semibold text-ink/40">
      <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
      <span>{children}</span>
    </p>
  );
}
