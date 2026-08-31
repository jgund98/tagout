"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { usePortal, shiftHours, toMins, uid, to24h, from24h } from "@/lib/portal/store";
import { Avatar, Burst, Chip, GreenBtn, GhostBtn, PageTitle, LiveDot } from "@/components/portal/ui";
import { DAYS, type Role, type Shift, type Staff, type HouseEvent, type EventKind } from "@/lib/portal/data";

const EVENT_KINDS: EventKind[] = ["Large party", "Live music", "Buyout", "Holiday", "Other"];

/** the display line every surface renders, derived from the structured fields */
function eventLabel(kind: EventKind, size: number, time24: string, other: string): string {
  const t = from24h(time24).replace(":00 ", " ");
  if (kind === "Large party") return `${size}-top · ${t}`;
  if (kind === "Other") return `${other.trim() || "Event"} · ${t}`;
  return `${kind} · ${t}`;
}

const ROLE_TONES: Record<Role, string> = {
  Manager: "bg-pine text-paper",
  Server: "bg-mint text-green-dark",
  Bartender: "bg-lav text-violet-mid",
  Host: "bg-blush text-coral",
  "Line cook": "bg-amber/90 text-ink",
  Prep: "bg-amber/90 text-ink",
  Busser: "bg-lav text-violet-mid",
};

type Editing = { staffId: string; day: number; shift?: Shift };
type EventEdit = {
  id?: string;
  day: number;
  kind: EventKind;
  time24: string;
  size: number;
  room: string | null;
  other: string;
  note: string;
};

const blankEvent = (day: number): EventEdit => ({
  day,
  kind: "Large party",
  time24: "19:00",
  size: 20,
  room: null,
  other: "",
  note: "",
});

const editEvent = (e: HouseEvent): EventEdit => ({
  id: e.id,
  day: e.day,
  kind: e.kind,
  time24: to24h(e.time),
  size: e.size ?? 20,
  room: e.room,
  other: e.kind === "Other" ? e.label.split("·")[0].trim() : "",
  note: e.note,
});

