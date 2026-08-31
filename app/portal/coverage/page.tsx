"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePortal, uid } from "@/lib/portal/store";
import { Avatar, Burst, Chip, LiveDot, GreenBtn, GhostBtn, PageTitle, TagBubble, ThemBubble } from "@/components/portal/ui";
import { DAYS, type CoverageRun } from "@/lib/portal/data";

const MODES = [
  { key: "suggest", label: "Suggest only", plain: "Tagout ranks the list and drafts the texts. Nothing sends until you say go." },
  { key: "ask-first", label: "Ask, then confirm with me", plain: "Tagout works the list on its own, but the final yes waits for your one tap." },
  { key: "full", label: "Handle it, tell me after", plain: "Tagout covers the shift end to end and sends you the receipt." },
] as const;

export default function CoveragePage() {
  const { state, dispatch } = usePortal();
  const [openRun, setOpenRun] = useState<string | null>("r-live");
  const [burst, setBurst] = useState(false);
  const staffOf = (id?: string) => state.staff.find((s) => s.id === id) ?? null;

  const liveRun = state.runs.find((r) => r.state === "live");
  const needsApproval = liveRun?.outcome?.includes("needs your approval");
  const cardsToApprove = state.punches.filter((p) => p.outAt !== null && !p.approved);
  const offToDecide = state.timeOff.filter((t) => t.state === "pending");
  const claimsToDecide = state.claims
    .map((c) => ({ claim: c, shift: state.shifts.find((s) => s.id === c.shiftId) }))
    .filter((x) => x.shift && x.shift.state === "open");
  const pendingCards = cardsToApprove.length;
  const pendingTimeOff = offToDecide.length;
  const needsYou = (needsApproval ? 1 : 0) + pendingCards + pendingTimeOff + claimsToDecide.length;

  const decideOff = (t: (typeof offToDecide)[number], verdict: "approved" | "denied") => {
    const p = staffOf(t.staffId);
    dispatch({ type: "TIMEOFF", id: t.id, state: verdict });
    dispatch({
      type: "FEED_PUSH",
      event: { id: uid("f"), kind: "swap", who: t.staffId, text: `You ${verdict === "approved" ? "approved" : "declined"} ${p?.first}'s time off (${t.range})`, sub: `${p?.first} got a text with the answer`, when: "Just now" },
    });
  };

  const approveCard = (id: string) => {
    const punch = state.punches.find((p) => p.id === id);
    const p = staffOf(punch?.staffId);
    dispatch({ type: "PUNCH_PATCH", id, patch: { approved: true } });
    dispatch({
      type: "FEED_PUSH",
      event: { id: uid("f"), kind: "clock", who: punch?.staffId ?? null, text: `You approved ${p?.first}'s timecard`, sub: "ready for payroll", when: "Just now" },
    });
  };

  const grantClaim = (shiftId: string, staffId: string) => {
    const p = staffOf(staffId);
    dispatch({ type: "SHIFT_CLAIM", shiftId, staffId });
    dispatch({ type: "CLAIM_CANCEL", shiftId, staffId });
    dispatch({
      type: "FEED_PUSH",
      event: { id: uid("f"), kind: "cover", who: staffId, text: `${p?.first} got the open shift`, sub: "board updated · confirmed by text", when: "Just now" },
    });
  };

  const approve = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 950);
    dispatch({ type: "APPROVE_LIVE_COVER" });
    dispatch({
      type: "FEED_PUSH",
      event: { id: uid("f"), kind: "cover", who: "sasha", text: "You approved: Sasha takes Friday close", sub: "board updated · everyone got their confirmation text", when: "Just now" },
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Burst show={burst} />
      <PageTitle
        title="Coverage"
        sub="Open shifts, outreach status, and full message history."
        right={
          <div className="flex items-center gap-2">
            <span className={`hidden text-[12.5px] font-extrabold sm:inline ${state.paused ? "text-coral" : "text-ink/45"}`}>
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
                    text: state.paused ? "You put Tagout back on shift" : "You paused Tagout. No texts go out until you resume",
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
            Outreach is paused. Active coverage holds its place until you resume.
          </p>
        </div>
      )}

      {/* NEEDS YOU: the catch-up queue */}
      <section className="rounded-[28px] bg-pine p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2.5 font-display text-[19px] font-extrabold text-paper">
            Needs attention
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-green px-2 font-display text-[14px] text-ink">
              {needsYou}
            </span>
          </h2>

        </div>
        <div className="mt-4 space-y-2.5">
          {needsApproval && liveRun && (
            <div className="rounded-2xl bg-paper/8 p-3.5 sm:flex sm:items-center sm:gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar person={staffOf("sasha")} size={36} />
                <div className="min-w-0">
                  <p className="text-[14px] font-bold leading-snug text-paper">Sasha said yes to Dana&apos;s Friday close</p>
                  <p className="text-[12px] font-semibold text-paper/50">approve and everyone gets confirmed</p>
                </div>
              </div>
              <GreenBtn className="mt-3 w-full sm:mt-0 sm:w-auto sm:shrink-0" onClick={approve}>
                Approve ✓
              </GreenBtn>
            </div>
          )}
          {claimsToDecide.map(({ claim, shift }) => {
            const p = staffOf(claim.staffId);
            return (
              <div key={claim.shiftId + claim.staffId} className="rounded-2xl bg-paper/8 p-3.5 sm:flex sm:items-center sm:gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar person={p} size={36} />
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold leading-snug text-paper">
                      {p?.first} wants the open {DAYS[shift!.day]} {shift!.role.toLowerCase()} shift
                    </p>
                    <p className="text-[12px] font-semibold text-paper/50">
                      {shift!.start}–{shift!.end} · first request wins
                    </p>
                  </div>
                </div>
                <GreenBtn className="mt-3 w-full sm:mt-0 sm:w-auto sm:shrink-0" onClick={() => grantClaim(claim.shiftId, claim.staffId)}>
                  Give it to {p?.first ?? "them"}
                </GreenBtn>
              </div>
            );
          })}
          {offToDecide.map((t) => {
            const p = staffOf(t.staffId);
            return (
              <div key={t.id} className="rounded-2xl bg-paper/8 p-3.5 sm:flex sm:items-center sm:gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar person={p} size={36} />
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold leading-snug text-paper">
                      {p?.first} requested {t.range} off
                    </p>
                    <p className="truncate text-[12px] font-semibold text-paper/50">{t.reason}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 sm:mt-0 sm:shrink-0">
                  <button
                    onClick={() => decideOff(t, "approved")}
                    className="flex-1 rounded-full bg-green px-4 py-2 text-[13px] font-extrabold text-ink transition-transform hover:scale-[1.02] sm:flex-none"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => decideOff(t, "denied")}
                    className="flex-1 rounded-full border-2 border-paper/20 px-4 py-2 text-[13px] font-extrabold text-paper/70 hover:border-paper/50 hover:text-paper sm:flex-none"
                  >
                    Decline
                  </button>
                </div>
              </div>
            );
          })}
          {cardsToApprove.map((punch) => {
            const p = staffOf(punch.staffId);
            const hrs = ((punch.outMins! - punch.inMins - punch.breakMins) / 60).toFixed(1);
            return (
              <div key={punch.id} className="rounded-2xl bg-paper/8 p-3.5 sm:flex sm:items-center sm:gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar person={p} size={36} />
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold leading-snug text-paper">
                      {p?.first}&apos;s timecard · {hrs} hrs
                    </p>
                    <p className="text-[12px] font-semibold text-paper/50">
                      {punch.inAt} – {punch.outAt} · {punch.breakMins} min break
                    </p>
                  </div>
                </div>
                <GreenBtn className="mt-3 w-full sm:mt-0 sm:w-auto sm:shrink-0" onClick={() => approveCard(punch.id)}>
                  Approve
                </GreenBtn>
              </div>
            );
          })}
          {needsYou === 0 && (
            <div className="rounded-2xl bg-paper/8 p-4 text-center">
              <p className="text-[14px] font-bold text-paper">All caught up</p>
              <p className="text-[12px] font-semibold text-paper/50">New items appear here when they need a decision.</p>
            </div>
          )}
        </div>
      </section>

      {/* autopilot dial */}
      <section className="mt-6 rounded-[28px] bg-white p-5 shadow-pop sm:p-6">
        <h2 className="font-display text-[18px] font-extrabold text-ink">Automation level</h2>
        <p className="mt-1 text-[13px] font-medium text-ink/50">
          Applies from the next message on.
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

      </section>

      {/* runs: happening now first, history below */}
      {state.runs.some((r) => r.state === "live") && (
        <section className="mt-6">
          <h2 className="mb-3 flex items-center gap-2 font-display text-[18px] font-extrabold text-ink">
            <LiveDot /> Happening right now
          </h2>
          <div className="space-y-3">
            {state.runs
              .filter((r) => r.state === "live")
              .map((r) => (
                <RunCard key={r.id} run={r} open={openRun === r.id} onToggle={() => setOpenRun(openRun === r.id ? null : r.id)} staffOf={staffOf} />
              ))}
          </div>
        </section>
      )}
      <section className="mt-6">
        <h2 className="mb-3 font-display text-[18px] font-extrabold text-ink">
          Coverage history
        </h2>
        <div className="space-y-3">
          {state.runs
            .filter((r) => r.state !== "live")
            .map((r) => (
              <RunCard key={r.id} run={r} open={openRun === r.id} onToggle={() => setOpenRun(openRun === r.id ? null : r.id)} staffOf={staffOf} />
            ))}
        </div>
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
      <Chip tone="mint"><LiveDot /> Live</Chip>
    ) : run.state === "covered" ? (
      <Chip tone="mint">Covered ✓</Chip>
    ) : (
      <Chip tone="butter">Handed to you</Chip>
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
                  Timeline
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
                              : "bg-pine/8 text-ink/35"
                        }`}
                      >
                        {s.state === "done" ? "✓" : i + 1}
                      </span>
                      <p className={`min-w-0 flex-1 text-[13.5px] font-semibold leading-snug ${s.state === "todo" ? "text-ink/35" : "text-ink"}`}>
                        {s.label}
                        {s.detail && <span className="block text-[12px] font-medium text-ink/45">{s.detail}</span>}
                      </p>
                      {s.at && (
                        <span className="shrink-0 pt-0.5 text-[11px] font-bold tabular-nums text-ink/35">{s.at}</span>
                      )}
                    </div>
                  ))}
                </div>
                {run.outcome && (
                  <p className="mt-3 w-fit rounded-full bg-pine px-3.5 py-1.5 text-[11.5px] font-bold text-paper">
                    {run.outcome}
                  </p>
                )}
              </div>
              {/* thread */}
              <div className="rounded-2xl bg-[#f1f3f2] p-3.5">
                <p className="mb-2.5 text-center text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink/35">
                  Messages
                </p>
                <div className="space-y-2">
                  {(() => {
                    let current: string | null = null;
                    return run.thread.map((b, i) => {
                      const person = b.who && b.who !== "you" ? b.who : null;
                      const divider = !!person && person !== current;
                      if (person) current = person;
                      const p = person ? staffOf(person) : null;
                      return (
                        <div key={i}>
                          {divider && (
                            <div className={`flex items-center justify-center gap-1.5 pb-1.5 ${i > 0 ? "pt-3" : ""}`}>
                              <Avatar person={p} size={18} />
                              <span className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink/40">
                                With {p?.first}
                              </span>
                            </div>
                          )}
                          {b.from === "tag" ? (
                            <TagBubble>{b.text}</TagBubble>
                          ) : (
                            <div className="flex items-end justify-end gap-1.5">
                              <ThemBubble>{b.text}</ThemBubble>
                              {b.who && b.who !== "you" && <Avatar person={staffOf(b.who)} size={22} />}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
