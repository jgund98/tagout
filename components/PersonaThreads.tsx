"use client";

import { ScriptedThread } from "./Phone";

/** The GM's side of Tagout: short reports, not requests. */
export function GmThread() {
  return (
    <ScriptedThread
      loop
      script={[
        {
          beat: {
            kind: "tag",
            text: <>Fri close covered: Dana out, Marisa in. Nothing needed from you.</>,
          },
          wait: 2200,
        },
        { beat: { kind: "them", text: <>👍</> }, wait: 1600 },
        {
          beat: {
            kind: "tag",
            text: (
              <>
                Heads up: Thursday has a 40-top at 7. Want me to add a server to the
                floor? Reply YES and I&apos;ll find one.
              </>
            ),
          },
          wait: 2600,
        },
        { beat: { kind: "them", text: <>yes</> }, wait: 1500 },
        { beat: { kind: "pill", text: "Devon added to Thursday. Confirmed 3:12 PM" }, wait: 4500 },
      ]}
    />
  );
}

/** The staff side: ask for anything in plain English. */
export function StaffThread() {
  return (
    <ScriptedThread
      loop
      script={[
        { beat: { kind: "them", text: <>what do i work this week?</> }, wait: 1800 },
        {
          beat: {
            kind: "tag",
            text: (
              <>
                This week: Tue 5–11, Thu 5–11, Sat 11–5. Want the week in your
                calendar? Tap: tagout.app/w/marisa
              </>
            ),
          },
          wait: 2600,
        },
        { beat: { kind: "them", text: <>any extra shifts going?</> }, wait: 1800 },
        {
          beat: {
            kind: "tag",
            text: (
              <>
                You&apos;re first in line if Friday opens up. You&apos;d finish the week at
                36 hrs, still under 40. Want me to flag you?
              </>
            ),
          },
          wait: 2600,
        },
        { beat: { kind: "them", text: <>yes please 🙏</> }, wait: 1400 },
        { beat: { kind: "pill", text: "Flagged. First dibs on Friday" }, wait: 4200 },
      ]}
    />
  );
}
