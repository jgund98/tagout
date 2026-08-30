"use client";

import { ScriptedThread } from "./Phone";

/** The GM's side of Tagout: text it like you'd text your AGM. */
export function GmThread() {
  return (
    <ScriptedThread
      loop
      script={[
        {
          beat: { kind: "them", text: <>marisa just called out for tonight. need a closer, 5–11</> },
          wait: 2000,
        },
        { beat: { kind: "typing", align: "left" }, wait: 1500 },
        {
          beat: {
            kind: "tag",
            text: (
              <>
                On it. Off tonight and under 40: Devon (26 hrs), Alex (31), Katie
                (34). Text them in that order?
              </>
            ),
          },
          wait: 2800,
        },
        { beat: { kind: "them", text: <>yes</> }, wait: 1400 },
        {
          beat: {
            kind: "tag",
            text: <>Texting Devon now. You&apos;ll hear from me the second someone locks&nbsp;in.</>,
          },
          wait: 2200,
        },
        { beat: { kind: "pill", text: "6:19 PM: Devon confirmed. Board updated" }, wait: 4500 },
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
                calendar? Tap: trytagout.com/w/marisa
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

/** The store manager's side: keyholders, openers, the Saturday scramble. */
export function StoreThread() {
  return (
    <ScriptedThread
      loop
      script={[
        {
          beat: { kind: "them", text: <>Jess called out. need a keyholder to open tomorrow</> },
          wait: 2000,
        },
        { beat: { kind: "typing", align: "left" }, wait: 1500 },
        {
          beat: {
            kind: "tag",
            text: (
              <>
                4 keyholders are off tomorrow and under 40: Tyler (28 hrs), Dana
                (31), Erin (33), Matt (35). Work the list in that order?
              </>
            ),
          },
          wait: 2800,
        },
        { beat: { kind: "them", text: <>yes</> }, wait: 1400 },
        {
          beat: {
            kind: "tag",
            text: (
              <>
                On it. I&apos;ll keep asking until it&apos;s covered. Only if the whole
                list passes do you get numbers to&nbsp;dial.
              </>
            ),
          },
          wait: 2200,
        },
        { beat: { kind: "pill", text: "8:41 PM: Tyler's opening. Confirmed" }, wait: 4500 },
      ]}
    />
  );
}
