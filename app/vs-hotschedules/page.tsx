import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, Item } from "@/components/Reveal";
import CTABand from "@/components/CTABand";
import CompareThread from "@/components/CompareThread";

export const metadata: Metadata = {
  title: "Compare: Tagout vs HotSchedules, 7shifts & more",
  description:
    "HotSchedules built the category. Tagout rebuilt it around the one channel your staff actually answers: text messages. The honest side-by-side, plus how Tagout stacks up against 7shifts, When I Work, Homebase, and Sling.",
};

const rows: { k: string; hs: string; tg: string }[] = [
  { k: "How staff respond", hs: "Push notifications into an app", tg: "SMS: reply and done" },
  { k: "Open shift coverage", hs: "Post it, blast it, chase it", tg: "Tagout finds, asks, and confirms" },
  { k: "Who gets asked", hs: "Everyone, or whoever checks", tg: "Ranked: free, under OT, likely yes" },
  { k: "Overtime control", hs: "Reports and alerts", tg: "Blocked before the offer goes out" },
  { k: "Staff onboarding", hs: "Download, register, learn", tg: "Reply YES to one text" },
  { k: "Manager experience", hs: "Deep, dense, trained-into", tg: "Clean web app, learned in an afternoon" },
  { k: "Pricing shape", hs: "Modules and add-ons", tg: "One house price, sections as you grow" },
  { k: "Built", hs: "1999, grown by acquisition", tg: "2026, built around AI + SMS from day one" },
];

