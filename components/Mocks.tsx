"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

/* ============================================================
   Product-UI mockups, all hand-built so they stay pixel-crisp.
   ============================================================ */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Cell = { label?: string; tone?: "green" | "mint" | "lav" | "butter" | "tag" | "empty" };

const GRID: { name: string; cells: Cell[] }[] = [
  {
    name: "Marisa T.",
    cells: [
      { label: "5–11", tone: "mint" },
      {},
      { label: "5–11", tone: "mint" },
      {},
      { label: "5–11", tone: "tag" },
      { label: "11–5", tone: "lav" },
      {},
    ],
  },
  {
    name: "Jake R.",
    cells: [
      { label: "11–5", tone: "lav" },
      { label: "11–5", tone: "lav" },
      {},
      { label: "5–11", tone: "mint" },
      { label: "5–11", tone: "mint" },
      {},
      { label: "11–5", tone: "lav" },
    ],
  },
  {
    name: "Priya S.",
    cells: [
      {},
      { label: "5–11", tone: "mint" },
      { label: "5–11", tone: "mint" },
      { label: "OFF", tone: "butter" },
      { label: "OFF", tone: "butter" },
      { label: "5–11", tone: "mint" },
      {},
    ],
  },
  {
    name: "Devon K.",
    cells: [
      { label: "5–11", tone: "mint" },
      {},
      { label: "11–5", tone: "lav" },
      { label: "11–5", tone: "lav" },
      {},
      { label: "5–11", tone: "mint" },
      { label: "5–11", tone: "mint" },
    ],
  },
];

function toneClass(tone?: Cell["tone"]) {
  switch (tone) {
    case "mint":
      return "bg-mint text-green-dark";
    case "lav":
      return "bg-lav text-violet-mid";
    case "butter":
      return "bg-butter text-[#9a6a00]";
    case "tag":
      return "bg-violet text-white ring-2 ring-violet/30";
    default:
      return "";
  }
}

