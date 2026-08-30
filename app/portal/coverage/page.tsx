"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePortal, uid } from "@/lib/portal/store";
import { Avatar, Chip, LiveDot, GreenBtn, GhostBtn, PageTitle, TagBubble, ThemBubble, DemoNote } from "@/components/portal/ui";
import type { CoverageRun } from "@/lib/portal/data";

const MODES = [
  { key: "suggest", label: "Suggest only", plain: "Tagout ranks the list and drafts the texts. Nothing sends until you say go." },
  { key: "ask-first", label: "Ask, then confirm with me", plain: "Tagout works the list on its own, but the final yes waits for your one tap." },
  { key: "full", label: "Handle it, tell me after", plain: "Tagout covers the shift end to end and sends you the receipt." },
] as const;

export default function CoveragePage() {
  const { state, dispatch } = usePortal();
  const [openRun, setOpenRun] = useState<string | null>("r-live");
  const staffOf = (id?: string) => state.staff.find((s) => s.id === id) ?? null;

  const liveRun = state.runs.find((r) => r.state === "live");
  const needsApproval = liveRun?.outcome?.includes("needs your approval");
  const pendingCards = state.punches.filter((p) => p.outAt !== null && !p.approved).length;
  const pendingTimeOff = state.timeOff.filter((t) => t.state === "pending").length;
  const needsYou =
    (needsApproval ? 1 : 0) + pendingCards + pendingTimeOff;

  const approve = () => {
    dispatch({ type: "APPROVE_LIVE_COVER" });
    dispatch({
      type: "FEED_PUSH",
      event: { id: uid("f"), kind: "cover", who: "sasha", text: "You approved: Sasha takes Friday close", sub: "board updated · everyone got their confirmation text", when: "Just now" },
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle
        title="Coverage"
        sub="Every dropped shift, who Tagout asked, what they said, and where you come in."
        right={
          <div className="flex items-center gap-2">
            <span className={`text-[12.5px] font-extrabold ${state.paused ? "text-coral" : "text-ink/45"}`}>
              {state.paused ? "Tagout is paused" : "Tagout is on shift"}
            </span>
            <button
              onClick={() => {
                dispatch({ type: "PAUSE_TOGGLE" });
                dispatch({
                  type: "FEED_PUSH",
                  event: {
                    id: uid("f"),
                    kind: "rule",
                    who: null,
                    text: state.paused ? "You put Tagout back on shift" : "You paused Tagout — no texts go out until you resume",
                    sub: state.paused ? "outreach resumes where it left off" : "live covers hold their place",
                    when: "Just now",
                  },
                });
              }}
              className={`rounded-full px-4 py-2 text-[13px] font-extrabold transition-colors ${
                state.paused ? "bg-green text-ink" : "bg-white text-coral shadow-pop hover:bg-blush/60"
              }`}
            >
              {state.paused ? "Resume Tagout →" : "Pause tonight"}
            </button>
          </div>
        }
      />

      {state.paused && (
        <div className="mb-5 flex items-center gap-3 rounded-3xl bg-blush/60 p-4">
          <span className="text-[18px]">⏸️</span>
          <p className="text-[13.5px] font-bold text-ink">
            Paused: Tagout won&apos;t text anyone until you resume. The live cover below is holding its place in line.
          </p>
        </div>
      )}

      {/* NEEDS YOU: the catch-up queue */}
      <section className="rounded-[28px] bg-ink p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2.5 font-display text-[19px] font-extrabold text-paper">
            Needs you
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-green px-2 font-display text-[14px] text-ink">
              {needsYou}
            </span>
          </h2>
          <p className="text-[12px] font-bold text-paper/40">Swamped all shift? Start here.</p>
        </div>
        <div className="mt-4 space-y-2.5">
          {needsApproval && liveRun && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-paper/8 p-3.5">
              <Avatar person={staffOf("sasha")} size={36} />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold text-paper">Sasha said yes to Dana&apos;s Friday close</p>
                <p className="text-[12px] font-semibold text-paper/50">one tap and everyone gets confirmed</p>
              </div>
              <GreenBtn onClick={approve}>Approve ✓</GreenBtn>
            </div>
          )}
          {pendingCards > 0 && (
            <Link href="/portal/hours" className="flex items-center gap-3 rounded-2xl bg-paper/8 p-3.5 transition-colors hover:bg-paper/12">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-butter text-[16px]">⏱️</span>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-paper">{pendingCards} timecard{pendingCards > 1 ? "s" : ""} to approve</p>
                <p className="text-[12px] font-semibold text-paper/50">from today&apos;s clock-outs</p>
              </div>
              <span className="text-paper/40">→</span>
            </Link>
          )}
          {pendingTimeOff > 0 && (
            <Link href="/portal/team" className="flex items-center gap-3 rounded-2xl bg-paper/8 p-3.5 transition-colors hover:bg-paper/12">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lav text-[16px]">🌴</span>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-paper">{pendingTimeOff} time-off request{pendingTimeOff > 1 ? "s" : ""} waiting</p>
                <p className="text-[12px] font-semibold text-paper/50">Sasha&apos;s wedding weekend & Devon&apos;s DMV run</p>
              </div>
              <span className="text-paper/40">→</span>
            </Link>
          )}
          {needsYou === 0 && (
            <div className="rounded-2xl bg-paper/8 p-4 text-center">
              <p className="text-[14px] font-bold text-paper">You&apos;re all caught up 🤙</p>
              <p className="text-[12px] font-semibold text-paper/50">Tagout will tap you here the moment something needs a human.</p>
            </div>
          )}
        </div>
      </section>

      {/* autopilot dial */}
      <section className="mt-6 rounded-[28px] bg-white p-5 shadow-pop sm:p-6">
        <h2 className="font-display text-[18px] font-extrabold text-ink">How much should Tagout handle?</h2>
        <p className="mt-1 text-[13px] font-medium text-ink/50">
          Your call, changeable any time. Most houses start in the middle and go hands-off within a month.
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          {MODES.map((m) => {
            const active = state.autopilot === m.key;
            return (
              <button
                key={m.key}
                onClick={() => dispatch({ type: "AUTOPILOT", mode: m.key })}
                className={`rounded-2xl p-4 text-left transition-all ${
                  active ? "bg-green text-ink shadow-pop" : "bg-cream text-ink/70 hover:bg-mint/50"
                }`}
              >
                <p className="font-display text-[15px] font-extrabold">{m.label}</p>
                <p className={`mt-1 text-[12.5px] font-semibold leading-snug ${active ? "text-ink/75" : "text-ink/45"}`}>
                  {m.plain}
                </p>
              </button>
            );
          })}
        </div>
        <DemoNote>
          This setting drives the live demo below: on &ldquo;Handle it,&rdquo; Tagout confirms Sasha without waiting for you.
        </DemoNote>
      </section>

      {/* runs */}
      <section className="mt-6">
        <h2 className="mb-3 font-display text-[18px] font-extrabold text-ink">Every cover, receipts included</h2>
        <div className="space-y-3">
          {state.runs.map((r) => (
            <RunCard
              key={r.id}
              run={r}
              open={openRun === r.id}
              onToggle={() => setOpenRun(openRun === r.id ? null : r.id)}
              staffOf={staffOf}
            />
          ))}
        </div>
      </section>

      {/* the guarantee, restated where it matters */}
      <section className="mt-6 rounded-[28px] bg-mint/60 p-5 sm:p-6">
        <h3 className="font-display text-[16px] font-extrabold text-ink">When nobody says yes</h3>
        <p className="mt-1.5 max-w-2xl text-[13.5px] font-medium leading-relaxed text-ink/65">
          Tagout asks every eligible person, one at a time, before it ever hands a shift back. If the whole
          list passes, you get names and numbers early enough to act, and one reply
          (&ldquo;COVERED Rosa&rdquo;) closes the loop. See &ldquo;Sunday brunch&rdquo; above for exactly how that looked.
        </p>
      </section>
    </div>
  );
}

function RunCard({
  run,
  open,
  onToggle,
  staffOf,
}: {
  run: CoverageRun;
  open: boolean;
  onToggle: () => void;
  staffOf: (id?: string) => import("@/lib/portal/data").Staff | null;
}) {
  const tone =
    run.state === "live" ? (
      <Chip tone="mint"><LiveDot /> live</Chip>
    ) : run.state === "covered" ? (
      <Chip tone="mint">covered ✓</Chip>
    ) : (
      <Chip tone="butter">handed to you</Chip>
    );
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-pop">
      <button onClick={onToggle} className="flex w-full flex-wrap items-center gap-3 p-4 text-left sm:p-5">
        {tone}
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15.5px] font-extrabold text-ink">{run.title}</p>
          <p className="text-[12.5px] font-semibold text-ink/45">
            {run.sub} · {run.when}
          </p>
        </div>
        <span className={`text-ink/35 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="grid gap-5 border-t border-ink/6 p-4 sm:p-5 lg:grid-cols-2">
              {/* steps */}
              <div>
                <p className="mb-2.5 text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">
                  What Tagout did
                </p>
                <div className="space-y-2.5">
                  {run.steps.map((s, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                          s.state === "done"
                            ? "bg-mint text-green-dark"
                            : s.state === "live"
                              ? "bg-green text-ink"
                              : "bg-ink/8 text-ink/35"
                        }`}
                      >
                        {s.state === "done" ? "✓" : i + 1}
                      </span>
                      <p className={`text-[13.5px] font-semibold leading-snug ${s.state === "todo" ? "text-ink/35" : "text-ink"}`}>
                        {s.label}
                        {s.detail && <span className="block text-[12px] font-medium text-ink/45">{s.detail}</span>}
                      </p>
                    </div>
                  ))}
                </div>
                {run.outcome && (
                  <p className="mt-3 w-fit rounded-full bg-ink px-3.5 py-1.5 text-[11.5px] font-bold text-paper">
                    {run.outcome}
                  </p>
                )}
              </div>
              {/* thread */}
              <div className="rounded-2xl bg-[#f4f2ec] p-3.5">
                <p className="mb-2.5 text-center text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink/35">
                  The actual texts
                </p>
                <div className="space-y-2">
                  {run.thread.map((b, i) =>
                    b.from === "tag" ? (
                      <TagBubble key={i}>{b.text}</TagBubble>
                    ) : (
                      <div key={i} className="flex items-end justify-end gap-1.5">
                        <ThemBubble>{b.text}</ThemBubble>
                        {b.who && b.who !== "you" && <Avatar person={staffOf(b.who)} size={22} />}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
