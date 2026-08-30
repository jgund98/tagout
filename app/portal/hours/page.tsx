"use client";

import { useEffect, useState } from "react";
import { usePortal, fmtClock, uid } from "@/lib/portal/store";
import { Avatar, Chip, GreenBtn, PageTitle, LiveDot, DemoNote } from "@/components/portal/ui";

/** The demo clock: it's 6:12 PM at Harbor & Vine, and it keeps ticking for real. */
function useDemoNow() {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);
  const base = 18 * 60 + 12; // 6:12 PM
  return base + sec / 60;
}

export default function HoursPage() {
  const { state, dispatch } = usePortal();
  const now = useDemoNow();
  const staffOf = (id: string) => state.staff.find((s) => s.id === id) ?? null;

  const onClock = state.punches.filter((p) => p.outAt === null);
  const doneToday = state.punches.filter((p) => p.outAt !== null);

  const worked = (inMins: number) => {
    const mins = Math.max(0, now - inMins);
    const h = Math.floor(mins / 60);
    const m = Math.floor(mins % 60);
    const s = Math.floor(((now - inMins) * 60) % 60);
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const exportCsv = () => {
    const rows = [
      ["Name", "Role", "Clock in", "Clock out", "Break (min)", "Hours", "Status"],
      ...state.punches.map((p) => {
        const person = staffOf(p.staffId);
        const hrs =
          p.outMins !== null ? (((p.outMins - p.inMins - p.breakMins) / 60).toFixed(2)) : "on the clock";
        return [person?.name ?? "", person?.role ?? "", p.inAt, p.outAt ?? "—", String(p.breakMins), hrs, p.approved ? "approved" : "pending"];
      }),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "harbor-and-vine-hours.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle
        title="Time clock"
        sub="The time clock runs itself over text: crew texts IN and OUT, you just approve."
        right={<GreenBtn onClick={exportCsv}>Export for payroll (CSV)</GreenBtn>}
      />

      {/* on the clock */}
      <section className="rounded-[28px] bg-white p-5 shadow-pop sm:p-6">
        <h2 className="flex items-center gap-2 font-display text-[17px] font-extrabold text-ink">
          <LiveDot /> On the clock right now · {onClock.length}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {onClock.map((p) => {
            const person = staffOf(p.staffId);
            return (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-cream/80 p-3.5">
                <Avatar person={person} size={42} />
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-[14px] font-extrabold text-ink">{person?.first}</p>
                  <p className="text-[11.5px] font-bold text-ink/45">in at {p.inAt}</p>
                </div>
                <p className="font-display text-[16px] font-extrabold tabular-nums text-green-deep">
                  {worked(p.inMins)}
                </p>
              </div>
            );
          })}
        </div>
        <DemoNote>
          Crew clocks in by texting IN when they arrive; Tagout checks they&apos;re at the right place and time.
          Geofenced punch-in turns on with the SMS provider.
        </DemoNote>
      </section>

      {/* today's timecards */}
      <section className="mt-6 rounded-[28px] bg-white p-5 shadow-pop sm:p-6">
        <h2 className="font-display text-[17px] font-extrabold text-ink">Today&apos;s finished timecards</h2>

        {/* mobile: cards, thumb-sized */}
        <div className="mt-3 space-y-2.5 sm:hidden">
          {doneToday.map((p) => {
            const person = staffOf(p.staffId);
            const hrs = ((p.outMins! - p.inMins - p.breakMins) / 60).toFixed(2);
            return (
              <div key={p.id} className="rounded-2xl bg-cream/80 p-3.5">
                <div className="flex items-center gap-3">
                  <Avatar person={person} size={38} />
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="text-[14.5px] font-extrabold text-ink">{person?.first}</p>
                    <p className="text-[12px] font-semibold text-ink/45">
                      {p.inAt} – {p.outAt} · {p.breakMins} min break
                    </p>
                  </div>
                  <p className="font-display text-[17px] font-extrabold text-ink">{hrs}h</p>
                </div>
                {p.approved ? (
                  <p className="mt-2.5 text-center text-[12.5px] font-extrabold text-green-deep">Approved ✓</p>
                ) : (
                  <button
                    onClick={() => {
                      dispatch({ type: "PUNCH_PATCH", id: p.id, patch: { approved: true } });
                      dispatch({
                        type: "FEED_PUSH",
                        event: { id: uid("f"), kind: "clock", who: p.staffId, text: `You approved ${person?.first}'s timecard`, sub: `${hrs} hours, ready for payroll`, when: "Just now" },
                      });
                    }}
                    className="mt-2.5 w-full rounded-full bg-ink py-2.5 text-[13.5px] font-extrabold text-paper"
                  >
                    Approve timecard
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/8 text-[11.5px] font-extrabold uppercase tracking-wide text-ink/40">
                <th className="px-3 py-2.5">Who</th>
                <th className="px-3 py-2.5">In</th>
                <th className="px-3 py-2.5">Out</th>
                <th className="px-3 py-2.5">Break</th>
                <th className="px-3 py-2.5">Hours</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {doneToday.map((p) => {
                const person = staffOf(p.staffId);
                const hrs = ((p.outMins! - p.inMins - p.breakMins) / 60).toFixed(2);
                const shortBreak = p.outMins! - p.inMins > 360 && p.breakMins < 30;
                return (
                  <tr key={p.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar person={person} size={32} />
                        <span className="text-[14px] font-extrabold text-ink">{person?.first}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[13.5px] font-semibold text-ink/70">{p.inAt}</td>
                    <td className="px-3 py-3 text-[13.5px] font-semibold text-ink/70">{p.outAt}</td>
                    <td className="px-3 py-3">
                      <span className={`text-[13.5px] font-semibold ${shortBreak ? "text-coral" : "text-ink/70"}`}>
                        {p.breakMins} min{shortBreak ? " ⚠︎" : ""}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-display text-[15px] font-extrabold text-ink">{hrs}</td>
                    <td className="px-3 py-3 text-right">
                      {p.approved ? (
                        <Chip tone="mint">Approved ✓</Chip>
                      ) : (
                        <button
                          onClick={() => {
                            dispatch({ type: "PUNCH_PATCH", id: p.id, patch: { approved: true } });
                            dispatch({
                              type: "FEED_PUSH",
                              event: { id: uid("f"), kind: "clock", who: p.staffId, text: `You approved ${person?.first}'s timecard`, sub: `${hrs} hours, ready for payroll`, when: "Just now" },
                            });
                          }}
                          className="rounded-full bg-ink px-4 py-1.5 text-[12.5px] font-extrabold text-paper transition-all hover:bg-green-dark"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {doneToday.some((p) => p.outMins! - p.inMins > 360 && p.breakMins < 30) && (
          <p className="mt-2.5 text-[12.5px] font-semibold text-ink/45">
            ⚠︎ Over 6 hours with a short break. Some states require 30 minutes, so give it a look before approving.
          </p>
        )}
      </section>

      {/* week so far */}
      <section className="mt-6 rounded-[28px] bg-white p-5 shadow-pop sm:p-6">
        <h2 className="font-display text-[17px] font-extrabold text-ink">The week so far</h2>
        <div className="mt-4 space-y-2.5">
          {state.staff
            .filter((s) => s.status === "active" && s.hoursWeek > 0)
            .sort((a, b) => b.hoursWeek - a.hoursWeek)
            .map((p) => {
              const nearOt = p.hoursWeek >= 38;
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <Avatar person={p} size={30} />
                  <span className="w-16 text-[13px] font-extrabold text-ink">{p.first}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-ink/6">
                    <div
                      className={`h-full rounded-full ${nearOt ? "bg-amber" : "bg-green"}`}
                      style={{ width: `${Math.min(100, (p.hoursWeek / 45) * 100)}%` }}
                    />
                  </div>
                  <span className={`w-20 text-right text-[13px] font-extrabold ${nearOt ? "text-[#9a6a00]" : "text-ink/60"}`}>
                    {p.hoursWeek} hrs{nearOt ? " · close" : ""}
                  </span>
                </div>
              );
            })}
        </div>
        <p className="mt-3 text-[12.5px] font-semibold text-ink/45">
          Anyone in amber is close to 40. Tagout already won&apos;t offer them overtime. That&apos;s the house rule doing its job.
        </p>
      </section>
    </div>
  );
}
