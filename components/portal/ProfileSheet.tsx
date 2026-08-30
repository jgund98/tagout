"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePortal, uid } from "@/lib/portal/store";
import { Avatar, Chip, GreenBtn } from "./ui";
import type { Role, Staff } from "@/lib/portal/data";

/**
 * The person's file: everything the system knows from onboarding plus what
 * it has learned since. Editable where a GM would actually edit.
 */
export default function ProfileSheet({ person, onClose }: { person: Staff; onClose: () => void }) {
  const { state, dispatch } = usePortal();
  const p = state.staff.find((s) => s.id === person.id) ?? person;
  const [avail, setAvail] = useState(p.availNote);

  const recent = state.feed.filter((f) => f.who === p.id).slice(0, 3);
  const week = state.shifts.filter((s) => s.staffId === p.id && s.state !== "open");

  const save = (patch: Partial<Staff>, note?: string) => {
    dispatch({ type: "STAFF_PATCH", id: p.id, patch });
    if (note)
      dispatch({
        type: "FEED_PUSH",
        event: { id: uid("f"), kind: "rule", who: p.id, text: note, sub: "updated in their file, applies to every offer", when: "Just now" },
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-white p-6 shadow-lift sm:rounded-[28px]"
        role="dialog"
        aria-label={`${p.name}'s profile`}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink/15 sm:hidden" />

        {/* header */}
        <div className="flex items-center gap-4">
          <Avatar person={p} size={64} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[21px] font-extrabold text-ink">{p.name}</p>
            <p className="text-[13px] font-bold text-ink/45">
              {p.phone} · since {p.since}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {p.keyholder && <Chip tone="mint">🔑 Keyholder</Chip>}
              {p.minor && <Chip tone="blush">Minor · 17</Chip>}
              {p.certs.map((c) => (
                <Chip key={c} tone="lav">{c}</Chip>
              ))}
            </div>
          </div>
          <a
            href={`sms:${p.phone.replace(/\D/g, "")}`}
            className="shrink-0 rounded-full bg-green px-4 py-2.5 text-[13.5px] font-extrabold text-ink"
          >
            Text
          </a>
        </div>

        {/* what Tagout has learned */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            ["Says yes", p.yesRate > 0 ? `${Math.round(p.yesRate * 10)} of 10` : "new"],
            ["Pickups", String(p.picks90)],
            ["Drops", String(p.drops90)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-cream p-3 text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-ink/40">{k}</p>
              <p className="mt-0.5 font-display text-[18px] font-extrabold text-ink">{v}</p>
            </div>
          ))}
        </div>
        <p className="mt-1.5 text-right text-[11px] font-bold text-ink/35">Last 90 days</p>
        {p.drops90 >= 3 && (
          <p className="mt-2 rounded-2xl rounded-bl-md bg-blush/50 px-3.5 py-2 text-[12.5px] font-bold text-ink">
            Pattern: {p.drops90} drops in 90 days, three of them Fridays. Kept private, worth a conversation.
          </p>
        )}

        {/* this week */}
        <div className="mt-5">
          <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">This week · {p.hoursWeek} hrs</p>
          <div className="mt-1.5 space-y-1">
            {week.length === 0 && <p className="text-[13px] font-semibold text-ink/40">Nothing scheduled</p>}
            {week.map((s) => (
              <p key={s.id} className="flex justify-between text-[13.5px] font-semibold text-ink">
                <span>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][s.day]} · {s.start}–{s.end}</span>
                <span className="text-ink/45">{s.section ?? s.role}</span>
              </p>
            ))}
          </div>
        </div>

        {/* editable: role, rate, keyholder, availability */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Role</span>
            <select
              value={p.role}
              onChange={(e) => save({ role: e.target.value as Role }, `${p.first}'s role is now ${e.target.value}`)}
              className="mt-1 w-full rounded-xl border-2 border-ink/10 px-3 py-2.5 text-[14px] font-bold text-ink outline-none focus:border-green"
            >
              {(["Server", "Bartender", "Host", "Line cook", "Prep", "Busser"] as Role[]).map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Pay rate</span>
            <div className="mt-1 flex items-center gap-2">
              <button
                onClick={() => p.rate > 8 && save({ rate: p.rate - 1 })}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream font-display font-extrabold text-ink"
                aria-label="Lower rate"
              >
                −
              </button>
              <span className="flex-1 text-center font-display text-[17px] font-extrabold text-ink">${p.rate}/hr</span>
              <button
                onClick={() => p.rate < 40 && save({ rate: p.rate + 1 })}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream font-display font-extrabold text-ink"
                aria-label="Raise rate"
              >
                +
              </button>
            </div>
          </label>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
          <span className="text-[14px] font-bold text-ink">Keyholder · can open & close</span>
          <button
            role="switch"
            aria-checked={!!p.keyholder}
            onClick={() =>
              save(
                { keyholder: !p.keyholder },
                p.keyholder ? `${p.first} is no longer a keyholder` : `${p.first} is now a keyholder`
              )
            }
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${p.keyholder ? "bg-green" : "bg-ink/15"}`}
          >
            <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-pop transition-all ${p.keyholder ? "right-0.5" : "left-0.5"}`} />
          </button>
        </div>
        <label className="mt-3 block">
          <span className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Availability</span>
          <div className="mt-1 flex gap-2">
            <input
              value={avail}
              onChange={(e) => setAvail(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border-2 border-ink/10 px-3 py-2.5 text-[14px] font-bold text-ink outline-none focus:border-green"
            />
            {avail !== p.availNote && (
              <button
                onClick={() => save({ availNote: avail }, `${p.first}'s availability updated`)}
                className="shrink-0 rounded-xl bg-green px-3.5 text-[13px] font-extrabold text-ink"
              >
                Save
              </button>
            )}
          </div>
        </label>

        {/* their recent activity */}
        {recent.length > 0 && (
          <div className="mt-5">
            <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Recent</p>
            <div className="mt-1.5 space-y-1.5">
              {recent.map((f) => (
                <p key={f.id} className="rounded-2xl rounded-bl-md bg-cream px-3.5 py-2 text-[13px] font-semibold text-ink/70">
                  {f.text} <span className="text-ink/35">· {f.when}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        <GreenBtn className="mt-6 w-full" onClick={onClose}>
          Done
        </GreenBtn>
      </motion.div>
    </motion.div>
  );
}
