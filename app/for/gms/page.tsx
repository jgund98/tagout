import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, Item } from "@/components/Reveal";
import { PhoneShell } from "@/components/Phone";
import { GmThread } from "@/components/PersonaThreads";
import { ApprovalsMock, GuardrailsMock } from "@/components/Mocks";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "For general managers",
  description:
    "Tagout for GMs: coverage handled by AI over text, approvals in one tap, overtime blocked before it happens. Get your Friday nights back.",
};

export default function GmsPage() {
  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-paper pt-16 md:pt-[72px]">
        <div className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-mint blur-[100px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <div className="order-2 lg:order-1">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-[13.5px] font-bold text-ink shadow-[0_1px_2px_rgb(15_21_18/0.05)]">
                For general managers
              </p>
              <h1 className="mt-6 font-display text-[42px] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink sm:text-6xl md:text-7xl">
                Get your Friday nights&nbsp;<span className="text-green-deep">back.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
                Text Tagout like you&apos;d text your best AGM: &ldquo;Marisa called out
                tonight.&rdquo; It comes back with a ranked list, and one word starts
                the&nbsp;outreach.
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
                  href="/product"
                  className="rounded-full border-2 border-ink/15 px-7 py-4 text-lg font-extrabold text-ink transition-colors hover:border-ink"
                >
                  See the product
                </Link>
              </div>
            </Reveal>
          </div>
          <div className="order-1 lg:order-2">
            <Reveal delay={0.1} y={40}>
              <div className="mx-auto w-fit">
                <PhoneShell contact="Tagout" time="3:08">
                  <GmThread />
                </PhoneShell>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* before / after */}
      <section className="mx-2 rounded-[36px] bg-ink py-20 sm:mx-4 md:rounded-[52px] md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-paper sm:text-5xl">
              The same Tuesday, run two&nbsp;ways.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col rounded-[28px] bg-paper/[0.05] border border-paper/10 p-7 sm:p-9">
                <p className="font-display text-[14px] font-extrabold uppercase tracking-[0.14em] text-coral">
                  Without Tagout
                </p>
                <ul className="mt-6 flex-1 space-y-4">
                  {[
                    "6:15 AM: wake up to a call-out, start dialing",
                    "10:00 AM: post the shift, blast the group chat",
                    "2:00 PM: chase the two “maybes” from the chat",
                    "4:45 PM: give up, take a section yourself",
                    "11:30 PM: build tomorrow's fix from the office",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[15.5px] font-semibold text-paper/70">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-coral" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex h-full flex-col rounded-[28px] bg-green p-7 sm:p-9">
                <p className="font-display text-[14px] font-extrabold uppercase tracking-[0.14em] text-ink/60">
                  With Tagout
                </p>
                <ul className="mt-6 flex-1 space-y-4">
                  {[
                    "6:41 AM: “Covered: Luis takes 8–2.” Go back to sleep",
                    "10:00 AM: approve one swap with one tap",
                    "2:00 PM: nothing. It's quiet. That's the product",
                    "4:45 PM: run the pass, watch the room",
                    "11:30 PM: go home. The board is already whole",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[15.5px] font-bold text-ink">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* the two mocks that matter to a GM */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <ApprovalsMock />
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Your inbox becomes a list of&nbsp;yeses.
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Every request that reaches you is already checked against hours, roles,
                and your house rules. You keep the authority. You lose the legwork.
              </p>
            </Reveal>
          </div>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className="lg:order-2">
              <GuardrailsMock />
            </Reveal>
            <Reveal delay={0.1} className="lg:order-1">
              <h3 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Walk into the owner&apos;s office with a better labor&nbsp;line.
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Overtime that never happens, doubles that get asked about first, and a
                clean export at payroll. The P&amp;L notices even if nobody says&nbsp;so.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* pitch to the owner */}
      <section className="mx-2 rounded-[36px] bg-pine py-20 sm:mx-4 md:rounded-[52px] md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-green">
              Pitching it upstairs?
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-paper sm:text-5xl">
              The owner conversation takes four&nbsp;sentences.
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" gap={0.1}>
            {[
              { n: "1", t: "“It's $29 a seat with everything included.”" },
              { n: "2", t: "“It blocks overtime before the offer goes out.”" },
              { n: "3", t: "“The crew doesn't need training. It's texting.”" },
              { n: "4", t: "“There's a 30-day pilot. If it flops, we walk.”" },
            ].map((c) => (
              <Item key={c.n}>
                <div className="h-full rounded-3xl bg-white/[0.06] border border-white/10 p-6">
                  <p className="flex h-10 w-10 items-center justify-center rounded-full bg-green font-display text-lg font-extrabold text-ink">
                    {c.n}
                  </p>
                  <p className="mt-4 text-[16px] font-bold leading-relaxed text-paper/90">{c.t}</p>
                </div>
              </Item>
            ))}
          </Stagger>
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl text-[15.5px] font-semibold text-paper/60">
              Bring your owner to the demo. We&apos;ll drop a shift live and let the
              product make the argument.
            </p>
          </Reveal>
        </div>
      </section>

      <CTABand title="Run the demo on a real shift." />
    </>
  );
}
