"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePortal, uid } from "@/lib/portal/store";
import { Avatar, GreenBtn, PageTitle, LiveDot } from "@/components/portal/ui";
import { NavIcon } from "@/components/portal/NavIcon";
import { ROOMS, type Fixture, type FixtureKind, type Table } from "@/lib/portal/data";

const SECTIONS = [
  { name: "Main", fill: "#0ecf7f", soft: "#dcf8ea", text: "#056443" },
  { name: "Patio", fill: "#ffb020", soft: "#ffedca", text: "#7a5200" },
  { name: "Bar side", fill: "#6d5bff", soft: "#ebe7ff", text: "#4b3ad9" },
];

const TABLE_KINDS: { label: string; shape: Table["shape"]; seats: number }[] = [
  { label: "Round table", shape: "round", seats: 4 },
  { label: "Square table", shape: "square", seats: 4 },
  { label: "Booth", shape: "booth", seats: 4 },
  { label: "High-top", shape: "hightop", seats: 2 },
];

const FIXTURE_KINDS: FixtureKind[] = ["Kitchen", "Bar counter", "Entry", "Restrooms", "Host stand"];

function sizeFor(t: Table): { w: number; ratio: number } {
  if (t.shape === "booth") return { w: 16, ratio: 1.6 };
  if (t.shape === "hightop") return { w: 7.5, ratio: 1 };
  if (t.seats <= 2) return { w: 9, ratio: 1 };
  if (t.seats <= 4) return { w: 12, ratio: 1 };
  if (t.seats <= 6) return { w: 15, ratio: 1 };
  return { w: t.shape === "square" ? 22 : 19, ratio: t.shape === "square" ? 1.8 : 1 };
}

