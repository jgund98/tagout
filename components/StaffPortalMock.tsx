"use client";

import { motion } from "framer-motion";

/**
 * The staff web portal, proving "there's a full app too."
 * Rendered as a phone-sized web view of tagout.app.
 */
export default function StaffPortalMock({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[340px] overflow-hidden rounded-[28px] bg-white shadow-lift ${className}`}>
      {/* browser bar */}
      <div className="flex items-center gap-2 border-b border-ink/8 bg-cream px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="mx-auto rounded-full bg-white px-4 py-1 text-[11px] font-bold text-ink/50">
          tagout.app
        </span>
        <span className="w-5" />
      </div>

      <div className="p-4">
        {/* greeting */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green font-display text-[13px] font-extrabold text-white">
              MT
            </span>
            <div>
              <p className="font-display text-[15px] font-extrabold leading-tight text-ink">
                Hey, Marisa
              </p>
              <p className="text-[11px] font-semibold text-ink/45">Harbor &amp; Vine · this week</p>
            </div>
          </div>
          <span className="rounded-full bg-mint px-2.5 py-1 text-[10.5px] font-extrabold text-green-dark">
            22 hrs
          </span>
        </div>

        {/* my week */}
        <p className="mt-4 text-[10.5px] font-extrabold uppercase tracking-wide text-ink/40">
          My week
        </p>
        <div className="mt-1.5 space-y-1.5">
          {[
            { d: "Tue", s: "5–11 PM · Server · Sec 3" },
            { d: "Thu", s: "5–11 PM · Server · Sec 3" },
            { d: "Sat", s: "11–5 PM · Server · Patio" },
          ].map((r) => (
            <div key={r.d} className="flex items-center gap-3 rounded-xl bg-cream px-3 py-2">
              <span className="w-8 font-display text-[13px] font-extrabold text-ink">{r.d}</span>
              <span className="text-[12.5px] font-semibold text-ink-soft">{r.s}</span>
            </div>
          ))}
        </div>

        {/* open shift */}
        <p className="mt-4 text-[10.5px] font-extrabold uppercase tracking-wide text-ink/40">
          Open near you
        </p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-1.5 flex items-center justify-between gap-3 rounded-xl bg-lav px-3 py-2.5"
        >
          <div>
            <p className="text-[13px] font-extrabold text-violet-deep">Fri 5–11 PM · Server</p>
            <p className="text-[11px] font-semibold text-violet-mid">Keeps you under 40 hrs</p>
          </div>
          <span className="rounded-full bg-violet px-3.5 py-1.5 text-[12px] font-extrabold text-white">
            Grab it
          </span>
        </motion.div>

        {/* quick actions */}
        <div className="mt-4 grid grid-cols-3 gap-1.5 border-t border-ink/6 pt-3">
          {["Swap", "Time off", "Availability"].map((a) => (
            <span
              key={a}
              className="rounded-full border border-ink/10 py-1.5 text-center text-[11.5px] font-bold text-ink-soft"
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
