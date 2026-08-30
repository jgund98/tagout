import type { Metadata } from "next";
import Link from "next/link";
import { BubbleMark } from "@/components/Wordmark";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Tagout manager dashboard.",
};

export default function LoginPage() {
  return (
    <section className="grid min-h-screen bg-paper pt-16 md:pt-[72px] lg:grid-cols-2">
      {/* form side */}
      <div className="flex items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green">
            <BubbleMark size={26} className="text-white" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink">
            Welcome back.
          </h1>
          <p className="mt-2 text-[15.5px] font-medium text-ink-soft">
            Managers log in here. Your staff never has to. They just text.
          </p>
          <LoginForm />
          <p className="mt-8 text-center text-[14px] font-semibold text-ink-soft">
            New to Tagout?{" "}
            <Link href="/demo" className="font-extrabold text-green-dark underline decoration-green decoration-2 underline-offset-4">
              Get a demo
            </Link>
          </p>
        </div>
      </div>

      {/* brand side */}
      <div className="relative hidden overflow-hidden bg-pine lg:block">
        <div className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[460px] rounded-full bg-green/15 blur-[100px]" />
        <div className="relative flex h-full flex-col justify-center gap-6 px-14 xl:px-20">
          <div className="w-fit max-w-md rounded-3xl rounded-bl-md bg-white/95 p-5 shadow-lift">
            <p className="text-[13px] font-extrabold uppercase tracking-wide text-ink/40">
              While you were logged out
            </p>
            <p className="mt-2 text-[15.5px] font-medium leading-relaxed text-ink">
              Tagout covered Sunday brunch (Katie said yes), lined up a swap for
              Tuesday, and kept Jake out of overtime.
            </p>
          </div>
          <div className="ml-auto w-fit max-w-xs rounded-3xl rounded-br-md bg-green p-5 shadow-lift">
            <p className="text-[15.5px] font-bold leading-relaxed text-white">
              Nothing needs you. It&apos;s all in the feed if you want the story.
            </p>
          </div>
          <p className="mt-8 max-w-md font-display text-3xl font-extrabold leading-tight text-paper/90">
            The best shift report is a short&nbsp;one.
          </p>
        </div>
      </div>
    </section>
  );
}
