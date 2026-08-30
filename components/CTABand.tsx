import Link from "next/link";
import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

export default function CTABand({
  title = "Put Tagout on the schedule.",
  sub = "Watch it cover a real shift in 20 minutes, then pilot it for 30 days with your old scheduler still running. If you don't stay, we refund your launch fee.",
}: {
  title?: string;
  sub?: string;
}) {
  return (
    <section className="relative mx-2 mb-2 mt-2 overflow-hidden rounded-[36px] bg-green sm:mx-4 sm:mb-4 sm:mt-4 md:rounded-[52px]">
      {/* oversized watermark bubble */}
      <svg
        className="pointer-events-none absolute -bottom-28 -right-20 h-[420px] w-[420px] rotate-12 text-white/12"
        viewBox="0 0 48 48"
        fill="currentColor"
        aria-hidden
      >
        <path d="M24 4C12.4 4 3 12.3 3 22.6c0 5.9 3.1 11.2 8 14.6-.3 2.5-1.3 4.7-3.1 6.5-.5.5-.1 1.4.6 1.3 3.9-.4 7.3-1.8 9.9-3.7 1.8.4 3.7.7 5.6.7 11.6 0 21-8.3 21-18.7S35.6 4 24 4Z" />
      </svg>
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <Reveal>
          <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-ink/75">{sub}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href={site.cta.href}
              className="group rounded-full bg-ink px-8 py-4 text-lg font-extrabold text-paper transition-all hover:shadow-lift"
            >
              {site.cta.label}
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border-2 border-ink/25 px-8 py-4 text-lg font-extrabold text-ink transition-colors hover:border-ink"
            >
              See pricing
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