export default function SchedulePage() {
  const { state, dispatch } = usePortal();
  const [editing, setEditing] = useState<Editing | null>(null);
  const [toast, setToast] = useState("");
  const [burst, setBurst] = useState(false);
  const [eventEdit, setEventEdit] = useState<EventEdit | null>(null);
  const [view, setView] = useState<"board" | "coverage" | "day">("board");
  const [dayView, setDayView] = useState(4);

  const active = state.staff.filter((s) => s.status === "active" || s.status === "pending");
  const shiftsFor = (staffId: string, day: number) =>
    state.shifts.filter((s) => s.staffId === staffId && s.day === day && s.state !== "open");

  const hoursOf = (staffId: string) =>
    state.shifts.filter((s) => s.staffId === staffId && s.state !== "open").reduce((h, s) => h + shiftHours(s), 0);

  const otRule = state.rules.find((r) => r.id === "ot")?.on;
  const minorRule = state.rules.find((r) => r.id === "minor")?.on;

  const warnings = useMemo(() => {
    const list: string[] = [];
    if (otRule) {
      for (const p of active) {
        const h = hoursOf(p.id);
        if (h > 40) list.push(`${p.first} is at ${Math.round(h)} hrs, past the 40-hour guard.`);
      }
    }
    if (minorRule) {
      for (const s of state.shifts) {
        const p = state.staff.find((x) => x.id === s.staffId);
        if (p?.minor && toMins(s.end) > toMins("10:00 PM") && toMins(s.end) < toMins("11:59 PM"))
          list.push(`${p.first} is 17, and this ${DAYS[s.day]} shift runs past the 10 PM curfew.`);
      }
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.shifts, otRule, minorRule]);

  const draftCount = state.shifts.filter((s) => s.state === "draft").length;

  // the board is live: anything that changes it while you're looking says so
  const shiftsKey = JSON.stringify(state.shifts);
  const firstRender = useRef(true);
  const lastKey = useRef(shiftsKey);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      lastKey.current = shiftsKey;
      return;
    }
    if (shiftsKey !== lastKey.current) {
      lastKey.current = shiftsKey;
      setToast("Board updated live");
      const t = setTimeout(() => setToast(""), 2600);
      return () => clearTimeout(t);
    }
  }, [shiftsKey]);

  const publish = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 950);
    dispatch({ type: "PUBLISH_WEEK" });
    dispatch({
      type: "FEED_PUSH",
      event: {
        id: uid("f"),
        kind: "rule",
        who: null,
        text: "Schedule published",
        sub: "sent by text to everyone on the week",
        when: "Just now",
      },
    });
    setToast("Published. Schedules sent by text.");
    setTimeout(() => setToast(""), 3500);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <Burst show={burst} />
      <PageTitle
        title="Schedule"
        sub="Week of Aug 25 – 31"
        right={
          <div className="flex items-center gap-2">
            <span className="mr-1 flex items-center gap-1.5 text-[12.5px] font-extrabold text-green-deep">
              <LiveDot /> Live board
            </span>
            <GreenBtn onClick={publish} disabled={state.weekPublished && draftCount === 0}>
              {state.weekPublished && draftCount === 0 ? "Published ✓" : `Publish week${draftCount ? ` (${draftCount} new)` : ""}`}
            </GreenBtn>
          </div>
        }
      />

      {/* conflicts the rules caught */}
      {warnings.length > 0 && (
        <div className="mb-4 space-y-2">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-2xl border-2 border-amber/60 bg-white px-4 py-2.5">
              <span aria-hidden>⚠️</span>
              <p className="text-[13px] font-bold text-ink">{w}</p>
            </div>
          ))}
        </div>
      )}

      {/* mobile: one day at a time, like an app */}
      <div className="lg:hidden">
        <MobileDayView
          active={active}
          shiftsFor={shiftsFor}
          onEdit={(e) => setEditing(e)}
          events={state.events}
          staff={state.staff}
          onEvent={(e) => setEventEdit(e)}
        />
      </div>

      {/* desktop controls: view switcher + board state */}
      <div className="mb-3 hidden items-center justify-between lg:flex">
        <div className="flex items-center gap-0.5 rounded-full bg-white p-1 shadow-pop">
          {([
            ["board", "Board"],
            ["coverage", "Coverage"],
            ["day", "Day"],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setView(k)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-extrabold transition-colors ${
                view === k ? "bg-pine text-paper" : "text-ink/45 hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {draftCount > 0 && (
          <Chip tone="butter">{draftCount} draft{draftCount === 1 ? "" : "s"} unpublished</Chip>
        )}
      </div>

      {/* desktop: the full board */}
      <div className={`overflow-x-auto rounded-[28px] bg-white p-3 shadow-pop ${view === "board" ? "hidden lg:block" : "hidden"}`}>
        <table className="w-full min-w-[880px] border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-[180px] bg-white px-3 py-2.5 text-left text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">
                Crew
              </th>
              {DAYS.map((d, i) => (
                <th key={d} className="px-1.5 py-2.5 text-left">
                  <span className={`text-[11.5px] font-extrabold uppercase tracking-wide ${i === 4 ? "text-green-deep" : "text-ink/40"}`}>
                    {d}
                    {i === 4 && " · tonight"}
                  </span>
                  {state.events.filter((e) => e.day === i).map((e) => (
                    <button
                      key={e.id}
                      title={e.note}
                      onClick={() => setEventEdit(editEvent(e))}
                      className="ml-1.5 rounded-md bg-lav px-1.5 py-0.5 text-[10px] font-extrabold text-violet-mid hover:bg-violet/25"
                    >
                      {e.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setEventEdit(blankEvent(i))}
                    aria-label={`Add event on ${d}`}
                    className="ml-1 rounded-md px-1 text-[11px] font-extrabold text-ink/20 hover:text-green-deep"
                  >
                    +
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {active.map((p) => {
              const h = hoursOf(p.id);
              return (
                <tr key={p.id} className="border-t border-ink/5">
                  <td className="sticky left-0 z-10 bg-white px-3 py-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar person={p} size={34} />
                      <div className="leading-tight">
                        <p className="text-[13.5px] font-extrabold text-ink">{p.first}</p>
                        <p className={`text-[11px] font-bold ${h > 40 && otRule ? "text-coral" : "text-ink/40"}`}>
                          {Math.round(h)} / 40 hrs
                        </p>
                      </div>
                    </div>
                  </td>
                  {DAYS.map((_, day) => {
                    const cell = shiftsFor(p.id, day);
                    return (
                      <td key={day} className={`px-1.5 py-2 align-top ${day === 4 ? "bg-mint/25" : ""}`}>
                        {cell.length === 0 ? (
                          <button
                            aria-label={`Add shift for ${p.first} on ${DAYS[day]}`}
                            onClick={() => setEditing({ staffId: p.id, day })}
                            className="h-[46px] w-full rounded-xl border-2 border-dashed border-ink/8 text-[16px] font-bold text-transparent transition-colors hover:border-green/50 hover:text-green"
                          >
                            +
                          </button>
                        ) : (
                          cell.map((s) => (
                            <motion.button
                              key={s.id}
                              layout
                              onClick={() => setEditing({ staffId: p.id, day, shift: s })}
                              className={`relative block w-full rounded-xl px-2 py-1.5 text-left transition-shadow hover:shadow-pop ${ROLE_TONES[s.role]} ${
                                s.state === "draft" ? "opacity-70 ring-2 ring-dashed ring-ink/20" : ""
                              }`}
                            >
                              <span className="block text-[11.5px] font-extrabold leading-tight">
                                {s.start.replace(":00", "")}–{s.end.replace(":00", "")}
                              </span>
                              <span className="block text-[10px] font-bold opacity-70">
                                {s.section ?? s.role}
                                {s.state === "draft" && " · draft"}
                              </span>
                              {s.state === "covering" && (
                                <span className="absolute -right-1 -top-1"><LiveDot /></span>
                              )}
                            </motion.button>
                          ))
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-ink/8">
              <td className="sticky left-0 z-10 bg-white px-3 py-2.5 text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">
                Day totals
              </td>
              {DAYS.map((_, day) => {
                const dayShifts = state.shifts.filter((s) => s.day === day && s.state !== "open");
                const hrs = dayShifts.reduce((h, s) => h + shiftHours(s), 0);
                const cost = dayShifts.reduce((c, s) => {
                  const person = state.staff.find((p) => p.id === s.staffId);
                  return c + shiftHours(s) * (person?.rate ?? 14);
                }, 0);
                return (
                  <td key={day} className={`px-1.5 py-2.5 ${day === 4 ? "bg-mint/25" : ""}`}>
                    <p className="text-[12px] font-extrabold text-ink">{Math.round(hrs)} hrs</p>
                    <p className="text-[11px] font-bold text-ink/40">${Math.round(cost).toLocaleString()}</p>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* coverage view: staffing depth per role per day, one glance */}
      {view === "coverage" && (
        <div className="hidden overflow-x-auto rounded-[28px] bg-white p-3 shadow-pop lg:block">
          <table className="w-full min-w-[880px] border-collapse">
            <thead>
              <tr>
                <th className="w-[160px] px-3 py-2.5 text-left text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">
                  Role
                </th>
                {DAYS.map((d, i) => (
                  <th key={d} className={`px-1.5 py-2.5 text-left text-[11.5px] font-extrabold uppercase tracking-wide ${i === 4 ? "text-green-deep" : "text-ink/40"}`}>
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from(new Set(state.shifts.filter((s) => s.state !== "open").map((s) => s.role))).map((role) => (
                <tr key={role} className="border-t border-ink/5">
                  <td className="px-3 py-2.5">
                    <span className={`rounded-lg px-2 py-1 text-[12px] font-extrabold ${ROLE_TONES[role]}`}>{role}</span>
                  </td>
                  {DAYS.map((_, day) => {
                    const cell = state.shifts.filter((s) => s.day === day && s.role === role && s.state !== "open");
                    const hrs = cell.reduce((h, s) => h + shiftHours(s), 0);
                    return (
                      <td key={day} className={`px-1.5 py-2 ${day === 4 ? "bg-mint/25" : ""}`}>
                        <div className={`rounded-xl px-2.5 py-2 ${cell.length === 0 ? "bg-cream/60" : cell.length === 1 ? "bg-amber/30" : "bg-mint/60"}`}>
                          <p className="text-[13.5px] font-extrabold text-ink">{cell.length === 0 ? "—" : cell.length}</p>
                          <p className="text-[10.5px] font-bold text-ink/40">{cell.length ? `${Math.round(hrs)} hrs` : "nobody on"}</p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t-2 border-ink/8">
                <td className="px-3 py-2.5 text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">On the floor</td>
                {DAYS.map((_, day) => {
                  const n = state.shifts.filter((s) => s.day === day && s.state !== "open").length;
                  const open = state.shifts.filter((s) => s.day === day && s.state === "open").length;
                  return (
                    <td key={day} className={`px-1.5 py-2.5 ${day === 4 ? "bg-mint/25" : ""}`}>
                      <p className="text-[12.5px] font-extrabold text-ink">{n} shifts</p>
                      {open > 0 && <p className="text-[11px] font-bold text-coral">{open} open</p>}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
          <p className="px-3 pb-1 pt-2 text-[12px] font-semibold text-ink/40">
            Single coverage shows amber. An empty cell means that role isn&apos;t scheduled that day.
          </p>
        </div>
      )}

      {/* day view: everyone's bars on one timeline */}
      {view === "day" && (
        <div className="hidden rounded-[28px] bg-white p-5 shadow-pop lg:block">
          <div className="flex items-center gap-1.5">
            {DAYS.map((d, i) => (
              <button
                key={d}
                onClick={() => setDayView(i)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-extrabold transition-colors ${
                  dayView === i ? "bg-green-dark text-white" : "bg-cream text-ink/50 hover:text-ink"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          {(() => {
            const AXIS_START = 8 * 60;
            const AXIS_SPAN = 16 * 60;
            const dayShifts = state.shifts
              .filter((s) => s.day === dayView && s.state !== "open")
              .sort((a, b) => toMins(a.start) - toMins(b.start));
            return (
              <div className="mt-5">
                <div className="relative mb-2 ml-[150px] h-4">
                  {["8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p", "12a"].map((t, i) => (
                    <span
                      key={t}
                      className="absolute -translate-x-1/2 text-[10.5px] font-bold text-ink/35"
                      style={{ left: `${(i / 8) * 100}%` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="space-y-1.5">
                  {dayShifts.map((s) => {
                    const p = state.staff.find((x) => x.id === s.staffId);
                    const left = Math.max(0, ((toMins(s.start) - AXIS_START) / AXIS_SPAN) * 100);
                    const width = Math.min(100 - left, ((toMins(s.end) - toMins(s.start)) / AXIS_SPAN) * 100);
                    return (
                      <div key={s.id} className="flex items-center">
                        <div className="flex w-[150px] shrink-0 items-center gap-2 pr-3">
                          <Avatar person={p ?? null} size={26} />
                          <p className="truncate text-[12.5px] font-extrabold text-ink">{p?.first}</p>
                        </div>
                        <div className="relative h-9 flex-1 rounded-lg bg-cream/60">
                          {[...Array(9)].map((_, i) => (
                            <span key={i} className="absolute inset-y-0 w-px bg-ink/4" style={{ left: `${(i / 8) * 100}%` }} />
                          ))}
                          <div
                            className={`absolute inset-y-1 flex items-center rounded-lg px-2.5 ${ROLE_TONES[s.role]}`}
                            style={{ left: `${left}%`, width: `${width}%` }}
                          >
                            <span className="truncate text-[11px] font-extrabold">
                              {s.start.replace(":00", "")}–{s.end.replace(":00", "")}
                              {s.section ? ` · ${s.section}` : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {dayShifts.length === 0 && (
                    <p className="rounded-2xl bg-cream/60 px-4 py-6 text-center text-[13px] font-semibold text-ink/45">
                      Nothing scheduled {DAYS[dayView]}.
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {view === "board" && (
        <p className="mt-3 hidden flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-semibold text-ink/40 lg:flex">
          <span className="flex items-center gap-1.5"><LiveDot /> Tagout is covering it live</span>
          <span>Dashed = draft, goes out when you publish</span>
          <span>Tap any block to change it · tap an empty day to add a shift</span>
        </p>
      )}

      {/* editor */}
      <AnimatePresence>
        {editing && (
          <ShiftEditor
            key="editor"
            editing={editing}
            staff={state.staff}
            onClose={() => setEditing(null)}
            onSave={(shift) => {
              dispatch({ type: "SHIFT_UPSERT", shift });
              setEditing(null);
            }}
            onDelete={(id) => {
              dispatch({ type: "SHIFT_DELETE", id });
              dispatch({
                type: "FEED_PUSH",
                event: { id: uid("f"), kind: "cover", who: editing.staffId, text: `You removed a ${DAYS[editing.day]} shift`, sub: "nobody gets asked, the night just runs lighter", when: "Just now" },
              });
              setEditing(null);
            }}
            onDropCover={(id) => {
              const shift = state.shifts.find((s) => s.id === id);
              if (shift) dispatch({ type: "SHIFT_UPSERT", shift: { ...shift, state: "open", staffId: shift.staffId } });
              dispatch({
                type: "FEED_PUSH",
                event: { id: uid("f"), kind: "cover", who: editing.staffId, text: `Coverage started for a ${DAYS[editing.day]} shift`, sub: "Tagout is ranking the eligible list now", when: "Just now" },
              });
              setEditing(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* event editor */}
      <AnimatePresence>
        {eventEdit && (
          <motion.div
            key="event-editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setEventEdit(null)}
          >
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-lift"
              role="dialog"
              aria-label="Event"
            >
              <p className="font-display text-[20px] font-extrabold text-ink">
                {eventEdit.id ? "Edit event" : "New event"}
              </p>

              <p className="mt-4 text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Day</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {DAYS.map((d, i) => (
                  <button
                    key={d}
                    onClick={() => setEventEdit({ ...eventEdit, day: i })}
                    className={`rounded-full px-3 py-1.5 text-[12.5px] font-extrabold transition-colors ${
                      eventEdit.day === i ? "bg-green-dark text-white" : "bg-cream text-ink/55"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <p className="mt-3.5 text-[12px] font-extrabold uppercase tracking-wide text-ink/40">What is it</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {EVENT_KINDS.map((k) => (
                  <button
                    key={k}
                    onClick={() => setEventEdit({ ...eventEdit, kind: k })}
                    className={`rounded-full px-3 py-1.5 text-[12.5px] font-extrabold transition-colors ${
                      eventEdit.kind === k ? "bg-green-dark text-white" : "bg-cream text-ink/55"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
              {eventEdit.kind === "Other" && (
                <input
                  value={eventEdit.other}
                  onChange={(e) => setEventEdit({ ...eventEdit, other: e.target.value })}
                  placeholder="Name it, like Wine dinner"
                  className="mt-2 w-full rounded-xl border-2 border-ink/10 px-3.5 py-2.5 text-[14.5px] font-bold text-ink outline-none focus:border-green"
                />
              )}

              <div className="mt-3.5 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Starts</p>
                  <input
                    type="time"
                    value={eventEdit.time24}
                    onChange={(e) => setEventEdit({ ...eventEdit, time24: e.target.value })}
                    className="mt-1.5 h-11 w-full min-w-0 appearance-none rounded-xl border-2 border-ink/10 bg-white px-3 text-[15px] font-bold text-ink outline-none focus:border-green [&::-webkit-date-and-time-value]:text-left"
                  />
                </div>
                {eventEdit.kind === "Large party" && (
                  <div>
                    <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Party size</p>
                    <div className="mt-1.5 flex h-11 items-center justify-between rounded-xl border-2 border-ink/10 px-2">
                      <button
                        onClick={() => setEventEdit({ ...eventEdit, size: Math.max(6, eventEdit.size - 5) })}
                        className="h-8 w-8 rounded-lg bg-cream text-[16px] font-extrabold text-ink"
                        aria-label="Smaller party"
                      >
                        −
                      </button>
                      <span className="text-[15px] font-extrabold text-ink">{eventEdit.size}</span>
                      <button
                        onClick={() => setEventEdit({ ...eventEdit, size: Math.min(200, eventEdit.size + 5) })}
                        className="h-8 w-8 rounded-lg bg-cream text-[16px] font-extrabold text-ink"
                        aria-label="Bigger party"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <p className="mt-3.5 text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Where</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {["Dining room", "Patio", "Bar"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setEventEdit({ ...eventEdit, room: eventEdit.room === r ? null : r })}
                    className={`rounded-full px-3 py-1.5 text-[12.5px] font-extrabold transition-colors ${
                      eventEdit.room === r ? "bg-green-dark text-white" : "bg-cream text-ink/55"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <input
                value={eventEdit.note}
                onChange={(e) => setEventEdit({ ...eventEdit, note: e.target.value })}
                placeholder="Note for the crew (optional)"
                className="mt-3.5 w-full rounded-xl border-2 border-ink/10 px-3.5 py-2.5 text-[14px] font-semibold text-ink outline-none focus:border-green"
              />

              <div className="mt-4 flex items-center gap-2">
                <GreenBtn
                  className="flex-1"
                  disabled={eventEdit.kind === "Other" && !eventEdit.other.trim()}
                  onClick={() => {
                    if (eventEdit.id) dispatch({ type: "EVENT_REMOVE", id: eventEdit.id });
                    dispatch({
                      type: "EVENT_ADD",
                      event: {
                        day: eventEdit.day,
                        kind: eventEdit.kind,
                        time: from24h(eventEdit.time24),
                        size: eventEdit.kind === "Large party" ? eventEdit.size : null,
                        room: eventEdit.room,
                        label: eventLabel(eventEdit.kind, eventEdit.size, eventEdit.time24, eventEdit.other),
                        note: eventEdit.note.trim(),
                      },
                    });
                    setEventEdit(null);
                  }}
                >
                  Save event
                </GreenBtn>
                {eventEdit.id && (
                  <button
                    onClick={() => {
                      dispatch({ type: "EVENT_REMOVE", id: eventEdit.id! });
                      setEventEdit(null);
                    }}
                    className="rounded-full border-2 border-blush px-4 py-2.5 text-[13.5px] font-extrabold text-coral hover:bg-blush/40"
                  >
                    Remove
                  </button>
                )}
                <button onClick={() => setEventEdit(null)} className="px-2 text-[13.5px] font-bold text-ink/45">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-pine px-5 py-3 text-[13.5px] font-bold text-paper shadow-lift lg:bottom-8"
          >
            {toast} ✓
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileDayView({
  active,
  shiftsFor,
  onEdit,
  events,
  staff,
  onEvent,
}: {
  active: Staff[];
  shiftsFor: (staffId: string, day: number) => Shift[];
  onEdit: (e: Editing) => void;
  events: HouseEvent[];
  staff: Staff[];
  onEvent: (e: EventEdit) => void;
}) {
  const [day, setDay] = useState(4); // tonight
  const [mode, setMode] = useState<"day" | "person">("day");
  const [personId, setPersonId] = useState(active[0]?.id ?? "");
  const person = active.find((p) => p.id === personId) ?? active[0];
  const all = active.flatMap((p) => DAYS.map((_, i) => shiftsFor(p.id, i).map(() => i)).flat());
  const counts = DAYS.map((_, i) => all.filter((d) => d === i).length);
  const dayShifts = active.flatMap((p) => shiftsFor(p.id, day));
  const dayHrs = dayShifts.reduce((h, s) => h + shiftHours(s), 0);
  const dayCost = dayShifts.reduce((c, s) => {
    const person = staff.find((p) => p.id === s.staffId);
    return c + shiftHours(s) * (person?.rate ?? 14);
  }, 0);
  const summary = `${dayShifts.length} on · ${Math.round(dayHrs)} hrs · $${Math.round(dayCost).toLocaleString()} scheduled`;
  if (mode === "person") {
    return (
      <div>
        <ModeToggle mode={mode} setMode={setMode} />
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
          {active.map((p) => (
            <button
              key={p.id}
              onClick={() => setPersonId(p.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 transition-colors ${
                person?.id === p.id ? "bg-green-dark text-white" : "bg-white text-ink shadow-pop"
              }`}
            >
              <Avatar person={p} size={28} />
              <span className="text-[13px] font-extrabold">{p.first}</span>
            </button>
          ))}
        </div>
        {person && (
          <div className="mt-3 space-y-2">
            {DAYS.map((d, i) => {
              const cell = shiftsFor(person.id, i);
              return cell.length === 0 ? (
                <button
                  key={d}
                  onClick={() => onEdit({ staffId: person.id, day: i })}
                  className="flex w-full items-center justify-between rounded-2xl border-2 border-dashed border-ink/8 px-4 py-3 text-left"
                >
                  <span className="text-[13.5px] font-bold text-ink/35">{d} · off</span>
                  <span className="text-[16px] font-extrabold text-green">+</span>
                </button>
              ) : (
                cell.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onEdit({ staffId: person.id, day: i, shift: s })}
                    className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left shadow-pop active:scale-[0.99]"
                  >
                    <span>
                      <span className="block text-[14px] font-extrabold text-ink">
                        {d} · {s.start}–{s.end}
                      </span>
                      <span className="block text-[12px] font-semibold text-ink/45">
                        {s.section ?? s.role}
                        {s.state === "draft" && " · draft"}
                        {s.note ? ` · ${s.note}` : ""}
                      </span>
                    </span>
                    <span className={`rounded-lg rounded-bl-[4px] px-2.5 py-1 text-[11px] font-extrabold ${ROLE_TONES[s.role]}`}>
                      {s.role}
                    </span>
                  </button>
                ))
              );
            })}
            <p className="text-right text-[12.5px] font-bold text-ink/40">
              {person.first}: {Math.round(DAYS.flatMap((_, i) => shiftsFor(person.id, i)).reduce((h, s) => h + shiftHours(s), 0))} hrs this week
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <ModeToggle mode={mode} setMode={setMode} />
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {DAYS.map((d, i) => {
          const n = counts[i];
          return (
            <button
              key={d}
              onClick={() => setDay(i)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-extrabold transition-colors ${
                day === i ? "bg-green-dark text-white" : "bg-white text-ink/50 shadow-pop"
              }`}
            >
              {d}
              <span className={`text-[11px] font-bold ${day === i ? "text-white/60" : "text-ink/30"}`}>{n}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2.5 text-[13px] font-bold text-ink/45">{summary}</p>
      {events.filter((e) => e.day === day).map((e) => (
        <button
          key={e.id}
          onClick={() => onEvent(editEvent(e))}
          className="mt-3 block w-full rounded-2xl rounded-bl-md bg-lav/60 px-4 py-2.5 text-left text-[13px] font-bold text-violet-mid"
        >
          📌 {e.label} · {e.note}
        </button>
      ))}
      <button
        onClick={() => onEvent(blankEvent(day))}
        className="mt-2 text-[12.5px] font-bold text-ink/40 hover:text-ink"
      >
        + Add event
      </button>
      <div className="mt-3 space-y-2">
        {active.map((p) => {
          const cell = shiftsFor(p.id, day);
          return cell.length === 0 ? (
            <button
              key={p.id}
              onClick={() => onEdit({ staffId: p.id, day })}
              className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-ink/8 px-3.5 py-2.5 text-left"
            >
              <Avatar person={p} size={34} />
              <span className="flex-1 text-[13.5px] font-bold text-ink/35">{p.first} · off</span>
              <span className="text-[16px] font-extrabold text-green">+</span>
            </button>
          ) : (
            cell.map((s) => (
              <button
                key={s.id}
                onClick={() => onEdit({ staffId: p.id, day, shift: s })}
                className="flex w-full items-center gap-3 rounded-2xl bg-white px-3.5 py-3 text-left shadow-pop active:scale-[0.99]"
              >
                <Avatar person={p} size={38} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-extrabold text-ink">{p.first}</span>
                  <span className="block text-[12px] font-semibold text-ink/45">
                    {s.start}–{s.end} · {s.section ?? s.role}
                    {s.state === "draft" && " · draft"}
                  </span>
                </span>
                <span className={`rounded-lg rounded-bl-[4px] px-2.5 py-1 text-[11px] font-extrabold ${ROLE_TONES[s.role]}`}>
                  {s.role}
                </span>
                {s.state === "covering" && <LiveDot />}
              </button>
            ))
          );
        })}
      </div>
    </div>
  );
}

function ModeToggle({ mode, setMode }: { mode: "day" | "person"; setMode: (m: "day" | "person") => void }) {
  return (
    <div className="flex w-fit rounded-full bg-white p-1 shadow-pop">
      {(["day", "person"] as const).map((k) => (
        <button
          key={k}
          onClick={() => setMode(k)}
          className={`rounded-full px-4 py-1.5 text-[12.5px] font-extrabold transition-colors ${
            mode === k ? "bg-green-dark text-white" : "text-ink/45"
          }`}
        >
          {k === "day" ? "By day" : "By person"}
        </button>
      ))}
    </div>
  );
}

function ShiftEditor({
  editing,
  staff,
  onClose,
  onSave,
  onDelete,
  onDropCover,
}: {
  editing: Editing;
  staff: Staff[];
  onClose: () => void;
  onSave: (s: Shift) => void;
  onDelete: (id: string) => void;
  onDropCover: (id: string) => void;
}) {
  const person = staff.find((s) => s.id === editing.staffId)!;
  const [dropping, setDropping] = useState(false);
  const [start, setStart] = useState(editing.shift?.start ?? "5:00 PM");
  const [end, setEnd] = useState(editing.shift?.end ?? "11:00 PM");
  const [role, setRole] = useState<Role>(editing.shift?.role ?? person.role);
  const [section, setSection] = useState(editing.shift?.section ?? "");
  const [shiftNote, setShiftNote] = useState(editing.shift?.note ?? "");

  const bad = toMins(end) !== 0 && toMins(end) <= toMins(start);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-lift"
        role="dialog"
        aria-label="Edit shift"
      >
        <div className="flex items-center gap-3">
          <Avatar person={person} size={44} />
          <div>
            <p className="font-display text-[18px] font-extrabold text-ink">
              {person.first} · {DAYS[editing.day]}
            </p>
            <p className="text-[12.5px] font-semibold text-ink/45">
              {editing.shift ? "Edit this shift" : "New shift"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {[
            ["Open", "8:00 AM", "2:00 PM"],
            ["Lunch", "11:00 AM", "5:00 PM"],
            ["Dinner", "5:00 PM", "11:00 PM"],
            ["Close", "4:00 PM", "12:00 AM"],
          ].map(([label, s, e]) => {
            const active = start === s && end === e;
            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setStart(s);
                  setEnd(e);
                }}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-extrabold transition-colors ${
                  active ? "bg-green-dark text-white" : "bg-cream text-ink/55 hover:text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="block min-w-0">
            <span className="text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">Starts</span>
            <input
              type="time"
              step={900}
              value={to24h(start)}
              onChange={(e) => e.target.value && setStart(from24h(e.target.value))}
              className="mt-1 block h-11 w-full min-w-0 appearance-none rounded-xl border-2 border-ink/10 bg-white px-3 text-[14px] font-bold text-ink outline-none focus:border-green [&::-webkit-date-and-time-value]:text-left"
            />
          </label>
          <label className="block min-w-0">
            <span className="text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">Ends</span>
            <input
              type="time"
              step={900}
              value={to24h(end)}
              onChange={(e) => e.target.value && setEnd(from24h(e.target.value))}
              className="mt-1 block h-11 w-full min-w-0 appearance-none rounded-xl border-2 border-ink/10 bg-white px-3 text-[14px] font-bold text-ink outline-none focus:border-green [&::-webkit-date-and-time-value]:text-left"
            />
          </label>
          <label className="block min-w-0">
            <span className="text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">Working as</span>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="mt-1 w-full rounded-xl border-2 border-ink/10 px-3 py-2.5 text-[14px] font-bold text-ink outline-none focus:border-green">
              {(["Server", "Bartender", "Host", "Line cook", "Prep", "Busser", "Manager"] as Role[]).map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>
          <label className="block min-w-0">
            <span className="text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">Section</span>
            <select value={section} onChange={(e) => setSection(e.target.value)} className="mt-1 w-full rounded-xl border-2 border-ink/10 px-3 py-2.5 text-[14px] font-bold text-ink outline-none focus:border-green">
              <option value="">—</option>
              {["Main", "Patio", "Bar side"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <label className="mt-3 block">
          <span className="text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">Note (optional)</span>
          <input
            value={shiftNote}
            onChange={(e) => setShiftNote(e.target.value)}
            placeholder="training with Marisa, big party at 7"
            className="mt-1 w-full rounded-xl border-2 border-ink/10 px-3 py-2.5 text-[14px] font-bold text-ink outline-none focus:border-green"
          />
        </label>
        {bad && <p className="mt-2 text-[12.5px] font-bold text-coral">That shift ends before it starts.</p>}
        <div className="mt-5 flex items-center gap-2">
          <GreenBtn
            className="flex-1"
            disabled={bad}
            onClick={() =>
              onSave({
                id: editing.shift?.id ?? uid("s"),
                staffId: editing.staffId,
                day: editing.day,
                start,
                end,
                role,
                section: section || undefined,
                note: shiftNote.trim() || undefined,
                state: "draft",
              })
            }
          >
            {editing.shift ? "Save change" : "Add as draft"}
          </GreenBtn>
          {editing.shift && (
            <button
              onClick={() => setDropping(true)}
              className="rounded-full border-2 border-blush px-4 py-2.5 text-[13.5px] font-extrabold text-coral transition-colors hover:bg-blush/40"
            >
              Drop
            </button>
          )}
          <button onClick={onClose} className="px-2 text-[13.5px] font-bold text-ink/45 hover:text-ink">
            Cancel
          </button>
        </div>
        {dropping && (
          <div className="mt-4 rounded-2xl bg-cream p-4">
            <p className="text-[13.5px] font-extrabold text-ink">Drop this shift, then what?</p>
            <div className="mt-2.5 grid gap-2">
              <button
                onClick={() => onDropCover(editing.shift!.id)}
                className="rounded-xl bg-green px-4 py-2.5 text-left text-[13px] font-extrabold text-ink hover:bg-green-deep hover:text-white"
              >
                Find coverage · Tagout texts the eligible list
              </button>
              <button
                onClick={() => onDelete(editing.shift!.id)}
                className="rounded-xl border-2 border-ink/12 bg-white px-4 py-2.5 text-left text-[13px] font-extrabold text-ink/70 hover:border-ink"
              >
                Remove only · no outreach
              </button>
            </div>
          </div>
        )}
        <p className="mt-3 text-[11.5px] font-semibold text-ink/40">
          Saved as drafts. Nothing is sent until you publish.
        </p>
      </motion.div>
    </motion.div>
  );
}