export default function FloorPage() {
  const { state, dispatch } = usePortal();
  const [room, setRoom] = useState(ROOMS[0]);
  const [editing, setEditing] = useState<Table | null>(null);
  const [editingFx, setEditingFx] = useState<Fixture | null>(null);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  // the full-screen editor owns the viewport: nothing scrolls behind it
  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [expanded]);

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
  const roomFixtures = state.fixtures.filter((f) => f.room === room);

  const balance = () => {
    dispatch({ type: "FLOOR_BALANCE", sections: SECTIONS.map((s) => s.name) });
    dispatch({
      type: "FEED_PUSH",
      event: { id: uid("f"), kind: "rule", who: null, text: "Sections evened out", sub: `${heavy} was ${spread} seats heavier than ${light}`, when: "Just now" },
    });
  };

  const assign = (section: string, shiftId: string, first: string) => {
    const current = shiftFor(section);
    if (current && current.id !== shiftId) dispatch({ type: "SECTION_SET", shiftId: current.id, section: "" });
    dispatch({ type: "SECTION_SET", shiftId, section });
    dispatch({
      type: "FEED_PUSH",
      event: { id: uid("f"), kind: "rule", who: null, text: `${first} is running ${section} tonight`, sub: "section change sent by text", when: "Just now" },
    });
    setAssigning(null);
  };

  const dropAt = (info: { point: { x: number; y: number } }) => {
    const el = canvasRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(Math.min(96, Math.max(4, ((info.point.x - r.left) / r.width) * 100)) * 10) / 10,
      y: Math.round(Math.min(94, Math.max(6, ((info.point.y - r.top) / r.height) * 100)) * 10) / 10,
    };
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle
        title="Floor plan"
        sub="Drag to arrange tables and fixtures, double-tap to edit one. Section changes notify staff by text."
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
                            className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left ${here ? "bg-mint/60" : "hover:bg-cream"}`}
                          >
                            <Avatar person={sp} size={26} />
                            <span className="flex-1 text-[13.5px] font-bold text-ink">{sp?.first}</span>
                            <span className="text-[11.5px] font-semibold text-ink/40">
                              {here ? "assigned" : s.section ? `on ${s.section}` : "unassigned"}
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

      {/* room tabs + add — expands to a full-screen editor on tap */}
      <div
        className={
          expanded
            ? "fixed inset-0 z-50 flex flex-col overflow-hidden bg-cream px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
            : ""
        }
        style={expanded ? { paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" } : undefined}
      >
      <div className={`flex items-center justify-between gap-2 ${expanded ? "" : "mt-5"}`}>
        <div className="no-scrollbar flex max-w-full overflow-x-auto rounded-full bg-white p-1 shadow-pop">
          {ROOMS.map((r) => (
            <button
              key={r}
              onClick={() => setRoom(r)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-extrabold transition-colors ${
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
        {/* editing controls: desktop inline, mobile only inside the full-screen editor */}
        <div className={`relative shrink-0 items-center gap-2 ${expanded ? "flex" : "hidden lg:flex"}`}>
          <button
            onClick={() => setAddOpen((v) => !v)}
            className="whitespace-nowrap rounded-full border-2 border-ink/12 px-4 py-2 text-[13px] font-extrabold text-ink/60 transition-colors hover:border-green hover:text-green-deep"
          >
            + Add
          </button>
          {expanded && (
            <button
              onClick={() => setExpanded(false)}
              className="rounded-full bg-green-dark px-4 py-2 text-[13px] font-extrabold text-white"
            >
              Done
            </button>
          )}
          <AnimatePresence>
            {addOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 top-11 z-40 w-48 rounded-2xl bg-white p-2 shadow-lift"
              >
                <p className="px-2.5 pb-1 pt-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-ink/35">Tables</p>
                {TABLE_KINDS.map((k) => (
                  <button
                    key={k.label}
                    onClick={() => {
                      dispatch({ type: "TABLE_ADD", seats: k.seats, section: light, shape: k.shape, room });
                      setAddOpen(false);
                    }}
                    className="block w-full rounded-xl px-2.5 py-2 text-left text-[13.5px] font-bold text-ink hover:bg-cream"
                  >
                    {k.label}
                  </button>
                ))}
                <p className="px-2.5 pb-1 pt-2 text-[10.5px] font-extrabold uppercase tracking-wide text-ink/35">Fixtures</p>
                {FIXTURE_KINDS.map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      dispatch({ type: "FIXTURE_ADD", room, kind: k });
                      setAddOpen(false);
                    }}
                    className="block w-full rounded-xl px-2.5 py-2 text-left text-[13.5px] font-bold text-ink hover:bg-cream"
                  >
                    {k}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* the room canvas */}
      <div
        ref={canvasRef}
        className={`relative mt-3 w-full touch-none select-none overflow-hidden rounded-[28px] border border-ink/8 bg-white shadow-pop ${
          expanded ? "min-h-0 flex-1" : "aspect-[16/10] sm:aspect-[16/9]"
        }`}
        style={{
          backgroundImage: "radial-gradient(circle, rgb(15 21 18 / 0.045) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
        onClick={() => setAddOpen(false)}
      >
        {/* mobile: the inline plan is a preview — editing happens full-screen only */}
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="absolute inset-0 z-30 flex items-center justify-center bg-paper/40 backdrop-blur-[1.5px] lg:hidden"
            aria-label="Open the floor plan editor"
          >
            <span className="flex items-center gap-2 rounded-full bg-pine px-5 py-3 text-[14px] font-extrabold text-paper shadow-lift">
              <NavIcon name="floor" size={16} />
              Edit floor plan
            </span>
          </button>
        )}
        {roomFixtures.map((f) => (
          <motion.div
            key={f.id}
            drag
            dragMomentum={false}
            dragElastic={0.06}
            onDragStart={() => (draggedRef.current = true)}
            onDragEnd={(_, info) => {
              const p = dropAt(info);
              if (p) dispatch({ type: "FIXTURE_PATCH", id: f.id, patch: p });
              setTimeout(() => (draggedRef.current = false), 50);
            }}
            onDoubleClick={() => !draggedRef.current && setEditingFx(f)}
            whileDrag={{ scale: 1.03, zIndex: 25 }}
            className={`absolute flex cursor-grab items-center justify-center rounded-2xl border ${
              f.kind === "Bar counter" ? "border-pine bg-pine/90" : "border-ink/10 bg-ink/[0.05]"
            }`}
            style={{
              width: `${f.w}%`,
              height: `${f.h}%`,
              left: `${f.x}%`,
              top: `${f.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            title={`${f.kind} · drag to move, double-tap to edit`}
          >
            <span
              className={`px-1 text-center text-[10px] font-extrabold uppercase tracking-wider ${
                f.kind === "Bar counter" ? "text-paper/80" : "text-ink/35"
              }`}
            >
              {f.kind}
            </span>
          </motion.div>
        ))}

        {roomTables.map((t) => {
          const sec = SECTIONS.find((s) => s.name === t.section) ?? SECTIONS[0];
          const { w, ratio } = sizeFor(t);
          return (
            <motion.button
              key={t.id}
              drag
              dragMomentum={false}
              dragElastic={0.06}
              onDragStart={() => (draggedRef.current = true)}
              onDragEnd={(_, info) => {
                const p = dropAt(info);
                if (p) dispatch({ type: "TABLE_PATCH", id: t.id, patch: p });
                setTimeout(() => (draggedRef.current = false), 50);
              }}
              onDoubleClick={() => !draggedRef.current && setEditing(t)}
              whileDrag={{ scale: 1.06, zIndex: 30 }}
              className={`absolute flex cursor-grab flex-col items-center justify-center border-2 border-white shadow-[0_2px_10px_rgb(15_21_18/0.14)] ${
                t.shape === "round" || t.shape === "hightop" ? "rounded-full" : t.shape === "booth" ? "rounded-xl" : "rounded-lg"
              }`}
              style={{
                width: `${w}%`,
                aspectRatio: String(ratio),
                left: `${t.x}%`,
                top: `${t.y}%`,
                transform: "translate(-50%, -50%)",
                background: sec.soft,
                ...(t.shape === "hightop" ? { boxShadow: `0 0 0 3px ${sec.fill}44, 0 2px 10px rgb(15 21 18 / 0.14)` } : {}),
              }}
              title={`Table ${t.label} · ${t.seats} seats · ${t.section} · drag to move, double-tap to edit`}
            >
              {t.shape === "booth" && (
                <span className="absolute inset-x-1.5 top-1 h-1.5 rounded-full" style={{ background: sec.fill, opacity: 0.45 }} />
              )}
              <span className="font-display text-[12px] font-extrabold leading-none sm:text-[14px]" style={{ color: sec.text }}>
                {t.label}
              </span>
              {t.shape !== "hightop" && (
                <span className="mt-0.5 text-[9px] font-bold sm:text-[10px]" style={{ color: sec.text, opacity: 0.65 }}>
                  {t.seats}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
      <p className={`mt-2.5 flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-semibold text-ink/40 ${expanded ? "flex" : "hidden lg:flex"}`}>
        <span>Drag to move · double-tap to edit</span>
        {SECTIONS.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: s.fill }} />
            {s.name}
          </span>
        ))}
      </p>
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
              className="max-h-[85dvh] w-full max-w-sm overflow-y-auto overscroll-contain rounded-[28px] bg-white p-6 shadow-lift"
              role="dialog"
              aria-label={`Edit table ${editing.label}`}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-[20px] font-extrabold text-ink">Table {editing.label}</p>
                <span className="text-[12px] font-bold text-ink/40">{editing.room}</span>
              </div>
              <div className="mt-4">
                <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Type</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {TABLE_KINDS.map((k) => (
                    <button
                      key={k.shape}
                      onClick={() => {
                        dispatch({ type: "TABLE_PATCH", id: editing.id, patch: { shape: k.shape } });
                        setEditing({ ...editing, shape: k.shape });
                      }}
                      className={`rounded-full px-3.5 py-2 text-[12.5px] font-extrabold transition-colors ${
                        editing.shape === k.shape ? "bg-green-dark text-white" : "bg-cream text-ink/55"
                      }`}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Seats</p>
                <div className="mt-1.5 flex items-center gap-2.5">
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
                  <span className="w-8 text-center font-display text-[22px] font-extrabold text-ink">{editing.seats}</span>
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

      {/* fixture editor */}
      <AnimatePresence>
        {editingFx && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setEditingFx(null)}
          >
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85dvh] w-full max-w-sm overflow-y-auto overscroll-contain rounded-[28px] bg-white p-6 shadow-lift"
              role="dialog"
              aria-label={`Edit ${editingFx.kind}`}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-[20px] font-extrabold text-ink">{editingFx.kind}</p>
                <span className="text-[12px] font-bold text-ink/40">{editingFx.room}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {(
                  [
                    ["Width", "w", 6, 90],
                    ["Depth", "h", 6, 60],
                  ] as const
                ).map(([label, key, min, max]) => (
                  <div key={key}>
                    <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">{label}</p>
                    <div className="mt-1.5 flex items-center gap-2.5">
                      <button
                        onClick={() => {
                          const v = Math.max(min, editingFx[key] - 4);
                          dispatch({ type: "FIXTURE_PATCH", id: editingFx.id, patch: { [key]: v } });
                          setEditingFx({ ...editingFx, [key]: v });
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-cream font-display text-[18px] font-extrabold text-ink"
                        aria-label={`Smaller ${label.toLowerCase()}`}
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-display text-[16px] font-extrabold text-ink">
                        {editingFx[key]}%
                      </span>
                      <button
                        onClick={() => {
                          const v = Math.min(max, editingFx[key] + 4);
                          dispatch({ type: "FIXTURE_PATCH", id: editingFx.id, patch: { [key]: v } });
                          setEditingFx({ ...editingFx, [key]: v });
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-cream font-display text-[18px] font-extrabold text-ink"
                        aria-label={`Larger ${label.toLowerCase()}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => {
                    dispatch({ type: "FIXTURE_REMOVE", id: editingFx.id });
                    setEditingFx(null);
                  }}
                  className="text-[13.5px] font-extrabold text-coral/80 hover:text-coral"
                >
                  Remove
                </button>
                <GreenBtn onClick={() => setEditingFx(null)}>Done</GreenBtn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
