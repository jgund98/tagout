"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePortal } from "@/lib/portal/store";
import { answer, SUGGESTIONS } from "@/lib/portal/tagai";
import { BubbleMark } from "@/components/Wordmark";

type Msg = { role: "user" | "ai"; text: string; actions?: { label: string; href: string }[] };

export default function TagAiPage() {
  const { state } = usePortal();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: `Evening, ${state.gmFirst}. I'm reading the live board at ${state.houseName}. Ask me anything on it.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, thinking]);

  // the chat is a fixed screen on mobile: the page behind it must not scroll
  // or rubber-band while the keyboard opens and closes
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const ask = (q: string) => {
    const question = q.trim();
    if (!question || thinking) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: question }]);
    setThinking(true);
    setTimeout(() => {
      const a = answer(question, state);
      setMsgs((m) => [...m, { role: "ai", text: a.text, actions: a.actions }]);
      setThinking(false);
    }, 650);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-10 mx-auto flex w-full max-w-3xl flex-col px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-4 lg:static lg:inset-auto lg:h-[calc(100dvh-140px)] lg:px-0 lg:pb-0 lg:pt-0">
      {/* header */}
      <div className="flex items-center gap-3 pb-4">
        <Link
          href="/portal"
          aria-label="Back to Today"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-pop lg:hidden"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-green shadow-[0_0_28px_rgb(14_207_127/0.45)]">
          <BubbleMark size={22} className="text-white" />
        </span>
        <div>
          <h1 className="font-display text-[22px] font-extrabold leading-none text-ink">TagAI</h1>
          <p className="mt-1 text-[12.5px] font-semibold text-ink/45">Answers from the live board</p>
        </div>
      </div>

      {/* thread */}
      <div className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain rounded-[28px] bg-white p-4 shadow-pop sm:p-5">
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={m.role === "user" ? "flex justify-end" : "flex items-start gap-2.5"}
            >
              {m.role === "ai" && (
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green">
                  <BubbleMark size={14} className="text-white" />
                </span>
              )}
              <div className={m.role === "user" ? "max-w-[85%]" : "max-w-[85%]"}>
                <p
                  className={
                    m.role === "user"
                      ? "rounded-[18px] rounded-br-md bg-green-dark px-4 py-2.5 text-[14.5px] font-semibold leading-relaxed text-white"
                      : "rounded-[18px] rounded-bl-md bg-cream px-4 py-2.5 text-[14.5px] font-medium leading-relaxed text-ink"
                  }
                >
                  {m.text}
                </p>
                {m.actions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.actions.map((a) => (
                      <Link
                        key={a.href + a.label}
                        href={a.href}
                        className="rounded-full bg-green px-3.5 py-1.5 text-[12.5px] font-extrabold text-ink transition-all hover:bg-green-deep hover:text-white"
                      >
                        {a.label} →
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {thinking && (
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green">
              <BubbleMark size={14} className="text-white" />
            </span>
            <span className="flex items-center gap-1 rounded-[18px] rounded-bl-md bg-cream px-4 py-3">
              <span className="tg-dot h-1.5 w-1.5 rounded-full bg-ink/50" />
              <span className="tg-dot h-1.5 w-1.5 rounded-full bg-ink/50" />
              <span className="tg-dot h-1.5 w-1.5 rounded-full bg-ink/50" />
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* suggestions */}
      {msgs.length < 3 && (
        <div className="no-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1">
          {SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              onClick={() => ask(sug)}
              className="shrink-0 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-ink/60 shadow-pop transition-colors hover:text-ink"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="mt-3 flex items-center gap-2 rounded-full bg-white p-1.5 shadow-lift"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about tonight, the schedule, anyone on the team"
          enterKeyHint="send"
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-[16px] font-semibold text-ink outline-none placeholder:text-ink/35 lg:text-[14.5px]"
        />
        <button
          type="submit"
          disabled={!input.trim() || thinking}
          aria-label="Send"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green text-white transition-all hover:bg-green-deep disabled:opacity-40"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M8 13V3M8 3 3.5 7.5M8 3l4.5 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}
