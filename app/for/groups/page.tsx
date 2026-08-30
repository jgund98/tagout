import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, Item } from "@/components/Reveal";
import { GroupDashMock } from "@/components/Mocks";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "For restaurant groups",
  description:
    "Tagout for multi-unit operators: one pilot store, then a wave rollout. Group dashboards, shared staff pools, volume seat pricing, and controls that scale.",
};

export default function GroupsPage() {
  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-paper pt-16 md:pt-[72px]">
        <div className="pointer-events-none absolute -top-40 right-[-8%] h-[520px] w-[520px] rounded-full bg-mint blur-[100px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16 lg:grid-cols-[1fr_1fr] lg:px-8">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-[13.5px] font-bold text-ink shadow-[0_1px_2px_rgb(15_21_18/0.05)]">
              For multi-unit operators
            </p>
            <h1 className="mt-6 font-display text-[42px] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink sm:text-6xl md:text-7xl">
              Roll out in waves, not&nbsp;<span className="text-green-deep">weekends.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
              Most workforce rollouts die in training rooms. Tagout skips them: staff
              onboard by replying to one text, GMs learn the portal in an afternoon,
              and you watch every store from one&nbsp;screen.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/demo"
                className="group rounded-full bg-green px-7 py-4 text-lg font-extrabold text-ink transition-all hover:bg-green-deep hover:text-white hover:shadow-lift"
              >
                Get a group demo
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border-2 border-ink/15 px-7 py-4 text-lg font-extrabold text-ink transition-colors hover:border-ink"
              >
                Volume pricing
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <GroupDashMock />
          </Reveal>
        </div>
      </section>

      {/* rollout playbook */}
      <section className="bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-green">
              The rollout playbook
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-paper sm:text-5xl">
              Prove it in one store. Scale it on your&nbsp;calendar.
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-5 md:grid-cols-3" gap={0.12}>
            {[
              {
                n: "Weeks 1–4",
                h: "The pilot store",
                b: "Pick your toughest location, not your easiest. We import, launch, and let the GM stress-test it on real Fridays. You watch the coverage numbers move.",
              },
              {
                n: "Week 5",
                h: "The readout",
                b: "Fill times, OT exposure, manager hours saved, staff adoption. Real numbers from your own store, on one page you can forward upstairs.",
              },
              {
                n: "Weeks 6+",
                h: "The waves",
                b: "Five stores at a time or twenty. Each launch is an import and one text to staff. No training tour, no travel budget, no all-hands.",
              },
            ].map((c) => (
              <Item key={c.n}>
                <div className="h-full rounded-3xl border border-paper/10 bg-paper/[0.04] p-7 sm:p-8">
                  <p className="font-display text-[14px] font-extrabold uppercase tracking-wide text-green">{c.n}</p>
                  <h3 className="mt-2 font-display text-[22px] font-extrabold text-paper">{c.h}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-paper/60">{c.b}</p>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* what scale gets you */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <h2 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl">
                Built for the ops&nbsp;org, not just the&nbsp;store.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                Every GM gets the same dead-simple tool. Your regional and finance
                teams get the layer on top: live coverage, labor exposure, and staffing
                patterns across the whole&nbsp;portfolio.
              </p>
              <Link
                href="/demo"
                className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 text-[16px] font-extrabold text-paper transition-colors hover:bg-green-dark"
              >
                Bring us your org chart →
              </Link>
            </Reveal>
            <Stagger className="grid gap-4 sm:grid-cols-2" gap={0.08}>
              {[
                { h: "Shared talent pools", b: "Let a closer from the store two miles away pick up your gap, with rules you set on roles, rates, and travel." },
                { h: "Standards that stick", b: "House rules, OT caps, and minor-labor limits set at the group level and enforced in every store, automatically." },
                { h: "SSO & permissions", b: "Regional roles, per-store access, and single sign-on for the people who live in five dashboards a day." },
                { h: "Exports & API", b: "Clean hour data to payroll, labor lines to finance, and an API when your data team comes knocking." },
                { h: "Volume seat pricing", b: "Per-seat rates step down as stores come online. One invoice, not forty." },
                { h: "A human rollout team", b: "A named team owns your launch calendar, store by store, until the last GM says they're good." },
              ].map((c) => (
                <Item key={c.h}>
                  <div className="h-full rounded-3xl bg-white p-6 shadow-pop">
                    <h3 className="font-display text-[18px] font-extrabold text-ink">{c.h}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{c.b}</p>
                  </div>
                </Item>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <CTABand
        title="Pilot it in your hardest store."
        sub="If Tagout can hold your toughest Friday, the rest of the rollout is a formality. Bring ops and finance to the same call."
      />
    </>
  );
}
