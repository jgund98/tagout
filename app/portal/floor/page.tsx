"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePortal, uid } from "@/lib/portal/store";
import { Avatar, GreenBtn, PageTitle, LiveDot } from "@/components/portal/ui";
import { ROOMS, type Table } from "@/lib/portal/data";

const SECTIONS = [
  { name: "Main", fill: "#0ecf7f", soft: "#dcf8ea", text: "#056443" },
  { name: "Patio", fill: "#ffb020", soft: "#ffedca", text: "#7a5200" },
  { name: "Bar side", fill: "#6d5bff", soft: "#ebe7ff", text: "#4b3ad9" },
];

/** table footprint by seats, in % of room width */
function sizeFor(seats: number): number {
  if (seats <= 2) return 9;
  if (seats <= 4) return 12;
  if (seats <= 6) return 15;
  return 19;
}

export default function FloorPage() {
  const { state, dispatch } = usePortal();
  const [room, setRoom] = useState(ROOMS[0]);
  const [editing, setEditing] = useState<Table | null>(null);
  const [assigning, setAssigning] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const tonight = state.shifts.filter((s) => s.day === 4 && s.role === "Server" && s.state !== "open");
  const staffOf = (id: string) => state.staff.find((p) => p.id === id) ?? null;
  const shiftFor = (section: string) => tonight.find((s) => s.section === section);

  const seatCount = (section: string) =>
    state.tables.filter((t) => t.section === section).reduce((n, t) => n + t.seats, 0);
  const totalSeats = state.tables.reduce((n, t) => n + t.seats, 0);
  const counts = SECTIONS.map((s) => seatCount(s.name));
  const spread = Math.max(...counts) - Math.min(...counts);
  const heavy = SECTIONS[counts.indexOf(Math.max(...counts))].name;
  const light = SECTIONS[counts.indexOf(Math.min(...counts))].name;

  const roomTables = state.tables.filter((t) => t.room === room);

  const balance = () => {
    dispatch({ type: "FLOOR_BALANCE", sections: SECTIONS.map((s) => s.name) });
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

  const onDragEnd = (t: Table, info: { point: { x: number; y: number } }) => {
    const el = canvasRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(96, Math.max(4, ((info.point.x - r.left) / r.width) * 100));
    const y = Math.min(94, Math.max(6, ((info.point.y - r.top) / r.height) * 100));
    dispatch({ type: "TABLE_PATCH", id: t.id, patch: { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 } });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle
        title="Floor plan"
        sub="Drag tables where they actually sit. Tap one to change it. Assignments text out instantly."
        right={
          <GreenBtn onClick={balance} disabled={state.floorBalanced || spread <= 4}>
            {state.floorBalanced ? "Evened out ✓" : "Even out sections"}
          </GreenBtn>
        }
      />

      {/* sections + tonight's servers */}
      <div className="grid gap-3 sm:grid-cols-3">
        {SECTIONS.map((sec) => {
          const shift = shiftFor(sec.name);
          const p = shift ? staffOf(shift.staffId) : null;
          const seats = seatCount(sec.name);
          const share = totalSeats ? Math.round((seats / totalSeats) * 100) : 0;
          return (
            <div key={sec.name} className="rounded-3xl bg-white p-4 shadow-pop">
              <div className="flex items-center gap-3">
                <Avatar person={p} size={42} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 font-display text-[15px] font-extrabold text-ink">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: sec.fill }} />
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
              <div className="mt-2.5">
                <div className="flex items-baseline justify-between text-[12px] font-bold text-ink/45">
                  <span>{seats} seats</span>
                  <span>{share}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/6">
                  <motion.div layout className="h-full rounded-full" style={{ width: `${share}%`, background: sec.fill }} />
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

      {/* room tabs */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex rounded-full bg-white p-1 shadow-pop">
          {ROOMS.map((r) => (
            <button
              key={r}
              onClick={() => setRoom(r)}
              className={`rounded-full px-4 py-2 text-[13px] font-extrabold transition-colors ${
                room === r ? "bg-green-dark text-white" : "text-ink/45 hover:text-ink"
              }`}
            >
              {r}
              <span className={`ml-1.5 text-[11px] ${room === r ? "text-white/60" : "text-ink/30"}`}>
                {state.tables.filter((t) => t.room === r).length}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => dispatch({ type: "TABLE_ADD", seats: 4, section: light, shape: "round", room })}
          className="rounded-full border-2 border-ink/12 px-4 py-2 text-[13px] font-extrabold text-ink/60 transition-colors hover:border-green hover:text-green-deep"
        >
          + Table
        </button>
      </div>

      {/* the room canvas */}
      <div
        ref={canvasRef}
        className="relative mt-3 aspect-[16/10] w-full touch-none select-none overflow-hidden rounded-[28px] border border-ink/8 bg-white shadow-pop sm:aspect-[16/9]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(15 21 18 / 0.045) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      >
        {/* architecture, per room */}
        {room === "Dining room" && (
          <>
            <div className="absolute right-0 top-0 flex h-[26%] w-[24%] items-center justify-center rounded-bl-3xl bg-ink/[0.05]">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink/35">Kitchen</span>
            </div>
            <div className="absolute bottom-0 left-[24%] h-2 w-[16%] rounded-t-md bg-ink/15" />
            <span className="absolute bottom-3 left-[25%] text-[10px] font-extrabold uppercase tracking-wider text-ink/30">
              Entry
            </span>
            <div className="absolute left-0 top-0 h-full w-1.5 bg-ink/8" />
          </>
        )}
        {room === "Patio" && (
          <>
            <div className="absolute inset-y-0 left-0 flex w-2 items-center bg-ink/8" />
            <span className="absolute left-4 top-3 text-[10px] font-extrabold uppercase tracking-wider text-ink/30">
              To dining room
            </span>
            <div className="absolute inset-0 rounded-[28px] border-2 border-dashed border-ink/8" />
          </>
        )}
        {room === "Bar" && (
          <div className="absolute left-[8%] right-[8%] top-[10%] flex h-[22%] items-center justify-center rounded-2xl bg-pine/90">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-paper/80">Bar</span>
          </div>
        )}

        {/* tables: drag anywhere, positions persist */}
        {roomTables.map((t) => {
          const sec = SECTIONS.find((s) => s.name === t.section) ?? SECTIONS[0];
          const w = sizeFor(t.seats);
          return (
            <motion.button
              key={t.id}
              drag
              dragMomentum={false}
              dragElastic={0.06}
              onDragEnd={(_, info) => onDragEnd(t, info)}
              onClick={() => setEditing(t)}
              whileDrag={{ scale: 1.06, zIndex: 30 }}
              className={`absolute flex flex-col items-center justify-center border-2 border-white shadow-[0_2px_10px_rgb(15_21_18/0.14)] ${
                t.shape === "round" ? "rounded-full" : t.seats >= 8 ? "rounded-xl" : "rounded-lg"
              }`}
              style={{
                width: `${t.seats >= 8 && t.shape === "square" ? w * 1.4 : w}%`,
                aspectRatio: t.seats >= 8 && t.shape === "square" ? "1.8" : "1",
                left: `${t.x}%`,
                top: `${t.y}%`,
                transform: "translate(-50%, -50%)",
                background: sec.soft,
              }}
              title={`Table ${t.label} · ${t.seats} seats · ${t.section}`}
            >
              <span className="font-display text-[13px] font-extrabold leading-none sm:text-[15px]" style={{ color: sec.text }}>
                {t.label}
              </span>
              <span className="mt-0.5 text-[9px] font-bold sm:text-[10px]" style={{ color: sec.text, opacity: 0.65 }}>
                {t.seats}
              </span>
            </motion.button>
          );
        })}
      </div>
      <p className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-semibold text-ink/40">
        <span>Drag to rearrange · tap to edit</span>
        {SECTIONS.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: s.fill }} />
            {s.name}
          </span>
        ))}
      </p>

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
              <div className="flex items-center justify-between">
                <p className="font-display text-[20px] font-extrabold text-ink">Table {editing.label}</p>
                <span className="text-[12px] font-bold text-ink/40">{editing.room}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Seats</p>
                  <div className="mt-1.5 flex items-center gap-2.5">
                    <button
                      onClick={() => {
                        if (editing.seats <= 2) return;
                        dispatch({ type: "TABLE_PATCH", id: editing.id, patch: { seats: editing.seats - 1 } });
                        setEditing({ ...editing, seats: editing.seats - 1 });
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-cream font-display text-[18px] font-extrabold text-ink"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-display text-[22px] font-extrabold text-ink">{editing.seats}</span>
                    <button
                      onClick={() => {
                        if (editing.seats >= 12) return;
                        dispatch({ type: "TABLE_PATCH", id: editing.id, patch: { seats: editing.seats + 1 } });
                        setEditing({ ...editing, seats: editing.seats + 1 });
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-cream font-display text-[18px] font-extrabold text-ink"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Shape</p>
                  <div className="mt-1.5 flex gap-2">
                    {(["round", "square"] as const).map((sh) => (
                      <button
                        key={sh}
                        onClick={() => {
                          dispatch({ type: "TABLE_PATCH", id: editing.id, patch: { shape: sh } });
                          setEditing({ ...editing, shape: sh });
                        }}
                        className={`flex h-10 w-10 items-center justify-center bg-cream ${
                          sh === "round" ? "rounded-full" : "rounded-lg"
                        } ${editing.shape === sh ? "ring-2 ring-green" : ""}`}
                        aria-label={sh}
                      >
                        <span className={`h-4 w-4 border-2 border-ink/50 ${sh === "round" ? "rounded-full" : "rounded-[3px]"}`} />
                      </button>
                    ))}
                  </div>
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
              <div className="mt-4">
                <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Room</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {ROOMS.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        dispatch({ type: "TABLE_PATCH", id: editing.id, patch: { room: r, x: 50, y: 50 } });
                        setEditing({ ...editing, room: r });
                        setRoom(r);
                      }}
                      className={`rounded-full px-4 py-2 text-[13px] font-extrabold transition-colors ${
                        editing.room === r ? "bg-green-dark text-white" : "bg-cream text-ink/55"
                      }`}
                    >
                      {r}
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
