import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { Reveal, Stagger, Item } from "@/components/Reveal";
import CTABand from "@/components/CTABand";
import FaqJsonLd from "@/components/FaqJsonLd";
import PricingCalculator from "@/components/PricingCalculator";

export const metadata: Metadata = {
  title: "Pricing: $29 a seat, everything on",
  description:
    "One rate: $29 per seat per month, with the AI agent, both portals, and unlimited texting included. White-glove launch, month to month, custom plans for groups.",
};

const FAQS = [
  {
    q: "Is the AI really included for every seat?",
    a: "Yes. The AI is the product, not an upsell. Every seat gets coverage, swaps, guardrails, and both portals.",
  },
  {
    q: "Are text messages really unlimited?",
    a: "All scheduling-related texting is included: offers, confirmations, publishing, reminders. We never meter your coverage.",
  },
  {
    q: "What does the pilot look like?",
    a: "Thirty days in one location, full product, our team does the launch. If your GM doesn't fight to keep it, walk away and the launch fee comes back.",
  },
  {
    q: "Any contracts?",
    a: "Month to month, always. Groups & Enterprise agreements are annual with rollout milestones you set.",
  },
  {
    q: "What if my roster swings with the season?",
    a: "Billing follows the schedule. Patio season adds seats; January takes them away. You never pay for someone who isn't working.",
  },
];

export default function PricingPage() {
  const { seatPrice, launchFee, custom } = site.pricing;
  return (
    <>
      <section className="relative overflow-hidden bg-paper pt-16 md:pt-[72px]">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-lav blur-[110px] opacity-90" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 text-center sm:px-6 md:pt-20 lg:px-8">
          <Reveal>
            <h1 className="mx-auto max-w-3xl font-display text-5xl font-extrabold leading-[0.98] tracking-[-0.03em] text-ink sm:text-6xl md:text-7xl">
              $29 a seat. <span className="text-green-deep">Everything&nbsp;on.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
              Everyone on your schedule is a seat, and everything is in the rate: the AI
              agent, both portals, unlimited texting. No modules, no add-ons,
              no math you need a rep to explain. Past 20 seats, volume discounts kick in on their own.
            </p>
            <p className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-[14.5px] font-extrabold text-green-dark">
              <span className="h-2 w-2 rounded-full bg-green" />
              {site.pricing.pilotNote}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper pb-16 pt-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <PricingCalculator />
          </Reveal>
        </div>
      </section>

      {/* how the money works */}
      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stagger className="grid gap-5 md:grid-cols-3" gap={0.1}>
            {[
              {
                h: "What counts as a seat?",
                b: `Anyone active on the schedule that month: servers, cooks, hosts, bartenders, managers. Seasonal crew rolls off automatically when they're off the schedule. Managers are seats too, never a separate "admin fee."`,
              },
              {
                h: "Why the launch fee?",
                b: `Because launch is work and we do all of it: your schedules and staff imported, house rules configured, every employee onboarded by text, and a human watching your first week. $${launchFee}, once per location.`,
              },
              {
                h: "Why per seat, not per module?",
                b: `Legacy platforms sell scheduling, then messaging, then forecasting, and the invoice grows a line at a time. Ours grows only when your team does, starting at ${seatPrice} a head with automatic volume discounts past 20 seats. Your accountant will get it in one glance.`,
              },
            ].map((c) => (
              <Item key={c.h}>
                <div className="h-full rounded-3xl bg-white p-7 shadow-pop">
                  <h3 className="font-display text-[20px] font-extrabold text-ink">{c.h}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{c.b}</p>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* custom tier */}
      <section className="bg-paper py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid overflow-hidden rounded-[32px] bg-violet-deep shadow-lift lg:grid-cols-[1fr_1fr]">
              <div className="p-7 sm:p-10">
                <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.12em] text-green">
                  {custom.name}
                </p>
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Custom, and worth the&nbsp;call.
                </h2>
                <p className="mt-4 text-[16px] leading-relaxed text-white/65">
                  {custom.blurb} For {custom.unit}: bring us your org chart and your
                  current invoice, and we&apos;ll come back with volume seat rates and a
                  store-by-store rollout plan.
                </p>
                <Link
                  href="/demo"
                  className="mt-8 inline-block rounded-full bg-green px-8 py-3.5 text-[16px] font-extrabold text-ink transition-all hover:shadow-lift"
                >
                  {custom.cta} →
                </Link>
              </div>
              <div className="border-t border-white/10 p-7 sm:p-10 lg:border-l lg:border-t-0">
                <ul className="space-y-3.5">
                  {custom.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15px] font-semibold text-white/85">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/20 text-[10.5px] font-black text-green">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* pricing FAQ */}
      <section className="bg-paper pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl space-y-4 px-4 sm:px-6 lg:px-8">
          <FaqJsonLd faqs={FAQS} />
          {FAQS.map((f) => (
            <Reveal key={f.q}>
              <details className="group rounded-2xl bg-white p-6 shadow-pop">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[17px] font-extrabold text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/6 text-lg font-bold text-ink transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <CTABand
        title="Do the math with us."
        sub="Bring your current scheduling bill to a 20-minute demo. We'll put the numbers side by side."
      />
    </>
  );
}
