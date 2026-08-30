import Link from "next/link";
import { site } from "@/lib/site";
import { Reveal, Stagger, Item } from "@/components/Reveal";
import { PhoneShell, HeroThread } from "@/components/Phone";
import { BubbleMark } from "@/components/Wordmark";
import CoverTheater from "@/components/CoverTheater";
import Marquee from "@/components/Marquee";
import CTABand from "@/components/CTABand";
import {
  ScheduleMock,
  ApprovalsMock,
  GuardrailsMock,
  GroupDashMock,
  LockscreenMock,
  GroupChatMock,
} from "@/components/Mocks";

export default function Home() {
  return (
    <>
      <Hero />
      <SegmentStrip />
      <TickerBand />
      <OldWay />
      <Theater />
      <ManagerPillars />
      <StaffSection />
      <MeetTag />
      <EdgeCases />
      <PhotoBand />
      <GroupsSection />
      <CompareTeaser />
      <SwitchSteps />
      <CTABand />
    </>
  );
}

/* ================= HERO ================= */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper pt-16 md:pt-[72px]">
      <div className="relative mx-auto flex min-h-[calc(100svh-64px)] w-full max-w-7xl flex-col gap-5 px-4 pb-8 pt-5 sm:px-6 md:min-h-[calc(100svh-72px)] lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[auto_auto] lg:items-center lg:justify-center lg:gap-x-10 lg:gap-y-0 lg:px-8 lg:py-6">
        {/* headline first, everywhere */}
        <div className="lg:self-end lg:[grid-area:1/1/2/2]">
          <Reveal>
            <p className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/10 bg-white px-4 py-2 text-[13px] font-bold text-ink shadow-[0_1px_2px_rgb(15_21_18/0.05)] sm:text-[13.5px]">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green text-[11px] text-white">⚡</span>
              <span className="sm:hidden">Built for restaurants</span>
              <span className="hidden sm:inline">For restaurants: single spots to 200-location groups</span>
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-4 font-display text-[40px] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink sm:text-6xl lg:mt-5 xl:text-7xl">
              Scheduling that{" "}
              <span className="relative inline-block text-green-deep">
                texts&nbsp;back.
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path d="M2 9C55 3 148 2 198 6" stroke="#0ecf7f" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
          </Reveal>
          {/* mobile-only CTAs: above the fold, before the phone */}
          <Reveal delay={0.16}>
            <div className="mt-5 flex items-center gap-3 lg:hidden">
              <Link
                href="/demo"
                className="rounded-full bg-green px-6 py-3.5 text-[16px] font-extrabold text-ink"
              >
                Get a demo →
              </Link>
              <a
                href="#watch"
                className="rounded-full border-2 border-ink/15 px-5 py-3.5 text-[16px] font-extrabold text-ink"
              >
                Watch it work
              </a>
            </div>
          </Reveal>
        </div>

        {/* the rest of the pitch: after the phone on mobile, under the headline on desktop */}
        <div className="order-3 lg:order-none lg:self-start lg:[grid-area:2/1/3/2]">
          <Reveal delay={0.16}>
            <p className="mt-0 max-w-xl text-lg leading-relaxed text-ink-soft lg:mt-6 xl:text-xl">
              The AI <strong className="font-bold text-ink">covers every dropped shift
              by text</strong>. It knows who&apos;s free, who&apos;s under 40, and who
              actually says yes. You never work the phones&nbsp;again.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/demo"
                className="group rounded-full bg-green px-7 py-4 text-lg font-extrabold text-ink transition-all hover:bg-green-deep hover:text-white hover:shadow-lift"
              >
                Get a demo
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <a
                href="#watch"
                className="rounded-full border-2 border-ink/15 px-7 py-4 text-lg font-extrabold text-ink transition-colors hover:border-ink"
              >
                Watch it work ↓
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-[14.5px] font-semibold text-ink-soft">
              {["One price covers the house", "Live in one shift", "Free import from your old scheduler"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint text-[11px] font-black text-green-dark">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* phone on its stage */}
        <div className="order-2 lg:order-none lg:[grid-area:1/2/3/3]">
          <Reveal delay={0.1} y={40}>
            <div className="relative mx-auto w-fit px-6 py-8 sm:px-10">
              {/* tilted brand stage instead of vapor */}
              <div
                className="absolute inset-x-0 bottom-2 top-14 -rotate-2 rounded-[44px] bg-mint sm:-inset-x-6"
                aria-hidden
              />
              <BubbleMark
                size={110}
                className="pointer-events-none absolute -left-2 bottom-6 -rotate-12 text-green/25 sm:-left-8"
              />
              <PhoneShell className="relative">
                <HeroThread />
              </PhoneShell>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= SEGMENTS ================= */

function SegmentStrip() {
  return (
    <section className="border-y border-ink/6 bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
          <p className="mr-3 text-[13.5px] font-bold uppercase tracking-wider text-ink/40">
            Built for
          </p>
          {site.segments.map((s) => (
            <span
              key={s}
              className="rounded-full border border-ink/10 bg-white px-4 py-1.5 text-[13.5px] font-bold text-ink-soft"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="mt-3.5 text-center text-[15px] font-bold text-ink">
          Runs on the phones your crew already carries. If they can text, they&apos;re&nbsp;trained.
        </p>
      </div>
    </section>
  );
}

/* ================= TICKER ================= */

function TickerBand() {
  return (
    <section className="bg-paper py-10 md:py-14">
      <Reveal>
        <p className="mx-auto max-w-7xl px-4 text-center font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-ink/40 sm:px-6">
          A Friday with Tagout on shift
        </p>
        <p className="mx-auto mt-3 max-w-2xl px-4 text-center text-lg font-bold text-ink sm:px-6">
          An entire coverage scramble, handled, and the manager never left the&nbsp;pass.
        </p>
      </Reveal>
      <div className="mt-6">
        <Marquee />
      </div>
    </section>
  );
}

/* ================= THE OLD WAY ================= */

function OldWay() {
  return (
    <section className="relative mx-2 overflow-hidden rounded-[36px] bg-ink py-20 sm:mx-4 md:rounded-[52px] md:py-28">
      <BubbleMark
        check={false}
        size={340} className="pointer-events-none absolute -bottom-24 -right-20 rotate-12 text-paper/[0.045]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-green">
            The old way
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-paper sm:text-5xl md:text-6xl">
            Your scheduler is an app your staff&nbsp;ignores.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/60">
            Push notifications get swiped away. The group chat spirals. So the coverage
            problem lands where it always lands: on the manager, mid-service, phone in&nbsp;hand.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-3" gap={0.12}>
          <Item className="hidden md:block">
            <div className="flex h-full flex-col">
              <LockscreenMock />
              <p className="mt-5 text-[15.5px] font-semibold leading-snug text-paper/70">
                <span className="font-display font-extrabold text-paper">The notification graveyard.</span>{" "}
                “Open the app to view” is where open shifts go to die.
              </p>
            </div>
          </Item>
          <Item>
            <div className="flex h-full flex-col">
              <GroupChatMock />
              <p className="mt-5 text-[15.5px] font-semibold leading-snug text-paper/70">
                <span className="font-display font-extrabold text-paper">The group-chat spiral.</span>{" "}
                Twenty-three people, six replies, zero coverage.
              </p>
            </div>
          </Item>
          <Item className="hidden md:block">
            <div className="flex h-full flex-col">
              <div className="rounded-[30px] bg-white p-6 shadow-lift">
                <p className="font-display text-[15px] font-extrabold uppercase tracking-wide text-ink/40">
                  Manager&apos;s notebook · Fri
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    { n: "Call Kyle", s: "no answer" },
                    { n: "Call Sam", s: "voicemail" },
                    { n: "Call Alexis", s: "“maybe”" },
                    { n: "Call Jordan", s: "left VM" },
                    { n: "Text Mia", s: "seen 6:40" },
                  ].map((r) => (
                    <li key={r.n} className="flex items-center justify-between border-b border-dashed border-ink/12 pb-2.5">
                      <span className="text-[15.5px] font-bold text-ink/70 line-through decoration-coral decoration-2">
                        {r.n}
                      </span>
                      <span className="text-[13px] font-semibold italic text-ink/40">{r.s}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-center font-display text-[15px] font-extrabold text-coral">
                  47 minutes of your Friday
                </p>
              </div>
              <p className="mt-5 text-[15.5px] font-semibold leading-snug text-paper/70">
                <span className="font-display font-extrabold text-paper">The call-down list.</span>{" "}
                You became a switchboard operator with a section to run.
              </p>
            </div>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}

/* ================= THEATER ================= */

function Theater() {
  return (
    <section id="watch" className="scroll-mt-24 bg-mint/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-green-dark">
            The new way
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl md:text-6xl">
            Watch Tagout cover Friday.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            This is the whole product in one scene: a real drop, handled end-to-end,
            while the manager stays on the floor.
          </p>
        </Reveal>
        <div className="mt-12">
          <CoverTheater />
        </div>
      </div>
    </section>
  );
}

/* ================= MANAGER PILLARS ================= */

function ManagerPillars() {
  return (
    <section id="managers" className="scroll-mt-24 bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-violet-mid">
            For the manager
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl md:text-6xl">
            Run the floor, not the phone&nbsp;tree.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            The portal is fast. The thread is faster: text &ldquo;Marisa called out
            tonight&rdquo; and a ranked list comes back, ready to work. If nobody
            answers, you get names and numbers to dial, never a&nbsp;mystery.
          </p>
        </Reveal>

        {/* Row 1 — schedule builder */}
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <ScheduleMock />
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Build the week in minutes, not&nbsp;Sunday nights.
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Start from last week or a template. Conflicts get flagged while you build,
              not after you publish. One tap sends the week to every phone in the building.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Copy-forward weeks and station templates",
                "Conflicts and availability checked as you drag",
                "The board updates in real time as covers and swaps land",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15.5px] font-semibold text-ink">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint text-[12px] font-black text-green-dark">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Row 2 — approvals */}
        <div className="mt-20 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="hidden md:block lg:order-2">
            <ApprovalsMock />
          </Reveal>
          <Reveal delay={0.1} className="lg:order-1">
            <h3 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Swaps and covers arrive pre-solved.
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              By the time a request reaches you, the hours, the roles, and usually the
              replacement are already handled. Your job shrinks to one tap: approve.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Every swap sanity-checked before you see it",
                "House rules: who can close, who can pour, who's still training",
                "Full paper trail of every change and confirmation",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15.5px] font-semibold text-ink">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lav text-[12px] font-black text-violet-mid">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Row 3 — guardrails */}
        <div className="mt-20 hidden items-center gap-10 md:grid lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <GuardrailsMock />
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Overtime surprises, retired.
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Tagout runs the math before every offer. A shift is never offered to someone
              it would push into overtime, so payroll just comes in clean.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Hard caps and soft warnings you control",
                "Labor cost visible while you build, not after payroll",
                "Clean exports for payroll and accounting",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15.5px] font-semibold text-ink">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-butter text-[12px] font-black text-[#9a6a00]">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= STAFF ================= */

function StaffSection() {
  return (
    <section id="staff" className="scroll-mt-24 overflow-hidden bg-cream py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8">
        <Reveal>
          <div className="relative">
            <img
              src="/photos/server-text.webp"
              alt="A server smiling at a text message on her phone between shifts"
              className="aspect-[4/5] w-full max-w-md rounded-[32px] object-cover object-[38%_50%] shadow-lift"
              loading="lazy"
            />
            <div className="absolute -right-3 bottom-8 max-w-[240px] rounded-2xl rounded-bl-md bg-green p-4 text-white shadow-lift sm:-right-6">
              <p className="text-[14px] font-semibold leading-snug">
                “Friday 5–11 just opened up. Want it? You&apos;d stay under 40.”
              </p>
              <p className="mt-1.5 text-[12px] font-bold text-white/70">the text she&apos;s smiling at</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-green-dark">
            For your team
          </p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl">
            Zero training. It&apos;s just&nbsp;texting.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Swaps, pickups, availability: all handled by reply. The full staff portal is
            there when they want it, but it&apos;s a choice, not homework. The 19-year-old
            host and the 30-year vet both just&nbsp;text.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { k: "“Drop my Tuesday”", v: "Tagout starts finding coverage" },
              { k: "“Swap with Devon”", v: "Checked & sent for approval" },
              { k: "“What do I work this week?”", v: "Week texted back instantly" },
              { k: "“Can't do mornings anymore”", v: "Availability updated" },
            ].map((r) => (
              <div key={r.k} className="rounded-2xl bg-white p-4 shadow-pop">
                <p className="font-display text-[15.5px] font-extrabold text-ink">{r.k}</p>
                <p className="mt-1 text-[13.5px] font-semibold text-green-dark">→ {r.v}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= MEET TAG ================= */

function MeetTag() {
  const cards = [
    {
      title: "Reads the whole board",
      mobile: false,
      body: "Availability, time-off, roles, stations, weekly hours: Tagout knows the same things your best AGM knows.",
      chip: "Availability ✓ Hours ✓ Roles ✓",
      tone: "green",
    },
    {
      title: "Knows who says yes",
      mobile: true,
      body: "Tagout learns each person's real pickup pattern and asks the likely yeses first, so shifts fill in minutes, not hours.",
      chip: "Marisa: 8 of 9 asks",
      tone: "violet",
    },
    {
      title: "Texts like a person",
      mobile: true,
      body: "No robotic blasts. Short, warm, personal messages people actually answer, signed by your restaurant.",
      chip: "“omg yes 🙌”",
      tone: "green",
    },
    {
      title: "Escalates early, not at 4:55",
      mobile: false,
      body: "If nobody answers, Tagout tells you while there's still time to act: what it tried, who's left, and their numbers ready to dial.",
      chip: "Heads-up at 1:15 PM",
      tone: "amber",
    },
  ];
  return (
    <section className="relative mx-2 overflow-hidden rounded-[36px] bg-violet-deep py-20 sm:mx-4 md:rounded-[52px] md:py-28">
      <div className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-violet/25 blur-[110px]" />
      <BubbleMark
        check={false}
        size={320} className="pointer-events-none absolute -left-24 -bottom-24 -rotate-12 text-white/[0.05]"
      />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-green/14 blur-[110px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-green">
            Meet Tag
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl">
            The quiet operator on every&nbsp;shift.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/65">
            Not a chatbot bolted onto a calendar. A coverage engine that works the way
            your sharpest manager does, and never&nbsp;sleeps.
          </p>
        </Reveal>

        <Stagger className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible" gap={0.1}>
          {cards.map((c) => (
            <Item key={c.title} className="min-w-[84%] snap-center sm:min-w-0">
              <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition-colors hover:bg-white/[0.1] sm:p-8">
                <span
                  className={`inline-block rounded-full px-3.5 py-1.5 text-[12.5px] font-extrabold ${
                    c.tone === "green"
                      ? "bg-green/15 text-green"
                      : c.tone === "violet"
                        ? "bg-violet/25 text-lav"
                        : "bg-amber/15 text-amber"
                  }`}
                >
                  {c.chip}
                </span>
                <h3 className="mt-4 font-display text-2xl font-extrabold text-white">{c.title}</h3>
                <p className="mt-2.5 text-[15.5px] leading-relaxed text-white/60">{c.body}</p>
              </div>
            </Item>
          ))}
        </Stagger>

        <Reveal delay={0.15}>
          <p className="mt-12 flex flex-wrap items-center gap-3 text-[15px] font-semibold text-white/55">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green font-display text-[13px] font-extrabold text-ink">T</span>
            Texts get read: industry research puts SMS open rates near 98%, most within minutes.
            That&apos;s the channel your coverage should live on.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= EDGE CASES ================= */

function EdgeCases() {
  const cases = [
    {
      time: "6:04 AM",
      tone: "bg-blush text-coral",
      title: "The 6 AM call-out",
      body: "Sam calls out at 6:04. By 6:41, Luis has confirmed for prep. Your first notification arrives with your coffee, not your alarm.",
      sms: "“Covered: Luis takes 8–2. Told Sam to feel better.”",
      mobile: true,
    },
    {
      time: "11:40 AM",
      tone: "bg-lav text-violet-mid",
      title: "The 40-top on a Tuesday",
      body: "A big party lands on the books. Tagout catches the bump, checks your usual coverage for that shift, and offers to staff up.",
      sms: "“Thursday just got a 40-top at 7. Want me to add a server?”",
      mobile: true,
    },
    {
      time: "2:15 PM",
      tone: "bg-butter text-[#9a6a00]",
      title: "The rained-out patio",
      body: "The forecast flips. Instead of eating labor on an empty patio, Tagout offers voluntary cuts. First replies win.",
      sms: "“Rain tonight. Anyone want the evening off? Two spots.”",
      mobile: true,
    },
    {
      time: "Always on",
      tone: "bg-mint text-green-dark",
      title: "The 17-year-old host",
      body: "Minors can't close past curfew in your state. Tagout knows, so she is simply never offered the 11 PM shift. Compliance without a binder.",
      sms: "Curfew rule enforced automatically, every offer, every week.",
      mobile: false,
    },
    {
      time: "Week 4",
      tone: "bg-lav text-violet-mid",
      title: "The quiet pattern",
      body: "Third dropped Friday in a row? Tagout doesn't gossip to the group chat. It hands you the pattern, privately, with the history.",
      sms: "“Heads up: Dana has dropped 3 straight Fridays.”",
      mobile: false,
    },
    {
      time: "Before publish",
      tone: "bg-mint text-green-dark",
      title: "The accidental clopen",
      body: "A swap would have Priya closing Saturday and opening Sunday brunch. Tagout catches the clopen and asks her first, so nobody finds it on the published schedule.",
      sms: "“Heads up: that swap means close Sat, open Sun at 9. Still good?”",
      mobile: false,
    },
  ];
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-green-dark">
            Real restaurant, real edge cases
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl md:text-6xl">
            Trained on the weird nights,&nbsp;too.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Anyone can fill an empty Tuesday. These are the moments that make a GM
            trust the system with the&nbsp;keys.
          </p>
        </Reveal>
        <Stagger className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-3" gap={0.08}>
          {cases.map((c) => (
            <Item key={c.title} className="min-w-[84%] snap-center sm:min-w-0">
              <div className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-pop transition-shadow hover:shadow-lift sm:p-7">
                <span className={`w-fit rounded-full px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-wide ${c.tone}`}>
                  {c.time}
                </span>
                <h3 className="mt-3.5 font-display text-[20px] font-extrabold text-ink">{c.title}</h3>
                <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-ink-soft">{c.body}</p>
                <p className="mt-4 rounded-2xl rounded-bl-md bg-cream px-4 py-3 text-[13.5px] font-semibold leading-snug text-ink">
                  {c.sms}
                </p>
              </div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ================= PHOTO BAND ================= */

function PhotoBand() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-center font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Great shifts don&apos;t start with an&nbsp;app.
            <span className="text-green-deep"> They start with a full&nbsp;roster.</span>
          </h2>
        </Reveal>
        <Stagger
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible"
          gap={0.12}
        >
          {[
            {
              src: "/photos/dining-room.webp",
              alt: "Server setting tables in a warm dining room before service",
              cap: "Friday, fully staffed",
              pos: "50% 45%",
            },
            {
              src: "/photos/counter-service.webp",
              alt: "Coffee shop employee working the register",
              cap: "Counter covered, line moving",
              pos: "92% 50%",
            },
            {
              src: "/photos/server-burgers.webp",
              alt: "Server delivering plates of burgers and fries on a patio",
              cap: "Nobody working a double they didn't ask for",
              pos: "62% 45%",
            },
          ].map((p) => (
            <Item key={p.src} className="min-w-[78%] snap-center sm:min-w-0">
              <figure className="group overflow-hidden rounded-[28px] shadow-pop">
                <div className="overflow-hidden">
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    style={{ objectPosition: p.pos }}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="bg-white px-5 py-4 font-display text-[15.5px] font-extrabold text-ink">
                  {p.cap}
                </figcaption>
              </figure>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ================= GROUPS ================= */

function GroupsSection() {
  return (
    <section id="groups" className="relative mx-2 scroll-mt-24 overflow-hidden rounded-[36px] bg-ink py-20 sm:mx-4 md:rounded-[52px] md:py-28">
      <BubbleMark
        check={false}
        size={300} className="pointer-events-none absolute -right-16 top-10 rotate-6 text-paper/[0.04]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-green">
              For restaurant groups
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-paper sm:text-5xl">
              One pilot store. Then all&nbsp;of&nbsp;them.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-paper/60">
              Tagout rolls out the way ops leaders actually buy: prove it in one
              location, then scale on your calendar. Every GM gets the same dead-simple
              tool. You get the numbers that matter, roll-up&nbsp;clean.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { h: "Group dashboard", b: "Coverage, open shifts, and OT exposure across every store, live." },
                { h: "Shared talent pool", b: "Let Tagout borrow a closer from your store two miles away, rules included." },
                { h: "Rollout without retraining", b: "Staff onboarding is one text. GMs learn it in an afternoon." },
                { h: "Enterprise-grade controls", b: "SSO, roles and permissions, exports, API access on Enterprise." },
              ].map((r) => (
                <li key={r.h} className="flex gap-4">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green/15 text-[13px] font-black text-green">✓</span>
                  <div>
                    <p className="font-display text-[17px] font-extrabold text-paper">{r.h}</p>
                    <p className="mt-0.5 text-[14.5px] leading-relaxed text-paper/55">{r.b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={0.1}>
              <GroupDashMock />
            </Reveal>
            <Reveal delay={0.18} className="hidden md:block">
              <figure className="relative overflow-hidden rounded-3xl shadow-lift">
                <img
                  src="/photos/groups-floor.webp"
                  alt="Server moving through a busy modern dining room mid-shift"
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent px-6 pb-5 pt-14 font-display text-[15.5px] font-extrabold text-paper">
                  Same product at the dive bar and the flagship.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= COMPARE TEASER ================= */

function CompareTeaser() {
  const rows = [
    { k: "Staff responds via", them: "App they have to open", us: "A text they answer anyway" },
    { k: "Open shift coverage", them: "Blast + hope + call list", us: "Tagout finds, asks, confirms" },
    { k: "Overtime protection", them: "Report after the damage", us: "Blocked before the offer" },
    { k: "Staff onboarding", them: "Downloads, logins, training", us: "One text: “reply YES”" },
    { k: "Pricing", them: "Modules, add-ons, tiers", us: "One house price, everything on" },
  ];
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-violet-mid">
                The switch
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl">
                Switching is&nbsp;the&nbsp;easy&nbsp;part.
              </h2>
            </div>
            <Link
              href="/vs-hotschedules"
              className="w-fit rounded-full border-2 border-ink/15 px-6 py-3 text-[15px] font-extrabold text-ink transition-colors hover:border-ink"
            >
              Full comparison →
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 overflow-x-auto rounded-3xl shadow-lift">
            <table className="w-full border-collapse md:min-w-[640px] overflow-hidden rounded-3xl bg-white text-left">
              <thead>
                <tr className="border-b border-ink/8">
                  <th className="px-6 py-5 text-[13px] font-extrabold uppercase tracking-wide text-ink/40">
                    What matters
                  </th>
                  <th className="px-6 py-5 text-[13px] font-extrabold uppercase tracking-wide text-ink/40">
                    Legacy schedulers
                  </th>
                  <th className="bg-mint/70 px-6 py-5">
                    <span className="font-display text-[16px] font-extrabold text-green-dark">Tagout</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.k} className="border-b border-ink/6 last:border-0">
                    <td className="px-6 py-4 font-display text-[15px] font-extrabold text-ink">{r.k}</td>
                    <td className="px-6 py-4 text-[14.5px] font-medium text-ink/50">{r.them}</td>
                    <td className="bg-mint/40 px-6 py-4 text-[14.5px] font-bold text-green-dark">{r.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= SWITCH STEPS ================= */

function SwitchSteps() {
  const steps = [
    {
      n: "01",
      h: "We import everything",
      b: "Schedules, staff, roles, availability, all pulled in from HotSchedules, 7shifts, or your spreadsheet. You don't rebuild a thing.",
    },
    {
      n: "02",
      h: "Your team replies YES",
      b: "Staff onboarding is literally one text message. No downloads, no account setup, no training meeting.",
    },
    {
      n: "03",
      h: "Tagout takes the pager",
      b: "Run one week side by side if you like. Most managers stop opening the old app before the trial ends.",
    },
  ];
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl">
            Switch in a week, not a&nbsp;quarter.
          </h2>
        </Reveal>
        <Stagger className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto md:grid md:grid-cols-3 md:gap-5 md:overflow-visible" gap={0.12}>
          {steps.map((s) => (
            <Item key={s.n} className="min-w-[82%] snap-center md:min-w-0">
              <div className="h-full rounded-3xl bg-white p-7 shadow-pop">
                <p className="font-display text-5xl font-extrabold tracking-tight text-green">{s.n}</p>
                <h3 className="mt-4 font-display text-[21px] font-extrabold text-ink">{s.h}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{s.b}</p>
              </div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
