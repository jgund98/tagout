import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-paper px-4 pt-16 text-center md:pt-[72px]">
      <p className="rounded-2xl rounded-bl-md bg-cream px-5 py-3 text-[15px] font-medium text-ink">
        Hmm. That page dropped its shift and nobody covered it. 😅
      </p>
      <h1 className="mt-6 font-display text-6xl font-extrabold tracking-tight text-ink">404</h1>
      <Link
        href="/"
        className="mt-8 rounded-full bg-green px-7 py-3.5 text-[16px] font-extrabold text-ink transition-all hover:shadow-lift"
      >
        Back to the floor →
      </Link>
    </section>
  );
}
