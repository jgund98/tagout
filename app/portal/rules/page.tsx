"use client";

import { usePortal, uid } from "@/lib/portal/store";
import { PageTitle, Toggle } from "@/components/portal/ui";
import type { Rule } from "@/lib/portal/data";

const GROUPS: Rule["group"][] = ["Hours & pay", "Compliance", "How Tagout asks", "Approvals"];

export default function RulesPage() {
  const { state, dispatch } = usePortal();

  const setValue = (r: Rule, value: string) => {
    dispatch({ type: "RULE_VALUE", id: r.id, value });
    dispatch({
      type: "FEED_PUSH",
      event: {
        id: uid("f"),
        kind: "rule",
        who: null,
        text: `Rule updated: ${r.name} is now "${value}"`,
        sub: "applies to every offer from this moment on",
        when: "Just now",
      },
    });
  };

  const toggle = (r: Rule) => {
    dispatch({ type: "RULE_TOGGLE", id: r.id });
    dispatch({
      type: "FEED_PUSH",
      event: {
        id: uid("f"),
        kind: "rule",
        who: null,
        text: r.on ? `Rule off: ${r.name}` : `Rule back on: ${r.name}`,
        sub: r.on
          ? "Tagout stops checking this on offers, and the schedule page stops flagging it too"
          : "enforced again on every offer, starting now",
        when: "Just now",
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle
        title="House rules"
        sub="Enforced automatically on every offer, message, and swap."
      />

      {GROUPS.map((g) => (
        <section key={g} className="mb-7">
          <h2 className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.14em] text-ink/35">{g}</h2>
          <div className="space-y-3">
            {state.rules
              .filter((r) => r.group === g)
              .map((r) => (
                <div
                  key={r.id}
                  className={`rounded-3xl p-5 shadow-pop transition-colors ${r.on ? "bg-white" : "bg-white/55"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-display text-[17px] font-extrabold ${r.on ? "text-ink" : "text-ink/40"}`}>
                        {r.name}
                      </h3>
                      <p className={`mt-1.5 max-w-xl text-[14px] font-medium leading-relaxed ${r.on ? "text-ink/60" : "text-ink/35"}`}>
                        {r.plain}
                      </p>
                    </div>
                    <Toggle on={r.on} label={r.name} onChange={() => toggle(r)} />
                  </div>

                  {r.on && (
                    <div className="mt-3.5 flex flex-wrap items-center gap-2">
                      {r.options ? (
                        r.options.map((o) => {
                          const active = r.value === o;
                          return (
                            <button
                              key={o}
                              onClick={() => !active && setValue(r, o)}
                              className={`rounded-full px-3.5 py-2 text-[13px] font-extrabold transition-colors ${
                                active ? "bg-green-dark text-white" : "bg-cream text-ink/55 hover:text-ink"
                              }`}
                            >
                              {o}
                            </button>
                          );
                        })
                      ) : (
                        r.value && (
                          <span className="rounded-full bg-cream px-3.5 py-2 text-[13px] font-extrabold text-ink/60">
                            {r.value}
                          </span>
                        )
                      )}
                    </div>
                  )}

                  {r.on && (
                    <p className="mt-3 flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-cream px-3.5 py-2 text-[12.5px] font-semibold text-ink/55">
                      <span className="text-green-deep">✓</span> Last applied · {r.lastUsed}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </section>
      ))}

    </div>
  );
}
