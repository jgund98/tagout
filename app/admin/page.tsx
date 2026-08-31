"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Chip, GreenBtn, PageTitle, StatTile } from "@/components/portal/ui";
import { NavIcon } from "@/components/portal/NavIcon";
import { PovSwitch } from "@/components/portal/PovSwitch";
import { BubbleMark } from "@/components/Wordmark";

/**
 * Tagout HQ: the internal panel we use to run the business — onboard
 * restaurants, watch account health, and work support. Demo-seeded, and
 * built on the exact same shell language as the GM portal.
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
  { id: "dock", name: "Dockside Grill", step: 4, owner: "Sasha", note: "trial · first cover ran Aug 27" },
  { id: "blue", name: "Blue Heron Café", step: 1, owner: "Jordan", note: "signed Aug 28, number pending 10DLC" },
];

const SEED_TICKETS: { id: string; client: string; text: string; owner: string; state: "open" | "done"; when: string }[] = [
  { id: "t1", client: "The Tap Room", text: "Two servers report pickup texts landing in spam. Check 10DLC registration on their number.", owner: "Sasha", state: "open", when: "Today, 2:10 PM" },
  { id: "t2", client: "Castaways", text: "Deb asked how to hand the account to the new AGM. Walk her through manager invites.", owner: "Jordan", state: "open", when: "Yesterday" },
  { id: "t3", client: "Nona's Kitchen", text: "Roster CSV had duplicate phone numbers. Cleaned and re-imported.", owner: "Jordan", state: "done", when: "Aug 27" },
];

type TeamRole = "Owner" | "Admin" | "Support" | "Read-only";
type TeamMember = { id: string; name: string; role: TeamRole; status: "active" | "disabled" | "invited" };

const ROLE_SCOPES: Record<TeamRole, string> = {
  Owner: "Everything, including billing and this team",
  Admin: "Clients, onboarding, support, and team",
  Support: "Clients and tickets, no billing",
  "Read-only": "Can view everything, can't change anything",
};

const ROLE_TONE: Record<TeamRole, "ink" | "mint" | "lav" | "butter"> = {
  Owner: "ink",
  Admin: "mint",
  Support: "lav",
  "Read-only": "butter",
};
const STATUS_META: Record<ClientStatus, { label: string; tone: "mint" | "butter" | "lav" | "blush" }> = {
  live: { label: "Live", tone: "mint" },
  onboarding: { label: "Onboarding", tone: "lav" },
  trial: { label: "Trial", tone: "butter" },
  "at-risk": { label: "At risk", tone: "blush" },
};

type Tab = "overview" | "clients" | "onboarding" | "support" | "team";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "home" },
  { key: "clients", label: "Clients", icon: "people" },
  { key: "onboarding", label: "Onboarding", icon: "swap" },
  { key: "support", label: "Support", icon: "chat" },
  { key: "team", label: "Team", icon: "shield" },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [clients, setClients] = useState(SEED_CLIENTS);
  const [pipeline, setPipeline] = useState(SEED_PIPELINE);
  const [tickets, setTickets] = useState(SEED_TICKETS);
  const [openClient, setOpenClient] = useState<Client | null>(null);
  const [toast, setToast] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invName, setInvName] = useState("");
  const [invRole, setInvRole] = useState<TeamRole>("Support");
  const [team, setTeam] = useState<TeamMember[]>([
    { id: "m1", name: "Jordan G.", role: "Owner", status: "active" },
    { id: "m2", name: "Sasha D.", role: "Support", status: "active" },
  ]);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);

  const activeOwners = team.filter((m) => m.role === "Owner" && m.status === "active").length;
  const patchMember = (id: string, p: Partial<TeamMember>) =>
    setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, ...p } : m)));

  const say = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(""), 2600);
  };

  const kpis = useMemo(() => {
    const paying = clients.filter((c) => c.mrr > 0);
    return {
      mrr: clients.reduce((n, c) => n + c.mrr, 0),
      houses: paying.length,
      seats: clients.reduce((n, c) => n + c.seats, 0),
      covers: clients.reduce((n, c) => n + c.covers30, 0),
      sms: clients.reduce((n, c) => n + c.smsMonth, 0),
    };
  }, [clients]);

  const openTickets = tickets.filter((t) => t.state === "open").length;
  const atRisk = clients.filter((c) => c.status === "at-risk");

  const go = (t: Tab) => {
    setTab(t);
    window.scrollTo(0, 0);
  };

  /* ---- sections ---- */

  const ClientList = (
    <section className="rounded-3xl bg-white p-5 shadow-pop">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[18px] font-extrabold text-ink">All clients</h2>
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
  );

  const Pipeline = (
    <section className="rounded-3xl bg-white p-5 shadow-pop">
      <h2 className="font-display text-[18px] font-extrabold text-ink">Onboarding pipeline</h2>
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
  );

  const Support = (
    <section className="rounded-3xl bg-white p-5 shadow-pop">
      <h2 className="font-display text-[18px] font-extrabold text-ink">Support queue</h2>
      <p className="mt-0.5 text-[12px] font-semibold text-ink/40">{openTickets} open</p>
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
  );

  const Team = (
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
          <button
            key={m.id}
            onClick={() => setEditMember(m)}
            className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-cream ${
              m.status === "disabled" ? "bg-cream/40 opacity-60" : "bg-cream/70"
            }`}
          >
            <div className="min-w-0">
              <p className="text-[14px] font-extrabold text-ink">{m.name}</p>
              <p className="truncate text-[12px] font-semibold text-ink/45">{ROLE_SCOPES[m.role]}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {m.status === "disabled" && <Chip tone="blush">Disabled</Chip>}
              {m.status === "invited" && <Chip tone="butter">Invite sent</Chip>}
              <Chip tone={ROLE_TONE[m.role]}>{m.role}</Chip>
            </div>
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* sidebar (desktop): same pine rail as the portal */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col p-4 lg:flex">
        <div className="flex h-full flex-col rounded-[28px] bg-pine px-4 pb-4 pt-5">
          <div className="flex items-center gap-2.5 px-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green">
              <BubbleMark size={20} className="text-white" />
            </span>
            <span className="font-display text-[22px] font-extrabold text-paper">tagout</span>
            <span className="rounded-lg rounded-bl-[4px] bg-green px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ink">
              HQ
            </span>
          </div>

          <nav className="mt-7 flex-1 space-y-1" aria-label="Admin">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => go(t.key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-[15px] font-bold transition-colors ${
                  tab === t.key ? "bg-green text-ink" : "text-paper/65 hover:bg-paper/8 hover:text-paper"
                }`}
              >
                <NavIcon name={t.icon} />
                {t.label}
                {t.key === "support" && openTickets > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1.5 text-[11px] font-extrabold text-white">
                    {openTickets}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* topbar: same anatomy as the portal */}
      <header className="sticky top-0 z-30 border-b border-ink/6 bg-cream/85 backdrop-blur-xl lg:pl-[264px]">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green">
              <BubbleMark size={16} className="text-white" />
            </span>
            <span className="font-display text-[18px] font-extrabold text-ink">tagout</span>
            <span className="rounded-lg rounded-bl-[4px] bg-pine px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wide text-paper">
              HQ
            </span>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <p className="font-display text-[15px] font-extrabold text-ink">Tagout HQ</p>
            <span className="rounded-lg rounded-bl-[4px] bg-pine px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wide text-paper">
              Internal
            </span>
            <PovSwitch current="admin" />
          </div>
          <div className="flex items-center gap-2">
            <span className="lg:hidden"><PovSwitch current="admin" /></span>
            <div className="flex items-center rounded-full bg-white p-1.5 shadow-pop sm:gap-2.5 sm:pr-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-dark font-display text-[13px] font-extrabold text-paper">
                J
              </span>
              <div className="hidden leading-tight sm:block">
                <p className="text-[13px] font-extrabold text-ink">Jordan</p>
                <p className="text-[10.5px] font-bold text-ink/40">Owner · Tagout</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 pb-28 pt-6 sm:px-6 lg:pb-10 lg:pl-[288px] lg:pr-8">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="mx-auto max-w-5xl"
        >
          {tab === "overview" && (
            <>
              <PageTitle title="Overview" sub="How the book looks today" />
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                <StatTile label="MRR" value={`$${kpis.mrr.toLocaleString()}`} sub={`${kpis.houses} paying houses`} tone="mint" />
                <StatTile label="Seats" value={kpis.seats} sub="across all houses" />
                <StatTile label="Covers" value={kpis.covers} sub="last 30 days" />
                <StatTile label="Texts" value={kpis.sms.toLocaleString()} sub="last 30 days" />
                <StatTile label="Open tickets" value={openTickets} sub={openTickets ? "in the queue" : "queue is clear"} tone={openTickets ? "butter" : "white"} />
              </div>

              {atRisk.length > 0 && (
                <section className="mt-5 rounded-3xl border-2 border-coral/25 bg-white p-5">
                  <h2 className="font-display text-[16px] font-extrabold text-ink">Needs a check-in</h2>
                  <div className="mt-3 space-y-2">
                    {atRisk.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setOpenClient(c)}
                        className="flex w-full items-center justify-between rounded-2xl bg-cream/70 px-4 py-3 text-left"
                      >
                        <div>
                          <p className="text-[14px] font-extrabold text-ink">{c.name}</p>
                          <p className="text-[12px] font-semibold text-ink/45">{c.notes[0]}</p>
                        </div>
                        <Chip tone="blush">active {c.lastActive}</Chip>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                {Pipeline}
                {Support}
              </div>
            </>
          )}

          {tab === "clients" && (
            <>
              <PageTitle title="Clients" sub={`${clients.length} restaurants on the platform`} />
              {ClientList}
            </>
          )}

          {tab === "onboarding" && (
            <>
              <PageTitle title="Onboarding" sub="Every house between signed and live" />
              {Pipeline}
            </>
          )}

          {tab === "support" && (
            <>
              <PageTitle title="Support" sub="Escalations from client houses" />
              {Support}
            </>
          )}

          {tab === "team" && (
            <>
              <PageTitle title="Team" sub="Who can touch client accounts" />
              {Team}
            </>
          )}
        </motion.div>
      </main>

      {/* mobile bottom nav: same pine bar as the portal */}
      <nav
        aria-label="Admin mobile"
        style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        className="fixed inset-x-3 z-40 flex justify-between rounded-[24px] bg-pine px-2 py-2 lg:hidden"
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => go(t.key)}
            className={`relative flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[11px] font-extrabold ${
              tab === t.key ? "text-ink" : "text-paper/60"
            }`}
          >
            {tab === t.key && (
              <motion.span
                layoutId="admin-tab-pill"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-2xl bg-green"
              />
            )}
            <span className="relative"><NavIcon name={t.icon} size={17} /></span>
            <span className="relative">{t.label}</span>
            {t.key === "support" && openTickets > 0 && (
              <span className="absolute -top-1 right-1 z-10 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-coral px-1 text-[10px] font-extrabold text-white">
                {openTickets}
              </span>
            )}
          </button>
        ))}
      </nav>

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
              className="h-full w-full max-w-md overflow-y-auto overscroll-contain bg-white p-6"
              style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
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
                  [`${openClient.covers30} cover${openClient.covers30 === 1 ? "" : "s"}`, "last 30 days"],
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
                <p className="flex justify-between"><span>GM phone</span><a href={`tel:${openClient.gmPhone.replace(/\D/g, "")}`} className="font-extrabold text-green-deep">{openClient.gmPhone}</a></p>
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
                  onClick={() => say(`Logging in as ${openClient.gm} is off in the demo.`)}
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

      {/* manage a teammate: role, access, removal */}
      <AnimatePresence>
        {editMember && (() => {
          const m = team.find((x) => x.id === editMember.id);
          if (!m) return null;
          const lastOwner = m.role === "Owner" && m.status === "active" && activeOwners <= 1;
          return (
            <motion.div
              key="member-editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
              onClick={() => setEditMember(null)}
            >
              <motion.div
                initial={{ y: 24 }}
                animate={{ y: 0 }}
                exit={{ y: 24, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[85dvh] w-full max-w-sm overflow-y-auto overscroll-contain rounded-[28px] bg-white p-6 shadow-lift"
                role="dialog"
                aria-label={`Manage ${m.name}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-[20px] font-extrabold text-ink">{m.name}</p>
                  {m.status === "disabled" && <Chip tone="blush">Disabled</Chip>}
                  {m.status === "invited" && <Chip tone="butter">Invite sent</Chip>}
                </div>

                <p className="mt-4 text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Permissions</p>
                <div className="mt-1.5 space-y-1.5">
                  {(Object.keys(ROLE_SCOPES) as TeamRole[]).map((r) => {
                    const blocked = lastOwner && r !== "Owner";
                    return (
                      <button
                        key={r}
                        disabled={blocked}
                        onClick={() => {
                          patchMember(m.id, { role: r });
                          say(`${m.name} is now ${r}.`);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-colors disabled:opacity-40 ${
                          m.role === r ? "bg-green-dark text-white" : "bg-cream text-ink"
                        }`}
                      >
                        <span className="text-[13.5px] font-extrabold">
                          {r}
                          <span className={`block text-[11.5px] font-semibold ${m.role === r ? "text-white/60" : "text-ink/45"}`}>
                            {ROLE_SCOPES[r]}
                          </span>
                        </span>
                        {m.role === r && <span aria-hidden>✓</span>}
                      </button>
                    );
                  })}
                </div>
                {lastOwner && (
                  <p className="mt-2 text-[12px] font-semibold text-ink/45">
                    The last owner can&apos;t be demoted, disabled, or removed. Make someone else an owner first.
                  </p>
                )}

                <div className="mt-5 space-y-2">
                  {m.status === "invited" && (
                    <GreenBtn className="w-full" onClick={() => say(`Invite re-sent to ${m.name}.`)}>
                      Resend invite
                    </GreenBtn>
                  )}
                  {m.status === "active" && !lastOwner && (
                    <button
                      onClick={() => {
                        patchMember(m.id, { status: "disabled" });
                        say(`${m.name}'s access is off. Their logins stop working now.`);
                      }}
                      className="w-full rounded-full border-2 border-ink/10 py-2.5 text-[13.5px] font-extrabold text-ink/55 hover:border-ink/30"
                    >
                      Disable access
                    </button>
                  )}
                  {m.status === "disabled" && (
                    <GreenBtn
                      className="w-full"
                      onClick={() => {
                        patchMember(m.id, { status: "active" });
                        say(`${m.name} is back on.`);
                      }}
                    >
                      Re-enable access
                    </GreenBtn>
                  )}
                  {!lastOwner && (
                    <button
                      onClick={() => {
                        if (!window.confirm(`Remove ${m.name} from Tagout HQ? This can't be undone.`)) return;
                        setTeam((prev) => prev.filter((x) => x.id !== m.id));
                        setEditMember(null);
                        say(`${m.name} removed.`);
                      }}
                      className="w-full rounded-full border-2 border-blush py-2.5 text-[13.5px] font-extrabold text-coral hover:bg-blush/30"
                    >
                      Remove from team
                    </button>
                  )}
                  <button
                    onClick={() => setEditMember(null)}
                    className="w-full py-1 text-[13.5px] font-bold text-ink/45"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
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
              className="max-h-[85dvh] w-full max-w-sm overflow-y-auto overscroll-contain rounded-[28px] bg-white p-6 shadow-lift"
            >
              <p className="font-display text-[20px] font-extrabold text-ink">Invite a teammate</p>
              <input
                value={invName}
                onChange={(e) => setInvName(e.target.value)}
                placeholder="Name"
                className="mt-4 w-full rounded-xl border-2 border-ink/10 px-3.5 py-2.5 text-[14.5px] font-bold text-ink outline-none focus:border-green"
              />
              <p className="mt-3.5 text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Permissions</p>
              <div className="mt-1.5 space-y-1.5">
                {(Object.keys(ROLE_SCOPES) as TeamRole[]).filter((r) => r !== "Owner").map((r) => (
                  <button
                    key={r}
                    onClick={() => setInvRole(r)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-colors ${
                      invRole === r ? "bg-green-dark text-white" : "bg-cream text-ink"
                    }`}
                  >
                    <span className="text-[13.5px] font-extrabold">
                      {r}
                      <span className={`block text-[11.5px] font-semibold ${invRole === r ? "text-white/60" : "text-ink/45"}`}>
                        {ROLE_SCOPES[r]}
                      </span>
                    </span>
                    {invRole === r && <span aria-hidden>✓</span>}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <GreenBtn
                  className="flex-1"
                  disabled={!invName.trim()}
                  onClick={() => {
                    setTeam((t) => [...t, { id: `m-${Date.now()}`, name: invName.trim(), role: invRole, status: "invited" }]);
                    setInviteOpen(false);
                    setInvName("");
                    say("Invite sent by text.");
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
