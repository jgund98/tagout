import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/**
 * Demo-request handler.
 * Sends the lead to LEAD_TO via Brevo. Only BREVO_API_KEY lives in env
 * (set it in Vercel); recipients and sender are code defaults, overridable.
 */

const LEAD_TO = process.env.LEAD_TO ?? site.email; // hello@trytagout.com
const LEAD_FROM_EMAIL = process.env.LEAD_FROM_EMAIL ?? "leads@trytagout.com";
const LEAD_FROM_NAME = "Tagout Website";

type DemoLead = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  locations?: string;
  current?: string;
  website?: string; // honeypot
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  let lead: DemoLead;
  try {
    lead = (await req.json()) as DemoLead;
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  // honeypot: bots fill every field, humans never see this one
  if (lead.website) return NextResponse.json({ ok: true });

  if (!lead.email || !lead.firstName || !lead.phone) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    // Preview environments without the key: accept the lead so the UX works,
    // and leave a trace in the function logs.
    console.warn("[demo] BREVO_API_KEY not set; lead not emailed:", lead.email);
    return NextResponse.json({ ok: true, delivered: false });
  }

  const rows: [string, string | undefined][] = [
    ["Name", `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim()],
    ["Email", lead.email],
    ["Cell", lead.phone],
    ["Restaurant / group", lead.company],
    ["Role", lead.role],
    ["Locations", lead.locations],
    ["Current scheduler", lead.current],
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <div style="background:#0ecf7f;border-radius:12px 12px 0 0;padding:16px 24px">
        <strong style="color:#0f1512;font-size:18px">New demo request — trytagout.com</strong>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee">
        ${rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) =>
              `<tr><td style="padding:10px 24px;color:#888;font-size:13px;white-space:nowrap">${k}</td><td style="padding:10px 24px;font-size:14px;font-weight:bold">${esc(v!)}</td></tr>`
          )
          .join("")}
      </table>
      <p style="color:#888;font-size:12px;padding:12px 24px">They were promised a text within one business day.</p>
    </div>`;

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json" },
      body: JSON.stringify({
        sender: { email: LEAD_FROM_EMAIL, name: LEAD_FROM_NAME },
        to: [{ email: LEAD_TO }],
        replyTo: { email: lead.email },
        subject: `Demo request: ${lead.company || lead.firstName} (${lead.locations || "1"} location${lead.locations === "1" || !lead.locations ? "" : "s"})`,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      console.error("[demo] Brevo error", res.status, await res.text());
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[demo] send failed", err);
    return NextResponse.json({ ok: true, delivered: false });
  }
}
