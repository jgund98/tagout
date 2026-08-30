"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

const { seatMinimum, launchFee, seatTiers } = site.pricing;

function priceFor(seats: number) {
  let remaining = seats;
  let floor = 0;
  let total = 0;
  for (const tier of seatTiers) {
    const span = Math.min(remaining, tier.upTo - floor);
    if (span <= 0) break;
    total += span * tier.price;
    remaining -= span;
    floor = tier.upTo;
  }
  return total;
}

export default function PricingCalculator() {
  const [seats, setSeats] = useState(18);
  const billable = Math.max(seats, seatMinimum);
  const monthly = priceFor(billable);
  const blended = monthly / billable;
  const perDay = monthly / 30;
  const activeTier = billable > 35 ? 2 : billable > 20 ? 1 : 0;

  return (
    <div className="overflow-hidden rounded-[32px] bg-white shadow-lift">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        {/* the dial */}
        <div className="p-7 sm:p-10">
          <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.12em] text-green-dark">
            Size it to your crew
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink">
            How many people are on your&nbsp;schedule?
          </h2>

          <div className="mt-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <p className="font-display text-6xl font-extrabold tabular-nums tracking-tight text-ink">
                {seats}
              </p>
              <p className="text-[14px] font-bold text-ink/45 sm:text-right">
                seats · servers, cooks, hosts, managers, everyone
              </p>
            </div>
            <input
              type="range"
              min={seatMinimum}
              max={60}
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value, 10))}
              aria-label="Number of people on your schedule"
              className="mt-4 h-2.5 w-full cursor-pointer appearance-none rounded-full bg-ink/8 accent-[#0ecf7f]"
            />
            <div className="mt-2 flex justify-between text-[12px] font-bold text-ink/35">
              <span>café · {seatMinimum}</span>
              <span>fast casual</span>
              <span>full service</span>
              <span>60</span>
            </div>
          </div>

          {/* volume tiers */}
          <div className="mt-6">
            <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">
              Volume pricing, applied automatically
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { label: `Seats 1–20 · $${seatTiers[0].price}` },
                { label: `21–35 · $${seatTiers[1].price}` },
                { label: `36+ · $${seatTiers[2].price}` },
              ].map((t, i) => (
                <span
                  key={t.label}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-extrabold transition-colors ${
                    i <= activeTier
                      ? "bg-mint text-green-dark"
                      : "bg-ink/5 text-ink/40"
                  }`}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-mint p-4">
              <p className="text-[12px] font-extrabold uppercase tracking-wide text-green-dark/70">
                Your monthly
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold tabular-nums text-green-dark">
                ${monthly.toLocaleString()}
              </p>
              <p className="text-[12px] font-semibold text-green-dark/70">
                {billable > 20
                  ? `blended $${blended.toFixed(2).replace(/\.00$/, "")} a seat`
                  : `$${seatTiers[0].price} × ${billable} seats`}
              </p>
            </div>
            <div className="rounded-2xl bg-cream p-4">
              <p className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">
                Per day
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold tabular-nums text-ink">
                ${perDay.toFixed(0)}
              </p>
              <p className="text-[12px] font-semibold text-ink/45">
                about one comped entrée
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
            {seatMinimum}-seat minimum. A seat is anyone active on the schedule that
            month; managers included, never billed extra. Multiple locations unlock
            deeper volume rates.
          </p>
        </div>

        {/* what's in it */}
        <div className="flex flex-col bg-ink p-7 sm:p-10">
          <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.12em] text-green">
            Every seat gets everything
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
            className="mt-8 rounded-full bg-green py-4 text-center text-[16px] font-extrabold text-ink transition-all hover:shadow-lift"
          >
            Price mine in a demo →
          </Link>
        </div>
      </div>
    </div>
  );
}
