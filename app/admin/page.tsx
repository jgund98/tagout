"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Chip, GreenBtn } from "@/components/portal/ui";
import { PovSwitch } from "@/components/portal/PovSwitch";
import { BubbleMark } from "@/components/Wordmark";

/**
 * Tagout HQ: the internal panel we use to run the business — onboard
 * restaurants, watch account health, and work support. Demo-seeded.
 */

type ClientStatus = "live" | "onboarding" | "trial" | "at-risk";
type Client = {
  id: string;
  name: string;
  city: string;
  gm: string;
  gmPhone: string;
  seats: number;
  status: ClientStatus;
  mrr: number;
  covers30: number;
  smsMonth: number;
  successRate: number | null;
  since: string;
  lastActive: string;
  number: string | null;
  notes: string[];
};

const ONBOARD_STEPS = [
  "Signed",
  "Number provisioned",
  "Roster imported",
  "House rules set",
  "First live cover",
];

const SEED_CLIENTS: Client[] = [
  {
    id: "hv", name: "Harbor & Vine", city: "West Palm Beach, FL", gm: "Jordan", gmPhone: "(561) 324-9522",
    seats: 13, status: "live", mrr: 377, covers30: 14, smsMonth: 412, successRate: 0.93,
    since: "Jun 2026", lastActive: "4 min ago", number: "(561) 555-8240",
    notes: ["Flagship account. GM demos it to other operators."],
  },
  {
    id: "tap", name: "The Tap Room", city: "Delray Beach, FL", gm: "Carla Mendes", gmPhone: "(561) 555-0771",
    seats: 22, status: "live", mrr: 638, covers30: 21, smsMonth: 688, successRate: 0.88,
    since: "Jul 2026", lastActive: "1 hr ago", number: "(561) 555-9031",
    notes: ["Two bars, heavy weekend volume."],
  },
  {
    id: "nona", name: "Nona's Kitchen", city: "Boynton Beach, FL", gm: "Mike Tran", gmPhone: "(561) 555-0342",
    seats: 9, status: "onboarding", mrr: 0, covers30: 0, smsMonth: 36, successRate: null,
    since: "Aug 2026", lastActive: "2 days ago", number: "(561) 555-7118",
    notes: ["Roster import waiting on their POS export."],
  },
  {
    id: "dock", name: "Dockside Grill", city: "Jupiter, FL", gm: "Ana Ruiz", gmPhone: "(561) 555-0518",
    seats: 17, status: "trial", mrr: 0, covers30: 3, smsMonth: 122, successRate: 0.75,
    since: "Aug 2026", lastActive: "Yesterday", number: "(561) 555-6402",
    notes: ["Trial ends Sep 12. Ana wants the floor plan demo."],
  },
  {
    id: "cast", name: "Castaways", city: "Stuart, FL", gm: "Deb Kowalski", gmPhone: "(772) 555-0289",
    seats: 11, status: "at-risk", mrr: 319, covers30: 1, smsMonth: 44, successRate: 0.5,
    since: "Jun 2026", lastActive: "9 days ago", number: "(772) 555-3350",
    notes: ["Usage fell off after their AGM left. Needs a check-in call."],
  },
];

const SEED_PIPELINE: { id: string; name: string; step: number; owner: string; note: string }[] = [
  { id: "nona", name: "Nona's Kitchen", step: 2, owner: "Jordan", note: "POS export promised Friday" },
  { id: "dock", name: "Dockside Grill", step: 4, owner: "Shawn", note: "trial · first cover ran Aug 27" },
  { id: "blue", name: "Blue Heron Café", step: 1, owner: "Jordan", note: "signed Aug 28, number pending 10DLC" },
];

const SEED_TICKETS: { id: string; client: string; text: string; owner: string; state: "open" | "done"; when: string }[] = [
  { id: "t1", client: "The Tap Room", text: "Two servers report pickup texts landing in spam. Check 10DLC registration on their number.", owner: "Shawn", state: "open", when: "Today, 2:10 PM" },
  { id: "t2", client: "Castaways", text: "Deb asked how to hand the account to the new AGM. Walk her through manager invites.", owner: "Jordan", state: "open", when: "Yesterday" },
  { id: "t3", client: "Nona's Kitchen", text: "Roster CSV had duplicate phone numbers. Cleaned and re-imported.", owner: "Jordan", state: "done", when: "Aug 27" },
];

