"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BubbleMark } from "@/components/Wordmark";
import { startDemoSession } from "@/lib/portal/store";

/**
 * Phone-first sign in, because everything at Tagout starts with a text.
 * Until the SMS provider is wired up, the demo account (Jordan's number)
 * gets a visible bypass code of all zeros.
 */
const DEMO_PHONE = "5613249522";
const OTP_LEN = 6;

const digitsOnly = (v: string) => v.replace(/\D/g, "");
const fmtPhone = (v: string) => {
  const d = digitsOnly(v).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp" | "waitlist">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LEN).fill(""));
  const [err, setErr] = useState("");
  const [resent, setResent] = useState(false);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const submitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    const d = digitsOnly(phone);
    if (d.length !== 10) {
      setErr("That doesn't look like a 10-digit cell number.");
      return;
    }
    setErr("");
    setStep(d === DEMO_PHONE ? "otp" : "waitlist");
  };

  const setDigit = (i: number, v: string) => {
    const d = digitsOnly(v).slice(-1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    if (d && i < OTP_LEN - 1) boxes.current[i + 1]?.focus();
    if (next.every((x) => x !== "")) {
      if (next.join("") === "0".repeat(OTP_LEN)) {
        startDemoSession();
        router.push("/portal");
      } else {
        setErr("That code didn't match. Check the text or resend.");
        setOtp(Array(OTP_LEN).fill(""));
        boxes.current[0]?.focus();
      }
    }
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) boxes.current[i - 1]?.focus();
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4">
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-mint blur-[110px]" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[-8%] h-[400px] w-[400px] rounded-full bg-lav blur-[110px] opacity-80" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green">
            <BubbleMark size={20} className="text-white" />
          </span>
          <span className="font-display text-[26px] font-extrabold tracking-tight text-ink">tagout</span>
        </Link>

        <div className="rounded-[32px] bg-white p-7 shadow-lift sm:p-9">
          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.form
                key="phone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={submitPhone}
              >
                <h1 className="font-display text-[26px] font-extrabold tracking-tight text-ink">
                  Sign in with a text.
                </h1>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
                  No passwords here. Enter your cell and we&apos;ll text you a six-digit code.
                </p>
                <label className="mt-6 block text-[12px] font-extrabold uppercase tracking-wide text-ink/45">
                  Cell phone
                </label>
                <input
                  inputMode="tel"
                  autoFocus
                  value={phone}
                  onChange={(e) => setPhone(fmtPhone(e.target.value))}
                  placeholder="(561) 555-0123"
                  className="mt-1.5 w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3.5 font-display text-[20px] font-extrabold tracking-wide text-ink outline-none transition-colors focus:border-green"
                />
                {err && <p className="mt-2 text-[13px] font-bold text-coral">{err}</p>}
                <button
                  type="submit"
                  className="mt-5 w-full rounded-full bg-green py-4 text-[16.5px] font-extrabold text-ink transition-all hover:bg-green-deep hover:text-white"
                >
                  Text me my code →
                </button>
                <p className="mt-4 text-center text-[12.5px] font-semibold text-ink/40">
                  Staff and managers both sign in here. Your role decides what you see.
                </p>
              </motion.form>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h1 className="font-display text-[26px] font-extrabold tracking-tight text-ink">
                  Check your texts.
                </h1>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
                  We sent a code to <span className="font-bold text-ink">{fmtPhone(phone)}</span>.
                </p>
                <div className="mt-6 flex justify-between gap-2">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        boxes.current[i] = el;
                      }}
                      inputMode="numeric"
                      autoFocus={i === 0}
                      value={d}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => onKey(i, e)}
                      aria-label={`Digit ${i + 1}`}
                      className="h-14 w-full rounded-2xl border-2 border-ink/10 bg-white text-center font-display text-[24px] font-extrabold text-ink outline-none transition-colors focus:border-green"
                    />
                  ))}
                </div>
                {err && <p className="mt-3 text-[13px] font-bold text-coral">{err}</p>}
                <button
                  onClick={() => {
                    setErr("");
                    setResent(true);
                    setTimeout(() => setResent(false), 4000);
                  }}
                  className="mt-5 w-full rounded-full border-2 border-ink/10 py-3 text-[14px] font-extrabold text-ink/60 transition-colors hover:border-ink hover:text-ink"
                >
                  {resent ? "Code re-sent ✓" : "Didn't get it? Resend"}
                </button>
                <button
                  onClick={() => {
                    setStep("phone");
                    setOtp(Array(OTP_LEN).fill(""));
                    setErr("");
                  }}
                  className="mt-4 text-[13.5px] font-bold text-ink/45 hover:text-ink"
                >
                  ← Different number
                </button>
              </motion.div>
            )}

            {step === "waitlist" && (
              <motion.div
                key="wait"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h1 className="font-display text-[26px] font-extrabold tracking-tight text-ink">
                  Your house isn&apos;t on Tagout yet.
                </h1>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
                  That number isn&apos;t on a roster we run. If your restaurant uses Tagout, ask
                  your GM to add you; onboarding is one text. If you&apos;re the GM, we&apos;d love
                  to show you around.
                </p>
                <Link
                  href="/demo"
                  className="mt-6 block w-full rounded-full bg-green py-4 text-center text-[16.5px] font-extrabold text-ink transition-all hover:bg-green-deep hover:text-white"
                >
                  Get a demo →
                </Link>
                <button
                  onClick={() => {
                    setStep("phone");
                    setErr("");
                  }}
                  className="mt-4 text-[13.5px] font-bold text-ink/45 hover:text-ink"
                >
                  ← Try another number
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center text-[13px] font-semibold text-ink/40">
          <Link href="/" className="hover:text-ink">← Back to trytagout.com</Link>
        </p>
      </div>
    </section>
  );
}
