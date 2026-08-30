"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { BubbleMark } from "./Wordmark";

/* ---------- iPhone-style shell ---------- */

export function PhoneShell({
  children,
  className = "",
  contact = "Tagout",
  time = "4:52",
}: {
  children: ReactNode;
  className?: string;
  contact?: string;
  time?: string;
}) {
  return (
    <div
      className={`relative w-[300px] sm:w-[320px] rounded-[44px] bg-ink p-[10px] shadow-lift ${className}`}
    >
      <div className="relative flex h-full min-h-[560px] flex-col overflow-hidden rounded-[36px] bg-[#f4f2ec]">
        {/* status bar */}
        <div className="flex items-center justify-between px-6 pt-3 text-[12px] font-semibold text-ink">
          <span>{time}</span>
          <div className="absolute left-1/2 top-2.5 h-[24px] w-[92px] -translate-x-1/2 rounded-full bg-ink" />
          <span className="flex items-center gap-1">
            <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor" aria-hidden>
              <rect x="0" y="7" width="2.5" height="4" rx="0.8" />
              <rect x="4" y="5" width="2.5" height="6" rx="0.8" />
              <rect x="8" y="2.5" width="2.5" height="8.5" rx="0.8" />
              <rect x="12" y="0" width="2.5" height="11" rx="0.8" opacity="0.35" />
            </svg>
            <svg width="22" height="11" viewBox="0 0 24 12" fill="none" aria-hidden>
              <rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke="currentColor" opacity="0.4" />
              <rect x="2" y="2" width="14" height="8" rx="1.6" fill="currentColor" />
              <path d="M22.5 4v4c1-.3 1.5-1 1.5-2s-.5-1.7-1.5-2Z" fill="currentColor" opacity="0.4" />
            </svg>
          </span>
        </div>

        {/* contact header */}
        <div className="mt-2 flex flex-col items-center border-b border-ink/8 pb-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green">
            <BubbleMark size={20} className="text-paper" />
          </div>
          <p className="mt-1 text-[12px] font-semibold text-ink">{contact}</p>
          <p className="text-[10px] text-ink/45">Text Message · SMS</p>
        </div>

        <div className="flex-1 space-y-2.5 overflow-hidden px-3.5 py-4">{children}</div>

        {/* input bar */}
        <div className="flex items-center gap-2 px-3.5 pb-5">
          <div className="flex h-9 flex-1 items-center rounded-full border border-ink/12 bg-white px-4 text-[12px] text-ink/35">
            Text message
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 13V3M8 3 3.5 7.5M8 3l4.5 4.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- bubbles ---------- */

export function Bubble({
  from,
  children,
  className = "",
}: {
  from: "tag" | "them";
  children: ReactNode;
  className?: string;
}) {
  const isTag = from === "tag";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`flex ${isTag ? "justify-start" : "justify-end"} ${className}`}
    >
      <div
        className={`max-w-[82%] rounded-[18px] px-3.5 py-2 text-[13.5px] leading-snug ${
          isTag
            ? "rounded-bl-md bg-white text-ink shadow-[0_1px_2px_rgb(15_21_18/0.08)]"
            : "rounded-br-md bg-green text-white font-medium"
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
}

export function Typing({ align = "right" }: { align?: "left" | "right" }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-center gap-1 rounded-[18px] px-3.5 py-2.5 ${
          align === "right" ? "rounded-br-md bg-green/25" : "rounded-bl-md bg-white shadow-[0_1px_2px_rgb(15_21_18/0.08)]"
        }`}
      >
        <span className="tg-dot h-1.5 w-1.5 rounded-full bg-ink/50" />
        <span className="tg-dot h-1.5 w-1.5 rounded-full bg-ink/50" />
        <span className="tg-dot h-1.5 w-1.5 rounded-full bg-ink/50" />
      </div>
    </motion.div>
  );
}

export function SystemPill({ children }: { children: ReactNode }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex justify-center pt-1"
    >
      <span className="rounded-full bg-ink px-3.5 py-1.5 text-[11px] font-bold text-paper shadow-pop">
        {children}
      </span>
    </motion.div>
  );
}

/* ---------- the hero conversation, auto-looping ---------- */

type Beat =
  | { kind: "tag"; text: ReactNode }
  | { kind: "them"; text: ReactNode }
  | { kind: "typing"; align: "left" | "right" }
  | { kind: "action"; text: string }
  | { kind: "pill"; text: string };

type Script = { beat: Beat; wait: number }[];

