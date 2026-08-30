"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

/**
 * The signature piece: an auto-playing theater where Tagout covers a dropped
 * Friday shift end-to-end. Plays once scrolled into view; replayable.
 */

const STEPS = [
  { id: 0, label: "5:12 PM: Dana drops Friday close", sub: "It happens. Tagout sees it instantly." },
  { id: 1, label: "Tagout reads the room", sub: "Availability, hours, and who actually says yes." },
  { id: 2, label: "Texts go out, in a human voice", sub: "Only to the right people. Never a blast." },
  { id: 3, label: "Marisa says yes", sub: "By text. She never opened an app." },
  { id: 4, label: "Covered. You get one line", sub: "Not fourteen notifications. One." },
] as const;

const DURATIONS = [2600, 3600, 3400, 2800, 60000];

type Person = {
  name: string;
  role: string;
  hours: number;
  status: "pick" | "skip-ot" | "skip-off" | "backup";
  reason: string;
  yes?: string;
};

const ROSTER: Person[] = [
  { name: "Marisa T.", role: "Server", hours: 31, status: "pick", reason: "Free · says yes often", yes: "8 of 9 asks" },
  { name: "Devon K.", role: "Server", hours: 26, status: "backup", reason: "Free · newer on close", yes: "5 of 7 asks" },
  { name: "Jake R.", role: "Server", hours: 38.5, status: "skip-ot", reason: "Would hit overtime" },
  { name: "Priya S.", role: "Server", hours: 29, status: "skip-off", reason: "Requested off" },
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").replace(".", "");
}