const STATUS_META: Record<ClientStatus, { label: string; tone: "mint" | "butter" | "lav" | "blush" }> = {
  live: { label: "Live", tone: "mint" },
  onboarding: { label: "Onboarding", tone: "lav" },
  trial: { label: "Trial", tone: "butter" },
  "at-risk": { label: "At risk", tone: "blush" },
};

export default function AdminPage() {
  const [clients, setClients] = useState(SEED_CLIENTS);
  const [pipeline, setPipeline] = useState(SEED_PIPELINE);
  const [tickets, setTickets] = useState(SEED_TICKETS);
  const [openClient, setOpenClient] = useState<Client | null>(null);
  const [toast, setToast] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invName, setInvName] = useState("");
  const [team, setTeam] = useState([
    { name: "Jordan G.", role: "Owner", scope: "Everything" },
    { name: "Shawn W.", role: "Support", scope: "Clients + tickets" },
  ]);

  const say = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(""), 2600);
  };

  const kpis = useMemo(() => {
    const live = clients.filter((c) => c.status === "live" || c.status === "at-risk");
    return {
      mrr: clients.reduce((n, c) => n + c.mrr, 0),
      houses: live.length,
      seats: clients.reduce((n, c) => n + c.seats, 0),
      covers: clients.reduce((n, c) => n + c.covers30, 0),
      sms: clients.reduce((n, c) => n + c.smsMonth, 0),
    };
  }, [clients]);

  return (
    <div className="min-h-screen bg-cream pb-16">
      {/* topbar */}
      <header className="sticky top-0 z-30 border-b border-ink/6 bg-cream/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pine">
              <BubbleMark size={18} className="text-green" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-[17px] font-extrabold text-ink">Tagout HQ</p>
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-ink/40">Internal · client operations</p>
            </div>
          </div>
          <PovSwitch current="admin" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 pt-6 sm:px-6">
        {/* KPIs */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            [`$${kpis.mrr.toLocaleString()}`, "MRR"],
            [String(kpis.houses), "Paying houses"],
            [String(kpis.seats), "Seats on platform"],
            [String(kpis.covers), "Covers · 30d"],
            [kpis.sms.toLocaleString(), "Texts · 30d"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-3xl bg-white p-4 shadow-pop">
              <p className="font-display text-[24px] font-extrabold leading-none text-ink">{v}</p>
              <p className="mt-1.5 text-[11px] font-extrabold uppercase tracking-wide text-ink/40">{l}</p>
            </div>
          ))}
        </section>

        {/* clients */}
        <section className="rounded-3xl bg-white p-5 shadow-pop">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[18px] font-extrabold text-ink">Clients</h2>
            <button
              onClick={() => say("Onboarding link copied. Send it to the GM.")}
              className="rounded-full bg-green px-4 py-2 text-[13px] font-extrabold text-ink transition-transform hover:scale-[1.02]"
            >
              + New restaurant
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {clients.map((c) => (
              <button
                key={c.id}
                onClick={() => setOpenClient(c)}
                className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl bg-cream/70 px-4 py-3 text-left transition-colors hover:bg-cream"
              >
                <div className="min-w-[160px] flex-1">
                  <p className="text-[14.5px] font-extrabold text-ink">{c.name}</p>
                  <p className="text-[12px] font-semibold text-ink/45">{c.city} · GM {c.gm}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-[13px] font-extrabold text-ink">{c.seats} seats</p>
                  <p className="text-[11.5px] font-semibold text-ink/40">${c.mrr}/mo</p>
                </div>
                <div className="hidden text-right md:block">
                  <p className="text-[13px] font-extrabold text-ink">{c.covers30} cover{c.covers30 === 1 ? "" : "s"} · 30d</p>
                  <p className="text-[11.5px] font-semibold text-ink/40">
                    {c.successRate !== null ? `${Math.round(c.successRate * 100)}% covered by Tagout` : "no runs yet"}
                  </p>
                </div>
                <div className="hidden text-right lg:block">
                  <p className="text-[12px] font-semibold text-ink/40">active {c.lastActive}</p>
                </div>
                <Chip tone={STATUS_META[c.status].tone}>{STATUS_META[c.status].label}</Chip>
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* onboarding pipeline */}
          <section className="rounded-3xl bg-white p-5 shadow-pop">
            <h2 className="font-display text-[18px] font-extrabold text-ink">Onboarding</h2>
            <p className="mt-0.5 text-[12px] font-semibold text-ink/40">
              Signed → number → roster → rules → first live cover
            </p>
            <div className="mt-4 space-y-3">
              {pipeline.map((p) => (
                <div key={p.id} className="rounded-2xl bg-cream/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[14.5px] font-extrabold text-ink">{p.name}</p>
                    <p className="text-[11.5px] font-bold text-ink/40">{p.owner}</p>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1">
                    {ONBOARD_STEPS.map((s, i) => (
                      <span
                        key={s}
                        title={s}
                        className={`h-1.5 flex-1 rounded-full ${i < p.step ? "bg-green" : i === p.step ? "bg-amber" : "bg-ink/8"}`}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-[12px] font-semibold text-ink/45">
                      {p.step >= ONBOARD_STEPS.length ? "Done" : `Now: ${ONBOARD_STEPS[p.step]}`} · {p.note}
                    </p>
                    {p.step < ONBOARD_STEPS.length && (
                      <button
                        onClick={() => {
                          setPipeline((prev) => prev.map((x) => (x.id === p.id ? { ...x, step: x.step + 1 } : x)));
                          say(`${p.name}: ${ONBOARD_STEPS[p.step]} marked done.`);
                        }}
                        className="shrink-0 rounded-full bg-green-dark px-3 py-1.5 text-[11.5px] font-extrabold text-white"
                      >
                        Mark step done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* support queue */}
          <section className="rounded-3xl bg-white p-5 shadow-pop">
            <h2 className="font-display text-[18px] font-extrabold text-ink">Support queue</h2>
            <p className="mt-0.5 text-[12px] font-semibold text-ink/40">
              {tickets.filter((t) => t.state === "open").length} open
            </p>
            <div className="mt-4 space-y-2.5">
              {tickets.map((t) => (
                <div key={t.id} className={`rounded-2xl p-4 ${t.state === "done" ? "bg-cream/50 opacity-60" : "bg-cream/70"}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">{t.client}</p>
                    <p className="text-[11.5px] font-bold text-ink/35">{t.when}</p>
                  </div>
                  <p className="mt-1 text-[13.5px] font-bold leading-snug text-ink">{t.text}</p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <p className="text-[11.5px] font-bold text-ink/40">Assigned · {t.owner}</p>
                    {t.state === "open" ? (
                      <button
                        onClick={() => {
                          setTickets((prev) => prev.map((x) => (x.id === t.id ? { ...x, state: "done" as const } : x)));
                          say("Ticket closed.");
                        }}
                        className="rounded-full border-2 border-ink/10 px-3 py-1 text-[11.5px] font-extrabold text-ink/55 hover:border-green hover:text-green-deep"
                      >
                        Resolve
                      </button>
                    ) : (
                      <Chip tone="mint">Done</Chip>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* internal team */}
        <section className="rounded-3xl bg-white p-5 shadow-pop">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[18px] font-extrabold text-ink">Tagout team</h2>
            <button
              onClick={() => setInviteOpen(true)}
              className="rounded-full border-2 border-ink/10 px-4 py-2 text-[13px] font-extrabold text-ink/55 hover:border-green hover:text-green-deep"
            >
              + Invite teammate
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {team.map((m) => (
              <div key={m.name} className="flex items-center justify-between rounded-2xl bg-cream/70 px-4 py-3">
                <div>
                  <p className="text-[14px] font-extrabold text-ink">{m.name}</p>
                  <p className="text-[12px] font-semibold text-ink/45">{m.scope}</p>
                </div>
                <Chip tone={m.role === "Owner" ? "ink" : "lav"}>{m.role}</Chip>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* client drawer */}
      <AnimatePresence>
        {openClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm"
            onClick={() => setOpenClient(null)}
          >
            <motion.div
              initial={{ x: 60 }}
              animate={{ x: 0 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-full max-w-md overflow-y-auto bg-white p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-[22px] font-extrabold text-ink">{openClient.name}</h2>
                  <p className="text-[13px] font-semibold text-ink/45">{openClient.city} · since {openClient.since}</p>
                </div>
                <Chip tone={STATUS_META[openClient.status].tone}>{STATUS_META[openClient.status].label}</Chip>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {[
                  [`$${openClient.mrr}/mo`, `${openClient.seats} seats · $29 each`],
                  [openClient.covers30 + " covers", "last 30 days"],
                  [openClient.smsMonth.toLocaleString() + " texts", "last 30 days"],
                  [openClient.successRate !== null ? `${Math.round(openClient.successRate * 100)}%` : "—", "covered without the GM"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-2xl bg-cream/70 p-3.5">
                    <p className="font-display text-[17px] font-extrabold text-ink">{v}</p>
                    <p className="text-[11px] font-bold text-ink/40">{l}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 text-[13.5px] font-semibold text-ink/60">
                <p className="flex justify-between"><span>GM</span><span className="font-extrabold text-ink">{openClient.gm}</span></p>
                <p className="flex justify-between"><span>GM phone</span><span className="font-extrabold text-ink">{openClient.gmPhone}</span></p>
                <p className="flex justify-between"><span>Tagout number</span><span className="font-extrabold text-ink">{openClient.number ?? "provisioning"}</span></p>
                <p className="flex justify-between"><span>Last activity</span><span className="font-extrabold text-ink">{openClient.lastActive}</span></p>
              </div>

              <div className="mt-5">
                <p className="text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">Account notes</p>
                <div className="mt-2 space-y-2">
                  {openClient.notes.map((n, i) => (
                    <p key={i} className="rounded-2xl bg-cream/70 px-3.5 py-2.5 text-[13px] font-bold text-ink">{n}</p>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <GreenBtn className="w-full" onClick={() => say(`Onboarding link for ${openClient.name} copied.`)}>
                  Copy GM onboarding link
                </GreenBtn>
                <button
                  onClick={() => say(`Logged in as ${openClient.gm} is disabled in the demo.`)}
                  className="w-full rounded-full border-2 border-ink/10 py-2.5 text-[13.5px] font-extrabold text-ink/55"
                >
                  Open their portal
                </button>
                {openClient.status !== "at-risk" ? (
                  <button
                    onClick={() => {
                      setClients((prev) => prev.map((c) => (c.id === openClient.id ? { ...c, status: "at-risk" as const } : c)));
                      setOpenClient(null);
                      say("Flagged for a check-in.");
                    }}
                    className="w-full rounded-full border-2 border-blush py-2.5 text-[13.5px] font-extrabold text-coral"
                  >
                    Flag at risk
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setClients((prev) => prev.map((c) => (c.id === openClient.id ? { ...c, status: "live" as const } : c)));
                      setOpenClient(null);
                      say("Back to healthy.");
                    }}
                    className="w-full rounded-full border-2 border-ink/10 py-2.5 text-[13.5px] font-extrabold text-ink/55"
                  >
                    Clear risk flag
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* invite teammate */}
      <AnimatePresence>
        {inviteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
            onClick={() => setInviteOpen(false)}
          >
            <motion.div
              initial={{ y: 24 }}
              animate={{ y: 0 }}
              exit={{ y: 24, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-lift"
            >
              <p className="font-display text-[20px] font-extrabold text-ink">Invite a teammate</p>
              <p className="mt-1 text-[12.5px] font-semibold text-ink/45">
                Support scope: clients and tickets, no billing.
              </p>
              <input
                value={invName}
                onChange={(e) => setInvName(e.target.value)}
                placeholder="Name"
                className="mt-4 w-full rounded-xl border-2 border-ink/10 px-3.5 py-2.5 text-[14.5px] font-bold text-ink outline-none focus:border-green"
              />
              <div className="mt-4 flex gap-2">
                <GreenBtn
                  className="flex-1"
                  disabled={!invName.trim()}
                  onClick={() => {
                    setTeam((t) => [...t, { name: invName.trim(), role: "Support", scope: "Clients + tickets" }]);
                    setInviteOpen(false);
                    setInvName("");
                    say("Invite sent.");
                  }}
                >
                  Send invite
                </GreenBtn>
                <button onClick={() => setInviteOpen(false)} className="px-3 text-[13.5px] font-bold text-ink/45">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-pine px-5 py-2.5 text-[13px] font-extrabold text-paper shadow-lift"
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
