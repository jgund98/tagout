import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
};

export default function TermsPage() {
  return (
    <section className="bg-paper pt-16 md:pt-[72px]">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Terms of service
        </h1>
        <p className="mt-3 text-[14px] font-semibold text-ink/45">Placeholder. Replace with counsel-reviewed terms before launch.</p>
        <div className="mt-10 space-y-6 text-[15.5px] leading-relaxed text-ink-soft">
          <p>
            These terms govern use of the Tagout service operated by {site.legal.company}
          </p>
          <p>
            <strong className="text-ink">The service.</strong> Tagout provides restaurant
            scheduling, shift coverage, and related communication tools, including
            AI-assisted SMS messaging.
          </p>
          <p>
            <strong className="text-ink">Your responsibilities.</strong> Customers are
            responsible for the accuracy of schedule data, for obtaining appropriate
            consent from staff for SMS communication, and for compliance with local
            labor regulations.
          </p>
          <p>
            <strong className="text-ink">Billing.</strong> Plans are billed per location as
            described on the pricing page. Single and Group plans are month to month.
          </p>
          <p>
            Contact{" "}
            <a href={`mailto:${site.email}`} className="font-bold text-green-dark underline underline-offset-4">
              {site.email}
            </a>{" "}
            with any questions.
          </p>
        </div>
      </div>
    </section>
  );
}
