import type { ReactNode } from "react";

export type CompareRow = { k: string; them: ReactNode; us: ReactNode };

/**
 * The comparison, staged as a conversation instead of a table: the old way
 * mumbles in a gray incoming bubble, Tagout answers in a green outgoing one.
 * Same bubble grammar as the phones, so the chart speaks the brand.
 */
export default function CompareThread({
  rows,
  themLabel = "Legacy schedulers",
}: {
  rows: CompareRow[];
  themLabel?: string;
}) {
  return (
    <div className="rounded-[28px] bg-white p-3 shadow-lift sm:p-4">
      {/* column captions */}
      <div className="grid grid-cols-[150px_1fr_1fr] items-center gap-6 px-4 pb-2 pt-3 lg:grid-cols-[190px_1fr_1fr]">
        <span />
        <span className="text-[12px] font-extrabold uppercase tracking-wide text-ink/35">
          {themLabel}
        </span>
        <span className="justify-self-end text-[12px] font-extrabold uppercase tracking-wide text-green-dark">
          With Tagout
        </span>
      </div>
      {rows.map((r) => (
        <div
          key={r.k}
          className="grid grid-cols-[150px_1fr_1fr] items-center gap-6 border-t border-ink/6 px-4 py-4 lg:grid-cols-[190px_1fr_1fr]"
        >
          <p className="font-display text-[15px] font-extrabold leading-snug text-ink">{r.k}</p>
          <p className="w-fit max-w-full rounded-[18px] rounded-bl-md bg-ink/[0.05] px-4 py-2.5 text-[14.5px] font-medium leading-snug text-ink/45">
            {r.them}
          </p>
          <p className="w-fit max-w-full justify-self-end rounded-[18px] rounded-br-md bg-green px-4 py-2.5 text-right text-[14.5px] font-bold leading-snug text-white shadow-[0_2px_8px_rgb(14_207_127/0.25)]">
            {r.us}
          </p>
        </div>
      ))}
    </div>
  );
}
