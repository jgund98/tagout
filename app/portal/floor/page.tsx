"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePortal, uid } from "@/lib/portal/store";
import { Avatar, Chip, GreenBtn, PageTitle } from "@/components/portal/ui";

const SECTIONS = [
  { name: "Main", tone: "bg-mint text-green-dark", dot: "#0ecf7f" },
  { name: "Patio", tone: "bg-butter text-[#9a6a00]", dot: "#f4b53f" },
  { name: "Bar side", tone: "bg-lav text-violet-mid", dot: "#7c6cf6" },
];

// the room: tables laid out on a 6-col grid, grouped by section
const TABLES: { id: string; label: string; section: string; shape: "round" | "square"; seats: number }[] = [
  { id: "t1", label: "1", section: "Main", shape: "round", seats: 4 },
  { id: "t2", label: "2", section: "Main", shape: "square", seats: 2 },
  { id: "t3", label: "3", section: "Main", shape: "round", seats: 6 },
  { id: "t4", label: "4", section: "Main", shape: "square", seats: 4 },
  { id: "t5", label: "5", section: "Main", shape: "round", seats: 4 },
  { id: "t6", label: "6", section: "Bar side", shape: "square", seats: 2 },
  { id: "t7", label: "7", section: "Bar side", shape: "square", seats: 2 },
  { id: "t8", label: "8", section: "Bar side", shape: "round", seats: 4 },
  { id: "t9", label: "9", section: "Bar side", shape: "square", seats: 2 },
  { id: "t10", label: "10", section: "Patio", shape: "round", seats: 4 },
  { id: "t11", label: "11", section: "Patio", shape: "round", seats: 4 },
  { id: "t12", label: "12", section: "Patio", shape: "square", seats: 6 },
  { id: "t13", label: "13", section: "Patio", shape: "round", seats: 2 },
  { id: "t14", label: "14", section: "Patio", shape: "square", seats: 8 },
];

export default function FloorPage() {
  const { state, dispatch } = usePortal();
  const [tables, setTables] = useState(TABLES);
  const [balanced, setBalanced] = useState(false);

  // tonight's servers (Friday) and their sections
  const tonight = state.shifts.filter((s) => s.day === 4 && s.role === "Server" && s.state !== "open");
  const staffOf = (id: string) => state.staff.find((p) => p.id === id) ?? null;
  const serverFor = (section: string) => tonight.find((s) => s.section === section);

  const cycle = (tid: string) => {
    setTables((ts) =>
      ts.map((t) => {
        if (t.id !== tid) return t;
        const i = SECTIONS.findIndex((s) => s.name === t.section);
        return { ...t, section: SECTIONS[(i + 1) % SECTIONS.length].name };
      })
    );
  };

  const balance = () => {
    setBalanced(true);
    // Tagout's suggestion: even the covers out (demo: move table 5 to Bar side, 13 to Main)
    setTables((ts) =>
      ts.map((t) => (t.id === "t5" ? { ...t, section: "Bar side" } : t.id === "t13" ? { ...t, section: "Main" } : t))
    );
    dispatch({
      type: "FEED_PUSH",
      event: {
        id: uid("f"),
        kind: "rule",
        who: null,
        text: "Tagout rebalanced tonight's sections",
        sub: "covers were leaning 60/40 on Main — moved two tables so nobody drowns",
        when: "Just now",
      },
    });
  };

  const seatCount = (section: string) => tables.filter((t) => t.section === section).reduce((n, t) => n + t.seats, 0);

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle
        title="The floor"
        sub="Tonight's sections, who's running them, and a quick way to even things out."
        right={
          <GreenBtn onClick={balance} disabled={balanced}>
            {balanced ? "Balanced ✓" : "Ask Tagout to balance"}
          </GreenBtn>
        }
      />

      {/* section legend + assigned servers */}
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
              {shift?.state === "covering" && <Chip tone="butter">covering…</Chip>}
            </div>
          );
        })}
      </div>

      {/* the room */}
      <div className="mt-5 rounded-[28px] bg-white p-5 shadow-pop sm:p-8">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 sm:gap-4">
          {tables.map((t) => {
            const sec = SECTIONS.find((s) => s.name === t.section)!;
            return (
              <motion.button
                key={t.id}
                layout
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                onClick={() => cycle(t.id)}
                title={`Table ${t.label} · ${t.section} · tap to move`}
                className={`flex aspect-square flex-col items-center justify-center gap-0.5 ${sec.tone} ${
                  t.shape === "round" ? "rounded-full" : "rounded-2xl"
                } font-display font-extrabold shadow-[0_1px_4px_rgb(15_21_18/0.08)] transition-transform active:scale-95`}
              >
                <span className="text-[16px] leading-none">{t.label}</span>
                <span className="text-[10px] font-bold opacity-60">{t.seats} top</span>
              </motion.button>
            );
          })}
        </div>
        <p className="mt-4 text-center text-[12.5px] font-semibold text-ink/40">
          Tap a table to move it to the next section. Tomorrow&apos;s 45-top lands on Patio — table 14&apos;s the anchor.
        </p>
      </div>

      {/* rotation formats */}
      <div className="mt-5 rounded-3xl bg-lav/50 p-5">
        <h3 className="font-display text-[16px] font-extrabold text-ink">Rotations, pre-built</h3>
        <p className="mt-1.5 max-w-2xl text-[13.5px] font-medium leading-relaxed text-ink/65">
          Tagout keeps three ways to run this room — even covers, seniority picks, and a training layout that pairs
          Tyler with Marisa his first two weeks. Pick one per shift or let it rotate weekly so the patio isn&apos;t
          always the same server&apos;s money.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Even covers (tonight)", "Seniority picks", "Training pairs"].map((f, i) => (
            <span key={f} className={`rounded-lg rounded-bl-[4px] px-3 py-1.5 text-[12.5px] font-extrabold ${i === 0 ? "bg-ink text-paper" : "bg-white text-ink/55"}`}>
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
