import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, Item } from "@/components/Reveal";
import { PhoneShell } from "@/components/Phone";
import { StaffThread } from "@/components/PersonaThreads";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "For servers & staff",
  description:
    "Tagout for restaurant staff: your schedule, swaps, and pickups live in your texts. No app to babysit, a full portal when you want it.",
};

export default function StaffPage() {
  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-paper pt-16 md:pt-[72px]">
        <div className="pointer-events-none absolute -top-40 left-[-10%] h-[520px] w-[520px] rounded-full bg-lav blur-[100px] opacity-90" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <div className="order-2 lg:order-1">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-[13.5px] font-bold text-ink shadow-[0_1px_2px_rgb(15_21_18/0.05)]">
                For servers, cooks, hosts & bartenders
              </p>
              <h1 className="mt-6 font-display text-[42px] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink sm:text-6xl md:text-7xl">
                Your schedule lives where your thumbs&nbsp;<span className="text-green-deep">do.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
                Ask for your week. Drop a shift. Grab extra hours. All in plain
                English, all from your texts. There&apos;s a full portal too, for when
                you want the whole picture. Nobody makes you live in&nbsp;it.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/demo"
                  className="group rounded-full bg-green px-7 py-4 text-lg font-extrabold text-ink transition-all hover:bg-green-deep hover:text-white hover:shadow-lift"
                >
                  Show your manager
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
              <p className="mt-5 text-[14.5px] font-semibold text-ink/45">
                Onboarding is one text. Reply YES and you&apos;re in.
              </p>
            </Reveal>
          </div>
          <div className="order-1 lg:order-2">
            <Reveal delay={0.1} y={40}>
              <div className="mx-auto w-fit">
                <PhoneShell contact="Tagout" time="11:22">
                  <StaffThread />
                </PhoneShell>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* fairness */}
      <section className="bg-violet-deep py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.14em] text-green">
              Built to be fair
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl">
              No favorites. No surprise&nbsp;doubles.
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-5 md:grid-cols-3" gap={0.1}>
            {[
              {
                h: "First yes takes it",
                b: "Open shifts go to the people who can actually work them, and the first clear yes wins. Not whoever happens to be standing near the office.",
              },
              {
                h: "Your hours, protected",
                b: "Tagout won't offer you a shift that pushes you past your limits, and it asks before anything becomes a double. You always get the choice.",
              },
              {
                h: "Your life, respected",
                b: "Set your availability once, by text. Class on Tuesdays? Kid pickup at 3? Tagout remembers, and simply never asks for those hours.",
              },
            ].map((c) => (
              <Item key={c.h}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/[0.06] p-7">
                  <h3 className="font-display text-[21px] font-extrabold text-white">{c.h}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/65">{c.b}</p>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* the everyday asks */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8">
          <Reveal>
            <div className="relative">
              <img
                src="/photos/server-tray.jpg"
                alt="Server carrying a tray of drinks across a patio"
                loading="lazy"
                className="aspect-square w-full max-w-md rounded-[32px] object-cover object-[45%_20%] shadow-lift"
              />
              <div className="absolute -right-3 bottom-8 max-w-[250px] rounded-2xl rounded-br-md bg-green p-4 text-white shadow-lift sm:-right-6">
                <p className="text-[14px] font-semibold leading-snug">“running 10 late, tell the floor?”</p>
                <p className="mt-1.5 text-[12px] font-bold text-white/70">handled. manager notified, no drama</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl">
              Everything you&apos;d ask a great manager, by&nbsp;text.
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { k: "“what do I work this week?”", v: "Week texted back in seconds" },
                { k: "“drop my Tuesday”", v: "Coverage search starts instantly" },
                { k: "“swap Sat with Devon”", v: "Checked and sent for approval" },
                { k: "“any open shifts?”", v: "You're flagged for the next one" },
                { k: "“no more mornings pls”", v: "Availability updated" },
                { k: "“who's on tonight?”", v: "Tonight's lineup, texted" },
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

      <CTABand
        title="Like this better than your current app?"
        sub="Tell your GM about Tagout. The demo takes 20 minutes and your whole crew onboards with one text."
      />
    </>
  );
}
