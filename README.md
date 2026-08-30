# Tagout — trytagout.com

Marketing site for **Tagout**, restaurant scheduling that texts back.

Next.js 15 · Tailwind CSS 4 · framer-motion · TypeScript. Fully static.

## Develop

```bash
npm install
npm run dev      # http://localhost:3820
```

## Production

```bash
npm run build
npm start        # http://localhost:3821
```

## Where things live

- `lib/site.ts` — every business fact (nav, pricing numbers, email). Change once, updates site-wide.
- `components/Phone.tsx` — the SMS phone + the three rotating hero scenarios.
- `components/CoverTheater.tsx` — the "watch Tagout cover Friday" showpiece.
- `components/Mocks.tsx` — product UI mockups (schedule grid, approvals, guardrails, group dashboard).
- `components/PricingCalculator.tsx` — the crew-size seat calculator.

## Before launch

- Wire `components/DemoForm.tsx` (demo requests) and `components/LoginForm.tsx` (auth) — both are UI stubs.
- Replace `/privacy` and `/terms` placeholder copy with counsel-reviewed versions.
- Photos in `public/photos/` are Unsplash stock; swap for brand photography when available.
