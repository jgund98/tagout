"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from "react";
import { makeSeed, type PortalState, type FeedEvent, type Shift, type Bubble } from "./data";

/* ---------- session helpers (demo mode: fresh seed on every login) ---------- */

const STATE_KEY = "tagout-demo-state";
const SESSION_KEY = "tagout-portal-session";

export function startDemoSession() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ at: new Date().toISOString() }));
  sessionStorage.setItem(STATE_KEY, JSON.stringify(makeSeed()));
}

export function endDemoSession() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(STATE_KEY);
}

export function hasSession() {
  try {
    return !!sessionStorage.getItem(SESSION_KEY);
  } catch {
    return false;
  }
}

/* ---------- time helpers ---------- */

export function toMins(t: string): number {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return h * 60 + parseInt(m[2], 10);
}

export function shiftHours(s: { start: string; end: string }): number {
  let a = toMins(s.start);
  let b = toMins(s.end);
  if (b <= a) b += 24 * 60; // past midnight
  return (b - a) / 60;
}

export function fmtClock(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = Math.round(mins % 60);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
}

/**
 * Flexibility score, 0 to 99: how likely this person is to actually take a
 * shift when asked. Built only from tracked behavior, and the breakdown is
 * shown to the GM in full, so the ranking is oversight, not a black box.
 */
export function flexScore(s: import("./data").Staff): number {
  if (s.status !== "active" || (s.picks90 === 0 && s.yesRate === 0)) return 0;
  let score = 45 * s.yesRate + Math.min(30, s.picks90 * 3) - s.drops90 * 5;
  if (s.availNote === "Anytime") score += 18;
  else if (s.availNote === "Wants more hours") score += 18;
  else score += 6;
  return Math.max(5, Math.min(99, Math.round(score)));
}

export function flexParts(s: import("./data").Staff): { label: string; delta: string; good: boolean }[] {
  const parts: { label: string; delta: string; good: boolean }[] = [];
  parts.push({
    label: `Says yes ${Math.round(s.yesRate * 10)} of 10 asks`,
    delta: `+${Math.round(45 * s.yesRate)}`,
    good: s.yesRate >= 0.6,
  });
  parts.push({
    label: `${s.picks90} pickups in 90 days`,
    delta: `+${Math.min(30, s.picks90 * 3)}`,
    good: s.picks90 > 0,
  });
  if (s.drops90 > 0)
    parts.push({ label: `${s.drops90} drops in 90 days`, delta: `-${s.drops90 * 5}`, good: false });
  const open = s.availNote === "Anytime" || s.availNote === "Wants more hours";
  parts.push({
    label: open ? `Availability: ${s.availNote.toLowerCase()}` : `Availability: ${s.availNote.toLowerCase()}`,
    delta: open ? "+18" : "+6",
    good: open,
  });
  return parts;
}

/** Everything currently waiting on the GM, counted once, shown everywhere. */
export function needsYouCount(state: PortalState): number {
  const approval = state.runs.some((r) => r.state === "live" && r.outcome?.includes("needs your approval")) ? 1 : 0;
  const cards = state.punches.filter((p) => p.outAt !== null && !p.approved).length;
  const timeOff = state.timeOff.filter((t) => t.state === "pending").length;
  return approval + cards + timeOff;
}

/** "5:00 PM" <-> "17:00" for native time inputs */
export function to24h(t: string): string {
  const mins = toMins(t);
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}
export function from24h(v: string): string {
  const [h, m] = v.split(":").map((n) => parseInt(n, 10));
  return fmtClock(h * 60 + m);
}

let idc = 100;
export const uid = (p: string) => `${p}-${++idc}-${Math.random().toString(36).slice(2, 6)}`;

/* ---------- actions ---------- */

