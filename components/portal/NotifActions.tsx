"use client";

import { usePortal, uid } from "@/lib/portal/store";
import type { FeedEvent } from "@/lib/portal/data";

/**
 * Inline decisions on actionable notifications: approve or decline right in
 * the drawer or inbox, no redirect. Buttons render only while the underlying
 * record is still waiting, so acting anywhere clears them everywhere.
 */
export function NotifActions({ f }: { f: FeedEvent }) {
  const { state, dispatch } = usePortal();
  const action = f.action;
  if (!action) return null;

  const stop = (e: React.MouseEvent, run: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    run();
  };

  const btn = "rounded-full px-3.5 py-1.5 text-[12px] font-extrabold transition-transform hover:scale-[1.03]";

  if (action.kind === "timeoff") {
    const t = state.timeOff.find((x) => x.id === action.id);
    if (!t || t.state !== "pending") return null;
    const p = state.staff.find((s) => s.id === t.staffId);
    const decide = (verdict: "approved" | "denied") => {
      dispatch({ type: "TIMEOFF", id: t.id, state: verdict });
      dispatch({
        type: "FEED_PUSH",
        event: {
          id: uid("f"),
          kind: "swap",
          who: t.staffId,
          text: `You ${verdict === "approved" ? "approved" : "declined"} ${p?.first ?? "the"} ${t.range} request`,
          sub: `${p?.first ?? "they"} got a text with the answer`,
          when: "Just now",
        },
      });
    };
    return (
      <span className="mt-2 flex gap-2">
        <button onClick={(e) => stop(e, () => decide("approved"))} className={`${btn} bg-green-dark text-white`}>
          Approve
        </button>
        <button
          onClick={(e) => stop(e, () => decide("denied"))}
          className={`${btn} border-2 border-ink/10 py-[4px] text-ink/55 hover:border-blush hover:text-coral`}
        >
          Decline
        </button>
      </span>
    );
  }

  if (action.kind === "claim") {
    const claim = state.claims.find((c) => c.shiftId === action.id && c.staffId === f.who);
    const shift = state.shifts.find((s) => s.id === action.id);
    if (!claim || !shift || shift.state !== "open") return null;
    const p = state.staff.find((s) => s.id === claim.staffId);
    return (
      <span className="mt-2 flex gap-2">
        <button
          onClick={(e) =>
            stop(e, () => {
              dispatch({ type: "SHIFT_CLAIM", shiftId: shift.id, staffId: claim.staffId });
              dispatch({ type: "CLAIM_CANCEL", shiftId: shift.id, staffId: claim.staffId });
              dispatch({
                type: "FEED_PUSH",
                event: {
                  id: uid("f"),
                  kind: "cover",
                  who: claim.staffId,
                  text: `${p?.first ?? "They"} got the open shift`,
                  sub: "board updated · confirmed by text",
                  when: "Just now",
                },
              });
            })
          }
          className={`${btn} bg-green-dark text-white`}
        >
          Give it to {p?.first ?? "them"}
        </button>
      </span>
    );
  }

  // cover: the live run is waiting on the GM's one tap
  const run = state.runs.find((r) => r.id === action.id);
  if (!run || run.state !== "live" || !run.outcome?.includes("needs your approval")) return null;
  return (
    <span className="mt-2 flex gap-2">
      <button
        onClick={(e) =>
          stop(e, () => {
            dispatch({ type: "APPROVE_LIVE_COVER" });
            dispatch({
              type: "FEED_PUSH",
              event: {
                id: uid("f"),
                kind: "cover",
                who: "sasha",
                text: "You approved: Sasha takes Friday close",
                sub: "board updated · Sasha, Dana & the crew all got texts",
                when: "Just now",
              },
            });
          })
        }
        className={`${btn} bg-green-dark text-white`}
      >
        Approve ✓
      </button>
    </span>
  );
}
