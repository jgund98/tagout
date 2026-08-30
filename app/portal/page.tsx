"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePortal, shiftHours, uid, needsYouCount } from "@/lib/portal/store";
import { Avatar, AvatarStack, Burst, Chip, StatTile, LiveDot, GreenBtn } from "@/components/portal/ui";
import type { FeedEvent } from "@/lib/portal/data";

const KIND_META: Record<FeedEvent["kind"], { chip: string; tone: "mint" | "lav" | "butter" | "blush" }> = {
  cover: { chip: "Coverage", tone: "mint" },
  swap: { chip: "Swap", tone: "lav" },
  clock: { chip: "Time clock", tone: "butter" },
  headsup: { chip: "Heads-up", tone: "blush" },
  onboard: { chip: "New crew", tone: "mint" },
  rule: { chip: "House rule", tone: "lav" },
};

function LaborWeek() {
  const { state } = usePortal();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const perDay = days.map((_, day) => {
    const dayShifts = state.shifts.filter((s) => s.day === day && s.state !== "open");
    return dayShifts.reduce((c, s) => {
      const person = state.staff.find((p) => p.id === s.staffId);
      return c + shiftHours(s) * (person?.rate ?? 14);
    }, 0);
  });
  const total = perDay.reduce((a, b) => a + b, 0);
  const max = Math.max(...perDay, 1);

  return (
    <section className="mt-6 rounded-3xl bg-white p-5 shadow-pop">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-[17px] font-extrabold text-ink">This week&apos;s labor</h2>
        <p className="text-[14px] font-extrabold text-ink">
          ${Math.round(total).toLocaleString()}
          <span className="ml-1.5 text-[12px] font-semibold text-ink/40">scheduled</span>
        </p>
      </div>
      <div className="mt-4 flex items-end gap-2 sm:gap-3" style={{ height: 110 }}>
        {perDay.map((v, i) => (
          <Link
            key={i}
            href="/portal/schedule"
            className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5"
            title={`${days[i]} · ${Math.round(v).toLocaleString()}`}
          >
            <span className={`text-[10.5px] font-extrabold tabular-nums ${i === 4 ? "text-green-deep" : "text-ink/35"}`}>
              ${Math.round(v / 100) / 10}k
            </span>
            <motion.span
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(6, (v / max) * 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.04 }}
              className={`w-full max-w-[44px] rounded-t-lg transition-opacity group-hover:opacity-80 ${
                i === 4 ? "bg-green" : "bg-ink/12"
              }`}
            />
            <span className={`text-[11px] font-extrabold ${i === 4 ? "text-green-deep" : "text-ink/40"}`}>
              {days[i]}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Suggestions() {
  const { state, dispatch } = usePortal();
  const devon = state.staff.find((s) => s.id === "devon");
  const dana = state.staff.find((s) => s.id === "dana");
  const sam = state.staff.find((s) => s.id === "sam");
  const sundayOpen = state.shifts.some((s) => s.state === "open" && s.day === 6);

  type Sug = { id: string; icon: string; text: string; sub: string; action?: { label: string; run: () => void } };
  const sugs: Sug[] = [];

  if (devon && sundayOpen && devon.availNote === "Wants more hours")
    sugs.push({
      id: "devon-sunday",
      icon: "⚡",
      text: "Devon wants more hours and Sunday brunch is still open",
      sub: `He's at ${devon.hoursWeek} hrs and says yes ${Math.round(devon.yesRate * 10)} of 10 asks`,
      action: {
        label: "Ask him first",
        run: () =>
          dispatch({
            type: "FEED_PUSH",
            event: { id: uid("f"), kind: "cover", who: "devon", text: "Devon moved to the front of Sunday's list", sub: "he gets the first ask when outreach starts Saturday", when: "Just now" },
          }),
      },
    });

  if (dana && dana.drops90 >= 3)
    sugs.push({
      id: "dana-pattern",
      icon: "📉",
      text: `Dana has dropped ${dana.drops90} shifts in 90 days, three of them Fridays`,
      sub: "Kept off the group chat. A quick check-in usually turns this around",
      action: {
        label: "Remind me tomorrow",
        run: () => dispatch({ type: "NOTE_ADD", text: "Check in with Dana about Fridays." }),
      },
    });

  if (sam && sam.hoursWeek >= 38)
    sugs.push({
      id: "sam-ot",
      icon: "🛡️",
      text: `Sam is at ${sam.hoursWeek} hrs, so pickups would tip him into overtime`,
      sub: "He's excluded from extra-shift asks for the rest of the week",
    });

  const visible = sugs.filter((s) => !state.dismissed.includes(s.id));
  if (visible.length === 0) return null;

  return (
    <section className="rounded-3xl bg-white p-5 shadow-pop">
      <h3 className="flex items-center gap-2 font-display text-[17px] font-extrabold text-ink">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green text-[12px]">✦</span>
        Tagout suggests
      </h3>
      <div className="mt-3 space-y-2.5">
        {visible.map((s) => (
          <div key={s.id} className="rounded-2xl bg-cream/80 p-3.5">
            <p className="text-[13.5px] font-bold leading-snug text-ink">
              <span className="mr-1.5" aria-hidden>{s.icon}</span>
              {s.text}
            </p>
            <p className="mt-1 text-[12px] font-semibold text-ink/50">{s.sub}</p>
            <div className="mt-2.5 flex items-center gap-2">
              {s.action && (
                <button
                  onClick={() => {
                    s.action!.run();
                    dispatch({ type: "SUGGEST_DISMISS", id: s.id });
                  }}
                  className="rounded-full bg-green-dark px-3.5 py-1.5 text-[12.5px] font-extrabold text-white"
                >
                  {s.action.label}
                </button>
              )}
              <button
                onClick={() => dispatch({ type: "SUGGEST_DISMISS", id: s.id })}
                className="px-1 text-[12.5px] font-bold text-ink/40 hover:text-ink"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

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
  const [burst, setBurst] = useState(false);
  const celebrate = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 950);
  };

  const staffOf = (id: string | null) => state.staff.find((s) => s.id === id) ?? null;

  // Friday (day 4) is "tonight" in the demo
  const tonight = useMemo(
    () => state.shifts.filter((s) => s.day === 4 && s.state !== "open"),
    [state.shifts]
  );
  const onClock = state.punches.filter((p) => p.outAt === null);
  const liveRun = state.runs.find((r) => r.state === "live");
  const laborTonight = tonight.reduce((sum, s) => {
    const person = state.staff.find((p) => p.id === s.staffId);
    return sum + shiftHours(s) * (person?.rate ?? 14);
  }, 0);

  const feed = state.feed.filter((f) => (filter === "all" ? true : f.kind === filter));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const needs = needsYouCount(state);

  return (
    <div className="mx-auto max-w-6xl">
      <Burst show={burst} />
      {needs > 0 && (
        <Link
          href="/portal/coverage"
          className="mb-5 flex items-center gap-3 rounded-3xl border-2 border-coral/25 bg-white p-4 shadow-pop transition-transform hover:scale-[1.005]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral font-display text-[16px] font-extrabold text-white">
            {needs}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14.5px] font-extrabold leading-snug text-ink">
              {needs === 1 ? "One thing needs" : `${needs} things need`} your call
            </span>
            <span className="block text-[12.5px] font-semibold text-ink/50">
              approvals, timecards, time off · everything else is handled
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-green px-4 py-2 text-[13px] font-extrabold text-ink">
            Start here →
          </span>
        </Link>
      )}
      {/* greeting */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-extrabold tracking-tight text-ink sm:text-4xl">
            {greeting}, {state.gmFirst} 👋
          </h1>
          <p className="mt-1 text-[14.5px] font-medium text-ink/55">
            Friday night at {state.houseName}. Tagout has the phones. Here&apos;s everything it&apos;s doing.
          </p>
        </div>
        {liveRun ? (
          <Link
            href="/portal/coverage"
            className="flex items-center gap-2 rounded-full bg-pine px-5 py-3 text-[14px] font-extrabold text-paper transition-all hover:shadow-lift"
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
        <StatTile label="Coverage" value={liveRun ? "1 gap" : "100%"} sub={liveRun ? "Tagout's working it" : "every shift confirmed"} tone="mint" live={!!liveRun} />
        <StatTile label="On the clock" value={onClock.length} sub="live time clock" tone="white" live />
        <StatTile label="Labor tonight" value={"$" + Math.round(laborTonight).toLocaleString()} sub="as scheduled" tone="butter" />
        <StatTile label="Tomorrow" value="Ready" sub="45-top at 7 · staffed +2" tone="lav" />
      </div>

      {/* the week's labor, computed from real shifts and real rates */}
      <LaborWeek />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        {/* THE FEED */}
        <section aria-label="Live activity">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="mr-1 font-display text-[20px] font-extrabold text-ink">Activity</h2>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-extrabold transition-colors ${
                  filter === f.key ? "bg-green-dark text-white" : "bg-white text-ink/55 shadow-pop hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {feed.slice(0, 10).map((f, i, arr) => {
                const meta = KIND_META[f.kind];
                const isPast = (w: string) => w === "Yesterday" || w === "Tuesday" || w === "Last Sunday";
                const firstPast = isPast(f.when) && (i === 0 || !isPast(arr[i - 1].when));
                return (
                  <div key={f.id}>
                  {firstPast && (
                    <p className="mb-2 mt-4 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink/30">
                      Earlier this week
                    </p>
                  )}
                  <motion.article
                    layout
                    whileHover={{ y: -2 }}
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
                      <p className="mt-1.5 text-[15.5px] font-bold leading-snug text-ink">{f.text}</p>
                      {f.sub && <p className="mt-0.5 text-[13.5px] font-medium text-ink/50">{f.sub}</p>}
                    </div>
                  </motion.article>
                  </div>
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
            <section className="rounded-3xl bg-pine p-5">
              <p className="flex items-center gap-2 text-[11.5px] font-extrabold uppercase tracking-wide text-green">
                <LiveDot /> Happening right now
              </p>
              <h3 className="mt-2 font-display text-[18px] font-extrabold leading-tight text-paper">
                {liveRun.title}
              </h3>
              <p className="mt-1 text-[13px] font-semibold text-paper/55">{liveRun.sub}</p>
              {(() => {
                const live = liveRun.steps.find((s) => s.state === "live");
                const lastDone = [...liveRun.steps].reverse().find((s) => s.state === "done");
                return (
                  <div className="mt-4">
                    {live && (
                      <p className="flex items-start gap-2 text-[14.5px] font-extrabold leading-snug text-paper">
                        <LiveDot className="mt-1.5" />
                        <span>
                          {live.label}
                          {live.detail && (
                            <span className="block text-[12px] font-medium text-paper/50">{live.detail}</span>
                          )}
                        </span>
                      </p>
                    )}
                    {lastDone && (
                      <p className="mt-2.5 text-[12.5px] font-semibold text-paper/45">
                        Last update: {lastDone.detail ?? lastDone.label}
                      </p>
                    )}
                  </div>
                );
              })()}
              {liveRun.outcome?.includes("needs your approval") && (
                <GreenBtn
                  className="mt-4 w-full"
                  onClick={() => {
                    celebrate();
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
                      <p className="truncate text-[14.5px] font-extrabold text-ink">{p?.first}</p>
                      <p className="text-[12px] font-semibold text-ink/45">
                        {s.role} · {s.start}–{s.end}
                        {s.section ? ` · ${s.section}` : ""}
                      </p>
                    </div>
                    {s.state === "covering" && <Chip tone="butter">Covering…</Chip>}
                  </div>
                );
              })}
            </div>
            <Link href="/portal/schedule" className="mt-3 block text-center text-[12.5px] font-bold text-ink/45 hover:text-ink">
              Open the week →
            </Link>
          </section>

          {/* Tagout suggests: derived from the data, acted on in one tap */}
          <Suggestions />

          {/* up next: the future, one glance */}
          <section className="rounded-3xl bg-white p-5 shadow-pop">
            <h3 className="font-display text-[17px] font-extrabold text-ink">Up next</h3>
            <ul className="mt-2.5 space-y-2">
              <li className="flex items-start gap-2.5 rounded-2xl bg-lav/50 px-3.5 py-2.5">
                <span aria-hidden>📌</span>
                <p className="text-[13px] font-bold leading-snug text-ink">
                  Tomorrow · 45-top at 7
                  <span className="block text-[11.5px] font-semibold text-ink/45">
                    rehearsal dinner, patio · staffed +2, all confirmed
                  </span>
                </p>
              </li>
              <li className="flex items-start gap-2.5 rounded-2xl bg-mint/60 px-3.5 py-2.5">
                <span aria-hidden>🌅</span>
                <p className="text-[13px] font-bold leading-snug text-ink">
                  Sunday brunch · one server shift open
                  <span className="block text-[11.5px] font-semibold text-ink/45">
                    Tagout starts asking Saturday morning, quiet hours respected
                  </span>
                </p>
              </li>
              {state.timeOff.filter((t) => t.state === "approved").map((t) => {
                const p = state.staff.find((s) => s.id === t.staffId);
                return (
                  <li key={t.id} className="flex items-start gap-2.5 rounded-2xl bg-butter/50 px-3.5 py-2.5">
                    <span aria-hidden>🌴</span>
                    <p className="text-[13px] font-bold leading-snug text-ink">
                      {p?.first} off {t.range}
                      <span className="block text-[11.5px] font-semibold text-ink/45">
                        approved · Tagout plans around it
                      </span>
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* note to tomorrow */}
          <section className="rounded-3xl bg-white p-5 shadow-pop">
            <h3 className="font-display text-[17px] font-extrabold text-ink">Shift notes</h3>
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