export default function CoverTheater() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.35, once: true });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(-1);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (reduced) {
      setStep(4);
      return;
    }
    if (!inView) return;
    if (step === -1) {
      const t = setTimeout(() => setStep(0), 400);
      return () => clearTimeout(t);
    }
    if (step >= 4) return;
    const t = setTimeout(() => setStep((s) => s + 1), DURATIONS[step]);
    return () => clearTimeout(t);
  }, [inView, step, reduced, runId]);

  const replay = () => {
    setStep(0);
    setRunId((r) => r + 1);
  };

  const active = Math.max(step, 0);

  return (
    <div ref={rootRef} className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-12">
      {/* progress rail (desktop) */}
      <div className="hidden flex-col lg:flex">
        <ol className="relative space-y-1">
          {STEPS.map((s, i) => {
            const isDone = step > i;
            const isActive = step === i || (step === -1 && i === 0);
            return (
              <li key={s.id} className="relative">
                <button
                  onClick={() => setStep(i)}
                  className={`group flex w-full items-start gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-colors ${
                    isActive ? "bg-white shadow-pop" : "hover:bg-white/60"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold transition-colors ${
                      isDone
                        ? "bg-green text-white"
                        : isActive
                          ? "bg-ink text-paper"
                          : "bg-ink/8 text-ink/50"
                    }`}
                  >
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span>
                    <span className={`block font-display text-[15.5px] font-bold leading-tight ${isActive || isDone ? "text-ink" : "text-ink/55"}`}>
                      {s.label}
                    </span>
                    <span className={`mt-0.5 hidden text-[13.5px] leading-snug sm:block ${isActive ? "text-ink-soft" : "text-ink/40"}`}>
                      {s.sub}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <button
          onClick={replay}
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink/12 px-5 py-2.5 text-[14px] font-bold text-ink transition-all hover:border-green hover:text-green-dark"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 1.5v3h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Replay
        </button>
      </div>

      {/* stage */}
      <div className="relative min-h-[460px] sm:min-h-[440px] overflow-hidden rounded-[28px] bg-pine p-5 sm:p-8">
        {/* stage backdrop: soft spotlight, nothing gridded */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 50% 38%, rgba(14,207,127,0.14), transparent 70%)",
          }}
        />
        {/* mobile narrator: keeps the story attached to the stage */}
        <div className="relative z-10 mb-4 flex items-center gap-2.5 lg:hidden">
          <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-extrabold tabular-nums text-paper">
            {Math.min(active + 1, STEPS.length)}/{STEPS.length}
          </span>
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 text-[13.5px] font-bold leading-snug text-paper"
          >
            {STEPS[Math.min(active, STEPS.length - 1)].label}
          </motion.p>
          <button
            onClick={replay}
            aria-label="Replay the scene"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-paper"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 1.5v3h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <AnimatePresence mode="wait">
          {/* STEP 0 — the drop */}
          {active === 0 && (
            <Scene key={`s0-${runId}`}>
              <div className="flex h-full flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0.9, rotate: -2 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lift"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blush px-3 py-1 text-[12px] font-extrabold uppercase tracking-wide text-coral">
                      Shift dropped
                    </span>
                    <span className="text-[13px] font-semibold text-ink/45">Fri · tomorrow</span>
                  </div>
                  <p className="mt-4 font-display text-2xl font-extrabold text-ink">Closing server</p>
                  <p className="mt-1 text-[15px] font-medium text-ink-soft">5:00 – 11:00 PM · Section 3</p>
                  <div className="mt-5 flex items-center gap-3 rounded-2xl bg-cream p-3.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral/15 font-display text-sm font-extrabold text-coral">
                      DL
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-ink">Dana L. can&apos;t make it</p>
                      <p className="text-[12.5px] text-ink/50">“so sorry, family thing 😞”</p>
                    </div>
                  </div>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="mt-6 flex items-center gap-2 text-[14px] font-semibold text-paper/80"
                >
                  <span className="h-2 w-2 rounded-full bg-green tg-pulse" />
                  Tagout picked it up. You keep expediting.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* STEP 1 — the scan */}
          {active === 1 && (
            <Scene key={`s1-${runId}`}>
              <p className="mb-4 text-center text-[14px] font-semibold text-paper/75">
                Tagout checks availability, weekly hours, and each person&apos;s real yes-rate
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {ROSTER.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.45 }}
                    className={`rounded-2xl p-4 ${
                      p.status === "pick" || p.status === "backup"
                        ? "bg-white shadow-pop"
                        : "bg-white/55"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full font-display text-[13px] font-extrabold ${
                            p.status === "pick"
                              ? "bg-green text-white"
                              : p.status === "backup"
                                ? "bg-violet text-white"
                                : "bg-ink/10 text-ink/50"
                          }`}
                        >
                          {initials(p.name)}
                        </span>
                        <div>
                          <p className="text-[14.5px] font-bold text-ink leading-tight">{p.name}</p>
                          <p className="text-[12px] text-ink/45">{p.hours} hrs this week</p>
                        </div>
                      </div>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.45, type: "spring", stiffness: 300, damping: 16 }}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold whitespace-nowrap ${
                          p.status === "pick"
                            ? "bg-mint text-green-dark"
                            : p.status === "backup"
                              ? "bg-lav text-violet-mid"
                              : p.status === "skip-ot"
                                ? "bg-butter text-[#9a6a00]"
                                : "bg-ink/8 text-ink/55"
                        }`}
                      >
                        {p.status === "pick" ? "Top pick" : p.status === "backup" ? "Backup" : p.status === "skip-ot" ? "OT risk · skip" : "Off · skip"}
                      </motion.span>
                    </div>
                    <p className="mt-2.5 text-[13px] font-medium text-ink-soft">{p.reason}</p>
                    {p.yes && (
                      <p className="mt-1 text-[12px] font-semibold text-ink/40">Said yes {p.yes}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </Scene>
          )}

          {/* STEP 2 — texts out */}
          {active === 2 && (
            <Scene key={`s2-${runId}`}>
              <div className="flex h-full flex-col items-center justify-center gap-4">
                {[
                  { to: "Marisa T.", msg: "Hey Marisa, it's Tagout for Harbor & Vine. Dana dropped Friday close, 5–11pm. You're at 31 hrs. Want it?", d: 0.2 },
                  { to: "Devon K.", msg: "Hey Devon, Friday close just opened up, 5–11pm. Interested? First yes takes it.", d: 1.4 },
                ].map((t) => (
                  <motion.div
                    key={t.to}
                    initial={{ opacity: 0, x: -40, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: t.d, type: "spring", stiffness: 220, damping: 22 }}
                    className="w-full max-w-md rounded-2xl bg-white p-4 shadow-pop"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[12.5px] font-extrabold uppercase tracking-wide text-ink/40">
                        Text → {t.to}
                      </p>
                      <span className="rounded-full bg-mint px-2 py-0.5 text-[10.5px] font-extrabold text-green-dark">
                        SMS
                      </span>
                    </div>
                    <p className="mt-2 rounded-2xl rounded-bl-md bg-cream px-3.5 py-2.5 text-[13.5px] leading-snug text-ink">
                      {t.msg}
                    </p>
                  </motion.div>
                ))}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="text-[13.5px] font-semibold text-paper/75"
                >
                  Two people. Not a 40-person blast that everyone ignores.
                </motion.p>
              </div>
            </Scene>
          )}

          {/* STEP 3 — the yes */}
          {active === 3 && (
            <Scene key={`s3-${runId}`}>
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 20 }}
                  className="w-full max-w-md rounded-2xl bg-white p-4 shadow-pop"
                >
                  <p className="text-[12.5px] font-extrabold uppercase tracking-wide text-ink/40">
                    Marisa T. · 5:19 PM
                  </p>
                  <p className="mt-2 ml-auto w-fit rounded-2xl rounded-br-md bg-green px-3.5 py-2.5 text-[14px] font-medium text-white">
                    omg yes 🙌 I&apos;ll take it
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  className="w-full max-w-md rounded-2xl bg-white/85 p-4"
                >
                  <p className="text-[12.5px] font-extrabold uppercase tracking-wide text-ink/40">
                    Tagout → Devon K.
                  </p>
                  <p className="mt-2 rounded-2xl rounded-bl-md bg-cream px-3.5 py-2.5 text-[13.5px] text-ink">
                    All set, Marisa grabbed it. Thanks anyway, enjoy the night off 🙏
                  </p>
                </motion.div>
              </div>
            </Scene>
          )}

          {/* STEP 4 — covered */}
          {active >= 4 && (
            <Scene key={`s4-${runId}`}>
              <div className="flex h-full flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0.92 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 16 }}
                  className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-lift"
                >
                  <div className="bg-green px-6 py-4">
                    <p className="font-display text-xl font-extrabold text-white">Friday is whole again ✓</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/8 font-display text-sm font-extrabold text-ink/40 line-through">
                        DL
                      </span>
                      <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
                        <path d="M1 7h16m0 0-5-5m5 5-5 5" stroke="#0ecf7f" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green font-display text-sm font-extrabold text-white">
                        MT
                      </span>
                      <div className="ml-1">
                        <p className="text-[15px] font-bold text-ink">Marisa T. · Fri 5–11 PM</p>
                        <p className="text-[13px] text-ink/50">Schedule updated · POS synced</p>
                      </div>
                    </div>
                    <div className="mt-5 rounded-2xl bg-cream p-4">
                      <p className="text-[12.5px] font-extrabold uppercase tracking-wide text-ink/40">
                        Your entire involvement
                      </p>
                      <p className="mt-1.5 text-[14.5px] font-medium text-ink">
                        📲 “Fri close covered: Dana out, Marisa in. Nothing needed from you.”
                      </p>
                    </div>
                    <p className="mt-4 text-center text-[13px] font-semibold text-ink/45">
                      7 minutes, start to finish. Zero calls made.
                    </p>
                  </div>
                </motion.div>
              </div>
            </Scene>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Scene({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-full"
    >
      {children}
    </motion.div>
  );
}
