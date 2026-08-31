# Tagout GM Portal — engineering notes

## What this is
The manager-facing product at `/portal`, running in **Demo Mode**: a fully interactive
Harbor & Vine seeded ~3 months into using Tagout. Every control mutates real state in a
client-side store; a scripted live engine streams events (Marisa passes → Sasha says yes →
approval → the board updates) so the dashboard is alive without refresh. Logout (or the
Settings reset) wipes and reseeds — every walkthrough starts identical.

## Architecture
- `lib/portal/data.ts` — the seed: roster (photos in `/public/portal/avatars`), week of
  shifts, punches, coverage runs (live / covered / handed-off), feed, house rules,
  time off, events, notes.
- `lib/portal/store.tsx` — reducer + React context + the engine timeline. State persists
  to `sessionStorage` per session; `startDemoSession()` reseeds. **This is the seam for
  the real backend**: replace the reducer's storage with API calls, keep the action shapes.
- `components/portal/ui.tsx` — Avatar/Chip/StatTile/Toggle/bubbles (site's bubble grammar).
- `components/portal/Shell.tsx` — sidebar (desktop), bottom tab bar + More sheet (mobile),
  notification bell fed by the same feed.
- Routes: `/portal` (Tonight: feed + live cover + lineup + notebook), `/coverage`
  (Needs-you queue, autopilot dial, pause switch, runs with full SMS transcripts),
  `/schedule` (desktop week grid, mobile day view, draft→publish, rule-aware conflicts),
  `/team` (roster, invite-by-text flow, time-off approvals), `/hours` (live clocks,
  timecard approval, break flags, real CSV export), `/rules` (toggles that actually change
  schedule-page behavior and the engine), `/floor` (sections, tap-to-move tables,
  balance action), `/settings` (plan, locations, integrations honesty).
- `/login`: phone-first + OTP. Hardcoded demo account **561-324-9522**, bypass code
  **000000**, clearly labeled. Other numbers get the waitlist screen.

## Settings → behavior (wired, not decorative)
- Autopilot dial changes what the live engine does at the approval step (full = auto-confirm).
- Pause switch stops the engine from sending anything until resumed.
- Turning off the OT / minor rules removes those warnings from the schedule builder.
- Publishing converts drafts and fires the "everyone got their week by text" event.

## Credential-gated (built to the seam, honestly labeled in-product)
1. **SMS provider** (Twilio/Telnyx + 10DLC): real OTP, invites, coverage texts, IN/OUT
   punches. Every send in the demo is marked with an amber Demo note.
2. **Anthropic API**: the ranking/reply brain. The run stepper + transcript UI is the
   exact surface it will feed.
3. **Database** (Neon/Vercel Postgres): swap sessionStorage persistence for real tenancy.
   Server-side auth/RBAC and true multi-tenant isolation start here — do not ship real
   customers on client state.
4. Toast POS / payroll: stubs shown as "Coming soon" in Settings.

## Source of truth & the future brain
The portal state is the system of record; every human and AI action flows through the
reducer and lands in the feed, which doubles as the audit/event log. That log is the
learning substrate for the brain: yes-rates per person, patterns (Dana's three dropped
Fridays), section balance, reply speed. When the Anthropic-powered brain arrives, it
reads and writes the same actions the UI does today — nothing about the surfaces changes,
only who's generating the events. Time model is explicit across the UI: Needs-you = act
now, "Happening right now" = live, "Up next" = future, "Past covers" / "Earlier this
week" = history.

## Next phase (not yet built)
- Owner/multi-location rollup view; platform-owner internal admin.
- New-restaurant onboarding wizard (the demo seeds one house).
- Real notification prefs per person; message-history browser per staffer.

## POV surfaces (added Aug 30)
- **/me** — staff app (server POV). Session role "staff" + personId. Tabs: My week / Pickups / Requests / Profile. The live offer renders the actual SMS thread (run.thread tag bubbles) with I'll-take-it / Pass; claims, drops (SHIFT_UPSERT → open), and TIMEOFF_REQUEST all feed the GM's world through the shared store.
- **/welcome** — the onboarding link a new hire opens. 3 steps: name → availability → SMS consent. Finishes with STAFF_PATCH (status active) and lands in /me.
- **/admin** — Tagout HQ (internal). Client list w/ health, onboarding pipeline, support queue, team. Local demo seed, separate from restaurant state.
- **PovSwitch** (components/portal/PovSwitch.tsx) — temp until launch. GM/Server/Admin chips in the GM topbar, the mobile More sheet, /me header, /admin header. switchDemoRole() rewrites only the session key so the world state survives the hop.
- Login routing: DEMO_PHONES → /portal; (561) 555-0184 (Marisa) / 0139 (Sasha) → /me; (561) 555-0102 (Tyler) → /welcome. Same silent-zeros OTP.
