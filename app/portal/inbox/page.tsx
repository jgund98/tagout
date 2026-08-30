"use client";

import Link from "next/link";
import { usePortal, needsYouCount } from "@/lib/portal/store";
import { Avatar, Chip, PageTitle, GhostBtn } from "@/components/portal/ui";
import type { FeedEvent } from "@/lib/portal/data";

const KIND_META: Record<FeedEvent["kind"], { chip: string; tone: "mint" | "lav" | "butter" | "blush"; href: string }> = {
  cover: { chip: "Coverage", tone: "mint", href: "/portal/coverage" },
  swap: { chip: "Swap", tone: "lav", href: "/portal/team" },
  clock: { chip: "Time clock", tone: "butter", href: "/portal/hours" },
  headsup: { chip: "Heads-up", tone: "blush", href: "/portal/coverage" },
  onboard: { chip: "New crew", tone: "mint", href: "/portal/team" },
  rule: { chip: "House rule", tone: "lav", href: "/portal/rules" },
};

const isPast = (w: string) => w === "Yesterday" || w === "Tuesday" || w === "Last Sunday";

export default function InboxPage() {
  const { state, dispatch } = usePortal();
  const staffOf = (id: string | null) => state.staff.find((s) => s.id === id) ?? null;
  const unread = state.feed.filter((f) => f.fresh).length;
  const needs = needsYouCount(state);

  const today = state.feed.filter((f) => !isPast(f.when));
  const earlier = state.feed.filter((f) => isPast(f.when));

  const Row = ({ f }: { f: FeedEvent }) => {
    const meta = KIND_META[f.kind];
    return (
      <Link
        href={meta.href}
        className={`flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-pop transition-transform hover:scale-[1.005] ${
          f.fresh ? "ring-2 ring-green/40" : ""
        }`}
      >
        <Avatar person={staffOf(f.who)} size={38} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone={meta.tone}>{meta.chip}</Chip>
            <span className="text-[12px] font-bold text-ink/35">{f.when}</span>
            {f.fresh && <span className="h-2 w-2 rounded-full bg-green" />}
          </div>
          <p className="mt-1 text-[15px] font-bold leading-snug text-ink">{f.text}</p>
          {f.sub && <p className="mt-0.5 text-[13px] font-medium text-ink/50">{f.sub}</p>}
        </div>
        <span className="mt-1 shrink-0 text-ink/25">→</span>
      </Link>
    );
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle
        title="Inbox"
        sub="Everything that's happened, newest first. If you missed a night, catch up here."
        right={
          unread > 0 ? (
            <GhostBtn onClick={() => dispatch({ type: "FEED_READ_ALL" })}>Mark all read</GhostBtn>
          ) : undefined
        }
      />

      {needs > 0 && (
        <Link
          href="/portal/coverage"
          className="mb-5 flex items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3.5"
        >
          <span className="text-[14.5px] font-extrabold text-paper">
            {needs === 1 ? "1 item needs" : `${needs} items need`} your call
          </span>
          <span className="rounded-full bg-coral px-3.5 py-1.5 text-[12.5px] font-extrabold text-white">
            Open queue →
          </span>
        </Link>
      )}

      {today.length > 0 && (
        <>
          <h2 className="mb-2.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-ink/35">Today</h2>
          <div className="space-y-2.5">
            {today.map((f) => (
              <Row key={f.id} f={f} />
            ))}
          </div>
        </>
      )}

      {earlier.length > 0 && (
        <>
          <h2 className="mb-2.5 mt-6 text-[12px] font-extrabold uppercase tracking-[0.14em] text-ink/35">
            Earlier this week
          </h2>
          <div className="space-y-2.5">
            {earlier.map((f) => (
              <Row key={f.id} f={f} />
            ))}
          </div>
        </>
      )}

      {state.feed.length === 0 && (
        <div className="rounded-3xl bg-white p-10 text-center shadow-pop">
          <p className="font-display text-[17px] font-extrabold text-ink">All quiet</p>
          <p className="mt-1 text-[14px] text-ink/50">New activity lands here the moment it happens.</p>
        </div>
      )}
    </div>
  );
}
