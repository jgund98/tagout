"use client";

import { usePortal, uid } from "@/lib/portal/store";
import { motion } from "framer-motion";
import { Avatar, Chip, GreenBtn, PageTitle } from "@/components/portal/ui";
import type { RotationMode } from "@/lib/portal/data";

const SECTIONS = [
  { name: "Main", tone: "bg-mint text-green-dark", dot: "#0ecf7f" },
  { name: "Patio", tone: "bg-butter text-[#9a6a00]", dot: "#f4b53f" },
  { name: "Bar side", tone: "bg-lav text-violet-mid", dot: "#7c6cf6" },
];
const SECTION_NAMES = SECTIONS.map((s) => s.name);

const ROTATIONS: { key: RotationMode; label: string; plain: string }[] = [
  { key: "even", label: "Even covers", plain: "Everyone's section carries about the same seats." },
  { key: "seniority", label: "Seniority picks", plain: "Longest-tenured pick their section first each week." },
  { key: "training", label: "Training pairs", plain: "New hires share a section with a trainer their first two weeks." },
];

export default function FloorPage() {
  const { state, dispatch } = usePortal();

  const tonight = state.shifts.filter((s) => s.day === 4 && s.role === "Server" && s.state !== "open");
  const staffOf = (id: string) => state.staff.find((p) => p.id === id) ?? null;
  const serverFor = (section: string) => tonight.find((s) => s.section === section);
  const seatCount = (section: string) =>
    state.tables.filter((t) => t.section === section).reduce((n, t) => n + t.seats, 0);

  const balance = () => {
    dispatch({ type: "FLOOR_BALANCE" });
    dispatch({
      type: "FEED_PUSH",
      event: {
        id: uid("f"),
        kind: "rule",
        who: null,
        text: "Tagout rebalanced tonight's sections",
        sub: "covers were leaning 60/40 on Main, so it moved two tables",
        when: "Just now",
      },
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle
        title="Floor plan"
        sub="Tonight's sections, who's running them, and a quick way to even things out."
        right={
          <GreenBtn onClick={balance} disabled={state.floorBalanced}>
            {state.floorBalanced ? "Balanced ✓" : "Ask Tagout to balance"}
          </GreenBtn>
        }
      />

      {/* sections + who's running them */}
      <div className="grid gap-3 sm:grid-cols-3">
        {SECTIONS.map((sec) => {
          const shift = serverFor(sec.name);
          const p = shift ? staffOf(shift.staffId) : null;
          return (
            <div key={sec.name} className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-pop">
              <Avatar person={p} size={44} />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 font-display text-[15px] font-extrabold text-ink">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: sec.dot }} />
                  {sec.name}
                </p>
                <p className="text-[12.5px] font-semibold text-ink/50">
                  {p ? `${p.first} tonight` : "unassigned"} · {seatCount(sec.name)} seats
                </p>
              </div>
              {shift?.state === "covering" && <Chip tone="butter">Covering…</Chip>}
            </div>
          );
        })}
      </div>

      {/* the room (persists for the session, like everything else) */}
      <div className="mt-5 rounded-[28px] bg-white p-5 shadow-pop sm:p-8">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 sm:gap-4">
          {state.tables.map((t) => {
            const sec = SECTIONS.find((s) => s.name === t.section)!;
            return (
              <motion.button
                key={t.id}
                layout
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                onClick={() => dispatch({ type: "TABLE_CYCLE", id: t.id, sections: SECTION_NAMES })}
                title={`Table ${t.label} · ${t.section} · tap to move`}
                className={`flex aspect-square flex-col items-center justify-center gap-0.5 ${sec.tone} ${
                  t.shape === "round" ? "rounded-full" : "rounded-2xl"
                } font-display font-extrabold shadow-[0_1px_4px_rgb(15_21_18/0.08)] transition-transform active:scale-95`}
              >
                <span className="text-[16px] leading-none">{t.label}</span>
                <span className="text-[10.5px] font-bold opacity-60">{t.seats} top</span>
              </motion.button>
            );
          })}
        </div>
        <p className="mt-4 text-center text-[12.5px] font-semibold text-ink/40">
          Tap a table to move it to the next section. Tomorrow&apos;s 45-top lands on Patio, anchored at table 14.
        </p>
      </div>

      {/* rotation: a real setting, not a poster */}
      <div className="mt-5 rounded-3xl bg-lav/50 p-5">
        <h3 className="font-display text-[16px] font-extrabold text-ink">How sections get handed out</h3>
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
                    event: {
                      id: uid("f"),
                      kind: "rule",
                      who: null,
                      text: `Section rotation set to "${r.label}"`,
                      sub: "applies when next week's schedule is built",
                      when: "Just now",
                    },
                  });
                }}
                className={`rounded-2xl p-3.5 text-left transition-all ${
                  on ? "bg-ink text-paper shadow-pop" : "bg-white text-ink/70 hover:bg-white/70"
                }`}
              >
                <p className="font-display text-[14px] font-extrabold">
                  {r.label}
                  {on && " ✓"}
                </p>
                <p className={`mt-0.5 text-[12px] font-semibold leading-snug ${on ? "text-paper/60" : "text-ink/45"}`}>
                  {r.plain}
                </p>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
