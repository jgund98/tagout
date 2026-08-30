"use client";

import { usePortal, uid } from "@/lib/portal/store";
import { Chip, PageTitle, Toggle } from "@/components/portal/ui";

export default function RulesPage() {
  const { state, dispatch } = usePortal();

  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle
        title="House rules"
        sub="You set the rules once. Tagout enforces them on every single offer, text, and swap — even the 6 AM ones."
      />

      <div className="space-y-3.5">
        {state.rules.map((r) => (
          <div key={r.id} className={`rounded-3xl p-5 shadow-pop transition-colors ${r.on ? "bg-white" : "bg-white/60"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className={`font-display text-[17px] font-extrabold ${r.on ? "text-ink" : "text-ink/40"}`}>
                    {r.name}
                  </h2>
                  {r.value && <Chip tone={r.on ? "mint" : "white"}>{r.value}</Chip>}
                </div>
                <p className={`mt-1.5 max-w-xl text-[13.5px] font-medium leading-relaxed ${r.on ? "text-ink/60" : "text-ink/35"}`}>
                  {r.plain}
                </p>
              </div>
              <Toggle
                on={r.on}
                label={r.name}
                onChange={() => {
                  dispatch({ type: "RULE_TOGGLE", id: r.id });
                  dispatch({
                    type: "FEED_PUSH",
                    event: {
                      id: uid("f"),
                      kind: "rule",
                      who: null,
                      text: r.on ? `Rule off: ${r.name}` : `Rule back on: ${r.name}`,
                      sub: r.on
                        ? "Tagout stops checking this on offers — the schedule page stops flagging it too"
                        : "enforced again on every offer, starting now",
                      when: "Just now",
                    },
                  });
                }}
              />
            </div>
            {r.on && (
              <p className="mt-3 flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-cream px-3.5 py-2 text-[12.5px] font-semibold text-ink/55">
                <span className="text-green-deep">✓</span> Last time it mattered: {r.lastUsed}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl bg-mint/60 p-5">
        <h3 className="font-display text-[16px] font-extrabold text-ink">These aren&apos;t suggestions</h3>
        <p className="mt-1.5 max-w-2xl text-[13.5px] font-medium leading-relaxed text-ink/65">
          Rules run before every text goes out. Turn one off and the schedule page stops flagging it
          too — you saw that wired together if you just tried it. When state law and a rule overlap
          (minors, breaks), Tagout keeps the stricter one.
        </p>
      </div>
    </div>
  );
}