export default function VsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-paper pt-16 md:pt-[72px]">
        <div className="pointer-events-none absolute -top-24 right-[-8%] h-[420px] w-[420px] rounded-full bg-mint blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 md:pb-16 md:pt-20 lg:px-8">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-2xl rounded-bl-[6px] bg-white px-4 py-2 text-[13.5px] font-bold text-ink shadow-[0_2px_12px_rgb(15_21_18/0.08)]">
              The respectful teardown
            </p>
            <h1 className="mt-6 max-w-5xl font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl md:text-6xl">
              HotSchedules built the&nbsp;category.
              <br className="hidden md:block" />{" "}
              <span className="text-green-deep">We rebuilt it around a&nbsp;text.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
              Respect where it&apos;s due: HotSchedules taught the industry that
              scheduling belongs in software. But it still answers everything with
              &ldquo;open the app,&rdquo; and your staff has voted on&nbsp;that.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            {/* mobile: stacked cards, one per row */}
            <div className="space-y-3 md:hidden">
              {rows.map((r) => (
                <div key={r.k} className="rounded-2xl bg-white p-4 shadow-pop">
                  <p className="text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">{r.k}</p>
                  <p className="mt-1.5 text-[13.5px] font-medium text-ink/40">
                    <span className="font-bold text-ink/50">HotSchedules:</span> {r.hs}
                  </p>
                  <p className="mt-1 text-[14.5px] font-bold text-green-dark">
                    <span className="font-extrabold">Tagout:</span> {r.tg}
                  </p>
                </div>
              ))}
            </div>
            <div className="hidden md:block">
              <CompareThread
                themLabel="HotSchedules"
                rows={rows.map((r) => ({ k: r.k, them: r.hs, us: r.tg }))}
              />
            </div>
          </Reveal>
          <p className="mt-4 text-center text-[13px] font-medium text-ink/40">
            Comparison reflects our understanding of typical HotSchedules deployments as of 2026. Your setup may vary, so bring it to the demo and we&apos;ll go line by line.
          </p>
        </div>
      </section>

      {/* the three reasons */}
      <section className="mx-2 rounded-[36px] bg-ink py-20 sm:mx-4 md:rounded-[52px] md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-paper sm:text-5xl">
              Three reasons GMs switch.
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-6 md:grid-cols-3" gap={0.12}>
            {[
              {
                n: "1",
                h: "The channel is the product",
                b: "An app your staff won't open can't cover a shift. SMS is the only channel with near-universal, near-instant reach, so we built the whole product on it.",
              },
              {
                n: "2",
                h: "Coverage does itself",
                b: "HotSchedules shows you the gap. Tagout closes it: ranks candidates, texts them personally, confirms the winner, updates the board, and tells you after.",
              },
              {
                n: "3",
                h: "The bill is one line",
                b: "No modules, no communications add-on, no AI tier. One per-seat price with everything on, positioned to be the easy yes against your current invoice.",
              },
            ].map((c) => (
              <Item key={c.n}>
                <div className="h-full rounded-3xl border border-paper/10 bg-paper/[0.04] p-7 sm:p-8">
                  <p className="flex h-11 w-11 items-center justify-center rounded-full bg-green font-display text-xl font-extrabold text-ink">
                    {c.n}
                  </p>
                  <h3 className="mt-5 font-display text-[21px] font-extrabold text-paper">{c.h}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-paper/60">{c.b}</p>
                </div>
              </Item>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <div className="mt-14 grid items-center gap-8 rounded-[28px] bg-paper/[0.05] border border-paper/10 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h3 className="font-display text-2xl font-extrabold text-paper sm:text-3xl">
                  Switching costs are our problem, not&nbsp;yours.
                </h3>
                <ul className="mt-6 space-y-3.5">
                  {[
                    "We import your schedules, staff, roles, and availability from HotSchedules",
                    "Your staff onboards by replying to one text, no meeting required",
                    "Run both side by side during the free pilot until you're sure",
                    "Month to month after that. We keep you by being better, not by contract",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[15.5px] font-semibold text-paper/80">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green/15 text-[12px] font-black text-green">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/demo"
                  className="mt-8 inline-block rounded-full bg-green px-7 py-3.5 text-[16px] font-extrabold text-ink transition-all hover:shadow-lift"
                >
                  Start the switch →
                </Link>
              </div>
              <img
                src="/photos/server-table.webp"
                alt="Server taking a payment at a table of business diners"
                loading="lazy"
                className="aspect-[4/3] w-full rounded-3xl object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* the rest of the field */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-green-dark">
              The rest of the field
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl">
              Good products. Different&nbsp;job.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Respect to all of them: they schedule. Tagout schedules and then goes
              and gets the shift covered. That difference is the whole&nbsp;company.
            </p>
          </Reveal>
          <Stagger
            className="no-scrollbar mt-12 flex snap-x snap-proximity overscroll-x-contain gap-4 overflow-x-auto sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible"
            gap={0.08}
          >
            {[
              {
                name: "7shifts",
                what: "The restaurant favorite for schedules and team chat",
                fair: "Genuinely strong scheduling, and staff like the chat.",
                us: "A dropped shift gets posted for staff to claim. Tagout goes and gets the yes: ranked asks by text, confirmed, board updated.",
              },
              {
                name: "When I Work",
                what: "Broad small-business scheduling with easy swaps",
                fair: "Clean scheduling and simple swaps across many industries.",
                us: "Swaps still start with someone opening an app. With Tagout the whole exchange happens in the thread your team already answers.",
              },
              {
                name: "Homebase",
                what: "Scheduling, time clocks, and payroll for small teams",
                fair: "A generous toolbox for small shops, clocks and payroll included.",
                us: "When someone calls out, the manager is still the engine. Tagout is the engine: it works the list and hands you a confirmed name.",
              },
              {
                name: "Sling by Toast",
                what: "Scheduling that lives inside the Toast ecosystem",
                fair: "Convenient if you run Toast: schedules sit next to the POS.",
                us: "Open shifts go to a feed and wait. Tagout doesn't wait: it texts the right people, in order, until Friday is whole.",
              },
            ].map((c) => (
              <Item key={c.name} className="min-w-[86%] snap-center sm:min-w-0">
                <div className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-pop sm:p-7">
                  <h3 className="font-display text-[20px] font-extrabold text-ink">{c.name}</h3>
                  <p className="mt-0.5 text-[13px] font-semibold text-ink/45">{c.what}</p>
                  <p className="mt-4 w-fit max-w-[92%] rounded-[16px] rounded-bl-md bg-ink/[0.05] px-4 py-2.5 text-[14px] font-medium leading-snug text-ink/55">
                    {c.fair}
                  </p>
                  <p className="mt-2.5 w-fit max-w-[92%] self-end rounded-[16px] rounded-br-md bg-green px-4 py-2.5 text-[14px] font-bold leading-snug text-white">
                    {c.us}
                  </p>
                </div>
              </Item>
            ))}
          </Stagger>
          <p className="mt-6 max-w-3xl text-[12.5px] leading-relaxed text-ink/40">
            Category-level comparisons based on public information as of August 2026;
            features vary by plan and tier. All product names and trademarks are the
            property of their respective owners.
          </p>
        </div>
      </section>

      <CTABand
        title="Bring your HotSchedules&nbsp;invoice."
        sub="Twenty minutes, side by side, line by line. If the math doesn't clearly win, keep what you have."
      />
    </>
  );
}
