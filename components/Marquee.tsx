const EVENTS = [
  { t: "6:04 AM", e: "Line cook texts in sick", tone: "coral" },
  { t: "6:41 AM", e: "Luis confirms prep. GM still asleep", tone: "green" },
  { t: "11:40 AM", e: "40-top books Thursday: +1 server suggested", tone: "violet" },
  { t: "2:15 PM", e: "Patio rained out: two voluntary early-outs", tone: "amber" },
  { t: "4:52 PM", e: "Dana drops Friday close", tone: "coral" },
  { t: "4:53 PM", e: "2 texts sent, zero group blasts", tone: "green" },
  { t: "4:59 PM", e: "Marisa: “omg yes 🙌”", tone: "green" },
  { t: "9:12 PM", e: "Jake near overtime: pickup rerouted to Devon", tone: "amber" },
  { t: "10:30 PM", e: "Minor curfew enforced: host never offered the close", tone: "violet" },
];

const dot: Record<string, string> = {
  coral: "bg-coral",
  violet: "bg-violet",
  green: "bg-green",
  amber: "bg-amber",
  ink: "bg-ink/40",
};

export default function Marquee() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {EVENTS.map((ev, i) => (
        <span
          key={`${key}-${i}`}
          className="mx-3 flex items-center gap-2.5 whitespace-nowrap rounded-full border border-ink/8 bg-white px-4 py-2 text-[13.5px] font-semibold text-ink-soft shadow-[0_1px_2px_rgb(15_21_18/0.04)]"
        >
          <span className={`h-2 w-2 rounded-full ${dot[ev.tone]}`} />
          <span className="font-extrabold tabular-nums text-ink/45">{ev.t}</span>
          {ev.e}
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden py-2" aria-hidden="true">
      <div className="flex w-max animate-marquee">
        {row("a")}
        {row("b")}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper to-transparent" />
    </div>
  );
}
