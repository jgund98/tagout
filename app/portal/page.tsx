"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePortal, shiftHours, uid } from "@/lib/portal/store";
import { Avatar, AvatarStack, Chip, StatTile, LiveDot, GreenBtn } from "@/components/portal/ui";
import type { FeedEvent } from "@/lib/portal/data";

const KIND_META: Record<FeedEvent["kind"], { chip: string; tone: "mint" | "lav" | "butter" | "blush" }> = {
  cover: { chip: "Coverage", tone: "mint" },
  swap: { chip: "Swap", tone: "lav" },
  clock: { chip: "Time clock", tone: "butter" },
  headsup: { chip: "Heads-up", tone: "blush" },
  onboard: { chip: "New crew", tone: "mint" },
  rule: { chip: "House rule", tone: "lav" },
};

const FILTERS = [
  { key: "all", label: "Everything" },
  { key: "cover", label: "Coverage" },
  { key: "swap", label: "Swaps" },
  { key: "clock", label: "Time clock" },
  { key: "headsup", label: "Heads-ups" },
] as const;

export default function TonightPage() {
  const { state, dispatch } = usePortal();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [note, setNote] = useState("");

  const staffOf = (id: string | null) => state.staff.find((s) => s.id === id) ?? null;

  // Friday (day 4) is "tonight" in the demo
  const tonight = useMemo(
    () => state.shifts.filter((s) => s.day === 4 && s.state !== "open"),
    [state.shifts]
  );
  const onClock = state.punches.filter((p) => p.outAt === null);
  const liveRun = state.runs.find((r) => r.state === "live");
  const laborTonight = tonight.reduce((sum, s) => sum + shiftHours(s) * 16, 0); // demo: blended $16/hr

  const feed = state.feed.filter((f) => (filter === "all" ? true : f.kind === filter));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="mx-auto max-w-6xl">
      {/* greeting */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-extrabold tracking-tight text-ink sm:text-4xl">
            {greeting}, {state.gmFirst} 👋
          </h1>
          <p className="mt-1 text-[14.5px] font-medium text-ink/55">
            Friday night at {state.houseName}. Tagout has the phones — here&apos;s everything it&apos;s doing.
          </p>
        </div>
        {liveRun ? (
          <Link
            href="/portal/coverage"
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-extrabold text-paper transition-all hover:shadow-lift"
          >
            <LiveDot /> 1 cover in motion →
          </Link>
        ) : (
          <Chip tone="mint">
            <LiveDot /> Fully covered
          </Chip>
        )}
      </div>

      {/* pulse */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Tonight's coverage" value={liveRun ? "1 gap · working" : "100%"} sub={liveRun ? "Tagout is on it, no action needed yet" : "every shift confirmed"} tone="mint" live={!!liveRun} />
        <StatTile label="On the clock" value={onClock.length} sub="live from the time clock" tone="white" live />
        <StatTile label="Tonight's labor" value={`$${Math.round(laborTonight).toLocaleString()}`} sub="scheduled, at blended rate" tone="butter" />
        <StatTile label="Covers, last 90 days" value={state.stats.covers90d} sub={`median ${state.stats.medianCoverMins} min to covered`} tone="lav" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        {/* THE FEED */}
        <section aria-label="Live activity">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="mr-1 font-display text-[18px] font-extrabold text-ink">The house feed</h2>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-extrabold transition-colors ${
                  filter === f.key ? "bg-ink text-paper" : "bg-white text-ink/55 shadow-pop hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {feed.slice(0, 10).map((f) => {
                const meta = KIND_META[f.kind];
                return (
                  <motion.article
                    key={f.id}
                    layout
                    initial={{ opacity: 0, y: -14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className={`flex items-start gap-3.5 rounded-3xl bg-white p-4 shadow-pop ${
                      f.fresh ? "ring-2 ring-green/40" : ""
                    }`}
                  >
                    <Avatar person={staffOf(f.who)} size={42} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip tone={meta.tone}>{meta.chip}</Chip>
                        <span className="text-[11.5px] font-bold text-ink/35">{f.when}</span>
                      </div>
                      <p className="mt-1.5 text-[14.5px] font-bold leading-snug text-ink">{f.text}</p>
                      {f.sub && <p className="mt-0.5 text-[13px] font-medium text-ink/50">{f.sub}</p>}
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
            {feed.length === 0 && (
              <div className="rounded-3xl bg-white p-8 text-center shadow-pop">
                <p className="font-display text-[16px] font-extrabold text-ink">Nothing here yet</p>
                <p className="mt-1 text-[13.5px] text-ink/50">This filter fills up as the night moves.</p>
              </div>
            )}
          </div>
        </section>

        {/* rail */}
        <div className="space-y-5">
          {/* live cover card */}
          {liveRun && (
            <section className="rounded-3xl bg-ink p-5">
              <p className="flex items-center gap-2 text-[11.5px] font-extrabold uppercase tracking-wide text-green">
                <LiveDot /> Happening right now
              </p>
              <h3 className="mt-2 font-display text-[18px] font-extrabold leading-tight text-paper">
                {liveRun.title}
              </h3>
              <p className="mt-1 text-[13px] font-semibold text-paper/55">{liveRun.sub}</p>
              <div className="mt-3.5 space-y-2">
                {liveRun.steps.map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                        s.state === "done"
                          ? "bg-green/20 text-green"
                          : s.state === "live"
                            ? "bg-green text-ink"
                            : "bg-paper/10 text-paper/40"
                      }`}
                    >
                      {s.state === "done" ? "✓" : i + 1}
                    </span>
                    <p className={`text-[13px] font-semibold leading-snug ${s.state === "todo" ? "text-paper/40" : "text-paper/85"}`}>
                      {s.label}
                      {s.detail && <span className="block text-[11.5px] font-medium text-paper/45">{s.detail}</span>}
                    </p>
                  </div>
                ))}
              </div>
              {liveRun.outcome?.includes("needs your approval") && (
                <GreenBtn
                  className="mt-4 w-full"
                  onClick={() => {
                    dispatch({ type: "APPROVE_LIVE_COVER" });
                    dispatch({
                      type: "FEED_PUSH",
                      event: { id: uid("f"), kind: "cover", who: "sasha", text: "You approved: Sasha takes Friday close", sub: "board updated · Sasha, Dana & the crew all got texts", when: "Just now" },
                    });
                  }}
                >
                  Approve: Sasha takes it ✓
                </GreenBtn>
              )}
              <Link href="/portal/coverage" className="mt-3 block text-center text-[12.5px] font-bold text-paper/50 hover:text-paper">
                Read the full text thread →
              </Link>
            </section>
          )}

          {/* tonight's lineup */}
          <section className="rounded-3xl bg-white p-5 shadow-pop">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[16px] font-extrabold text-ink">Tonight&apos;s lineup</h3>
              <AvatarStack people={tonight.map((s) => staffOf(s.staffId))} />
            </div>
            <div className="mt-3 space-y-2">
              {tonight.map((s) => {
                const p = staffOf(s.staffId);
                return (
                  <div key={s.id} className="flex items-center gap-3 rounded-2xl bg-cream/70 px-3 py-2">
                    <Avatar person={p} size={30} />
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="truncate text-[13.5px] font-extrabold text-ink">{p?.first}</p>
                      <p className="text-[11px] font-semibold text-ink/45">
                        {s.role} · {s.start}–{s.end}
                        {s.section ? ` · ${s.section}` : ""}
                      </p>
                    </div>
                    {s.state === "covering" && <Chip tone="butter">covering…</Chip>}
                  </div>
                );
              })}
            </div>
            <Link href="/portal/schedule" className="mt-3 block text-center text-[12.5px] font-bold text-ink/45 hover:text-ink">
              Open the week →
            </Link>
          </section>

          {/* note to tomorrow */}
          <section className="rounded-3xl bg-white p-5 shadow-pop">
            <h3 className="font-display text-[16px] font-extrabold text-ink">Manager&apos;s notebook</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!note.trim()) return;
                dispatch({ type: "NOTE_ADD", text: note.trim() });
                setNote("");
              }}
              className="mt-2.5 flex gap-2"
            >
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note for tomorrow's shift…"
                className="min-w-0 flex-1 rounded-full border-2 border-ink/10 px-4 py-2 text-[13.5px] font-semibold text-ink outline-none focus:border-green"
              />
              <button
                type="submit"
                aria-label="Save note"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green font-extrabold text-white"
              >
                ↑
              </button>
            </form>
            <ul className="mt-3 space-y-2">
              {state.notes.slice(0, 3).map((n) => (
                <li key={n.id} className="rounded-2xl rounded-bl-md bg-cream px-3.5 py-2.5 text-[13px] font-semibold leading-snug text-ink">
                  {n.text}
                  <span className="mt-0.5 block text-[11px] font-bold text-ink/35">{n.when}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
