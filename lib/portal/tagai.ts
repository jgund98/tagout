import type { PortalState } from "./data";
import { flexScore } from "./store";
import { needsYouCount, shiftHours } from "./store";

export type AiAction = { label: string; href: string };
export type AiAnswer = { text: string; actions?: AiAction[] };

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/**
 * TagAI's answer engine, running on the live portal state. Every number in
 * an answer is computed from the same store the pages render from.
 */
export function answer(q: string, state: PortalState): AiAnswer {
  const s = q.toLowerCase();
  const has = (...words: string[]) => words.some((w) => s.includes(w));

  // a named person?
  const person = state.staff.find(
    (p) => s.includes(p.first.toLowerCase()) || s.includes(p.name.toLowerCase())
  );

  // who's on tonight
  if (has("tonight", "who's on", "whos on", "working tonight", "lineup")) {
    const tonight = state.shifts.filter((x) => x.day === 4 && x.state !== "open");
    const names = tonight
      .map((x) => {
        const p = state.staff.find((st) => st.id === x.staffId);
        return p ? `${p.first} (${x.start}–${x.end}${x.section ? ", " + x.section : ""})` : null;
      })
      .filter(Boolean);
    return {
      text: `${names.length} on tonight: ${names.join(", ")}.`,
      actions: [{ label: "Open Schedule", href: "/portal/schedule" }],
    };
  }

  // approvals / needs review
  if (has("approve", "approval", "review", "pending", "waiting", "need my", "needs me", "catch up", "miss")) {
    const n = needsYouCount(state);
    const cards = state.punches.filter((p) => p.outAt !== null && !p.approved).length;
    const off = state.timeOff.filter((t) => t.state === "pending").length;
    const live = state.runs.some((r) => r.state === "live" && r.outcome?.includes("needs your approval"));
    if (n === 0) return { text: "Nothing is waiting on you right now.", actions: [{ label: "Open Inbox", href: "/portal/inbox" }] };
    const parts: string[] = [];
    if (live) parts.push("1 cover approval");
    if (cards) parts.push(`${cards} timecard${cards > 1 ? "s" : ""}`);
    if (off) parts.push(`${off} time-off request${off > 1 ? "s" : ""}`);
    return {
      text: `${n} item${n > 1 ? "s" : ""} need your review: ${parts.join(", ")}.`,
      actions: [{ label: "Open the queue", href: "/portal/coverage" }],
    };
  }

  // labor / cost
  if (has("labor", "cost", "spend", "payroll", "wages", "$")) {
    const perDay = DAY_NAMES.map((_, day) =>
      state.shifts
        .filter((x) => x.day === day && x.state !== "open")
        .reduce((c, x) => {
          const p = state.staff.find((st) => st.id === x.staffId);
          return c + shiftHours(x) * (p?.rate ?? 14);
        }, 0)
    );
    const total = Math.round(perDay.reduce((a, b) => a + b, 0));
    const top = perDay.indexOf(Math.max(...perDay));
    return {
      text: `Scheduled wages this week: $${total.toLocaleString()}. ${DAY_NAMES[top]} is the heaviest day at $${Math.round(perDay[top]).toLocaleString()}. That's wages only; percent-of-sales unlocks with the POS integration.`,
      actions: [{ label: "See the chart", href: "/portal" }],
    };
  }

  // coverage / the gap / dana's friday
  if (has("gap", "cover", "dropped", "open shift", "friday close")) {
    const live = state.runs.find((r) => r.state === "live");
    if (live) {
      const doneSteps = live.steps.filter((x) => x.state === "done").length;
      return {
        text: `${live.title}: ${doneSteps} of ${live.steps.length} steps done. ${live.outcome ?? "Outreach is running."}`,
        actions: [{ label: "Open Coverage", href: "/portal/coverage" }],
      };
    }
    const open = state.shifts.filter((x) => x.state === "open").length;
    return {
      text: open
        ? `No live outreach right now. ${open} open shift${open > 1 ? "s" : ""} on the board.`
        : "Everything is covered. No open shifts.",
      actions: [{ label: "Open Coverage", href: "/portal/coverage" }],
    };
  }

  // overtime / hours
  if (has("overtime", "over 40", "hours", "clock")) {
    const close = state.staff.filter((p) => p.status === "active" && p.hoursWeek >= 38);
    const onClock = state.punches.filter((p) => p.outAt === null).length;
    return {
      text: `${onClock} on the clock right now. Near the 40-hour cap: ${
        close.length ? close.map((p) => `${p.first} (${p.hoursWeek} hrs)`).join(", ") : "nobody"
      }. Anyone at the cap is excluded from extra-shift offers automatically.`,
      actions: [{ label: "Open Time clock", href: "/portal/hours" }],
    };
  }

  // flexibility / who says yes
  if (has("flexible", "flexibility", "pickup", "says yes", "reliable", "best")) {
    const ranked = state.staff
      .filter((p) => flexScore(p) > 0)
      .sort((a, b) => flexScore(b) - flexScore(a))
      .slice(0, 3);
    return {
      text: `Best coverage fit right now: ${ranked
        .map((p, i) => `${i + 1}. ${p.first} (${flexScore(p)})`)
        .join(", ")}. The score comes from yes-rate, pickups, drops, and availability.`,
      actions: [{ label: "Open Team", href: "/portal/team" }],
    };
  }

  // time off
  if (has("time off", "vacation", "pto", "off request")) {
    const pending = state.timeOff.filter((t) => t.state === "pending");
    if (!pending.length) return { text: "No pending time-off requests.", actions: [{ label: "Open Team", href: "/portal/team" }] };
    const lines = pending.map((t) => {
      const p = state.staff.find((st) => st.id === t.staffId);
      return `${p?.first} (${t.range}, ${t.reason.toLowerCase()})`;
    });
    return {
      text: `${pending.length} pending: ${lines.join("; ")}.`,
      actions: [{ label: "Review requests", href: "/portal/team" }],
    };
  }

  // rules
  if (has("rule", "curfew", "minor", "clopen", "quiet hours", "keyholder")) {
    const on = state.rules.filter((r) => r.on).length;
    return {
      text: `${on} of ${state.rules.length} house rules are on. Every offer, message, and swap is checked against them before it goes out.`,
      actions: [{ label: "Open House rules", href: "/portal/rules" }],
    };
  }

  // floor / sections
  if (has("floor", "section", "table", "patio", "seats")) {
    const seats = state.tables.reduce((n, t) => n + t.seats, 0);
    return {
      text: `${state.tables.length} tables, ${seats} seats across ${["Dining room", "Patio", "Bar"].length} rooms.`,
      actions: [{ label: "Open Floor plan", href: "/portal/floor" }],
    };
  }

  // a specific person
  if (person) {
    const shifts = state.shifts.filter((x) => x.staffId === person.id && x.state !== "open");
    const days = shifts.map((x) => DAY_NAMES[x.day].slice(0, 3)).join(", ");
    const score = flexScore(person);
    return {
      text: `${person.name}: ${person.role}, ${person.hoursWeek} hrs this week${days ? ` (${days})` : ""}. Says yes ${Math.round(person.yesRate * 10)} of 10 asks${score ? `, flexibility ${score}` : ""}. Availability: ${person.availNote.toLowerCase()}.`,
      actions: [{ label: `Open ${person.first}'s profile`, href: "/portal/team" }],
    };
  }

  // schedule building
  if (has("schedule", "shift", "publish", "build")) {
    const drafts = state.shifts.filter((x) => x.state === "draft").length;
    return {
      text: drafts
        ? `${drafts} draft shift${drafts > 1 ? "s" : ""} waiting to publish. Nothing sends until you publish.`
        : "The week is published. Add or change shifts any time; changes go out as drafts.",
      actions: [{ label: "Open Schedule", href: "/portal/schedule" }],
    };
  }

  return {
    text: "I can answer from the live board: tonight's lineup, labor, coverage, hours, the team, time off, house rules, or any one person. Try one of these, or ask in your own words.",
    actions: [
      { label: "Open Today", href: "/portal" },
      { label: "Open Coverage", href: "/portal/coverage" },
    ],
  };
}

export const SUGGESTIONS = [
  "Who's on tonight?",
  "Anything need my review?",
  "Where's labor this week?",
  "Who covers shifts best?",
];
