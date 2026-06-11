import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/claim — receives claim-form submissions and emails them to you.
 *
 * Uses Resend (resend.com) because it's the simplest email API on Vercel:
 *   1. npm install resend
 *   2. Create a free Resend account, verify your domain (missoulalegends.com)
 *   3. Add RESEND_API_KEY to your Vercel environment variables
 *
 * Don't want Resend? Swap the email block for anything else (SendGrid,
 * a Slack webhook, a Notion API call, a database insert). The form only
 * cares that this route returns 200.
 */

import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const bizname = String(data.get("bizname") ?? "").trim();
    const yourname = String(data.get("yourname") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const trade = String(data.get("trade") ?? "Not specified").trim();
    const notes = String(data.get("notes") ?? "None").trim();

    if (!bizname || !yourname || !contact) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Missoula Legends <claims@missoulalegends.com>", // must be on your verified domain
      to: "trevor@truepath406.com",
      replyTo: contact.includes("@") ? contact : undefined,
      subject: `Free Listing Claim — ${bizname}`,
      text: [
        `Business Name: ${bizname}`,
        `Contact Name: ${yourname}`,
        `Phone/Email: ${contact}`,
        `Trade: ${trade || "Not specified"}`,
        `Notes: ${notes || "None"}`,
        ``,
        `Submitted via missoulalegends.com/claim`,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Claim form error:", err);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
