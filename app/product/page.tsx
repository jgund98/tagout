import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, Item } from "@/components/Reveal";
import CTABand from "@/components/CTABand";
import CoverTheater from "@/components/CoverTheater";
import FaqJsonLd from "@/components/FaqJsonLd";
import StaffPortalMock from "@/components/StaffPortalMock";
import {
  ScheduleMock,
  ApprovalsMock,
  GuardrailsMock,
  GroupDashMock,
} from "@/components/Mocks";

export const metadata: Metadata = {
  title: "Product: scheduling, shift coverage & the AI that texts",
  description:
    "Everything in Tagout: fast schedule building, SMS-first shift swaps and coverage, the built-in AI agent, overtime guardrails, and multi-location dashboards.",
};

const FAQS = [
  {
    q: "What if someone doesn't want texts?",
    a: "They opt in when they join and can text STOP anytime. Anyone who prefers the staff portal just uses that; Tagout adapts per person. In practice, texting is the option staff pick for themselves.",
  },
  {
    q: "Does Tagout ever text the whole roster?",
    a: "No. That's the group-blast problem we exist to kill. Tagout ranks candidates by availability, hours, role, and real yes-history, then asks a few people in order. Escalation to you happens early if nobody bites.",
  },
  {
    q: "Can managers override the AI?",
    a: "Always. Tagout drafts, ranks, and asks, while you set how much it does on its own, from “suggest only” to “handle it and tell me after.” Every action is logged and reversible.",
  },
  {
    q: "What about tip pools, POS, and payroll?",
    a: "Tagout exports clean hour data for payroll and is built to sit alongside your POS. Tell us your stack in the demo and we'll show you exactly how it fits.",
  },
  {
    q: "How long does setup actually take?",
    a: "Import your current schedule, text your staff one onboarding message, set your house rules. Most single locations are live inside a day, often inside a shift.",
  },
];

