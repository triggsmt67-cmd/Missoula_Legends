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
import {
  cleanHeaderValue,
  getRequestIp,
  getValidEmail,
  hasAcceptableBodySize,
  isRateLimited,
  isSameOriginRequest,
} from "@/lib/request-security";

export async function POST(req: NextRequest) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }
    if (!hasAcceptableBodySize(req)) {
      return NextResponse.json({ error: "Request is too large" }, { status: 413 });
    }
    if (isRateLimited(`claim:${getRequestIp(req)}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const data = await req.formData();

    const bizname = cleanHeaderValue(data.get("bizname"), 160);
    const yourname = cleanHeaderValue(data.get("yourname"), 160);
    const contact = cleanHeaderValue(data.get("contact"), 254);
    const trade = cleanHeaderValue(data.get("trade") || "Not specified", 120);
    const notes = cleanHeaderValue(data.get("notes") || "None", 5_000);

    if (!bizname || !yourname || !contact) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json({ error: "Submission service is unavailable" }, { status: 503 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: "Missoula Legends <claims@missoulalegends.com>", // must be on your verified domain
      to: "trevor@truepath406.com",
      replyTo: getValidEmail(contact),
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

    if (error) {
      console.error("Claim email provider error:", error);
      return NextResponse.json({ error: "Submission service is unavailable" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Claim form error:", err);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
