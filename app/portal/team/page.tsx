"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePortal, uid, flexScore } from "@/lib/portal/store";
import { Avatar, Chip, GreenBtn, GhostBtn, PageTitle, TagBubble } from "@/components/portal/ui";
import ProfileSheet from "@/components/portal/ProfileSheet";
import type { Role, Staff } from "@/lib/portal/data";

export default function TeamPage() {
  const { state, dispatch } = usePortal();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [sort, setSort] = useState<"name" | "flex">("flex");
  const sorted = [...state.staff].sort((a, b) =>
    sort === "flex" ? flexScore(b) - flexScore(a) : a.name.localeCompare(b.name)
  );
  const profile = state.staff.find((s) => s.id === profileId) ?? null;
  const staffOf = (id: string) => state.staff.find((s) => s.id === id);

  const pendingTimeOff = state.timeOff.filter((t) => t.state === "pending");
  const decided = state.timeOff.filter((t) => t.state !== "pending");

  return (
    <div className="mx-auto max-w-6xl">
      <PageTitle
        title="Team"
        sub="Everyone on your roster, how their week looks, and who's still onboarding."
        right={
          <div className="flex items-center gap-2">
            <div className="flex rounded-full bg-white p-1 shadow-pop">
              {(["flex", "name"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setSort(k)}
                  className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-extrabold transition-colors ${
                    sort === k ? "bg-green-dark text-white" : "text-ink/45"
                  }`}
                >
                  {k === "flex" ? "Most flexible" : "A to Z"}
                </button>
              ))}
            </div>
            <GreenBtn onClick={() => setInviteOpen(true)}>+ Add team member</GreenBtn>
          </div>
        }
      />

      {/* time off requests: decisions first */}
      {pendingTimeOff.length > 0 && (
        <section className="mb-6 rounded-[28px] bg-lav/50 p-5">
          <h2 className="font-display text-[17px] font-extrabold text-ink">Time off waiting on you</h2>
          <div className="mt-3 space-y-2.5">
            {pendingTimeOff.map((t) => (
              <TimeOffCard key={t.id} t={t} person={staffOf(t.staffId)} dispatch={dispatch} />
            ))}
          </div>
        </section>
      )}

      {/* roster */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((p, i) => (
          <StaffCard key={p.id} p={p} rank={sort === "flex" ? i + 1 : 0} dispatch={dispatch} onOpen={() => setProfileId(p.id)} />
        ))}
      </div>

      {/* decided time off, quiet history */}
      {decided.length > 0 && (
        <p className="mt-6 text-[12.5px] font-semibold text-ink/40">
          Recent:{" "}
          {decided
            .map((t) => `${staffOf(t.staffId)?.first} · ${t.range} · ${t.state === "approved" ? "approved" : "declined"}`)
            .join("  ·  ")}
        </p>
      )}

      <AnimatePresence>
        {inviteOpen && <InviteModal key="invite" onClose={() => setInviteOpen(false)} />}
        {profile && <ProfileSheet key="profile" person={profile} onClose={() => setProfileId(null)} />}
      </AnimatePresence>
    </div>
  );
}

function StaffCard({
  p,
  rank,
  dispatch,
  onOpen,
}: {
  p: Staff;
  rank: number;
  dispatch: ReturnType<typeof usePortal>["dispatch"];
  onOpen: () => void;
}) {
  const pct = Math.min(100, (p.hoursWeek / 40) * 100);
  const score = flexScore(p);
  return (
    <motion.div
      layout
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      className="cursor-pointer rounded-3xl bg-white p-5 shadow-pop transition-transform hover:scale-[1.01]"
    >
      <div className="flex items-start gap-3.5">
        <Avatar person={p} size={52} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[16.5px] font-extrabold text-ink">{p.name}</p>
          <p className="text-[12.5px] font-bold text-ink/45">
            {p.role} · {p.phone}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {score > 0 && (
              <Chip tone={score >= 70 ? "mint" : score >= 45 ? "lav" : "white"}>
                {rank > 0 && rank <= 3 ? `#${rank} · ` : ""}Flexibility {score}
              </Chip>
            )}
            {p.status === "invited" && <Chip tone="butter">Invite sent</Chip>}
            {p.status === "pending" && <Chip tone="lav">Onboarding</Chip>}
            {p.keyholder && <Chip tone="mint">🔑 Keyholder</Chip>}
            {p.minor && <Chip tone="blush">Minor · 17</Chip>}
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
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[12px] font-semibold text-ink/50">
            <span className="whitespace-nowrap">
              Says yes {p.yesRate > 0 ? `${Math.round(p.yesRate * 10)} of 10 asks` : "· new"}
            </span>
            <span className="min-w-0 truncate text-right">{p.availNote}</span>
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-2xl bg-cream p-3">
          <p className="text-[12.5px] font-semibold leading-snug text-ink/60">{p.availNote}</p>
          <div className="mt-2.5 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({
                  type: "FEED_PUSH",
                  event: { id: uid("f"), kind: "onboard", who: p.id, text: `Invite re-sent to ${p.first}`, sub: "same text, fresh nudge", when: "Just now" },
                });
              }}
              className="rounded-full bg-green-dark px-3.5 py-1.5 text-[12px] font-extrabold text-white"
            >
              Nudge again
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "STAFF_PATCH", id: p.id, patch: { status: "active", availNote: "Onboarded manually" } });
              }}
              className="rounded-full border-2 border-ink/12 px-3.5 py-1.5 text-[12px] font-extrabold text-ink/60 hover:border-ink"
            >
              Mark onboarded
            </button>
            {p.status === "invited" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!window.confirm(`Take back ${p.first}'s invite? Their link stops working right away.`)) return;
                  dispatch({ type: "STAFF_REMOVE", id: p.id });
                  dispatch({
                    type: "FEED_PUSH",
                    event: { id: uid("f"), kind: "onboard", who: null, text: `You took back ${p.first}'s invite`, sub: "their onboarding link no longer works", when: "Just now" },
                  });
                }}
                className="rounded-full px-2.5 py-1.5 text-[12px] font-extrabold text-coral/70 hover:text-coral"
              >
                Take back
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function TimeOffCard({
  t,
  person,
  dispatch,
}: {
  t: import("@/lib/portal/data").TimeOff;
  person: import("@/lib/portal/data").Staff | undefined;
  dispatch: ReturnType<typeof usePortal>["dispatch"];
}) {
  const [mode, setMode] = useState<null | "approve" | "decline">(null);
  const [noteText, setNoteText] = useState("");
  const first = person?.first ?? "them";

  const send = () => {
    const state = mode === "approve" ? ("approved" as const) : ("denied" as const);
    dispatch({ type: "TIMEOFF", id: t.id, state });
    dispatch({
      type: "FEED_PUSH",
      event: {
        id: uid("f"),
        kind: "swap",
        who: t.staffId,
        text:
          mode === "approve"
            ? `You approved ${first}'s time off (${t.range})`
            : `You declined ${first}'s time off (${t.range})`,
        sub: noteText.trim()
          ? `your note went with the text: "${noteText.trim()}"`
          : mode === "approve"
            ? "Tagout texted the confirmation and blocked those days"
            : "Tagout let them down easy and offered to find a swap instead",
        when: "Just now",
      },
    });
  };

  return (
    <div className="rounded-2xl bg-white p-3.5 shadow-pop">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar person={person ?? null} size={38} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-extrabold text-ink">
            {first} · {t.range}
          </p>
          <p className="truncate text-[12.5px] font-semibold text-ink/50">{t.reason}</p>
        </div>
      </div>
      {mode === null ? (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setMode("approve")}
            className="flex-1 rounded-full bg-green px-4 py-2.5 text-[13px] font-extrabold text-ink hover:bg-green-deep hover:text-white"
          >
            Approve…
          </button>
          <button
            onClick={() => setMode("decline")}
            className="flex-1 whitespace-nowrap rounded-full border-2 border-ink/12 px-4 py-2.5 text-[13px] font-extrabold text-ink/60 hover:border-ink"
          >
            Decline…
          </button>
        </div>
      ) : (
        <div className="mt-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={2}
            placeholder={
              mode === "approve"
                ? `Note for ${first} (optional): "have fun at the wedding!"`
                : `Tell ${first} why (goes in the text): "we're slammed that weekend"`
            }
            className="w-full rounded-2xl border-2 border-ink/10 px-3.5 py-2.5 text-[13.5px] font-semibold text-ink outline-none focus:border-green"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={send}
              className={`flex-1 rounded-full px-4 py-2.5 text-[13px] font-extrabold ${
                mode === "approve" ? "bg-green text-ink hover:bg-green-deep hover:text-white" : "bg-coral text-white"
              }`}
            >
              {mode === "approve" ? "Approve & text " + first : "Decline & text " + first}
            </button>
            <button onClick={() => setMode(null)} className="px-2 text-[13px] font-bold text-ink/45">
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InviteModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = usePortal();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("Server");
  const [sent, setSent] = useState(false);

  const valid = name.trim().split(" ").length >= 1 && phone.replace(/\D/g, "").length === 10;
  const first = name.trim().split(" ")[0] || "there";

  const send = () => {
    dispatch({ type: "STAFF_INVITE", name: name.trim(), phone, role });
    dispatch({
      type: "FEED_PUSH",
      event: { id: uid("f"), kind: "onboard", who: null, text: `Invite texted to ${name.trim()}`, sub: "one YES and they're on the roster. No app, no meeting", when: "Just now" },
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
            <h2 className="font-display text-[21px] font-extrabold text-ink">Add a team member</h2>
            <p className="mt-1 text-[13px] font-medium text-ink/50">
              Onboarding is one text. They reply YES, then finish from a link: availability, a photo, and they are in.
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
            <div className="mt-4 rounded-2xl bg-[#f1f3f2] p-3.5">
              <p className="mb-2 text-center text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink/35">
                Message preview
              </p>
              <TagBubble>
                Hey {first}! {state.gmFirst} added you to the {state.houseName} schedule on Tagout. Reply YES and I&apos;ll text you a link to finish setting up: your availability, a photo, and you&apos;re on the schedule.
              </TagBubble>
            </div>
            <GreenBtn className="mt-4 w-full" disabled={!valid} onClick={send}>
              Text the invite →
            </GreenBtn>

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
