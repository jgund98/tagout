"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Wordmark, { BubbleMark } from "./Wordmark";
import { site } from "@/lib/site";

type NavChild = { label: string; href: string; desc?: string; short?: string };
type NavItem = { label: string; href: string; children?: readonly NavChild[] };

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const nav = site.nav as readonly NavItem[];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-paper/90 backdrop-blur-xl border-b border-ink/8"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 md:h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Wordmark size={28} />

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {nav.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${
                    pathname.startsWith(item.href) || item.children.some((c) => pathname === c.href.split("#")[0])
                      ? "text-ink bg-ink/6"
                      : "text-ink-soft hover:text-ink hover:bg-ink/5"
                  }`}
                >
                  {item.label}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden className="transition-transform group-hover:rotate-180">
                    <path d="m1 1 4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                {/* dropdown */}
                <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="w-[300px] rounded-3xl border border-ink/8 bg-white p-2.5 shadow-lift">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block rounded-2xl px-4 py-3 transition-colors hover:bg-mint/60"
                      >
                        <p className="text-[14.5px] font-extrabold text-ink">{c.label}</p>
                        {c.desc && <p className="mt-0.5 text-[13px] font-medium text-ink/50">{c.desc}</p>}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${
                  pathname === item.href
                    ? "text-ink bg-ink/6"
                    : "text-ink-soft hover:text-ink hover:bg-ink/5"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Link
            href={site.login.href}
            className="rounded-full px-4 py-2 text-[15px] font-semibold text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors"
          >
            {site.login.label}
          </Link>
          <Link
            href={site.cta.href}
            className="group rounded-full bg-ink px-5 py-2.5 text-[15px] font-bold text-paper transition-all hover:bg-green-dark hover:shadow-pop"
          >
            {site.cta.label}
            <span className="inline-block transition-transform group-hover:translate-x-0.5 ml-1.5">→</span>
          </Link>
        </div>

        {/* mobile */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href={site.cta.href}
            className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-paper"
          >
            {site.cta.label}
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5"
          >
            <div className="relative h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-[2.5px] w-5 rounded-full bg-ink transition-all duration-300 ${
                  open ? "top-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-[2.5px] w-5 rounded-full bg-ink transition-all duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-[2.5px] w-5 rounded-full bg-ink transition-all duration-300 ${
                  open ? "top-[7px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden overflow-hidden border-t border-ink/8 bg-paper"
            aria-label="Mobile"
          >
            {/* compact one-screen menu: tinted group cards, no inner scrolling */}
            <div className="relative overflow-hidden px-4 pb-5 pt-3">
              <BubbleMark
                check={false}
                size={170}
                className="pointer-events-none absolute -right-10 -top-8 rotate-12 text-ink/[0.04]"
              />
              {nav
                .filter((item) => item.children)
                .map((item, gi) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 + gi * 0.07, ease: "easeOut" }}
                    className={`relative mb-2.5 rounded-[24px] p-3.5 ${
                      gi === 0 ? "bg-mint/55" : "bg-lav/45"
                    }`}
                  >
                    <p
                      className={`mb-2 px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] ${
                        gi === 0 ? "text-green-dark/70" : "text-violet-mid"
                      }`}
                    >
                      {item.label}
                    </p>
                    <div className={`grid gap-2 ${item.children!.length > 3 ? "grid-cols-2" : "grid-cols-3"}`}>
                      {item.children!.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="rounded-2xl bg-white px-3 py-3 text-center text-[15px] font-extrabold text-ink shadow-[0_1px_3px_rgb(15_21_18/0.07)] active:scale-[0.97] transition-transform"
                        >
                          {c.short ?? c.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.19, ease: "easeOut" }}
                className="mt-3 grid grid-cols-2 gap-2 border-t border-ink/8 pt-3.5"
              >
                <Link
                  href={site.login.href}
                  className="rounded-full border-2 border-ink/15 py-3.5 text-center text-[16px] font-extrabold text-ink"
                >
                  {site.login.label}
                </Link>
                <Link
                  href={site.cta.href}
                  className="rounded-full bg-green py-3.5 text-center text-[16px] font-extrabold text-ink"
                >
                  {site.cta.label} →
                </Link>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
