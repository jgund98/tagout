"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePortal, shiftHours, toMins, uid } from "@/lib/portal/store";
import { Avatar, Chip, GreenBtn, GhostBtn, PageTitle, LiveDot } from "@/components/portal/ui";
import { DAYS, type Role, type Shift, type Staff } from "@/lib/portal/data";

const ROLE_TONES: Record<Role, string> = {
  Server: "bg-mint text-green-dark",
  Bartender: "bg-lav text-violet-mid",
  Host: "bg-blush text-coral",
  "Line cook": "bg-butter text-[#9a6a00]",
  Prep: "bg-butter text-[#9a6a00]",
  Busser: "bg-lav text-violet-mid",
};

const TIMES = ["8:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "5:00 PM"];
const ENDS = ["2:00 PM", "4:00 PM", "5:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"];

type Editing = { staffId: string; day: number; shift?: Shift };

export default function SchedulePage() {
  const { state, dispatch } = usePortal();
  const [editing, setEditing] = useState<Editing | null>(null);
  const [toast, setToast] = useState("");

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

  const publish = () => {
    dispatch({ type: "PUBLISH_WEEK" });
    dispatch({
      type: "FEED_PUSH",
      event: {
        id: uid("f"),
        kind: "rule",
        who: null,
        text: "Week published. Everyone just got their schedule by text",
        sub: "no app downloads, no 'check the portal'",
        when: "Just now",
      },
    });
    setToast("Published. The whole crew got their week by text.");
    setTimeout(() => setToast(""), 3500);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle
        title="Schedule"
        sub="Build it in minutes. Tagout keeps it whole after you publish."
        right={
          <div className="flex items-center gap-2">
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
            <div key={i} className="flex items-center gap-2.5 rounded-2xl bg-butter/60 px-4 py-2.5">
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
        />
      </div>

      {/* desktop: the full board */}
      <div className="hidden overflow-x-auto rounded-[28px] bg-white p-3 shadow-pop lg:block">
        <table className="w-full min-w-[880px] border-collapse">
          <thead>
            <tr>
              <th className="w-[180px] px-3 py-2.5 text-left text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">
                Crew
              </th>
              {DAYS.map((d, i) => (
                <th key={d} className="px-1.5 py-2.5 text-left">
                  <span className={`text-[11.5px] font-extrabold uppercase tracking-wide ${i === 4 ? "text-green-deep" : "text-ink/40"}`}>
                    {d}
                    {i === 4 && " · tonight"}
                  </span>
                  {state.events.filter((e) => e.day === i).map((e) => (
                    <span key={e.id} title={e.note} className="ml-1.5 rounded-md bg-lav px-1.5 py-0.5 text-[10px] font-extrabold text-violet-mid">
                      {e.label}
                    </span>
                  ))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {active.map((p) => {
              const h = hoursOf(p.id);
              return (
                <tr key={p.id} className="border-t border-ink/5">
                  <td className="px-3 py-2">
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
                      <td key={day} className="px-1.5 py-2 align-top">
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
        </table>
      </div>

      <p className="mt-3 hidden flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-semibold text-ink/40 lg:flex">
        <span className="flex items-center gap-1.5"><LiveDot /> Tagout is covering it live</span>
        <span>Dashed = draft, goes out when you publish</span>
        <span>Tap any block to change it · tap an empty day to add a shift</span>
      </p>

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
                event: { id: uid("f"), kind: "cover", who: editing.staffId, text: `You opened up a ${DAYS[editing.day]} shift`, sub: "Tagout will start finding coverage when you publish", when: "Just now" },
              });
              setEditing(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-5 py-3 text-[13.5px] font-bold text-paper shadow-lift lg:bottom-8"
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
}: {
  active: Staff[];
  shiftsFor: (staffId: string, day: number) => Shift[];
  onEdit: (e: Editing) => void;
  events: { id: string; day: number; label: string; note: string }[];
}) {
  const [day, setDay] = useState(4); // tonight
  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {DAYS.map((d, i) => (
          <button
            key={d}
            onClick={() => setDay(i)}
            className={`shrink-0 rounded-full px-4 py-2 text-[13.5px] font-extrabold transition-colors ${
              day === i ? "bg-ink text-paper" : "bg-white text-ink/50 shadow-pop"
            }`}
          >
            {d}
            {i === 4 && <span className="ml-1 text-green">•</span>}
          </button>
        ))}
      </div>
      {events.filter((e) => e.day === day).map((e) => (
        <p key={e.id} className="mt-3 rounded-2xl rounded-bl-md bg-lav/60 px-4 py-2.5 text-[13px] font-bold text-violet-mid">
          📌 {e.label} · {e.note}
        </p>
      ))}
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

function ShiftEditor({
  editing,
  staff,
  onClose,
  onSave,
  onDelete,
}: {
  editing: Editing;
  staff: Staff[];
  onClose: () => void;
  onSave: (s: Shift) => void;
  onDelete: (id: string) => void;
}) {
  const person = staff.find((s) => s.id === editing.staffId)!;
  const [start, setStart] = useState(editing.shift?.start ?? "5:00 PM");
  const [end, setEnd] = useState(editing.shift?.end ?? "11:00 PM");
  const [role, setRole] = useState<Role>(editing.shift?.role ?? person.role);
  const [section, setSection] = useState(editing.shift?.section ?? "");

  const bad = toMins(end) !== 0 && toMins(end) <= toMins(start) && end !== "12:00 AM";

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
        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">Starts</span>
            <select value={start} onChange={(e) => setStart(e.target.value)} className="mt-1 w-full rounded-xl border-2 border-ink/10 px-3 py-2.5 text-[14px] font-bold text-ink outline-none focus:border-green">
              {TIMES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">Ends</span>
            <select value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1 w-full rounded-xl border-2 border-ink/10 px-3 py-2.5 text-[14px] font-bold text-ink outline-none focus:border-green">
              {ENDS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">Working as</span>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="mt-1 w-full rounded-xl border-2 border-ink/10 px-3 py-2.5 text-[14px] font-bold text-ink outline-none focus:border-green">
              {(["Server", "Bartender", "Host", "Line cook", "Prep", "Busser"] as Role[]).map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">Section</span>
            <select value={section} onChange={(e) => setSection(e.target.value)} className="mt-1 w-full rounded-xl border-2 border-ink/10 px-3 py-2.5 text-[14px] font-bold text-ink outline-none focus:border-green">
              <option value="">—</option>
              {["Main", "Patio", "Bar side"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
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
                state: "draft",
              })
            }
          >
            {editing.shift ? "Save change" : "Add as draft"}
          </GreenBtn>
          {editing.shift && (
            <button
              onClick={() => onDelete(editing.shift!.id)}
              className="rounded-full border-2 border-blush px-4 py-2.5 text-[13.5px] font-extrabold text-coral transition-colors hover:bg-blush/40"
            >
              Drop shift
            </button>
          )}
          <button onClick={onClose} className="px-2 text-[13.5px] font-bold text-ink/45 hover:text-ink">
            Cancel
          </button>
        </div>
        <p className="mt-3 text-[11.5px] font-semibold text-ink/40">
          Changes go out as drafts. Nobody gets texted until you hit Publish.
        </p>
      </motion.div>
    </motion.div>
  );
}
