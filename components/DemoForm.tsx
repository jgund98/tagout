"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CURRENT = [
  "HotSchedules",
  "7shifts",
  "Sling",
  "When I Work",
  "Homebase",
  "Paper / spreadsheet",
  "Other",
];

const inputCls =
  "w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3.5 text-[15.5px] font-medium text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-green";

export default function DemoForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [locations, setLocations] = useState("1");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(false);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, locations }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="relative rounded-[28px] bg-white p-6 shadow-lift sm:p-8">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[420px] flex-col items-center justify-center py-10 text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green text-3xl text-white">
              ✓
            </span>
            <h2 className="mt-6 font-display text-3xl font-extrabold text-ink">
              You&apos;re on the books.
            </h2>
            <p className="mt-3 max-w-sm text-[15.5px] leading-relaxed text-ink-soft">
              We&apos;ll <strong className="text-ink">text you</strong> within one business
              day to lock in a time. Of course we text. It&apos;s kind of our whole thing.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={false}
            className="space-y-4"
          >
            <h2 className="font-display text-2xl font-extrabold text-ink">Book your demo</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-extrabold uppercase tracking-wide text-ink/45">
                  First name
                </span>
                <input required name="firstName" autoComplete="given-name" placeholder="Sam" className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-extrabold uppercase tracking-wide text-ink/45">
                  Last name
                </span>
                <input required name="lastName" autoComplete="family-name" placeholder="Rivera" className={inputCls} />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-extrabold uppercase tracking-wide text-ink/45">
                Work email
              </span>
              <input required type="email" name="email" autoComplete="email" placeholder="sam@yourrestaurant.com" className={inputCls} />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-extrabold uppercase tracking-wide text-ink/45">
                Cell phone <span className="normal-case text-ink/35">(we&apos;ll text to schedule)</span>
              </span>
              <input required type="tel" name="phone" autoComplete="tel" placeholder="(555) 210-4477" className={inputCls} />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-extrabold uppercase tracking-wide text-ink/45">
                  Restaurant / group
                </span>
                <input required name="company" autoComplete="organization" placeholder="Harbor & Vine" className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-extrabold uppercase tracking-wide text-ink/45">
                  Your role
                </span>
                <select name="role" className={inputCls} defaultValue="GM">
                  {["GM / Manager", "Owner / Operator", "Regional / Area manager", "VP Ops / Executive", "Other"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <span className="mb-1.5 block text-[13px] font-extrabold uppercase tracking-wide text-ink/45">
                Locations
              </span>
              <div className="flex flex-wrap gap-2">
                {["1", "2–5", "6–25", "26+"].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setLocations(n)}
                    className={`rounded-full px-5 py-2.5 text-[14.5px] font-extrabold transition-colors ${
                      locations === n
                        ? "bg-ink text-paper"
                        : "border-2 border-ink/10 text-ink-soft hover:border-ink/30"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-extrabold uppercase tracking-wide text-ink/45">
                Current scheduler
              </span>
              <select name="current" className={inputCls} defaultValue="HotSchedules">
                {CURRENT.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            {/* honeypot: humans never see it, bots always fill it */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
            />

            <button
              type="submit"
              disabled={sending}
              className="group w-full rounded-full bg-green py-4 text-[17px] font-extrabold text-ink transition-all hover:bg-green-deep hover:text-white hover:shadow-lift disabled:opacity-60"
            >
              {sending ? "Sending…" : "Get my demo"}
              {!sending && (
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              )}
            </button>
            {error && (
              <p className="text-center text-[13px] font-bold text-coral">
                That didn&apos;t go through. Try again, or email hello@trytagout.com.
              </p>
            )}
            <p className="text-center text-[12.5px] font-medium text-ink/40">
              No spam, no drip campaign. One text, one demo, your call.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