type Action =
  | { type: "HYDRATE"; state: PortalState }
  | { type: "FEED_PUSH"; event: FeedEvent }
  | { type: "FEED_READ_ALL" }
  | { type: "RUN_STEP"; runId: string; stepIndex: number; state: "done" | "live" | "todo"; detail?: string }
  | { type: "RUN_BUBBLE"; runId: string; bubble: Bubble }
  | { type: "RUN_SET"; runId: string; patch: Partial<import("./data").CoverageRun> }
  | { type: "SHIFT_UPSERT"; shift: Shift }
  | { type: "SHIFT_DELETE"; id: string }
  | { type: "PUBLISH_WEEK" }
  | { type: "RULE_TOGGLE"; id: string }
  | { type: "RULE_VALUE"; id: string; value: string }
  | { type: "AUTOPILOT"; mode: PortalState["autopilot"] }
  | { type: "TIMEOFF"; id: string; state: "approved" | "denied" }
  | { type: "NOTE_ADD"; text: string }
  | { type: "STAFF_INVITE"; name: string; phone: string; role: import("./data").Role }
  | { type: "STAFF_PATCH"; id: string; patch: Partial<import("./data").Staff> }
  | { type: "PUNCH_PATCH"; id: string; patch: Partial<import("./data").Punch> }
  | { type: "SECTION_SET"; shiftId: string; section: string }
  | { type: "PAUSE_TOGGLE" }
  | { type: "TABLE_CYCLE"; id: string; sections: string[] }
  | { type: "TABLE_ADD"; seats: number; section: string; shape: "round" | "square" }
  | { type: "TABLE_REMOVE"; id: string }
  | { type: "TABLE_PATCH"; id: string; patch: Partial<import("./data").Table> }
  | { type: "FLOOR_BALANCE"; sections: string[] }
  | { type: "ROTATION_SET"; mode: import("./data").RotationMode }
  | { type: "STAFF_REMOVE"; id: string }
  | { type: "APPROVE_LIVE_COVER" };