export function ScheduleMock({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-3xl bg-white shadow-lift ${className}`}>
      {/* app chrome */}
      <div className="flex items-center justify-between border-b border-ink/8 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <p className="font-display text-[15.5px] font-extrabold text-ink">Week of Mar 9</p>
          <span className="hidden sm:inline-flex rounded-full bg-mint px-2.5 py-1 text-[11px] font-extrabold text-green-dark">
            Fully covered
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline rounded-full border border-ink/12 px-3 py-1.5 text-[12px] font-bold text-ink-soft">
            Copy last week
          </span>
          <span className="rounded-full bg-green px-3.5 py-1.5 text-[12px] font-extrabold text-white">
            Publish
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-[76px_repeat(7,1fr)] gap-1.5 sm:grid-cols-[96px_repeat(7,1fr)]">
          <div />
          {DAYS.map((d, i) => (
            <p key={d} className={`pb-1 text-center text-[11px] font-extrabold uppercase tracking-wide ${i === 4 ? "text-violet" : "text-ink/40"}`}>
              {d}
            </p>
          ))}
          {GRID.map((row) => (
            <RowCells key={row.name} row={row} />
          ))}
        </div>

        {/* Tag annotation */}
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-lav p-3.5">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet text-[11px] font-extrabold text-white">
            T
          </span>
          <p className="text-[13px] font-medium leading-snug text-violet-deep">
            <span className="font-extrabold">Tagout filled Friday 5–11</span> after Dana dropped it:
            texted 2 people, Marisa confirmed in 7 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

function RowCells({ row }: { row: { name: string; cells: Cell[] } }) {
  return (
    <>
      <p className="flex items-center pr-2 text-[12px] font-bold text-ink-soft">{row.name}</p>
      {row.cells.map((c, i) => (
        <div
          key={i}
          className={`flex h-9 items-center justify-center rounded-lg text-[11px] font-extrabold sm:h-10 sm:text-[12px] ${
            c.label ? toneClass(c.tone) : "border border-dashed border-ink/8"
          }`}
        >
          {c.label ?? ""}
        </div>
      ))}
    </>
  );
}

/* ---------- approvals stack ---------- */

export function ApprovalsMock({ className = "" }: { className?: string }) {
  const cards = [
    {
      who: "Jake ↔ Devon",
      what: "Swap Thursday close",
      note: "Both under 35 hrs · same role",
      state: "ready",
    },
    {
      who: "Priya S.",
      what: "Drop Sunday brunch",
      note: "Tagout already has 3 candidates",
      state: "working",
    },
    {
      who: "Marisa T.",
      what: "Pick up Saturday patio",
      note: "No conflicts found",
      state: "approved",
    },
  ];
  return (
    <div className={`space-y-3 ${className}`}>
      {cards.map((c, i) => (
        <Reveal key={c.who} delay={i * 0.1}>
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-pop sm:p-5">
            <div className="min-w-0">
              <p className="truncate font-display text-[15.5px] font-extrabold text-ink">{c.what}</p>
              <p className="mt-0.5 truncate text-[13px] font-medium text-ink-soft">
                {c.who} · <span className="text-ink/45">{c.note}</span>
              </p>
            </div>
            {c.state === "approved" ? (
              <span className="shrink-0 rounded-full bg-mint px-3.5 py-2 text-[12.5px] font-extrabold text-green-dark">
                Approved ✓
              </span>
            ) : c.state === "working" ? (
              <span className="shrink-0 rounded-full bg-lav px-3.5 py-2 text-[12.5px] font-extrabold text-violet-mid">
                Tagout&apos;s on it…
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-ink px-3.5 py-2 text-[12.5px] font-extrabold text-paper">
                Approve
              </span>
            )}
          </div>
        </Reveal>
      ))}
      <p className="pt-1 text-center text-[13px] font-semibold text-ink/45">
        One tap each. Tagout handles the back-and-forth.
      </p>
    </div>
  );
}

/* ---------- guardrails ---------- */

export function GuardrailsMock({ className = "" }: { className?: string }) {
  const rows = [
    { name: "Jake R.", hrs: 38.5, cap: 40, tone: "amber" },
    { name: "Marisa T.", hrs: 31, cap: 40, tone: "green" },
    { name: "Devon K.", hrs: 26, cap: 40, tone: "green" },
    { name: "Priya S.", hrs: 29, cap: 40, tone: "green" },
  ];
  return (
    <div className={`rounded-3xl bg-white p-5 shadow-lift sm:p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="font-display text-[16px] font-extrabold text-ink">Weekly hours</p>
        <span className="rounded-full bg-butter px-3 py-1 text-[11.5px] font-extrabold text-[#9a6a00]">
          1 near overtime
        </span>
      </div>
      <div className="mt-5 space-y-4">
        {rows.map((r, i) => (
          <div key={r.name}>
            <div className="flex items-baseline justify-between">
              <p className="text-[13.5px] font-bold text-ink">{r.name}</p>
              <p className={`text-[13px] font-extrabold tabular-nums ${r.tone === "amber" ? "text-[#c8891a]" : "text-green-dark"}`}>
                {r.hrs} / {r.cap} hrs
              </p>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-ink/6">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(r.hrs / r.cap) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full ${r.tone === "amber" ? "bg-amber" : "bg-green"}`}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-2xl bg-cream p-3.5 text-[13px] font-medium leading-snug text-ink-soft">
        Tagout never offers a shift that would push someone into overtime. The expensive
        surprise just stops happening.
      </p>
    </div>
  );
}

/* ---------- multi-location dashboard ---------- */

export function GroupDashMock({ className = "" }: { className?: string }) {
  const locs = [
    { name: "Downtown", covered: 100, open: 0, ot: "$0" },
    { name: "Riverside", covered: 96, open: 1, ot: "$0" },
    { name: "Airport", covered: 92, open: 2, ot: "$118" },
    { name: "Midtown", covered: 100, open: 0, ot: "$0" },
  ];
  return (
    <div className={`overflow-hidden rounded-3xl bg-white shadow-lift ${className}`}>
      <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4">
        <p className="font-display text-[16px] font-extrabold text-ink">This week · 4 locations</p>
        <span className="flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 text-[12px] font-extrabold text-green-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-green tg-pulse" />
          AI active in all
        </span>
      </div>
      <div className="divide-y divide-ink/6">
        {locs.map((l, i) => (
          <div key={l.name} className="grid grid-cols-[1.2fr_1.6fr_auto] items-center gap-3 px-5 py-3.5 sm:gap-6">
            <p className="text-[14.5px] font-bold text-ink">{l.name}</p>
            <div className="flex items-center gap-2.5">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/6">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${l.covered}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                  className={`h-full rounded-full ${l.covered === 100 ? "bg-green" : l.covered >= 95 ? "bg-green/70" : "bg-amber"}`}
                />
              </div>
              <p className="w-11 text-right text-[13px] font-extrabold tabular-nums text-ink">{l.covered}%</p>
            </div>
            <div className="flex items-center gap-2 justify-self-end">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${l.open === 0 ? "bg-mint text-green-dark" : "bg-butter text-[#9a6a00]"}`}>
                {l.open} open
              </span>
              <span className={`hidden sm:inline rounded-full px-2.5 py-1 text-[11px] font-extrabold ${l.ot === "$0" ? "bg-ink/6 text-ink/50" : "bg-blush text-coral"}`}>
                OT {l.ot}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- the "old way" artifacts ---------- */

export function LockscreenMock({ className = "" }: { className?: string }) {
  const pushes = [
    "New shift available. Open the app to view",
    "REMINDER: 3 open shifts still need coverage",
    "Your manager posted an announcement",
    "New shift available. Open the app to view",
    "Please update your availability in the app",
  ];
  return (
    <div className={`flex flex-col rounded-[30px] bg-[#171d1a] p-4 shadow-lift ${className}`}>
      <p className="pt-4 text-center font-display text-4xl font-bold text-white/90">9:41</p>
      <p className="pb-4 text-center text-[12.5px] font-medium text-white/45">Tuesday, March 10</p>
      <div className="flex flex-1 flex-col justify-evenly gap-1.5">
        {pushes.map((p, i) => (
          <div key={i} className="rounded-2xl bg-white/12 px-3.5 py-2.5 backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-white/50">
                Scheduling app
              </p>
              <p className="text-[10.5px] text-white/35">{i === 0 ? "2m ago" : `${i * 3 + 1}h ago`}</p>
            </div>
            <p className="mt-0.5 text-[12.5px] font-medium leading-snug text-white/80">{p}</p>
          </div>
        ))}
      </div>
      <p className="pt-3 pb-1 text-center text-[12px] font-semibold text-white/40">
        swiped away · never opened
      </p>
    </div>
  );
}

export function GroupChatMock({ className = "" }: { className?: string }) {
  const msgs = [
    { who: "Manager", text: "Anyone able to cover Friday close?? Dana is out", me: false },
    { who: "Kyle", text: "can't, sorry", me: false },
    { who: "Sam", text: "who's out?", me: false },
    { who: "Manager", text: "Dana. Friday. 5–11. Anyone???", me: false },
    { who: "Alexis", text: "maybe? what section", me: false },
    { who: "Kyle", text: "wait is this about saturday", me: false },
  ];
  return (
    <div className={`flex flex-col rounded-[30px] bg-white p-4 shadow-lift ${className}`}>
      <p className="border-b border-ink/8 pb-2.5 text-center text-[13px] font-bold text-ink">
        🍔 FOH crew (23)
      </p>
      <div className="flex flex-1 flex-col justify-evenly gap-2 pt-3">
        {msgs.map((m, i) => (
          <div key={i}>
            <p className="mb-0.5 pl-2 text-[10.5px] font-bold text-ink/35">{m.who}</p>
            <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-ink/6 px-3 py-1.5 text-[12.5px] text-ink/75">
              {m.text}
            </p>
          </div>
        ))}
      </div>
      <p className="pt-3 text-center text-[12px] font-semibold text-ink/40">
        …still not covered
      </p>
    </div>
  );
}
