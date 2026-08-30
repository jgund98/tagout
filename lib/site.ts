/**
 * Every business fact on the site lives here.
 * Change it once, it changes everywhere.
 */

export const site = {
  name: "Tagout",
  wordmark: "tagout",
  domain: "trytagout.com",
  url: "https://trytagout.com",
  tagline: "Restaurant scheduling that texts back",
  description:
    "Tagout builds your schedule, then its AI fills every gap over text message, finding who's free, who's under overtime, and who actually says yes. Managers approve. Your team just replies.",
  email: "hello@trytagout.com",
  aiName: "Tagout",

  nav: [
    {
      label: "Product",
      href: "/product",
      children: [
        { label: "Overview", short: "Overview", href: "/product", desc: "The whole platform, front to back" },
        { label: "Watch it cover a shift", short: "Watch it work", href: "/product#watch", desc: "The coverage engine, in motion" },
        { label: "Pricing", short: "Pricing", href: "/pricing", desc: "One price covers the house" },
        { label: "Compare", short: "Compare", href: "/vs-hotschedules", desc: "The honest side-by-side" },
      ],
    },
    {
      label: "Who it's for",
      href: "/for/gms",
      children: [
        { label: "General managers", short: "GMs", href: "/for/gms", desc: "Get your Friday nights back" },
        { label: "Servers & staff", short: "Staff", href: "/for/staff", desc: "The schedule that lives in your texts" },
        { label: "Restaurant groups", short: "Groups", href: "/for/groups", desc: "Roll out in waves, not weekends" },
      ],
    },
    { label: "Pricing", href: "/pricing" },
    { label: "Compare", href: "/vs-hotschedules" },
  ],

  cta: { label: "Get a demo", href: "/demo" },
  login: { label: "Log in", href: "/login" },

  segments: [
    "Full-service dining",
    "Fast casual",
    "Coffee & cafés",
    "Bars & nightlife",
    "Multi-unit groups",
  ],

  pricing: {
    // "The house": one base price covers a full roster.
    // Growing? "Add a section": +15 seats, like the ones you hand your servers.
    base: 249,
    baseSeats: 25,
    sectionPrice: 99,
    sectionSeats: 15,
    launchFee: 299,
    pilotNote:
      "Start with a 30-day pilot in one location. If you don't stay, the launch fee comes back.",
    included: [
      "Tagout’s AI agent, covering shifts 24/7",
      "Unlimited scheduling-related texting",
      "Manager portal: schedules, approvals, labor dashboards",
      "Staff portal: their week, open shifts, time-off",
      "Shift swaps, drops & one-tap approvals",
      "Overtime & labor guardrails",
      "White-glove import from your current system",
      "Payroll-ready hour exports",
    ],
    custom: {
      name: "Groups & Enterprise",
      unit: "10+ locations or 200+ seats",
      blurb: "Volume seat rates, one rollout plan, one invoice.",
      features: [
        "Volume pricing on seats and launch",
        "Group dashboard across locations",
        "Shared staff pools between stores",
        "SSO, roles & advanced permissions",
        "API & payroll integrations",
        "Dedicated rollout team",
      ],
      cta: "Talk to us",
    },
  },

  legal: {
    company: "Tagout, Inc.",
  },
} as const;

export type Site = typeof site;
