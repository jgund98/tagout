import Link from "next/link";
import { site } from "@/lib/site";
import { Reveal, Stagger, Item } from "@/components/Reveal";
import { PhoneShell, HeroThread } from "@/components/Phone";
import { BubbleMark } from "@/components/Wordmark";
import CoverTheater from "@/components/CoverTheater";
import CTABand from "@/components/CTABand";
import CompareThread from "@/components/CompareThread";
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
      <OldWay />
      <Theater />
      <ManagerPillars />
      <StaffSection />
      <MeetTag />
      <EdgeCases />
      <PhotoBand />
      <GroupsSection />
      <CompareTeaser />
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
            <p className="inline-flex items-center gap-2 whitespace-nowrap rounded-2xl rounded-bl-[6px] bg-white px-4 py-2 text-[13px] font-bold text-ink shadow-[0_2px_12px_rgb(15_21_18/0.08)] sm:text-[13.5px]">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green text-[11px] text-white">⚡</span>
              <span className="sm:hidden">For restaurants &amp; retail</span>
              <span className="hidden sm:inline">For restaurants &amp; retail: single spots to 200-location groups</span>
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
            <p className="mt-3 text-[13px] font-semibold text-ink/50 lg:hidden">
              30-day pilot. Don&apos;t stay? We refund your launch fee.
            </p>
          </Reveal>
        </div>

        {/* the rest of the pitch: after the phone on mobile, under the headline on desktop */}
        <div className="order-3 lg:order-none lg:self-start lg:[grid-area:2/1/3/2]">
          <Reveal delay={0.16}>
            <p className="mt-0 max-w-xl text-lg leading-relaxed text-ink-soft lg:mt-6 xl:text-xl">
              Tagout <strong className="font-bold text-ink">covers every dropped shift
              by text</strong>. It knows who&apos;s free, who&apos;s under 40, and who
              actually says yes. You never work the phones&nbsp;again.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            {/* desktop-only: mobile already got its CTAs right under the H1 */}
            <div className="mt-7 hidden flex-wrap items-center gap-4 lg:flex">
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
            <p className="mt-3 hidden text-[13.5px] font-semibold text-ink/50 lg:block">
              30-day pilot. Don&apos;t stay? We refund your launch fee.
            </p>
          </Reveal>
          <Reveal delay={0.32}>
            <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-[14.5px] font-semibold text-ink-soft">
              {["One price covers the house", "Live in one shift", "We move you off your old scheduler"].map((t) => (
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
        {/* mobile: one tight line instead of the full six-segment credit roll */}
        <p className="text-center sm:hidden">
          <span className="mr-2.5 align-middle font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-green-deep">
            Built for
          </span>
          <span className="align-middle font-display text-[15px] font-extrabold tracking-tight text-ink">
            Restaurants, caf&eacute;s, bars &amp; retail
          </span>
        </p>
        <p className="hidden text-center leading-[2.1] sm:block">
          <span className="mr-4 align-middle font-display text-[12px] font-extrabold uppercase tracking-[0.18em] text-green-deep">
            Built for
          </span>
          {site.segments.map((s, i) => (
            <span key={s} className="align-middle">
              {i > 0 && (
                <span className="mx-3 inline-block h-1.5 w-1.5 rounded-full bg-green align-middle sm:mx-3.5" />
              )}
              <span className="whitespace-nowrap font-display text-[15.5px] font-extrabold tracking-tight text-ink sm:text-[17px]">
                {s}
              </span>
            </span>
          ))}
        </p>
        <p className="mt-2.5 text-center text-[14.5px] font-semibold text-ink-soft">
          Runs on the phones your crew already carries. If they can text, they&apos;re&nbsp;trained.
        </p>
      </div>
    </section>
  );
}

/* ================= THE OLD WAY ================= */

function OldWay() {
  return (
    <section className="relative mx-2 overflow-hidden rounded-[36px] bg-ink py-14 sm:mx-4 sm:py-20 md:rounded-[52px] md:py-28">
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
            problem lands where it always lands: on the manager, mid-service, phone
            in&nbsp;hand. Add it up and covering shifts is a part-time job
            nobody&nbsp;applied&nbsp;for.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-3" gap={0.12}>
          <Item className="hidden md:block">
            <div className="flex h-full flex-col">
              <LockscreenMock className="flex-1" />
              <p className="mt-5 text-[15.5px] font-semibold leading-snug text-paper/70">
                <span className="font-display font-extrabold text-paper">The notification graveyard.</span>{" "}
                “Open the app to view” is where open shifts go to die.
              </p>
            </div>
          </Item>
          <Item>
            <div className="flex h-full flex-col">
              <GroupChatMock className="flex-1" />
              <p className="mt-5 text-[15.5px] font-semibold leading-snug text-paper/70">
                <span className="font-display font-extrabold text-paper">The group-chat spiral.</span>{" "}
                Twenty-three people, six replies, zero coverage.
              </p>
            </div>
          </Item>
          <Item className="hidden md:block">
            <div className="flex h-full flex-col">
              <div className="flex flex-1 flex-col rounded-[30px] bg-white p-6 shadow-lift">
                <p className="font-display text-[15px] font-extrabold uppercase tracking-wide text-ink/40">
                  Manager&apos;s notebook · Fri
                </p>
                <ul className="mt-4 flex flex-1 flex-col justify-evenly gap-3">
                  {[
                    { n: "Call Kyle", s: "no answer" },
                    { n: "Call Sam", s: "voicemail" },
                    { n: "Call Alexis", s: "“maybe”" },
                    { n: "Call Jordan", s: "left VM" },
                    { n: "Text Sasha", s: "seen 6:40" },
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
    <section id="watch" className="scroll-mt-24 bg-mint/60 py-14 sm:py-20 md:py-28">
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
    <section id="managers" className="scroll-mt-24 bg-mint/40 py-14 sm:py-20 md:py-28">
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
            tonight&rdquo; and a ranked list comes back, ready to work. When an ask
            outgrows a text, the reply links straight into the&nbsp;portal.
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
            <ul className="mt-6 hidden space-y-3 md:block">
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
            <ul className="mt-6 hidden space-y-3 md:block">
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
    <section id="staff" className="scroll-mt-24 overflow-hidden bg-butter/30 py-14 sm:py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8">
        <Reveal>
          <div className="relative">
            <img
              src="/photos/server-text.webp"
              alt="A server smiling at a text message on her phone between shifts"
              className="aspect-square w-full max-w-md rounded-[32px] object-cover object-[38%_50%] shadow-lift sm:aspect-[4/5]"
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
              { k: "“Drop my Tuesday”", v: "Tagout starts finding coverage", mob: true },
              { k: "“Swap with Devon”", v: "Checked & sent for approval", mob: false },
              { k: "“What do I work this week?”", v: "Week texted back instantly", mob: true },
              { k: "“Can't do mornings anymore”", v: "Availability updated", mob: false },
            ].map((r) => (
              <div key={r.k} className={(r.mob ? "" : "hidden sm:block ") + "rounded-2xl bg-white p-4 shadow-pop"}>
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
      body: "Slow day for replies? Tagout warns you while there's still time to act, keeps working the list, and only hands you numbers to dial once every eligible person has been asked.",
      chip: "Heads-up at 1:15 PM",
      tone: "amber",
    },
  ];
  return (
    <section className="relative mx-2 overflow-hidden rounded-[36px] bg-violet-deep py-14 sm:mx-4 sm:py-20 md:rounded-[52px] md:py-28">
      <div className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-violet/25 blur-[110px]" />
      <BubbleMark
        check={false}
        size={320} className="pointer-events-none absolute -left-24 -bottom-24 -rotate-12 text-white/[0.05]"
      />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-green/14 blur-[110px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          <Reveal>
            <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-green">
              Meet Tagout
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl">
              The quiet operator on every&nbsp;shift.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/65">
              Not a chatbot bolted onto a calendar. A coverage engine that works the way
              your sharpest manager does, and never&nbsp;sleeps.
            </p>
          </Reveal>

          {/* the staff file: Tagout, written up like one of the crew */}
          <Reveal delay={0.12}>
            <div className="max-w-sm -rotate-1 rounded-[28px] bg-paper p-6 shadow-lift lg:justify-self-end">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green">
                  <BubbleMark size={24} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-[19px] font-extrabold leading-tight text-ink">Tagout</p>
                  <p className="text-[12px] font-bold text-ink/45">Coverage · nights, weekends, holidays</p>
                </div>
                <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-lg rounded-bl-[4px] bg-mint px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wide text-green-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-green tg-pulse" />
                  On shift
                </span>
              </div>
              <ul className="mt-5 space-y-2.5 border-t border-ink/8 pt-4">
                {[
                  ["Call-outs", "Zero, ever"],
                  ["Doubles", "Happily"],
                  ["Response time", "About 40 seconds"],
                  ["July 4th weekend", "Available"],
                  ["Tips", "Politely declined"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-baseline justify-between gap-4 text-[14px]">
                    <span className="font-semibold text-ink/45">{k}</span>
                    <span className="text-right font-extrabold text-ink">{v}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 inline-block -rotate-2 rounded-lg rounded-bl-[4px] bg-green px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-ink">
                Employee of the month, every month
              </p>
            </div>
          </Reveal>
        </div>

        <Stagger className="no-scrollbar mt-14 flex snap-x snap-proximity overscroll-x-contain gap-4 overflow-x-auto sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible" gap={0.1}>
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
      body: "A swap would have Katie closing Saturday and opening Sunday brunch. Tagout catches the clopen and asks her first, so nobody finds it on the published schedule.",
      sms: "“Heads up: that swap means close Sat, open Sun at 9. Still good?”",
      mobile: false,
    },
  ];
  return (
    <section className="bg-blush/25 py-14 sm:py-20 md:py-28">
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
        <Stagger className="no-scrollbar mt-12 flex snap-x snap-proximity overscroll-x-contain gap-4 overflow-x-auto sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-3" gap={0.08}>
          {cases.map((c) => (
            <Item key={c.title} className="min-w-[84%] snap-center sm:min-w-0">
              <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-pop transition-shadow hover:shadow-lift">
                {/* a slice of the phone screen: timestamp + the actual text */}
                <div className="bg-[#f4f2ec] px-5 pb-5 pt-3.5">
                  <p className="text-center text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink/35">
                    {c.time}
                  </p>
                  <div className="mt-2.5 flex items-start gap-2">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green">
                      <BubbleMark size={14} className="text-white" />
                    </div>
                    <p className="rounded-[16px] rounded-bl-md bg-white px-3.5 py-2 text-[13.5px] leading-snug text-ink shadow-[0_1px_2px_rgb(15_21_18/0.08)]">
                      {c.sms.replace(/[\u201c\u201d]/g, "")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:px-6">
                  <h3 className="font-display text-[19px] font-extrabold text-ink">{c.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{c.body}</p>
                </div>
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
    <section className="hidden bg-cream py-14 sm:py-20 md:block md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-center font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Great shifts don&apos;t start with an&nbsp;app.
            <span className="text-green-deep"> They start with a full&nbsp;roster.</span>
          </h2>
        </Reveal>
        <Stagger
          className="no-scrollbar mt-12 flex snap-x snap-proximity overscroll-x-contain gap-4 overflow-x-auto sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible"
          gap={0.12}
        >
          {[
            {
              src: "/photos/band-floor.webp",
              alt: "Server carrying a tray of drinks through a busy, warmly lit dining room",
              cap: "Friday, fully staffed",
              pos: "50% 50%",
            },
            {
              src: "/photos/band-counter.webp",
              alt: "Smiling barista handing a coffee across the counter to a customer",
              cap: "Counter covered, line moving",
              pos: "50% 50%",
            },
            {
              src: "/photos/band-happy.webp",
              alt: "Waitress laughing with a guest at a bright, plant-filled café",
              cap: "Nobody working a double they didn't ask for",
              pos: "50% 50%",
            },
          ].map((p) => (
            <Item key={p.cap} className="min-w-[78%] snap-center sm:min-w-0">
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
    <section id="groups" className="relative mx-2 scroll-mt-24 overflow-hidden rounded-[36px] bg-ink py-14 sm:mx-4 sm:py-20 md:rounded-[52px] md:py-28">
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
                { h: "Group dashboard", b: "Coverage, open shifts, and OT exposure across every store, live.", mob: true },
                { h: "Shared talent pool", b: "Let Tagout borrow a closer from your store two miles away, rules included.", mob: true },
                { h: "Rollout without retraining", b: "Staff onboarding is one text. GMs learn it in an afternoon.", mob: false },
                { h: "Enterprise-grade controls", b: "SSO, roles and permissions, exports, API access on Enterprise.", mob: false },
              ].map((r) => (
                <li key={r.h} className={(r.mob ? "flex" : "hidden md:flex") + " gap-4"}>
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
    { k: "Staff responds via", them: "App they have to open", us: "A text they answer anyway", mob: true },
    { k: "Open shift coverage", them: "Blast + hope + call list", us: "Tagout finds, asks, confirms", mob: true },
    { k: "Overtime protection", them: "Report after the damage", us: "Blocked before the offer", mob: false },
    { k: "Staff onboarding", them: "Downloads, logins, training", us: "One text: “reply YES”", mob: false },
    { k: "Pricing", them: "Modules, add-ons, tiers", us: "One house price, everything on", mob: true },
  ];
  return (
    <section className="bg-cream py-14 sm:py-20 md:py-28">
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
          {/* mobile: stacked cards, one per row */}
          <div className="mt-10 space-y-3 md:hidden">
            {rows.filter((r) => r.mob).map((r) => (
              <div key={r.k} className="rounded-2xl bg-white p-4 shadow-pop">
                <p className="text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">{r.k}</p>
                <p className="mt-1.5 text-[13.5px] font-medium text-ink/40 line-through decoration-ink/25">{r.them}</p>
                <p className="mt-1 text-[14.5px] font-bold text-green-dark">✓ {r.us}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 hidden md:block">
            <CompareThread rows={rows} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
