"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  usePortal,
  getSession,
  endDemoSession,
  shiftHours,
  uid,
} from "@/lib/portal/store";
import type { Shift } from "@/lib/portal/data";
import { Avatar, Chip, GreenBtn, LiveDot, Burst, Toggle, TagBubble, ThemBubble, StatTile } from "@/components/portal/ui";
import { NavIcon } from "@/components/portal/NavIcon";
import { PovSwitch } from "@/components/portal/PovSwitch";
import { BubbleMark } from "@/components/Wordmark";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TODAY = 4; // the demo world is Friday evening
const DEMO_TODAY = new Date(2026, 7, 29); // Fri Aug 29 in the demo fiction

type Tab = "home" | "board" | "requests" | "me";

/* ---------- time off: tap a day, or tap two to take the whole stretch ---------- */

function fmtRange(a: Date, b: Date | null): string {
  const one = `${MONTHS[a.getMonth()]} ${a.getDate()}`;
  if (!b || +a === +b) return one;
  if (a.getMonth() === b.getMonth()) return `${one}–${b.getDate()}`;
  return `${one} – ${MONTHS[b.getMonth()]} ${b.getDate()}`;
}

function TimeOffPicker({
  workDays,
  onSubmit,
  onCancel,
}: {
  workDays: number[]; // 0=Mon..6=Sun, days this person is usually on
  onSubmit: (range: string, reason: string, days: number) => void;
  onCancel: () => void;
}) {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [reason, setReason] = useState("");

  // five Mon-start weeks beginning with the current demo week
  const grid = useMemo(() => {
    const first = new Date(2026, 7, 25); // Mon Aug 25, the demo week
    return Array.from({ length: 35 }, (_, i) => {
      const d = new Date(first);
      d.setDate(first.getDate() + i);
      return d;
    });
  }, []);

  const pick = (d: Date) => {
    if (!start || (start && end)) {
      setStart(d);
      setEnd(null);
    } else if (+d >= +start) {
      setEnd(d);
    } else {
      setStart(d);
      setEnd(null);
    }
  };

  const inRange = (d: Date) => start && end && +d >= +start && +d <= +end;
  const isEdge = (d: Date) => (start && +d === +start) || (end && +d === +end);
  const dayCount = start ? (end ? Math.round((+end - +start) / 86400000) + 1 : 1) : 0;

  const selectedDates = useMemo(() => {
    if (!start) return [];
    const last = end ?? start;
    const out: Date[] = [];
    for (let d = new Date(start); +d <= +last; d.setDate(d.getDate() + 1)) out.push(new Date(d));
    return out;
  }, [start, end]);

  const conflictDays = useMemo(() => {
    const hit = new Set<number>();
    for (const d of selectedDates) {
      const our = (d.getDay() + 6) % 7;
      if (workDays.includes(our)) hit.add(our);
    }
    return [...hit].sort();
  }, [selectedDates, workDays]);

  const presets: { label: string; a: Date; b: Date }[] = [
    { label: "This weekend", a: new Date(2026, 7, 30), b: new Date(2026, 7, 31) },
    { label: "Next weekend", a: new Date(2026, 8, 5), b: new Date(2026, 8, 6) },
    { label: "Next week", a: new Date(2026, 8, 1), b: new Date(2026, 8, 7) },
  ];

  return (
    <div className="mt-3">
      {/* quick picks */}
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => {
          const active = start && +start === +p.a && end && +end === +p.b;
          return (
            <button
              key={p.label}
              onClick={() => { setStart(p.a); setEnd(p.b); }}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-extrabold transition-colors ${
                active ? "bg-green-dark text-white" : "bg-cream text-ink/55 hover:text-ink"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* calendar */}
      <div className="mt-3 rounded-2xl bg-cream/70 p-3">
        <div className="grid grid-cols-7 gap-y-0.5 text-center">
          {DAYS.map((d) => (
            <span key={d} className="pb-1 text-[10.5px] font-extrabold uppercase tracking-wide text-ink/35">
              {d[0]}
            </span>
          ))}
          {grid.map((d) => {
            const past = +d <= +DEMO_TODAY;
            const edge = isEdge(d);
            const mid = inRange(d) && !edge;
            const firstOfMonth = d.getDate() === 1;
            return (
              <button
                key={+d}
                disabled={past}
                onClick={() => pick(d)}
                aria-label={`${MONTHS[d.getMonth()]} ${d.getDate()}`}
                className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold transition-colors ${
                  past
                    ? "text-ink/20"
                    : edge
                      ? "bg-green-dark text-white"
                      : mid
                        ? "bg-mint text-green-dark"
                        : "text-ink hover:bg-white"
                }`}
              >
                {d.getDate()}
                {firstOfMonth && !edge && !mid && (
                  <span className="absolute -top-1 text-[8px] font-extrabold uppercase text-ink/35">
                    {MONTHS[d.getMonth()]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-center text-[11.5px] font-semibold text-ink/40">
          Tap a day, then tap the last day to take the whole stretch
        </p>
      </div>

      {/* what they picked, and what it means */}
      {start && (
        <div className="mt-3 rounded-2xl bg-white p-3.5 shadow-pop">
          <div className="flex items-center justify-between">
            <p className="text-[14.5px] font-extrabold text-ink">{fmtRange(start, end)}</p>
            <Chip tone="mint">{dayCount} day{dayCount === 1 ? "" : "s"}</Chip>
          </div>
          {conflictDays.length > 0 && (
            <p className="mt-1.5 text-[12px] font-semibold text-ink/50">
              Covers {conflictDays.map((d) => DAY_FULL[d]).join(" & ")} shifts you usually work.
              Tagout lines up cover before the GM approves.
            </p>
          )}
        </div>
      )}

      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (the GM sees this)"
        className="mt-3 w-full rounded-xl border-2 border-ink/10 bg-white px-3.5 py-2.5 text-[14px] font-semibold text-ink outline-none focus:border-green"
      />
      <div className="mt-3 flex gap-2">
        <GreenBtn
          className="flex-1"
          disabled={!start}
          onClick={() => onSubmit(fmtRange(start!, end), reason.trim() || "Personal", dayCount)}
        >
          Send request
        </GreenBtn>
        <button onClick={onCancel} className="px-3 text-[13px] font-bold text-ink/45">
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ---------- the staff app ---------- */

export default function MePage() {
  const { state, dispatch } = usePortal();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("home");
  const [burst, setBurst] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const meId = getSession()?.personId ?? "marisa";
  const me = state.staff.find((s) => s.id === meId) ?? state.staff[0];

  const myShifts = useMemo(
    () =>
      state.shifts
        .filter((s) => s.staffId === me.id && s.state !== "open")
        .sort((a, b) => a.day - b.day),
    [state.shifts, me.id]
  );
  const myPunch = state.punches.find((p) => p.staffId === me.id && p.outAt === null);
  const nextShift = myShifts.find((s) => s.day > TODAY) ?? myShifts[0];
  const weekHrs = myShifts.reduce((n, s) => n + shiftHours(s), 0);
  const weekPay = Math.round(weekHrs * me.rate);
  const openShifts = state.shifts.filter((s) => s.state === "open");
  const myTimeOff = state.timeOff.filter((t) => t.staffId === me.id);
  const myFeed = state.feed.filter((f) => f.who === me.id);
  const workDays = useMemo(() => [...new Set(myShifts.map((s) => s.day))], [myShifts]);

  const liveRun = state.runs.find((r) => r.state === "live");
  const liveStep = liveRun?.steps.find((s) => s.state === "live");
  const askedMe = !!liveStep && liveStep.label.toLowerCase().includes(me.first.toLowerCase());
  const [offerState, setOfferState] = useState<"open" | "yes" | "pass">("open");

  const [claimed, setClaimed] = useState<string[]>([]);
  const [dropTarget, setDropTarget] = useState<Shift | null>(null);
  const [offForm, setOffForm] = useState(false);
  const [pickupTexts, setPickupTexts] = useState(true);

  const logout = () => {
    endDemoSession();
    router.push("/login");
  };

  const celebrate = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 900);
  };

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "home", label: "My week", icon: "home" },
    { key: "board", label: "Pickups", icon: "swap" },
    { key: "requests", label: "Requests", icon: "calendar" },
    { key: "me", label: "Profile", icon: "people" },
  ];

  return (
    <div className="min-h-screen bg-cream pb-28">
      <Burst show={burst} />

      {/* topbar: same anatomy as the GM portal */}
      <header className="sticky top-0 z-30 border-b border-ink/6 bg-cream/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[640px] items-center justify-between gap-3 px-4">
          <button onClick={() => setTab("home")} className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green">
              <BubbleMark size={16} className="text-white" />
            </span>
            <span className="font-display text-[18px] font-extrabold text-ink">tagout</span>
          </button>
          <div className="flex items-center gap-2">
            <PovSwitch current="staff" />
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3 shadow-pop"
              >
                <Avatar person={me} size={32} />
                <div className="hidden leading-tight text-left min-[420px]:block">
                  <p className="text-[13px] font-extrabold text-ink">{me.first}</p>
                  <p className="text-[10.5px] font-bold text-ink/40">{me.role}</p>
                </div>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    role="menu"
                    className="absolute right-0 top-[48px] z-50 w-44 rounded-2xl bg-white p-1.5 shadow-lift"
                  >
                    <button
                      onClick={() => { setTab("me"); setMenuOpen(false); }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-bold text-ink transition-colors hover:bg-cream"
                    >
                      <NavIcon name="people" size={15} />
                      Profile
                    </button>
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-bold text-ink/60 transition-colors hover:bg-cream"
                    >
                      <NavIcon name="logout" size={15} />
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[640px] px-4 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* ---------------- MY WEEK ---------------- */}
            {tab === "home" && (
              <div className="space-y-5">
                <div>
                  <h1 className="font-display text-[30px] font-extrabold tracking-tight text-ink">
                    Good evening, {me.first} 👋
                  </h1>
                  <p className="mt-1.5 text-[15.5px] font-medium text-ink/55">
                    Friday night at {state.houseName} · your week
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <StatTile label="This week" value={`${weekHrs} hrs`} sub={`${myShifts.length} shifts · about $${weekPay}`} tone="mint" />
                  <StatTile
                    label="Next shift"
                    value={nextShift ? `${DAYS[nextShift.day]} ${nextShift.start.replace(":00", "").replace(" ", "")}` : "—"}
                    sub={nextShift ? `${nextShift.role}${nextShift.section ? ` · ${nextShift.section}` : ""}` : "nothing scheduled"}
                  />
                </div>

                {/* on the clock now */}
                {myPunch && (
                  <section className="rounded-3xl bg-pine p-5">
                    <p className="flex items-center gap-2 text-[11.5px] font-extrabold uppercase tracking-wide text-green">
                      <LiveDot /> On the clock
                    </p>
                    <p className="mt-2 font-display text-[22px] font-extrabold text-paper">
                      In at {myPunch.inAt}
                    </p>
                    <p className="mt-1 text-[12.5px] font-semibold text-paper/50">
                      Breaks and clock-outs go through the house tablet. Your card shows here after close.
                    </p>
                  </section>
                )}

                {/* the week */}
                <section className="rounded-3xl bg-white p-5 shadow-pop">
                  <h2 className="font-display text-[16px] font-extrabold text-ink">This week</h2>
                  <div className="mt-3 space-y-2">
                    {myShifts.map((s) => (
                      <div
                        key={s.id}
                        className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 ${
                          s.day === TODAY ? "bg-mint/60" : "bg-cream/70"
                        }`}
                      >
                        <div>
                          <p className="text-[14px] font-extrabold text-ink">{DAY_FULL[s.day]}</p>
                          <p className="text-[12px] font-semibold text-ink/45">
                            {s.start}–{s.end}
                            {s.section ? ` · ${s.section}` : ""}
                          </p>
                        </div>
                        <button
                          onClick={() => { setDropTarget(s); setTab("requests"); }}
                          className="text-[12px] font-bold text-ink/35 hover:text-coral"
                        >
                          Can&apos;t make it?
                        </button>
                      </div>
                    ))}
                    {myShifts.length === 0 && (
                      <p className="rounded-2xl bg-cream/70 px-3.5 py-3 text-[13px] font-semibold text-ink/45">
                        No shifts on the board this week.
                      </p>
                    )}
                    {nextShift && state.events.filter((e) => e.day === nextShift.day).map((e) => (
                      <p key={e.id} className="rounded-2xl bg-lav/50 px-3.5 py-2.5 text-[12.5px] font-bold text-violet-mid">
                        📌 {DAY_FULL[e.day]} · {e.label}{e.note ? ` · ${e.note}` : ""}
                      </p>
                    ))}
                  </div>
                </section>

                {/* my recent activity */}
                {myFeed.length > 0 && (
                  <section className="rounded-3xl bg-white p-5 shadow-pop">
                    <h2 className="font-display text-[16px] font-extrabold text-ink">Recent</h2>
                    <div className="mt-3 space-y-2.5">
                      {myFeed.slice(0, 5).map((f) => (
                        <div key={f.id} className="flex items-start gap-2.5">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/20" />
                          <p className="text-[13px] font-bold leading-snug text-ink">
                            {f.text}
                            <span className="block text-[11.5px] font-semibold text-ink/40">{f.when}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* ---------------- PICKUPS ---------------- */}
            {tab === "board" && (
              <div className="space-y-5">
                <div>
                  <h1 className="font-display text-[30px] font-extrabold tracking-tight text-ink">Pickups</h1>
                  <p className="mt-1.5 text-[15.5px] font-medium text-ink/55">
                    Extra shifts, first come first served
                  </p>
                </div>

                {/* live ask from Tagout: the same thread that's on their phone */}
                {askedMe && liveRun && (
                  <section className="rounded-3xl border-2 border-coral/25 bg-white p-5">
                    <p className="flex items-center gap-2 text-[11.5px] font-extrabold uppercase tracking-wide text-coral">
                      <LiveDot /> Tagout texted you · {liveRun.steps.find((s) => s.state === "live")?.at ?? "just now"}
                    </p>
                    <div className="mt-3 space-y-2 rounded-2xl bg-cream/70 p-3">
                      {liveRun.thread.filter((b) => b.from === "tag").slice(-2).map((b, i) => (
                        <TagBubble key={i}>{b.text}</TagBubble>
                      ))}
                      {offerState === "yes" && <ThemBubble>Yes, I&apos;ll take it 🙌</ThemBubble>}
                      {offerState === "pass" && <ThemBubble>Can&apos;t tonight, sorry!</ThemBubble>}
                    </div>
                    <p className="mt-2 text-[11.5px] font-semibold text-ink/40">
                      Answering here or by text does the same thing.
                    </p>
                    {offerState === "open" && (
                      <div className="mt-4 flex gap-2">
                        <GreenBtn
                          className="flex-1"
                          onClick={() => {
                            setOfferState("yes");
                            celebrate();
                            dispatch({
                              type: "FEED_PUSH",
                              event: { id: uid("f"), kind: "cover", who: me.id, text: `${me.first} said yes to Friday close`, sub: "waiting on GM approval", when: "Just now" },
                            });
                          }}
                        >
                          I&apos;ll take it
                        </GreenBtn>
                        <button
                          onClick={() => {
                            setOfferState("pass");
                            dispatch({
                              type: "FEED_PUSH",
                              event: { id: uid("f"), kind: "cover", who: me.id, text: `${me.first} passed on Friday close`, sub: "Tagout moved to the next person", when: "Just now" },
                            });
                          }}
                          className="rounded-full border-2 border-ink/10 px-5 py-2.5 text-[13.5px] font-extrabold text-ink/55"
                        >
                          Pass
                        </button>
                      </div>
                    )}
                    {offerState === "yes" && (
                      <p className="mt-4 rounded-2xl bg-mint/60 px-4 py-3 text-[13px] font-bold text-green-dark">
                        You said yes. It goes on your week as soon as the GM approves.
                      </p>
                    )}
                    {offerState === "pass" && (
                      <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-[13px] font-bold text-ink/55">
                        You passed. Tagout is asking the next person on the list.
                      </p>
                    )}
                  </section>
                )}

                {/* open shifts anyone can claim */}
                <section className="rounded-3xl bg-white p-5 shadow-pop">
                  <h2 className="font-display text-[16px] font-extrabold text-ink">Open shifts</h2>
                  <p className="mt-0.5 text-[12px] font-semibold text-ink/40">
                    Counts toward your week
                  </p>
                  <div className="mt-3 space-y-2">
                    {openShifts.map((s) => {
                      const mine = claimed.includes(s.id);
                      return (
                        <div key={s.id} className="flex items-center justify-between rounded-2xl bg-cream/70 px-3.5 py-3">
                          <div>
                            <p className="text-[14px] font-extrabold text-ink">
                              {DAY_FULL[s.day]} · {s.start}–{s.end}
                            </p>
                            <p className="text-[12px] font-semibold text-ink/45">
                              {s.role}
                              {s.section ? ` · ${s.section}` : ""}
                            </p>
                          </div>
                          {mine ? (
                            <Chip tone="mint">Requested ✓</Chip>
                          ) : (
                            <button
                              onClick={() => {
                                setClaimed((c) => [...c, s.id]);
                                celebrate();
                                dispatch({
                                  type: "FEED_PUSH",
                                  event: { id: uid("f"), kind: "cover", who: me.id, text: `${me.first} wants the open ${DAY_FULL[s.day]} ${s.role.toLowerCase()} shift`, sub: "tap to approve · first request wins", when: "Just now" },
                                });
                              }}
                              className="rounded-full bg-green px-4 py-2 text-[13px] font-extrabold text-ink transition-transform hover:scale-[1.03]"
                            >
                              Take it
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {openShifts.length === 0 && (
                      <p className="rounded-2xl bg-cream/70 px-3.5 py-3 text-[13px] font-semibold text-ink/45">
                        Nothing open right now. Texts go out the moment something drops.
                      </p>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* ---------------- REQUESTS ---------------- */}
            {tab === "requests" && (
              <div className="space-y-5">
                <div>
                  <h1 className="font-display text-[30px] font-extrabold tracking-tight text-ink">Requests</h1>
                  <p className="mt-1.5 text-[15.5px] font-medium text-ink/55">
                    Time off, drops, and where they stand
                  </p>
                </div>

                {/* time off */}
                <section className="rounded-3xl bg-white p-5 shadow-pop">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-[16px] font-extrabold text-ink">Time off</h2>
                    {!offForm && (
                      <button
                        onClick={() => setOffForm(true)}
                        className="rounded-full bg-green px-3.5 py-1.5 text-[12.5px] font-extrabold text-ink"
                      >
                        + Request
                      </button>
                    )}
                  </div>
                  {offForm && (
                    <TimeOffPicker
                      workDays={workDays}
                      onCancel={() => setOffForm(false)}
                      onSubmit={(range, reason, days) => {
                        dispatch({ type: "TIMEOFF_REQUEST", staffId: me.id, range, reason });
                        dispatch({
                          type: "FEED_PUSH",
                          event: { id: uid("f"), kind: "swap", who: me.id, text: `${me.first} requested ${range} off`, sub: `${days} day${days === 1 ? "" : "s"} · ${reason.toLowerCase()}`, when: "Just now" },
                        });
                        setOffForm(false);
                        celebrate();
                      }}
                    />
                  )}
                  <div className="mt-3 space-y-2">
                    {myTimeOff.map((t) => (
                      <div key={t.id} className="flex items-center justify-between rounded-2xl bg-cream/70 px-3.5 py-2.5">
                        <div>
                          <p className="text-[14px] font-extrabold text-ink">{t.range}</p>
                          <p className="text-[12px] font-semibold text-ink/45">{t.reason}</p>
                        </div>
                        <Chip tone={t.state === "approved" ? "mint" : t.state === "denied" ? "blush" : "butter"}>
                          {t.state === "approved" ? "Approved" : t.state === "denied" ? "Declined" : "Pending"}
                        </Chip>
                      </div>
                    ))}
                    {myTimeOff.length === 0 && !offForm && (
                      <p className="rounded-2xl bg-cream/70 px-3.5 py-3 text-[13px] font-semibold text-ink/45">
                        No requests yet.
                      </p>
                    )}
                  </div>
                </section>

                {/* drop a shift */}
                <section className="rounded-3xl bg-white p-5 shadow-pop">
                  <h2 className="font-display text-[16px] font-extrabold text-ink">Can&apos;t make a shift?</h2>
                  <p className="mt-0.5 text-[12px] font-semibold text-ink/40">
                    Tagout starts texting the eligible list the moment you drop it.
                  </p>
                  <div className="mt-3 space-y-2">
                    {myShifts.filter((s) => s.day >= TODAY).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setDropTarget(dropTarget?.id === s.id ? null : s)}
                        className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left ${
                          dropTarget?.id === s.id ? "bg-blush/50" : "bg-cream/70"
                        }`}
                      >
                        <span className="text-[14px] font-extrabold text-ink">
                          {DAY_FULL[s.day]} · {s.start}–{s.end}
                        </span>
                        <span className="text-[12px] font-bold text-ink/35">
                          {dropTarget?.id === s.id ? "Selected" : "Select"}
                        </span>
                      </button>
                    ))}
                  </div>
                  {dropTarget && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          dispatch({ type: "SHIFT_UPSERT", shift: { ...dropTarget, state: "open" } });
                          dispatch({
                            type: "FEED_PUSH",
                            event: { id: uid("f"), kind: "cover", who: me.id, text: `${me.first} dropped ${DAY_FULL[dropTarget.day]} ${dropTarget.start}–${dropTarget.end}`, sub: "Tagout is texting the eligible list", when: "Just now" },
                          });
                          setDropTarget(null);
                        }}
                        className="flex-1 rounded-full bg-coral px-5 py-2.5 text-[13.5px] font-extrabold text-white"
                      >
                        Drop it · Tagout finds cover
                      </button>
                      <button
                        onClick={() => setDropTarget(null)}
                        className="rounded-full border-2 border-ink/10 px-4 py-2.5 text-[13.5px] font-extrabold text-ink/55"
                      >
                        Keep it
                      </button>
                    </div>
                  )}
                </section>

                {/* request log */}
                <section className="rounded-3xl bg-white p-5 shadow-pop">
                  <h2 className="font-display text-[16px] font-extrabold text-ink">History</h2>
                  <div className="mt-3 space-y-2.5">
                    {myFeed.length === 0 && (
                      <p className="text-[13px] font-semibold text-ink/45">Your requests and pickups land here.</p>
                    )}
                    {myFeed.map((f) => (
                      <div key={f.id} className="flex items-start gap-2.5">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/20" />
                        <p className="text-[13px] font-bold leading-snug text-ink">
                          {f.text}
                          <span className="block text-[11.5px] font-semibold text-ink/40">
                            {f.sub && f.sub.includes(f.when) ? f.sub : f.sub ? `${f.sub} · ${f.when}` : f.when}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* ---------------- PROFILE ---------------- */}
            {tab === "me" && (
              <div className="space-y-5">
                <section className="rounded-3xl bg-white p-5 shadow-pop">
                  <div className="flex items-center gap-3.5">
                    <Avatar person={me} size={56} />
                    <div>
                      <h1 className="font-display text-[20px] font-extrabold text-ink">{me.name}</h1>
                      <p className="text-[13px] font-semibold text-ink/45">
                        {me.role} · since {me.since}
                      </p>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-3 gap-3">
                  <StatTile label="This week" value={weekHrs} sub="hours" />
                  <StatTile label="Your rate" value={`$${me.rate}`} sub="per hour" />
                  <StatTile label="Pickups" value={me.picks90} sub="last 90 days" tone="mint" />
                </div>

                {/* availability */}
                <section className="rounded-3xl bg-white p-5 shadow-pop">
                  <h2 className="font-display text-[16px] font-extrabold text-ink">Availability</h2>
                  <p className="mt-0.5 text-[12px] font-semibold text-ink/40">
                    Tagout only texts you about shifts you can actually work.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Anytime", "Not Sundays", "Weeknights only", "Days only"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => dispatch({ type: "STAFF_PATCH", id: me.id, patch: { availNote: opt } })}
                        className={`rounded-full px-3.5 py-2 text-[13px] font-extrabold transition-colors ${
                          me.availNote === opt ? "bg-green-dark text-white" : "bg-cream text-ink/55 hover:text-ink"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </section>

                {/* pickup texts */}
                <section className="rounded-3xl bg-white p-5 shadow-pop">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-[16px] font-extrabold text-ink">Pickup texts</h2>
                      <p className="mt-0.5 text-[12px] font-semibold text-ink/40">
                        Off means no extra-shift offers, ever. Schedule changes still come through.
                      </p>
                    </div>
                    <Toggle on={pickupTexts} onChange={() => setPickupTexts((v) => !v)} label="Pickup texts" />
                  </div>
                </section>

                {/* certs + contact */}
                <section className="rounded-3xl bg-white p-5 shadow-pop">
                  <h2 className="font-display text-[16px] font-extrabold text-ink">On file</h2>
                  <div className="mt-3 space-y-2 text-[13.5px] font-semibold text-ink/60">
                    <p className="flex justify-between"><span>Phone</span><span className="font-extrabold text-ink">{me.phone}</span></p>
                    <p className="flex justify-between"><span>Certifications</span><span className="font-extrabold text-ink">{me.certs.join(", ") || "None"}</span></p>
                    <p className="flex justify-between"><span>Says yes</span><span className="font-extrabold text-ink">{Math.round(me.yesRate * 10)} of 10 asks</span></p>
                  </div>
                </section>

                <button
                  onClick={logout}
                  className="w-full rounded-2xl border-2 border-ink/10 py-3 text-[13.5px] font-extrabold text-ink/55"
                >
                  Log out
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* bottom tabs: same bar as the GM portal */}
      <nav
        aria-label="Staff app"
        style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        className="fixed inset-x-3 z-40 mx-auto flex max-w-[640px] justify-around rounded-[24px] bg-pine px-2 py-2"
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); window.scrollTo(0, 0); }}
            className={`relative flex flex-col items-center gap-1 rounded-2xl px-4 py-1.5 text-[11px] font-extrabold ${
              tab === t.key ? "text-ink" : "text-paper/60"
            }`}
          >
            {tab === t.key && (
              <motion.span
                layoutId="me-tab-pill"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-2xl bg-green"
              />
            )}
            <span className="relative"><NavIcon name={t.icon} size={17} /></span>
            <span className="relative">{t.label}</span>
            {t.key === "board" && askedMe && offerState === "open" && (
              <span className="absolute -top-1 right-1 z-10 h-2.5 w-2.5 rounded-full bg-coral" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
