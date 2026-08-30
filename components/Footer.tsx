import Link from "next/link";
import Wordmark, { BubbleMark } from "./Wordmark";
import { site } from "@/lib/site";

const cols: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/product" },
      { label: "Pricing", href: "/pricing" },
      { label: "vs HotSchedules", href: "/vs-hotschedules" },
      { label: "Get a demo", href: "/demo" },
    ],
  },
  {
    title: "Who it's for",
    links: [
      { label: "General managers", href: "/for/gms" },
      { label: "Servers & staff", href: "/for/staff" },
      { label: "Restaurant groups", href: "/for/groups" },
      { label: "Retail & stores", href: "/for/stores" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: site.email, href: `mailto:${site.email}` },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <BubbleMark
        check={false}
        size={380} className="pointer-events-none absolute -bottom-24 -right-20 rotate-12 text-paper/[0.035]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid gap-10 md:gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Wordmark size={30} markClass="text-green" textClass="text-paper" />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-paper/60">
              {site.tagline}. Built for the people who actually run the floor.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-paper/8 px-4 py-2 text-sm font-semibold text-paper/80">
              <span className="h-2 w-2 rounded-full bg-green tg-pulse" />
              Tagout is on shift 24/7
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 md:contents">
            {cols.map((col) => (
              <div key={col.title}>
                <h3 className="text-[12px] font-bold uppercase tracking-wider text-paper/40 md:text-sm">
                  {col.title}
                </h3>
                <ul className="mt-3 space-y-2.5 md:mt-4 md:space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="break-words text-[13px] font-medium text-paper/75 transition-colors hover:text-green md:text-[15px]"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* extra bottom padding on mobile so the demo dock never covers the fine print */}
        <div className="mt-10 flex flex-col gap-4 border-t border-paper/10 pb-16 pt-8 sm:flex-row sm:items-center sm:justify-between md:mt-14 lg:pb-0">
          <p className="text-sm text-paper/45">
            © {new Date().getFullYear()} {site.legal.company} All rights reserved.
          </p>
          <p className="text-sm text-paper/45">
            {site.domain} · Made for restaurants, not head offices.
          </p>
        </div>
      </div>
    </footer>
  );
}