/** Three different, hyper-real scenarios — the hero phone rotates through them. */
const SCRIPTS: Script[] = [
  // 1 — coverage, the signature scene (staff side)
  [
    {
      beat: {
        kind: "tag",
        text: (
          <>
            Hey Marisa, it&apos;s Tagout for Harbor &amp; Vine. Dana dropped Friday close,
            5–11pm. You&apos;re at 31 hrs. Want it?
          </>
        ),
      },
      wait: 2200,
    },
    { beat: { kind: "typing", align: "right" }, wait: 1500 },
    { beat: { kind: "them", text: <>omg yes 🙌 I&apos;ll take it</> }, wait: 1400 },
    {
      beat: { kind: "tag", text: <>You&apos;re on. Schedule&apos;s updated. See you Friday 🤝</> },
      wait: 1600,
    },
    { beat: { kind: "pill", text: "Covered in 7 min. No app was opened" }, wait: 4200 },
  ],
  // 2 — the manager's command line + live orchestration across the roster
  [
    {
      beat: { kind: "them", text: <>down a busser tonight. who&apos;s off right now?</> },
      wait: 1900,
    },
    { beat: { kind: "typing", align: "left" }, wait: 1300 },
    {
      beat: {
        kind: "tag",
        text: (
          <>
            Off tonight and under 40: Devon (26 hrs), Alex (31), Sam (33). Devon&apos;s
            covered last-minute twice this month. Want me to work the list?
          </>
        ),
      },
      wait: 2600,
    },
    { beat: { kind: "them", text: <>yes go</> }, wait: 1300 },
    { beat: { kind: "action", text: "texting Devon… then Alex if he passes" }, wait: 2000 },
    {
      beat: {
        kind: "tag",
        text: <>Devon&apos;s in, there by 6:45. Board updated, and Alex got a &ldquo;never mind, thanks!&rdquo;</>,
      },
      wait: 2000,
    },
    { beat: { kind: "pill", text: "You sent 2 texts. Tagout handled the rest" }, wait: 4200 },
  ],
  // 3 — the data brain: it reads the board before you ask twice
  [
    {
      beat: { kind: "them", text: <>how are we looking for tomorrow? we have that 45-top at 7</> },
      wait: 2000,
    },
    { beat: { kind: "action", text: "reading Friday's board + party notes" }, wait: 1700 },
    {
      beat: {
        kind: "tag",
        text: (
          <>
            You&apos;re at 6 servers, two short of how you usually run a party that
            size. Jake and Sasha are free and under 40. Add both?
          </>
        ),
      },
      wait: 2700,
    },
    { beat: { kind: "them", text: <>do it</> }, wait: 1300 },
    {
      beat: {
        kind: "tag",
        text: (
          <>
            Asking both now. The full Friday board&apos;s bigger than a text:{" "}
            <span className="font-semibold text-[#0b84fe] underline decoration-[#0b84fe]/40">
              trytagout.com/b/fri
            </span>
          </>
        ),
      },
      wait: 2200,
    },
    { beat: { kind: "pill", text: "Both confirmed by 3:15. Friday's whole" }, wait: 4200 },
  ],
  // 4 — the 6 AM call-out (nobody woke the GM)
  [
    {
      beat: {
        kind: "tag",
        text: (
          <>
            Morning Luis, Sam woke up sick, so AM prep is open. Can you take 8–2
            today? You&apos;d still be under 40&nbsp;hrs.
          </>
        ),
      },
      wait: 2200,
    },
    { beat: { kind: "typing", align: "right" }, wait: 1500 },
    { beat: { kind: "them", text: <>yeah give me 30 min ☕</> }, wait: 1400 },
    {
      beat: { kind: "tag", text: <>Lifesaver. Chef knows you&apos;re coming. See you at 8 👊</> },
      wait: 1600,
    },
    { beat: { kind: "pill", text: "Covered 6:41 AM, GM still asleep" }, wait: 4200 },
  ],
  // 5 — memory + warmth: the swap that remembers why
  [
    {
      beat: { kind: "them", text: <>can I swap my Saturday? it&apos;s my mom&apos;s birthday 🎂</> },
      wait: 1900,
    },
    { beat: { kind: "action", text: "checking who can cover Saturday close" }, wait: 1600 },
    {
      beat: {
        kind: "tag",
        text: (
          <>
            Happy early birthday to your mom 🎉 Katie&apos;s free and under hours.
            She&apos;ll take Saturday if you cover her Sunday brunch. Deal?
          </>
        ),
      },
      wait: 2500,
    },
    { beat: { kind: "them", text: <>deal 🙌 tell her thank you</> }, wait: 1400 },
    { beat: { kind: "pill", text: "Swap solved. Your manager tapped Approve once" }, wait: 4200 },
  ],
];

export function HeroThread() {
  const [idx, setIdx] = useState(0);
  return (
    <ThreadPlayer
      key={idx}
      script={SCRIPTS[idx]}
      loop={false}
      onDone={() => setIdx((i) => (i + 1) % SCRIPTS.length)}
    />
  );
}

export function ScriptedThread({
  script,
  loop = false,
}: {
  script: Script;
  loop?: boolean;
}) {
  return <ThreadPlayer script={script} loop={loop} />;
}

function ThreadPlayer({
  script,
  loop,
  onDone,
}: {
  script: { beat: Beat; wait: number }[];
  loop: boolean;
  onDone?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(reduced ? script.length : 0);

  useEffect(() => {
    if (reduced) return;
    if (!inView) return;
    if (step >= script.length) {
      if (onDone) {
        const t = setTimeout(onDone, 400);
        return () => clearTimeout(t);
      }
      if (!loop) return;
      const t = setTimeout(() => setStep(0), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), script[step].wait);
    return () => clearTimeout(t);
  }, [step, inView, loop, reduced, script, onDone]);

  const visible = script.slice(0, step === 0 ? 1 : step + 1).map((s) => s.beat);
  // drop typing indicators that have been superseded by the next beat
  const rendered = visible.filter(
    (b, i) => b.kind !== "typing" || i === visible.length - 1
  );

  return (
    <div ref={ref} className="space-y-2.5">
      <AnimatePresence mode="popLayout">
        {rendered.map((b, i) =>
          b.kind === "typing" ? (
            <Typing key={`typing-${i}`} align={b.align} />
          ) : b.kind === "pill" ? (
            <SystemPill key={`pill-${i}`}>{b.text}</SystemPill>
          ) : b.kind === "action" ? (
            <motion.p
              key={`action-${i}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[10.5px] font-semibold italic text-ink/35"
            >
              {b.text}
            </motion.p>
          ) : (
            <Bubble key={`b-${i}`} from={b.kind}>
              {b.text}
            </Bubble>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