export default function ProductPage() {
  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-paper pt-16 md:pt-[72px]">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[460px] w-[720px] -translate-x-1/2 rounded-full bg-mint blur-[110px]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 text-center sm:px-6 md:pb-20 md:pt-20 lg:px-8">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-[13.5px] font-bold text-ink shadow-[0_1px_2px_rgb(15_21_18/0.05)]">
              The product, front to back
            </p>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-extrabold leading-[0.98] tracking-[-0.03em] text-ink sm:text-6xl md:text-7xl">
              A scheduler with&nbsp;<span className="text-green-deep">hands.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
              Most scheduling software shows you the hole in Friday night. Tagout is the
              first one that gets out of the chair and fills&nbsp;it.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/demo"
                className="group rounded-full bg-green px-7 py-4 text-lg font-extrabold text-ink transition-all hover:bg-green-deep hover:text-white hover:shadow-lift"
              >
                Get a demo
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border-2 border-ink/15 px-7 py-4 text-lg font-extrabold text-ink transition-colors hover:border-ink"
              >
                See pricing
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* capability grid */}
      <section className="bg-paper pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
            {[
              { h: "Schedule builder", b: "Drag-fast weekly grid, templates, copy-forward, conflict checks as you type.", c: "bg-mint text-green-dark" },
              { h: "AI shift coverage", b: "Drops and no-shows handled by an AI that texts the right people in a human voice.", c: "bg-lav text-violet-mid" },
              { h: "SMS everything", b: "Publishing, swaps, confirmations, reminders, on the channel with ~98% open rates.", c: "bg-mint text-green-dark" },
              { h: "Overtime guardrails", b: "Hour caps and labor targets enforced before offers go out, not after payroll.", c: "bg-butter text-[#9a6a00]" },
              { h: "Approvals in one tap", b: "Requests arrive pre-checked against hours, roles, and your house rules.", c: "bg-lav text-violet-mid" },
              { h: "Group dashboard", b: "Coverage, open shifts, and OT exposure across every location, live.", c: "bg-mint text-green-dark" },
            ].map((f) => (
              <Item key={f.h}>
                <div className="h-full rounded-3xl bg-white p-6 shadow-pop transition-shadow hover:shadow-lift sm:p-7">
                  <span className={`inline-block rounded-full px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-wide ${f.c}`}>
                    Included
                  </span>
                  <h3 className="mt-3.5 font-display text-[21px] font-extrabold text-ink">{f.h}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{f.b}</p>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* theater */}
      <section className="bg-mint/60 py-20 md:py-28" id="watch">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl">
              The coverage engine, in&nbsp;motion.
            </h2>
          </Reveal>
          <div className="mt-12">
            <CoverTheater />
          </div>
        </div>
      </section>

      {/* deep dives */}
      <section id="managers" className="scroll-mt-24 bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <ScheduleMock />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-display text-[14px] font-extrabold uppercase tracking-[0.14em] text-green-dark">Scheduling</p>
              <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                The week, built before your coffee&nbsp;cools.
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Templates for your Tuesday and your Saturday. Copy-forward that keeps
                what worked. Availability, time-off, and role conflicts flagged inline
                while you build, not discovered by an angry text on Friday.
              </p>
            </Reveal>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className="lg:order-2">
              <ApprovalsMock />
            </Reveal>
            <Reveal delay={0.1} className="lg:order-1">
              <p className="font-display text-[14px] font-extrabold uppercase tracking-[0.14em] text-violet-mid">Swaps & covers</p>
              <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Staff trade shifts. You tap&nbsp;approve.
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                A server texts “swap my Thursday with Devon.” Tagout checks hours, roles,
                and rules, lines it up, and hands you a one-tap decision. The entire
                negotiation happened without you. The authority didn&apos;t.
              </p>
            </Reveal>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <GuardrailsMock />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-display text-[14px] font-extrabold uppercase tracking-[0.14em] text-[#9a6a00]">Labor guardrails</p>
              <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                The cheapest overtime is the kind that never&nbsp;happens.
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Set weekly caps and labor targets once. Tagout routes around them
                automatically on every offer, swap, and pickup. Managers stop doing
                mental math at 11 PM; owners stop finding surprises in payroll.
              </p>
            </Reveal>
          </div>

          <div id="groups" className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className="lg:order-2">
              <GroupDashMock />
            </Reveal>
            <Reveal delay={0.1} className="lg:order-1">
              <p className="font-display text-[14px] font-extrabold uppercase tracking-[0.14em] text-green-dark">Multi-location</p>
              <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Every store on one screen. Every GM on the same&nbsp;tool.
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Group dashboards roll coverage and overtime exposure up to ops leaders,
                while each GM keeps a tool simple enough to love. Shared staff pools let Tagout borrow a closer from the store two miles away, with your rules.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* staff strip */}
      <section id="staff" className="scroll-mt-24 bg-cream py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
          <Reveal>
            <StaffPortalMock />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Managers get an app worth opening.
              <br />
              <span className="text-green-deep">Staff never need one.</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
              Tagout is a full platform: managers get a fast web portal (schedule
              builder, approvals, labor dashboards, the AI&apos;s activity feed) and staff
              get their own portal for the week, open shifts, and time-off. The SMS layer
              sits on top, so nobody is <em>forced</em> to open an app for the everyday
              stuff. That&apos;s why adoption isn&apos;t a rollout&nbsp;project.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Fair questions.
            </h2>
          </Reveal>
          <FaqJsonLd faqs={FAQS} />
          <div className="mt-10 space-y-4">
            {FAQS.map((f) => (
              <Reveal key={f.q}>
                <details className="group rounded-2xl bg-white p-6 shadow-pop open:shadow-lift">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[18px] font-extrabold text-ink [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/6 text-lg font-bold text-ink transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand title="See the whole thing in 20&nbsp;minutes." />
    </>
  );
}