function reducer(state: PortalState, a: Action): PortalState {
  switch (a.type) {
    case "HYDRATE":
      return a.state;
    case "FEED_PUSH":
      return { ...state, feed: [{ ...a.event, fresh: true }, ...state.feed].slice(0, 60) };
    case "FEED_READ_ALL":
      return { ...state, feed: state.feed.map((f) => ({ ...f, fresh: false })) };
    case "RUN_STEP":
      return {
        ...state,
        runs: state.runs.map((r) =>
          r.id !== a.runId
            ? r
            : {
                ...r,
                steps: r.steps.map((s, i) =>
                  i === a.stepIndex ? { ...s, state: a.state, detail: a.detail ?? s.detail } : s
                ),
              }
        ),
      };
    case "RUN_BUBBLE":
      return {
        ...state,
        runs: state.runs.map((r) => (r.id === a.runId ? { ...r, thread: [...r.thread, a.bubble] } : r)),
      };
    case "RUN_SET":
      return { ...state, runs: state.runs.map((r) => (r.id === a.runId ? { ...r, ...a.patch } : r)) };
    case "SHIFT_UPSERT": {
      const exists = state.shifts.some((s) => s.id === a.shift.id);
      return {
        ...state,
        weekPublished: false,
        shifts: exists ? state.shifts.map((s) => (s.id === a.shift.id ? a.shift : s)) : [...state.shifts, a.shift],
      };
    }
    case "SHIFT_DELETE":
      return { ...state, weekPublished: false, shifts: state.shifts.filter((s) => s.id !== a.id) };
    case "PUBLISH_WEEK":
      return {
        ...state,
        weekPublished: true,
        shifts: state.shifts.map((s) => (s.state === "draft" ? { ...s, state: "published" } : s)),
      };
    case "RULE_TOGGLE":
      return { ...state, rules: state.rules.map((r) => (r.id === a.id ? { ...r, on: !r.on } : r)) };
    case "RULE_VALUE":
      return { ...state, rules: state.rules.map((r) => (r.id === a.id ? { ...r, value: a.value } : r)) };
    case "AUTOPILOT":
      return { ...state, autopilot: a.mode };
    case "TIMEOFF":
      return { ...state, timeOff: state.timeOff.map((t) => (t.id === a.id ? { ...t, state: a.state } : t)) };
    case "NOTE_ADD":
      return { ...state, notes: [{ id: uid("n"), text: a.text, when: "Just now" }, ...state.notes] };
    case "STAFF_INVITE": {
      const first = a.name.split(" ")[0] || a.name;
      return {
        ...state,
        staff: [
          ...state.staff,
          {
            id: uid("st"),
            name: a.name,
            first,
            role: a.role,
            phone: a.phone,
            photo: null,
            color: "#7c6cf6",
            yesRate: 0,
            hoursWeek: 0,
            status: "invited",
            availNote: "Invite just texted · waiting on YES",
            rate: 12,
            since: "Today",
            certs: [],
            picks90: 0,
            drops90: 0,
          },
        ],
      };
    }
    case "STAFF_PATCH":
      return { ...state, staff: state.staff.map((s) => (s.id === a.id ? { ...s, ...a.patch } : s)) };
    case "PUNCH_PATCH":
      return { ...state, punches: state.punches.map((p) => (p.id === a.id ? { ...p, ...a.patch } : p)) };
    case "SECTION_SET":
      return {
        ...state,
        shifts: state.shifts.map((s) => (s.id === a.shiftId ? { ...s, section: a.section } : s)),
      };
    case "PAUSE_TOGGLE":
      return { ...state, paused: !state.paused };
    case "TABLE_CYCLE":
      return {
        ...state,
        tables: state.tables.map((t) => {
          if (t.id !== a.id) return t;
          const i = a.sections.indexOf(t.section);
          return { ...t, section: a.sections[(i + 1) % a.sections.length] };
        }),
      };
    case "TABLE_ADD": {
      const nextNum =
        Math.max(0, ...state.tables.map((t) => parseInt(t.label, 10)).filter((n) => !isNaN(n))) + 1;
      return {
        ...state,
        floorBalanced: false,
        tables: [
          ...state.tables,
          { id: uid("t"), label: String(nextNum), seats: a.seats, section: a.section, shape: a.shape },
        ],
      };
    }
    case "TABLE_REMOVE":
      return { ...state, floorBalanced: false, tables: state.tables.filter((t) => t.id !== a.id) };
    case "TABLE_PATCH":
      return {
        ...state,
        floorBalanced: false,
        tables: state.tables.map((t) => (t.id === a.id ? { ...t, ...a.patch } : t)),
      };
    case "FLOOR_BALANCE": {
      // real greedy rebalance: biggest tables first, each into the lightest section
      const totals = new Map<string, number>(a.sections.map((s) => [s, 0]));
      const sorted = [...state.tables].sort((x, y) => y.seats - x.seats);
      const assigned = new Map<string, string>();
      for (const t of sorted) {
        let best = a.sections[0];
        for (const s of a.sections) if ((totals.get(s) ?? 0) < (totals.get(best) ?? 0)) best = s;
        assigned.set(t.id, best);
        totals.set(best, (totals.get(best) ?? 0) + t.seats);
      }
      return {
        ...state,
        floorBalanced: true,
        tables: state.tables.map((t) => ({ ...t, section: assigned.get(t.id) ?? t.section })),
      };
    }
    case "ROTATION_SET":
      return { ...state, rotation: a.mode };
    case "STAFF_REMOVE":
      return { ...state, staff: state.staff.filter((s) => s.id !== a.id) };
    case "APPROVE_LIVE_COVER": {
      // Sasha takes Dana's Friday close; the board updates in front of you.
      return {
        ...state,
        runs: state.runs.map((r) =>
          r.id === "r-live"
            ? {
                ...r,
                state: "covered",
                outcome: "Covered in 17 min · Sasha confirmed",
                steps: r.steps.map((s) => ({ ...s, state: "done" as const })),
              }
            : r
        ),
        shifts: state.shifts.map((s) =>
          s.id === "s3" ? { ...s, staffId: "sasha", state: "published" } : s
        ),
        stats: { ...state.stats, covers90d: state.stats.covers90d + 1 },
      };
    }
    default:
      return state;
  }
}

/* ---------- context ---------- */

const Ctx = createContext<{ state: PortalState; dispatch: Dispatch<Action> } | null>(null);

export function usePortal() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePortal outside provider");
  return v;
}

/* ---------- the live engine: a believable Friday afternoon, no refresh needed ---------- */

type Cue = { at: number; run: (d: Dispatch<Action>, get: () => PortalState) => void };

