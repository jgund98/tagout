"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePortal, uid } from "@/lib/portal/store";
import { Avatar, Chip, GreenBtn, GhostBtn, PageTitle, TagBubble, DemoNote } from "@/components/portal/ui";
import type { Role, Staff } from "@/lib/portal/data";

export default function TeamPage() {
  const { state, dispatch } = usePortal();
  const [inviteOpen, setInviteOpen] = useState(false);
  const staffOf = (id: string) => state.staff.find((s) => s.id === id);

  const pendingTimeOff = state.timeOff.filter((t) => t.state === "pending");
  const decided = state.timeOff.filter((t) => t.state !== "pending");

  return (
    <div className="mx-auto max-w-6xl">
      <PageTitle
        title="The crew"
        sub="Everyone on your roster, how their week looks, and who's still onboarding."
        right={<GreenBtn onClick={() => setInviteOpen(true)}>+ Add someone</GreenBtn>}
      />

      {/* time off requests: decisions first */}
      {pendingTimeOff.length > 0 && (
        <section className="mb-6 rounded-[28px] bg-lav/50 p-5">
          <h2 className="font-display text-[17px] font-extrabold text-ink">Time off waiting on you</h2>
          <div className="mt-3 space-y-2.5">
            {pendingTimeOff.map((t) => {
              const p = staffOf(t.staffId);
              return (
                <div key={t.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3.5 shadow-pop">
                  <Avatar person={p ?? null} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-extrabold text-ink">
                      {p?.first} · {t.range}
                    </p>
                    <p className="text-[12.5px] font-semibold text-ink/50">{t.reason}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        dispatch({ type: "TIMEOFF", id: t.id, state: "approved" });
                        dispatch({ type: "FEED_PUSH", event: { id: uid("f"), kind: "swap", who: t.staffId, text: `You approved ${p?.first}'s time off (${t.range})`, sub: "Tagout texted the confirmation and blocked those days", when: "Just now" } });
                      }}
                      className="rounded-full bg-green px-4 py-2 text-[13px] font-extrabold text-ink hover:bg-green-deep hover:text-white"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        dispatch({ type: "TIMEOFF", id: t.id, state: "denied" });
                        dispatch({ type: "FEED_PUSH", event: { id: uid("f"), kind: "swap", who: t.staffId, text: `You passed on ${p?.first}'s time off (${t.range})`, sub: "Tagout let them down easy and offered to find a swap instead", when: "Just now" } });
                      }}
                      className="rounded-full border-2 border-ink/12 px-4 py-2 text-[13px] font-extrabold text-ink/60 hover:border-ink"
                    >
                      Can&apos;t this time
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* roster */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.staff.map((p) => (
          <StaffCard key={p.id} p={p} dispatch={dispatch} />
        ))}
      </div>

      {/* decided time off, quiet history */}
      {decided.length > 0 && (
        <p className="mt-6 text-[12.5px] font-semibold text-ink/40">
          Recent:{" "}
          {decided
            .map((t) => `${staffOf(t.staffId)?.first} ${t.range} ${t.state === "approved" ? "✓ approved" : "· passed"}`)
            .join("  ·  ")}
        </p>
      )}

      <AnimatePresence>
        {inviteOpen && <InviteModal key="invite" onClose={() => setInviteOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function StaffCard({ p, dispatch }: { p: Staff; dispatch: ReturnType<typeof usePortal>["dispatch"] }) {
  const pct = Math.min(100, (p.hoursWeek / 40) * 100);
  return (
    <motion.div layout className="rounded-3xl bg-white p-5 shadow-pop">
      <div className="flex items-start gap-3.5">
        <Avatar person={p} size={52} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[16.5px] font-extrabold text-ink">{p.name}</p>
          <p className="text-[12.5px] font-bold text-ink/45">
            {p.role} · {p.phone}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {p.status === "invited" && <Chip tone="butter">invite out</Chip>}
            {p.status === "pending" && <Chip tone="lav">onboarding</Chip>}
            {p.keyholder && <Chip tone="mint">🔑 keyholder</Chip>}
            {p.minor && <Chip tone="blush">17 · curfew rules</Chip>}
          </div>
        </div>
      </div>

      {p.status === "active" || p.status === "pending" ? (
        <>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <p className="text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">This week</p>
              <p className="text-[12.5px] font-extrabold text-ink">{p.hoursWeek} hrs</p>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/8">
              <motion.div
                layout
                className={`h-full rounded-full ${p.hoursWeek > 40 ? "bg-coral" : "bg-green"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[12px] font-semibold text-ink/50">
            <span>
              Says yes {p.yesRate > 0 ? `${Math.round(p.yesRate * 10)} of 10 asks` : "— new"}
            </span>
            <span className="text-right">{p.availNote}</span>
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-2xl bg-cream p-3">
          <p className="text-[12.5px] font-semibold leading-snug text-ink/60">{p.availNote}</p>
          <div className="mt-2.5 flex gap-2">
            <button
              onClick={() =>
                dispatch({
                  type: "FEED_PUSH",
                  event: { id: uid("f"), kind: "onboard", who: p.id, text: `Invite re-sent to ${p.first}`, sub: "same text, fresh nudge", when: "Just now" },
                })
              }
              className="rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-extrabold text-paper"
            >
              Nudge again
            </button>
            <button
              onClick={() => dispatch({ type: "STAFF_PATCH", id: p.id, patch: { status: "active", availNote: "Onboarded manually" } })}
              className="rounded-full border-2 border-ink/12 px-3.5 py-1.5 text-[12px] font-extrabold text-ink/60 hover:border-ink"
            >
              Mark onboarded
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function InviteModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = usePortal();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("Server");
  const [sent, setSent] = useState(false);

  const valid = name.trim().split(" ").length >= 1 && phone.replace(/\D/g, "").length === 10;
  const first = name.trim().split(" ")[0] || "them";

  const send = () => {
    dispatch({ type: "STAFF_INVITE", name: name.trim(), phone, role });
    dispatch({
      type: "FEED_PUSH",
      event: { id: uid("f"), kind: "onboard", who: null, text: `Invite texted to ${name.trim()}`, sub: "one YES and they're on the roster — no app, no meeting", when: "Just now" },
    });
    setSent(true);
    setTimeout(onClose, 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-lift"
        role="dialog"
        aria-label="Add someone to the crew"
      >
        {!sent ? (
          <>
            <h2 className="font-display text-[20px] font-extrabold text-ink">Add someone to the crew</h2>
            <p className="mt-1 text-[13px] font-medium text-ink/50">
              Onboarding is one text. They reply YES, answer availability, add a photo — done.
            </p>
            <div className="mt-4 space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-xl border-2 border-ink/10 px-3.5 py-2.5 text-[14.5px] font-bold text-ink outline-none focus:border-green"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="Cell number"
                className="w-full rounded-xl border-2 border-ink/10 px-3.5 py-2.5 text-[14.5px] font-bold text-ink outline-none focus:border-green"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full rounded-xl border-2 border-ink/10 px-3.5 py-2.5 text-[14.5px] font-bold text-ink outline-none focus:border-green"
              >
                {(["Server", "Bartender", "Host", "Line cook", "Prep", "Busser"] as Role[]).map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="mt-4 rounded-2xl bg-[#f4f2ec] p-3.5">
              <p className="mb-2 text-center text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink/35">
                The text {first} will get
              </p>
              <TagBubble>
                Hey {first}! {state.gmFirst} added you to the {state.houseName} schedule on Tagout. Reply
                YES and I&apos;ll get you set up — takes about a minute, right here in texts.
              </TagBubble>
            </div>
            <GreenBtn className="mt-4 w-full" disabled={!valid} onClick={send}>
              Text the invite →
            </GreenBtn>
            <DemoNote>Demo mode: the invite lands on the roster instantly; real texting turns on with the SMS provider.</DemoNote>
          </>
        ) : (
          <div className="py-8 text-center">
            <motion.p initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-[40px]">📲</motion.p>
            <p className="mt-2 font-display text-[19px] font-extrabold text-ink">Invite&apos;s out.</p>
            <p className="text-[13.5px] font-medium text-ink/50">You&apos;ll see it in the feed when they reply YES.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
