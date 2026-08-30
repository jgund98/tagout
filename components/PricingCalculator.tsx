"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { site } from "@/lib/site";
import { BubbleMark } from "./Wordmark";

/** Springy dollar counter so the price feels alive as the slider moves. */
function AnimatedDollars({ value, className }: { value: number; className: string }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => `$${Math.round(v).toLocaleString()}`);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.45, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [value, mv]);
  return <motion.p className={className}>{text}</motion.p>;
}

const { base, baseSeats, sectionPrice, sectionSeats, launchFee } = site.pricing;

function sectionsFor(seats: number) {
  return Math.max(0, Math.ceil((seats - baseSeats) / sectionSeats));
}

const MAX_SEATS = 70;

export default function PricingCalculator() {
  const [seats, setSeats] = useState(32);
  const atMax = seats >= MAX_SEATS; // past here, the ladder hands off to custom rates
  const sections = sectionsFor(seats);
  const monthly = base + sections * sectionPrice;
  // Divide by the seats the price COVERS, not the slider position — per-seat
  // then only ever falls as the house grows instead of spiking at band edges.
  const coveredSeats = baseSeats + sections * sectionSeats;
  const perSeat = monthly / coveredSeats;

  return (
    <div className="overflow-hidden rounded-[32px] bg-white shadow-lift">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        {/* the dial */}
        <div className="p-7 sm:p-10">
          <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.12em] text-green-dark">
            Size it to your house
          </p>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            How many people are on your&nbsp;schedule?
          </h2>

          <div className="mt-6 sm:mt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-5xl font-extrabold tabular-nums tracking-tight text-ink sm:text-6xl">
                  {atMax ? `${MAX_SEATS}+` : seats}
                </p>
                <p className="mt-0.5 text-[12.5px] font-bold text-ink/45 sm:text-[14px]">
                  seats on the schedule
                </p>
              </div>
              <div className="text-right">
                {atMax ? (
                  <p className="font-display text-5xl font-extrabold tracking-tight text-green-deep sm:text-6xl">
                    Custom
                  </p>
                ) : (
                  <AnimatedDollars
                    value={monthly}
                    className="font-display text-5xl font-extrabold tabular-nums tracking-tight text-green-deep sm:text-6xl"
                  />
                )}
                <p className="mt-0.5 text-[12.5px] font-bold text-ink/45 sm:text-[14px]">
                  {atMax
                    ? "volume rates, talk to us"
                    : sections === 0
                      ? "a month. the house covers it"
                      : `a month · the house + ${sections} section${sections > 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            <input
              type="range"
              min={8}
              max={MAX_SEATS}
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value, 10))}
              aria-label="Number of people on your schedule"
              className="mt-4 h-2.5 w-full cursor-pointer appearance-none rounded-full bg-ink/8 accent-[#0ecf7f]"
            />
            <div className="mt-2 flex justify-between text-[12px] font-bold text-ink/35">
              <span>café</span>
              <span>the house · {baseSeats}</span>
              <span>full service</span>
              <span>custom</span>
            </div>
          </div>

          {/* the house + sections */}
          <div className="mt-6 hidden sm:block">
            <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">
              How your price is built
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-green px-3.5 py-1.5 text-[13px] font-extrabold text-ink">
                The house · {baseSeats} seats · ${base}
              </span>
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-extrabold transition-colors ${
                    sections >= n ? "bg-mint text-green-dark" : "bg-ink/5 text-ink/35"
                  }`}
                >
                  + Section · {sectionSeats} seats · ${sectionPrice}
                </span>
              ))}
            </div>
            <p className="mt-2.5 text-[13px] font-semibold text-ink/45">
              A section, like the ones you hand your servers. Most houses never need
              more than&nbsp;two.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6">
            <div className="rounded-2xl bg-mint p-4">
              <p className="text-[12px] font-extrabold uppercase tracking-wide text-green-dark/70">
                Works out to
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold tabular-nums text-green-dark">
                {atMax ? "under $8" : `$${Math.round(perSeat)}`}
              </p>
              <p className="text-[12px] font-semibold text-green-dark/70">
                {atMax
                  ? "a seat, before volume rates even apply"
                  : `a seat across the ${coveredSeats} seats yours covers`}
              </p>
            </div>
            <div className="rounded-2xl bg-cream p-4">
              <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">
                To launch
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold tabular-nums text-ink">
                ${launchFee}
              </p>
              <p className="text-[12px] font-semibold text-ink/45">
                once, and we do the setup
              </p>
            </div>
          </div>

          <p className="mt-5 text-[13px] font-medium text-ink/45">
            Turnover-proof: hire, quit, and rehire all summer, the bill only moves when
            the house adds a section. Multi-location groups unlock custom rates.
          </p>
        </div>

        {/* what's in it */}
        <div className="relative flex flex-col overflow-hidden bg-ink p-7 sm:p-10">
          <BubbleMark
            check={false}
            size={220}
            className="pointer-events-none absolute -right-14 -bottom-14 rotate-12 text-paper/[0.05]"
          />
          <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.12em] text-green">
            The house comes fully loaded
          </p>
          <ul className="mt-5 flex-1 space-y-3">
            {site.pricing.included.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[14.5px] font-semibold text-paper/85">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/20 text-[10.5px] font-black text-green">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/demo"
            className="relative mt-8 rounded-full bg-green py-4 text-center text-[16px] font-extrabold text-ink transition-all hover:shadow-lift"
          >
            Price mine in a demo →
          </Link>
        </div>
      </div>
    </div>
  );
}