function buildTimeline(): Cue[] {
  const F = (event: Omit<FeedEvent, "id">): Action => ({
    type: "FEED_PUSH",
    event: { ...event, id: uid("f") },
  });
  return [
    {
      at: 9,
      run: (d) => {
        d({ type: "RUN_BUBBLE", runId: "r-live", bubble: { from: "them", who: "marisa", text: "ahh can't tonight, dentist at 6 😬 sorry!!" } });
        d(F({ kind: "cover", who: "marisa", text: "Marisa passed on Friday close", sub: "dentist · no penalty, Tagout moves on", when: "Just now" }));
      },
    },
    {
      at: 16,
      run: (d) => {
        d({ type: "RUN_STEP", runId: "r-live", stepIndex: 2, state: "done", detail: "Marisa passed (dentist)" });
        d({ type: "RUN_STEP", runId: "r-live", stepIndex: 3, state: "live", detail: "texting Sasha now · 30 hrs, free tonight" });
        d({ type: "RUN_BUBBLE", runId: "r-live", bubble: { from: "tag", text: "All good, feel better! (Now texting Sasha…)" } });
        d(F({ kind: "cover", who: "sasha", text: "Tagout moved to Sasha, 2nd of 6 on the list", sub: "asked in order, one at a time", when: "Just now" }));
      },
    },
    {
      at: 28,
      run: (d) => {
        d({ type: "RUN_BUBBLE", runId: "r-live", bubble: { from: "them", who: "sasha", text: "yes!! i'll take it 🙌" } });
      },
    },
    {
      at: 34,
      run: (d, get) => {
        const auto = get().autopilot;
        if (auto === "full") {
          d({ type: "APPROVE_LIVE_COVER" });
          d(F({ kind: "cover", who: "sasha", text: "Friday close covered: Sasha's in", sub: "autopilot confirmed it · board updated", when: "Just now" }));
        } else {
          d({ type: "RUN_STEP", runId: "r-live", stepIndex: 3, state: "done", detail: "Sasha said yes" });
          d({ type: "RUN_STEP", runId: "r-live", stepIndex: 4, state: "live", detail: "waiting on your one tap" });
          d({ type: "RUN_SET", runId: "r-live", patch: { state: "live", outcome: "Sasha said yes · needs your approval" } });
          d(F({ kind: "cover", who: "sasha", text: "Sasha said yes to Friday close", sub: "one tap to approve, then everyone gets confirmed", when: "Just now" }));
        }
      },
    },
    {
      at: 52,
      run: (d) => {
        d(F({ kind: "onboard", who: "tyler", text: "Tyler replied YES 🎉 He's on the roster", sub: "Tagout is texting him for availability and a photo", when: "Just now" }));
        d({ type: "STAFF_PATCH", id: "tyler", patch: { status: "pending", availNote: "Replied YES · answering availability by text" } });
      },
    },
    {
      at: 70,
      run: (d) => {
        d(F({ kind: "clock", who: "devon", text: "Devon's timecard from today is ready to approve", sub: "10:41 AM – 4:12 PM · 20 min break", when: "Just now" }));
      },
    },
    {
      at: 88,
      run: (d) => {
        d(F({ kind: "headsup", who: null, text: "Tomorrow's 45-top: you're staffed +2, all confirmed", sub: "rehearsal dinner · patio · Jake & Sasha added Tuesday", when: "Just now" }));
      },
    },
  ];
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem(STATE_KEY);
        if (raw) return JSON.parse(raw) as PortalState;
      } catch {}
    }
    return makeSeed();
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // persist every change so refreshes keep your edits (until logout resets)
  useEffect(() => {
    try {
      sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  // the engine: run the Friday-afternoon timeline once per session
  useEffect(() => {
    const doneKey = "tagout-demo-timeline";
    const played = new Set<number>(JSON.parse(sessionStorage.getItem(doneKey) ?? "[]"));
    const start = Date.now();
    const cues = buildTimeline();
    const iv = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      if (stateRef.current.paused) return; // the big red switch is real
      for (const c of cues) {
        if (elapsed >= c.at && !played.has(c.at)) {
          played.add(c.at);
          sessionStorage.setItem(doneKey, JSON.stringify([...played]));
          c.run(dispatch, () => stateRef.current);
        }
      }
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}
