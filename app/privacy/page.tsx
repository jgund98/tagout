import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
};

export default function PrivacyPage() {
  return (
    <section className="bg-paper pt-16 md:pt-[72px]">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Privacy policy
        </h1>
        <p className="mt-3 text-[14px] font-semibold text-ink/45">Placeholder. Replace with a counsel-reviewed policy before launch.</p>
        <div className="mt-10 space-y-6 text-[15.5px] leading-relaxed text-ink-soft">
          <p>
            {site.legal.company} (“Tagout,” “we”) provides scheduling and workforce
            communication software for restaurants. This page describes, in plain
            language, how we handle data.
          </p>
          <p>
            <strong className="text-ink">What we collect.</strong> Account details you provide
            (name, email, phone), schedule and shift data your workplace enters, and
            messages exchanged with the Tagout service for scheduling purposes.
          </p>
          <p>
            <strong className="text-ink">Text messaging.</strong> Staff receive scheduling texts
            only after opting in, and can opt out at any time by replying STOP.
            Message frequency varies with scheduling activity. Message and data rates
            may apply.
          </p>
          <p>
            <strong className="text-ink">What we don&apos;t do.</strong> We do not sell personal
            information, and we do not use your team&apos;s contact details for
            advertising.
          </p>
          <p>
            Questions? Email us at{" "}
            <a href={`mailto:${site.email}`} className="font-bold text-green-dark underline underline-offset-4">
              {site.email}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
