"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePortal, uid } from "@/lib/portal/store";
import { Avatar, GreenBtn, PageTitle, LiveDot } from "@/components/portal/ui";
import type { RotationMode, Table } from "@/lib/portal/data";

const SECTIONS = [
  { name: "Main", tone: "bg-mint text-green-dark", bar: "#0ecf7f" },
  { name: "Patio", tone: "bg-amber text-ink", bar: "#ffb020" },
  { name: "Bar side", tone: "bg-lav text-violet-mid", bar: "#6d5bff" },
];
const SECTION_NAMES = SECTIONS.map((s) => s.name);

const ROTATIONS: { key: RotationMode; label: string; plain: string }[] = [
  { key: "even", label: "Even covers", plain: "Everyone's section carries about the same seats." },
  { key: "seniority", label: "Seniority picks", plain: "Longest-tenured pick their section first each week." },
  { key: "training", label: "Training pairs", plain: "New hires share a section with a trainer their first two weeks." },
];

export default function FloorPage() {
  const { state, dispatch } = usePortal();
  const [editing, setEditing] = useState<Table | null>(null);
  const [assigning, setAssigning] = useState<string | null>(null);

  const tonight = state.shifts.filter((s) => s.day === 4 && s.role === "Server" && s.state !== "open");
  const staffOf = (id: string) => state.staff.find((p) => p.id === id) ?? null;
  const shiftFor = (section: string) => tonight.find((s) => s.section === section);

  const seatCount = (section: string) =>
    state.tables.filter((t) => t.section === section).reduce((n, t) => n + t.seats, 0);
  const totalSeats = state.tables.reduce((n, t) => n + t.seats, 0);
  const counts = SECTION_NAMES.map(seatCount);
  const spread = Math.max(...counts) - Math.min(...counts);
  const heavy = SECTION_NAMES[counts.indexOf(Math.max(...counts))];
  const light = SECTION_NAMES[counts.indexOf(Math.min(...counts))];

  const balance = () => {
    dispatch({ type: "FLOOR_BALANCE", sections: SECTION_NAMES });
    dispatch({
      type: "FEED_PUSH",
      event: {
        id: uid("f"),
        kind: "rule",
        who: null,
        text: "Sections evened out",
        sub: `${heavy} was ${spread} seats heavier than ${light} before the shuffle`,
        when: "Just now",
      },
    });
  };

  const assign = (section: string, shiftId: string, first: string) => {
    const current = shiftFor(section);
    if (current && current.id !== shiftId) dispatch({ type: "SECTION_SET", shiftId: current.id, section: "" });
    dispatch({ type: "SECTION_SET", shiftId, section });
    dispatch({
      type: "FEED_PUSH",
      event: { id: uid("f"), kind: "rule", who: null, text: `${first} is running ${section} tonight`, sub: "they got the section change by text", when: "Just now" },
    });
    setAssigning(null);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle
        title="Floor plan"
        sub="Tonight's sections and who's running them. Tap a table to change it, tap a name to reassign."
        right={
          <GreenBtn onClick={balance} disabled={state.floorBalanced || spread <= 4}>
            {state.floorBalanced ? "Evened out ✓" : "Even out sections"}
          </GreenBtn>
        }
      />

      {spread > 8 && !state.floorBalanced && (
        <div className="mb-4 flex items-center gap-2.5 rounded-2xl border-2 border-amber/60 bg-white px-4 py-2.5">
          <span aria-hidden>⚖️</span>
          <p className="text-[13.5px] font-bold text-ink">
            {heavy} is {spread} seats heavier than {light}. &ldquo;Even out sections&rdquo; fixes it in one tap.
          </p>
        </div>
      )}

      {/* sections: seat share + tap-to-reassign */}
      <div className="grid gap-3 sm:grid-cols-3">
        {SECTIONS.map((sec) => {
          const shift = shiftFor(sec.name);
          const p = shift ? staffOf(shift.staffId) : null;
          const seats = seatCount(sec.name);
          const share = totalSeats ? Math.round((seats / totalSeats) * 100) : 0;
          return (
            <div key={sec.name} className="rounded-3xl bg-white p-4 shadow-pop">
              <div className="flex items-center gap-3">
                <Avatar person={p} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 font-display text-[15.5px] font-extrabold text-ink">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: sec.bar }} />
                    {sec.name}
                  </p>
                  <button
                    onClick={() => setAssigning(assigning === sec.name ? null : sec.name)}
                    className="text-[13px] font-bold text-green-deep underline decoration-green-deep/30 underline-offset-2"
                  >
                    {p ? `${p.first} tonight` : "Assign a server"}
                  </button>
                </div>
                {shift?.state === "covering" && <LiveDot />}
              </div>
              <div className="mt-3">
                <div className="flex items-baseline justify-between text-[12px] font-bold text-ink/45">
                  <span>{seats} seats</span>
                  <span>{share}% of the room</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/6">
                  <motion.div layout className="h-full rounded-full" style={{ width: `${share}%`, background: sec.bar }} />
                </div>
              </div>
              <AnimatePresence>
                {assigning === sec.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-1.5 border-t border-ink/6 pt-3">
                      {tonight.map((s) => {
                        const sp = staffOf(s.staffId);
                        const here = s.section === sec.name;
                        return (
                          <button
                            key={s.id}
                            onClick={() => !here && assign(sec.name, s.id, sp?.first ?? "They")}
                            className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left ${
                              here ? "bg-mint/60" : "hover:bg-cream"
                            }`}
                          >
                            <Avatar person={sp} size={26} />
                            <span className="flex-1 text-[13.5px] font-bold text-ink">{sp?.first}</span>
                            <span className="text-[11.5px] font-semibold text-ink/40">
                              {here ? "here now" : s.section ? `on ${s.section}` : "unassigned"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* the room: tap to edit, add tables, everything persists */}
      <div className="mt-5 rounded-[28px] bg-white p-5 shadow-pop sm:p-8">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 sm:gap-4">
          {state.tables.map((t) => {
            const sec = SECTIONS.find((s) => s.name === t.section) ?? SECTIONS[0];
            return (
              <motion.button
                key={t.id}
                layout
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                onClick={() => setEditing(t)}
                title={`Table ${t.label} · ${t.section} · ${t.seats} seats`}
                className={`flex aspect-square flex-col items-center justify-center gap-0.5 ${sec.tone} ${
                  t.shape === "round" ? "rounded-full" : "rounded-2xl"
                } font-display font-extrabold shadow-[0_1px_4px_rgb(15_21_18/0.08)] transition-transform active:scale-95`}
              >
                <span className="text-[16px] leading-none">{t.label}</span>
                <span className="text-[10.5px] font-bold opacity-60">{t.seats} top</span>
              </motion.button>
            );
          })}
          <button
            onClick={() => dispatch({ type: "TABLE_ADD", seats: 4, section: light, shape: "square" })}
            className="flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink/12 font-display text-[22px] font-extrabold text-ink/30 transition-colors hover:border-green hover:text-green"
            aria-label="Add a table"
          >
            +
          </button>
        </div>
      </div>

      {/* rotation setting */}
      <div className="mt-5 rounded-3xl bg-white p-5 shadow-pop">
        <h3 className="font-display text-[16.5px] font-extrabold text-ink">How sections get handed out</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {ROTATIONS.map((r) => {
            const on = state.rotation === r.key;
            return (
              <button
                key={r.key}
                onClick={() => {
                  if (on) return;
                  dispatch({ type: "ROTATION_SET", mode: r.key });
                  dispatch({
                    type: "FEED_PUSH",
                    event: { id: uid("f"), kind: "rule", who: null, text: `Section rotation set to "${r.label}"`, sub: "applies when next week's schedule is built", when: "Just now" },
                  });
                }}
                className={`rounded-2xl p-3.5 text-left transition-all ${
                  on ? "bg-green-dark text-white shadow-pop" : "bg-cream text-ink/70 hover:bg-mint/40"
                }`}
              >
                <p className="font-display text-[14.5px] font-extrabold">
                  {r.label}
                  {on && " ✓"}
                </p>
                <p className={`mt-0.5 text-[12.5px] font-semibold leading-snug ${on ? "text-white/70" : "text-ink/45"}`}>
                  {r.plain}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* table editor */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-lift"
              role="dialog"
              aria-label={`Edit table ${editing.label}`}
            >
              <p className="font-display text-[20px] font-extrabold text-ink">Table {editing.label}</p>
              <div className="mt-4">
                <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Seats</p>
                <div className="mt-1.5 flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (editing.seats <= 2) return;
                      dispatch({ type: "TABLE_PATCH", id: editing.id, patch: { seats: editing.seats - 1 } });
                      setEditing({ ...editing, seats: editing.seats - 1 });
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-cream font-display text-[18px] font-extrabold text-ink"
                    aria-label="Fewer seats"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-display text-[22px] font-extrabold text-ink">
                    {editing.seats}
                  </span>
                  <button
                    onClick={() => {
                      if (editing.seats >= 12) return;
                      dispatch({ type: "TABLE_PATCH", id: editing.id, patch: { seats: editing.seats + 1 } });
                      setEditing({ ...editing, seats: editing.seats + 1 });
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-cream font-display text-[18px] font-extrabold text-ink"
                    aria-label="More seats"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Section</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {SECTIONS.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => {
                        dispatch({ type: "TABLE_PATCH", id: editing.id, patch: { section: s.name } });
                        setEditing({ ...editing, section: s.name });
                      }}
                      className={`rounded-full px-4 py-2 text-[13px] font-extrabold transition-colors ${
                        editing.section === s.name ? "bg-green-dark text-white" : "bg-cream text-ink/55"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => {
                    dispatch({ type: "TABLE_REMOVE", id: editing.id });
                    setEditing(null);
                  }}
                  className="text-[13.5px] font-extrabold text-coral/80 hover:text-coral"
                >
                  Remove table
                </button>
                <GreenBtn onClick={() => setEditing(null)}>Done</GreenBtn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
