"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BubbleMark } from "@/components/Wordmark";
import { usePortal, endDemoSession, needsYouCount } from "@/lib/portal/store";
import { Avatar, LiveDot } from "./ui";
import { NavIcon } from "./NavIcon";
import { PovSwitch } from "./PovSwitch";
import { NotifActions } from "./NotifActions";

const NAV = [
  { href: "/portal", label: "Today", icon: "home" },
  { href: "/portal/tagai", label: "TagAI", icon: "spark" },
  { href: "/portal/coverage", label: "Coverage", icon: "chat" },
  { href: "/portal/schedule", label: "Schedule", icon: "calendar" },
  { href: "/portal/team", label: "Team", icon: "people" },
  { href: "/portal/hours", label: "Hours", icon: "clock" },
  { href: "/portal/inbox", label: "Inbox", icon: "inbox" },
  { href: "/portal/floor", label: "Floor plan", icon: "floor" },
  { href: "/portal/rules", label: "House rules", icon: "shield" },
  { href: "/portal/settings", label: "Settings", icon: "gear" },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = usePortal();
  const pathname = usePathname();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const unread = state.feed.filter((f) => f.fresh).length;
  const needs = needsYouCount(state);
  const staffOf = (id: string | null) => state.staff.find((s) => s.id === id) ?? null;

  // TagAI is special on mobile: a floating bubble, not a tab. The chat page
  // itself goes full-bleed (no bottom bar) so the composer can pin above the keyboard.
  const onTagai = pathname.startsWith("/portal/tagai");
  const mobileTabs = NAV.filter((n) => n.href !== "/portal/tagai").slice(0, 5);
  const moreItems = NAV.filter((n) => n.href !== "/portal/tagai" && !mobileTabs.includes(n));

  // every tab starts at the top, always
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const logout = () => {
    endDemoSession();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col p-4 lg:flex">
        <div className="flex h-full flex-col rounded-[28px] bg-pine px-4 pb-4 pt-5">
          <Link href="/portal" className="flex items-center gap-2.5 px-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green">
              <BubbleMark size={20} className="text-white" />
            </span>
            <span className="font-display text-[22px] font-extrabold text-paper">tagout</span>
          </Link>

          <nav className="mt-7 flex-1" aria-label="Portal">
            {[
              { label: null, hrefs: ["/portal", "/portal/tagai", "/portal/inbox"] },
              { label: "Operate", hrefs: ["/portal/coverage", "/portal/schedule", "/portal/hours"] },
              { label: "The house", hrefs: ["/portal/team", "/portal/floor", "/portal/rules"] },
            ].map((group, gi) => (
              <div key={gi} className={gi === 0 ? "" : "mt-6"}>
                {group.label && (
                  <p className="mb-1.5 px-3.5 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-paper/30">
                    {group.label}
                  </p>
                )}
                <div className="space-y-1">
                  {group.hrefs.map((href) => {
                    const n = NAV.find((x) => x.href === href)!;
                    const active = href === "/portal" ? pathname === "/portal" : pathname.startsWith(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[15px] font-bold transition-colors ${
                          active ? "bg-green text-ink" : "text-paper/65 hover:bg-paper/8 hover:text-paper"
                        }`}
                      >
                        <NavIcon name={n.icon} />
                        {n.label}
                        {href === "/portal/coverage" && needs > 0 && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1.5 text-[11px] font-extrabold text-white">
                            {needs}
                          </span>
                        )}
                        {href === "/portal/coverage" && needs === 0 && state.runs.some((r) => r.state === "live") && (
                          <LiveDot className="ml-auto" />
                        )}
                        {href === "/portal/inbox" && unread > 0 && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-paper/15 px-1.5 text-[11px] font-extrabold text-paper/80">
                            {unread}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="space-y-1 border-t border-paper/10 pt-3">
            <Link
              href="/portal/settings"
              className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[15px] font-bold transition-colors ${
                pathname.startsWith("/portal/settings")
                  ? "bg-green text-ink"
                  : "text-paper/65 hover:bg-paper/8 hover:text-paper"
              }`}
            >
              <NavIcon name="gear" />
              Settings
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-[15px] font-bold text-paper/50 transition-colors hover:bg-paper/8 hover:text-paper"
            >
              <NavIcon name="logout" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* topbar */}
      <header className="sticky top-0 z-30 border-b border-ink/6 bg-cream/85 backdrop-blur-xl lg:pl-[264px]">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/portal" className="flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green">
              <BubbleMark size={16} className="text-white" />
            </span>
            <span className="font-display text-[18px] font-extrabold text-ink">tagout</span>
          </Link>
          <div className="hidden items-center gap-2 lg:flex">
            <p className="font-display text-[15px] font-extrabold text-ink">{state.houseName}</p>
            <span className="rounded-lg rounded-bl-[4px] bg-mint px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wide text-green-dark">
              Demo mode
            </span>
            <PovSwitch current="gm" />
            {needs > 0 && (
              <Link
                href="/portal/coverage"
                className="ml-1 flex items-center gap-1.5 rounded-full bg-coral px-3 py-1 text-[12px] font-extrabold text-white transition-transform hover:scale-[1.03]"
              >
                Needs attention · {needs}
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label={`Notifications, ${unread} unread`}
              onClick={() => {
                setNotifOpen((v) => !v);
                if (!notifOpen) dispatch({ type: "FEED_READ_ALL" });
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-pop"
            >
              <svg width="17" height="18" viewBox="0 0 18 20" fill="none" aria-hidden>
                <path d="M9 2a5.5 5.5 0 0 0-5.5 5.5v3.2L2 14h14l-1.5-3.3V7.5A5.5 5.5 0 0 0 9 2Z" stroke="#0f1512" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M7 17a2 2 0 0 0 4 0" stroke="#0f1512" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[10.5px] font-extrabold text-white">
                  {unread}
                </span>
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-4 shadow-pop"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-dark font-display text-[13px] font-extrabold text-paper">
                  J
                </span>
                <div className="leading-tight text-left">
                  <p className="text-[13px] font-extrabold text-ink">{state.gmFirst}</p>
                  <p className="text-[10.5px] font-bold text-ink/40">GM · {state.houseName}</p>
                </div>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    role="menu"
                    className="absolute right-0 top-[52px] z-50 w-48 rounded-2xl bg-white p-1.5 shadow-lift"
                  >
                    <Link
                      href="/portal/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-bold text-ink transition-colors hover:bg-cream"
                    >
                      <NavIcon name="gear" size={15} />
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-bold text-ink/60 transition-colors hover:bg-cream"
                    >
                      <NavIcon name="logout" size={15} />
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* notification drawer */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed right-4 top-[72px] z-50 w-[min(380px,calc(100vw-2rem))] rounded-3xl bg-white p-3 shadow-lift"
          >
            <div className="flex items-center justify-between px-2 pb-2 pt-1">
              <p className="font-display text-[15px] font-extrabold text-ink">Notifications</p>
              <button onClick={() => setNotifOpen(false)} className="text-[13px] font-bold text-ink/40 hover:text-ink">
                Close
              </button>
            </div>
            <div className="max-h-[60dvh] space-y-1 overflow-y-auto overscroll-contain">
              {state.feed.slice(0, 12).map((f) => {
                const href =
                  f.kind === "clock" ? "/portal/hours"
                  : f.kind === "swap" || f.kind === "onboard" ? "/portal/team"
                  : f.kind === "rule" ? "/portal/rules"
                  : "/portal/coverage";
                return (
                  <Link
                    key={f.id}
                    href={href}
                    onClick={() => setNotifOpen(false)}
                    className="flex items-start gap-2.5 rounded-2xl p-2.5 transition-colors hover:bg-cream"
                  >
                    <Avatar person={staffOf(f.who)} size={30} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold leading-snug text-ink">{f.text}</p>
                      <p className="text-[11.5px] font-semibold text-ink/40">{f.when}</p>
                      <NotifActions f={f} />
                    </div>
                  </Link>
                );
              })}
            </div>
            <Link
              href="/portal/inbox"
              onClick={() => setNotifOpen(false)}
              className="mt-1 block rounded-2xl bg-green-dark py-2.5 text-center text-[13px] font-extrabold text-paper"
            >
              View all in Inbox →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* content: each screen slides in like an app */}
      <main className={`px-4 pt-6 sm:px-6 lg:pb-10 lg:pl-[288px] lg:pr-8 ${onTagai ? "pb-4" : "pb-28"}`}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* TagAI floating bubble (mobile): always one thumb away */}
      {!onTagai && (
        <Link
          href="/portal/tagai"
          aria-label="Ask TagAI"
          style={{ bottom: "calc(5.25rem + env(safe-area-inset-bottom))" }}
          className="fixed right-4 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-green text-ink shadow-[0_4px_24px_rgb(14_207_127/0.55)] lg:hidden"
        >
          <NavIcon name="spark" size={24} />
        </Link>
      )}

      {/* mobile bottom nav */}
      {!onTagai && (
      <nav
        aria-label="Portal mobile"
        style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        className="fixed inset-x-3 z-40 flex justify-between rounded-[24px] bg-pine px-2 py-2 lg:hidden"
      >
        {mobileTabs.map((n) => {
          const active = n.href === "/portal" ? pathname === "/portal" : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`relative flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[11px] font-extrabold ${
                active ? "text-ink" : "text-paper/60"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="tab-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-2xl bg-green"
                />
              )}
              <span className="relative"><NavIcon name={n.icon} size={17} /></span>
              <span className="relative">{n.label}</span>
              {n.href === "/portal/coverage" && needs > 0 && (
                <span className="absolute -top-1 right-1 z-10 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-coral px-1 text-[10px] font-extrabold text-white">
                  {needs}
                </span>
              )}
            </Link>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[11px] font-extrabold ${
            moreItems.some((n) => pathname.startsWith(n.href)) ? "bg-green text-ink" : "text-paper/60"
          }`}
        >
          <NavIcon name="more" size={17} />
          More
        </button>
      </nav>
      )}

      {/* the More sheet: the rest of the app, one thumb away */}
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end bg-pine/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMoreOpen(false)}
          >
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 240 }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85dvh] w-full overflow-y-auto overscroll-contain rounded-t-[28px] bg-white p-5"
              style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
            >
              <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-pine/15" />
              <div className="grid grid-cols-2 gap-3">
                {moreItems.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex flex-col items-center gap-1.5 rounded-2xl bg-cream py-4 text-[12.5px] font-extrabold text-ink"
                  >
                    <NavIcon name={n.icon} size={20} />
                    {n.label}
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
                <span className="text-[12px] font-extrabold uppercase tracking-wide text-ink/40">Demo POV</span>
                <PovSwitch current="gm" />
              </div>
              <button
                onClick={logout}
                className="mt-2 w-full rounded-2xl border-2 border-ink/10 py-3 text-[13.5px] font-extrabold text-ink/55"
              >
                Log out
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
