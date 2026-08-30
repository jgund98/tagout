import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, Item } from "@/components/Reveal";
import { PhoneShell } from "@/components/Phone";
import { StoreThread } from "@/components/PersonaThreads";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "For retail & stores",
  description:
    "Tagout for shift-run retail: call-outs covered by text, keyholder rules enforced automatically, seasonal crews onboarded with one message, and billing that ignores turnover.",
};

export default function StoresPage() {
  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-paper pt-16 md:pt-[72px]">
        <div className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-mint blur-[100px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <div className="order-2 lg:order-1">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-[13.5px] font-bold text-ink shadow-[0_1px_2px_rgb(15_21_18/0.05)]">
                For retail, shops & every shift-run floor
              </p>
              <h1 className="mt-6 font-display text-[42px] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink sm:text-6xl md:text-7xl">
                Stores drop shifts&nbsp;too. <span className="text-green-deep">Covered.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
                Tagout was built on restaurant Fridays, and a boutique Saturday breaks
                the exact same way: a call-out, a dead group chat, a manager stuck on
                the register. Same fix. The schedule texts&nbsp;back.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
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
          <div className="order-1 lg:order-2">
            <Reveal delay={0.1} y={40}>
              <div className="mx-auto w-fit">
                <PhoneShell contact="Tagout" time="8:37">
                  <StoreThread />
                </PhoneShell>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* retail-real capabilities */}
      <section className="mx-2 rounded-[36px] bg-ink py-20 sm:mx-4 md:rounded-[52px] md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-green">
              Built for the floor, not the back office
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-paper sm:text-5xl">
              Your rules, enforced on every&nbsp;offer.
            </h2>
          </Reveal>
          <Stagger className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-3" gap={0.1}>
            {[
              {
                h: "Keyholder rules",
                b: "Opens and closes only get offered to people who can actually unlock the door. Set it once; Tagout never forgets who carries a key.",
              },
              {
                h: "Registers & floor coverage",
                b: "A call-out an hour before open gets worked the same way as a restaurant Friday: ranked candidates, personal texts, one confirmation back to you.",
              },
              {
                h: "The holiday army",
                b: "Twenty seasonal hires onboard by replying YES to one text. No app downloads in the break room, no training day for the scheduler.",
              },
              {
                h: "Minor work rules",
                b: "Your 16-year-old weekend cashier legally can't close alone or work past curfew. Tagout knows, so those shifts are simply never offered.",
              },
              {
                h: "Weekend surge staffing",
                b: "A big promo weekend on the calendar? Ask Tagout to staff up the same way a chef staffs a 40-top: it suggests, you approve.",
              },
              {
                h: "January without the spreadsheet",
                b: "Seasonal crew rolls off the schedule and off your bill on its own. Turnover-proof billing means December's roster never haunts February's invoice.",
              },
            ].map((c) => (
              <Item key={c.h} className="min-w-[84%] snap-center sm:min-w-0">
                <div className="h-full rounded-3xl border border-paper/10 bg-paper/[0.04] p-7">
                  <h3 className="font-display text-[21px] font-extrabold text-paper">{c.h}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-paper/60">{c.b}</p>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* who fits */}
      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl">
              If your week runs on a shift grid, it&nbsp;fits.
            </h2>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {[
                "Boutiques & apparel",
                "Grocery & convenience",
                "Coffee & bakeries",
                "Salons & barbershops",
                "Gyms & studios",
                "Pet stores & groomers",
                "Garden centers",
                "Liquor & smoke shops",
                "Hardware stores",
                "Franchise units",
              ].map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-ink/10 bg-white px-4 py-2 text-[14.5px] font-bold text-ink-soft"
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Same product, same $249-covers-the-house pricing, same one-text staff
              onboarding. The only thing that changes is what&apos;s behind
              the&nbsp;counter.
            </p>
          </Reveal>
        </div>
      </section>

      <CTABand
        title="Bring your messiest Saturday."
        sub="Twenty minutes, your real schedule, one dropped shift covered while you watch. If it doesn't fit your floor, no hard feelings."
      />
    </>
  );
}
