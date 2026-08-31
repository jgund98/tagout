"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { usePortal, getSession, switchDemoRole, uid } from "@/lib/portal/store";
import { GreenBtn } from "@/components/portal/ui";
import { BubbleMark } from "@/components/Wordmark";

/**
 * The setup link a new hire lands on after the GM invites them.
 * Three steps, under a minute, ends inside their staff app.
 */
export default function WelcomePage() {
  const { state, dispatch } = usePortal();
  const router = useRouter();

  const meId = getSession()?.personId ?? "tyler";
  const me = state.staff.find((s) => s.id === meId) ?? state.staff[0];

  const [step, setStep] = useState(0);
  const [first, setFirst] = useState(me.first === "Hey" ? "" : me.first);
  const [last, setLast] = useState(me.name.split(" ").slice(1).join(" "));
  const [avail, setAvail] = useState("Anytime");
  const [agreed, setAgreed] = useState(false);

  const finish = () => {
    dispatch({
      type: "STAFF_PATCH",
      id: me.id,
      patch: {
        status: "active",
        first: first.trim() || me.first,
        name: `${first.trim() || me.first} ${last.trim()}`.trim(),
        availNote: avail,
      },
    });
    dispatch({
      type: "FEED_PUSH",
      event: { id: uid("f"), kind: "onboard", who: me.id, text: `${first.trim() || me.first} finished setup`, sub: `availability: ${avail.toLowerCase()}`, when: "Just now" },
    });
    switchDemoRole("staff", me.id);
    router.push("/me");
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="mx-auto flex h-16 w-full max-w-[460px] items-center gap-2.5 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green">
          <BubbleMark size={18} className="text-white" />
        </span>
        <span className="font-display text-[19px] font-extrabold text-ink">tagout</span>
        <span className="ml-auto text-[12px] font-bold text-ink/35">Step {step + 1} of 3</span>
      </header>

      {/* progress */}
      <div className="mx-auto w-full max-w-[460px] px-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-ink/8">
          <motion.div
            animate={{ width: `${((step + 1) / 3) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full rounded-full bg-green"
          />
        </div>
      </div>

      <main className="mx-auto w-full max-w-[460px] flex-1 px-5 pb-10 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {step === 0 && (
              <>
                <h1 className="font-display text-[28px] font-extrabold leading-tight text-ink">
                  You&apos;re joining {state.houseName}
                </h1>
                <p className="mt-2 text-[14.5px] font-semibold text-ink/50">
                  {state.gmFirst} added you as a {me.role.toLowerCase()}. Confirm your name so the
                  schedule reads right.
                </p>
                <div className="mt-6 space-y-2.5">
                  <input
                    value={first}
                    onChange={(e) => setFirst(e.target.value)}
                    placeholder="First name"
                    className="w-full rounded-xl border-2 border-ink/10 bg-white px-4 py-3 text-[15px] font-bold text-ink outline-none focus:border-green"
                  />
                  <input
                    value={last}
                    onChange={(e) => setLast(e.target.value)}
                    placeholder="Last name"
                    className="w-full rounded-xl border-2 border-ink/10 bg-white px-4 py-3 text-[15px] font-bold text-ink outline-none focus:border-green"
                  />
                  <div className="rounded-xl bg-white px-4 py-3 text-[14px] font-semibold text-ink/45">
                    Phone · <span className="font-extrabold text-ink">{me.phone}</span>
                    <span className="block text-[11.5px] text-ink/35">verified when you opened this link</span>
                  </div>
                </div>
                <GreenBtn className="mt-6 w-full" disabled={!first.trim()} onClick={() => setStep(1)}>
                  Next
                </GreenBtn>
              </>
            )}

            {step === 1 && (
              <>
                <h1 className="font-display text-[28px] font-extrabold leading-tight text-ink">
                  When can you work?
                </h1>
                <p className="mt-2 text-[14.5px] font-semibold text-ink/50">
                  Tagout only offers you shifts that fit. Change this any time in your profile.
                </p>
                <div className="mt-6 space-y-2">
                  {["Anytime", "Not Sundays", "Weeknights only", "Days only"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAvail(opt)}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-[15px] font-extrabold transition-colors ${
                        avail === opt ? "bg-green-dark text-white" : "bg-white text-ink shadow-pop"
                      }`}
                    >
                      {opt}
                      {avail === opt && <span aria-hidden>✓</span>}
                    </button>
                  ))}
                </div>
                <GreenBtn className="mt-6 w-full" onClick={() => setStep(2)}>
                  Next
                </GreenBtn>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="font-display text-[28px] font-extrabold leading-tight text-ink">
                  How shifts reach you
                </h1>
                <div className="mt-5 space-y-2.5">
                  {[
                    ["💬", "Texts come from one number", "Save it. Schedule, pickups, and swaps all happen there."],
                    ["👍", "Reply YES to take a shift", "First yes wins. No group threads, no pile-ons."],
                    ["🌙", "Quiet hours are respected", `No texts overnight unless ${state.gmFirst} marks it urgent.`],
                  ].map(([icon, title, sub]) => (
                    <div key={title} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-pop">
                      <span aria-hidden className="text-[20px]">{icon}</span>
                      <p className="text-[14.5px] font-extrabold leading-snug text-ink">
                        {title}
                        <span className="block text-[12.5px] font-semibold text-ink/45">{sub}</span>
                      </p>
                    </div>
                  ))}
                </div>
                <label className="mt-5 flex items-start gap-3 rounded-2xl bg-white p-4 shadow-pop">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-5 w-5 accent-[#0ecf7f]"
                  />
                  <span className="text-[13px] font-semibold leading-snug text-ink/60">
                    OK to text me about my schedule at {me.phone}. Reply STOP any time; message rates may apply.
                  </span>
                </label>
                <GreenBtn className="mt-6 w-full" disabled={!agreed} onClick={finish}>
                  Finish setup
                </GreenBtn>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
