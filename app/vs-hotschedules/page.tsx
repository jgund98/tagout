import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, Item } from "@/components/Reveal";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Tagout vs HotSchedules: the honest comparison",
  description:
    "HotSchedules built the category. Tagout rebuilt it around the one channel your staff actually answers: text messages. Here's the side-by-side.",
};

const rows: { k: string; hs: string; tg: string }[] = [
  { k: "How staff respond", hs: "Push notifications into an app", tg: "SMS: reply and done" },
  { k: "Open shift coverage", hs: "Post it, blast it, chase it", tg: "Tagout finds, asks, and confirms" },
  { k: "Who gets asked", hs: "Everyone, or whoever checks", tg: "Ranked: free, under OT, likely yes" },
  { k: "Overtime control", hs: "Reports and alerts", tg: "Blocked before the offer goes out" },
  { k: "Staff onboarding", hs: "Download, register, learn", tg: "Reply YES to one text" },
  { k: "Manager experience", hs: "Deep, dense, trained-into", tg: "Clean web app, learned in an afternoon" },
  { k: "Pricing shape", hs: "Modules and add-ons", tg: "$29 a seat, everything included" },
  { k: "Built", hs: "1999, grown by acquisition", tg: "2026, built around AI + SMS from day one" },
];

export default function VsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-paper pt-16 md:pt-[72px]">
        <div className="pointer-events-none absolute -top-24 right-[-8%] h-[420px] w-[420px] rounded-full bg-mint blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 md:pb-16 md:pt-20 lg:px-8">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-[13.5px] font-bold text-ink shadow-[0_1px_2px_rgb(15_21_18/0.05)]">
              The respectful teardown
            </p>
            <h1 className="mt-6 max-w-5xl font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl md:text-6xl">
              HotSchedules built the&nbsp;category.
              <br className="hidden md:block" />{" "}
              <span className="text-green-deep">We rebuilt it around a&nbsp;text.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
              Respect where it&apos;s due: HotSchedules taught the industry that scheduling
              belongs in software. But it was designed when the answer to everything was
              “open the app,” and your staff has voted on that with their thumbs.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="overflow-x-auto rounded-3xl shadow-lift">
              <table className="w-full border-collapse md:min-w-[680px] bg-white text-left">
                <thead>
                  <tr className="border-b border-ink/8">
                    <th className="w-[30%] px-6 py-5 text-[13px] font-extrabold uppercase tracking-wide text-ink/40" />
                    <th className="w-[35%] px-6 py-5 font-display text-[16px] font-extrabold text-ink/55">
                      HotSchedules
                    </th>
                    <th className="w-[35%] bg-mint/70 px-6 py-5 font-display text-[16px] font-extrabold text-green-dark">
                      Tagout
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.k} className="border-b border-ink/6 last:border-0">
                      <td className="px-6 py-4 font-display text-[15px] font-extrabold text-ink">{r.k}</td>
                      <td className="px-6 py-4 text-[14.5px] font-medium text-ink/50">{r.hs}</td>
                      <td className="bg-mint/40 px-6 py-4 text-[14.5px] font-bold text-green-dark">{r.tg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      <CTABand
        title="Bring your HotSchedules&nbsp;invoice."
        sub="Twenty minutes, side by side, line by line. If the math doesn't clearly win, keep what you have."
      />
    </>
  );
}
