"use client";

import { useState } from "react";

const inputCls =
  "w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3.5 text-[15.5px] font-medium text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-green";

export default function LoginForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // NOTE: stub — wire to your auth provider before launch.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-8 rounded-3xl bg-mint p-6 text-center">
        <p className="font-display text-xl font-extrabold text-green-dark">Check your texts 📲</p>
        <p className="mt-2 text-[14.5px] font-medium leading-relaxed text-ink-soft">
          If that number belongs to a Tagout manager account, a sign-in link is on
          its way. (This preview site isn&apos;t wired to a live backend yet.)
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-extrabold uppercase tracking-wide text-ink/45">
          Cell phone or email
        </span>
        <input
          required
          name="identifier"
          placeholder="(555) 210-4477"
          className={inputCls}
          autoComplete="username"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-full bg-ink py-4 text-[16.5px] font-extrabold text-paper transition-colors hover:bg-green-dark"
      >
        Text me a sign-in link
      </button>
      <p className="text-center text-[13px] font-medium text-ink/40">
        No passwords to forget. We text you a magic link. On brand, we know.
      </p>
    </form>
  );
}
