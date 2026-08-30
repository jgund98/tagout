"use client";

import { useRouter } from "next/navigation";
import { usePortal, endDemoSession } from "@/lib/portal/store";
import { Chip, PageTitle, DemoNote, GhostBtn } from "@/components/portal/ui";

const INTEGRATIONS = [
  { name: "SMS provider", what: "Real texting: covers, invites, sign-in codes", state: "Needs credentials", key: true },
  { name: "Claude (Anthropic)", what: "The brain that reads replies and ranks the list", state: "Needs API key", key: true },
  { name: "Toast POS", what: "Sales vs. labor, live on Tonight", state: "Coming soon", key: false },
  { name: "Gusto / payroll", what: "Approved hours flow straight to payroll", state: "Coming soon", key: false },
];

export default function SettingsPage() {
  const { state } = usePortal();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle title="Settings" sub="The house, the plan, and what's wired up." />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* house */}
        <section className="rounded-3xl bg-white p-5 shadow-pop">
          <h2 className="font-display text-[17px] font-extrabold text-ink">The house</h2>
          <dl className="mt-3 space-y-2.5 text-[14px]">
            {[
              ["Name", state.houseName],
              ["Timezone", "Eastern (Palm Beach, FL)"],
              ["Service hours", "11 AM – 12 AM · brunch Sundays"],
              ["Tagout's number", "(561) 555-8248 — save it as a contact"],
              ["GM cell", "(561) 324-9522"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4">
                <dt className="shrink-0 font-bold text-ink/45">{k}</dt>
                <dd className="text-right font-extrabold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <DemoNote>Editing house details unlocks with real accounts — in demo mode they reset on logout anyway.</DemoNote>
        </section>

        {/* plan */}
        <section className="rounded-3xl bg-ink p-5">
          <h2 className="font-display text-[17px] font-extrabold text-paper">Your plan</h2>
          <p className="mt-2 font-display text-[30px] font-extrabold text-green">
            $348<span className="text-[15px] text-paper/50"> / month</span>
          </p>
          <p className="text-[13px] font-semibold text-paper/55">The house (25 seats) + 1 section · 12 of 40 seats used</p>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-paper/10">
            <div className="h-full w-[30%] rounded-full bg-green" />
          </div>
          <p className="mt-3 text-[12.5px] font-semibold leading-relaxed text-paper/50">
            Hire and fire all summer — this number only moves if you add a section. Multi-location? That&apos;s
            where group rates start.
          </p>
          <Chip tone="mint" className="mt-3">30-day pilot · $249 launch fee refundable</Chip>
        </section>

        {/* locations */}
        <section className="rounded-3xl bg-white p-5 shadow-pop">
          <h2 className="font-display text-[17px] font-extrabold text-ink">Locations</h2>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
            <div>
              <p className="text-[14px] font-extrabold text-ink">{state.houseName}</p>
              <p className="text-[12px] font-semibold text-ink/45">12 on the roster · you're the GM</p>
            </div>
            <Chip tone="mint">this one</Chip>
          </div>
          <button className="mt-2.5 w-full rounded-2xl border-2 border-dashed border-ink/12 px-4 py-3 text-[13.5px] font-extrabold text-ink/45 transition-colors hover:border-green hover:text-green-deep">
            + Add a second location
          </button>
          <p className="mt-2 text-[12px] font-semibold text-ink/40">
            A second spot copies this one's rules and templates, gets its own roster, and rolls up into one
            group view for owners.
          </p>
        </section>

        {/* integrations, honest about what's wired */}
        <section className="rounded-3xl bg-white p-5 shadow-pop">
          <h2 className="font-display text-[17px] font-extrabold text-ink">Wired up</h2>
          <div className="mt-3 space-y-2.5">
            {INTEGRATIONS.map((i) => (
              <div key={i.name} className="flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-extrabold text-ink">{i.name}</p>
                  <p className="text-[12px] font-semibold text-ink/45">{i.what}</p>
                </div>
                <Chip tone={i.key ? "butter" : "white"}>{i.state}</Chip>
              </div>
            ))}
          </div>
          <DemoNote>
            Everything in this demo runs without them; the moment keys land, the same flows go live for real.
          </DemoNote>
        </section>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-3xl bg-blush/40 p-5">
        <div>
          <p className="font-display text-[15px] font-extrabold text-ink">Demo mode</p>
          <p className="text-[13px] font-semibold text-ink/55">
            Logging out wipes every change and reseeds the restaurant, fresh for the next walkthrough.
          </p>
        </div>
        <GhostBtn
          onClick={() => {
            endDemoSession();
            router.push("/login");
          }}
        >
          Log out & reset
        </GhostBtn>
      </div>
    </div>
  );
}
