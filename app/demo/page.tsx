import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import DemoForm from "@/components/DemoForm";

export const metadata: Metadata = {
  title: "Get a demo: see Tagout cover a shift live",
  description:
    "Twenty minutes with a human. We'll import a week of your schedule and let Tagout cover a real gap while you watch.",
};

export default function DemoPage() {
  return (
    <section className="relative overflow-hidden bg-paper pt-16 md:pt-[72px]">
      <div className="pointer-events-none absolute -top-32 right-[-8%] h-[480px] w-[480px] rounded-full bg-mint blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 left-[-10%] h-[380px] w-[380px] rounded-full bg-lav blur-[110px] opacity-80" />

      {/* Mobile order is conversion-first: headline, then the form itself, then the
          pitch. Grid auto-placement gives desktop the classic two-column layout. */}
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-20 pt-10 sm:px-6 md:pb-28 md:pt-16 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-10 lg:px-8">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-[13.5px] font-bold text-ink shadow-[0_1px_2px_rgb(15_21_18/0.05)]">
            <span className="h-2 w-2 rounded-full bg-green tg-pulse" />
            A 20-minute live demo with a real person
          </p>
          <h1 className="mt-5 font-display text-[38px] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink sm:mt-6 sm:text-6xl sm:leading-[0.98]">
            Watch&nbsp;Tagout cover&nbsp;a&nbsp;shift.{" "}
            <span className="text-green-deep">Yours.</span>
          </h1>
          <p className="mt-4 max-w-lg text-[16.5px] leading-relaxed text-ink-soft sm:hidden">
            Bring a week of your real schedule. We drop a shift on purpose, you watch
            Tagout put it back together.
          </p>
          <p className="mt-6 hidden max-w-lg text-lg leading-relaxed text-ink-soft sm:block">
            No slides, no canned pitch. Bring a week of your real schedule and we&apos;ll import
            it live, drop a shift on purpose, and let you watch Tagout put it back
            together.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="lg:row-span-2">
          <DemoForm />
        </Reveal>

        <Reveal>
          <ul className="space-y-5">
            {[
              { h: "Minute 0–5", b: "Your schedule, imported while we talk." },
              { h: "Minute 5–15", b: "A dropped shift, covered end-to-end in front of you." },
              { h: "Minute 15–20", b: "Your bill vs ours, on a whiteboard, in the open." },
            ].map((s) => (
              <li key={s.h} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
                <span className="w-fit shrink-0 whitespace-nowrap rounded-full bg-mint px-3 py-1 text-[12px] font-extrabold uppercase tracking-wide text-green-dark sm:mt-1">
                  {s.h}
                </span>
                <p className="text-[15.5px] font-semibold leading-relaxed text-ink">{s.b}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-3xl bg-cream p-6 sm:mt-10">
            <p className="font-display text-[16px] font-extrabold text-ink">
              Rolling out a group?
            </p>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">
              Tell us in the form and we&apos;ll bring the multi-location dashboard and a
              pilot plan shaped for ops leadership.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
