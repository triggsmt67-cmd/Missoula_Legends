import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  checkRateLimit,
  cleanMultilineText,
  cleanText,
  getClientIp,
  isValidEmail,
} from "@/lib/request-security";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

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
export async function POST(req: NextRequest) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json({ error: "Email service unavailable" }, { status: 503 });
    }

    const rateLimit = checkRateLimit(
      `claim:${getClientIp(req)}`,
      RATE_LIMIT_MAX_REQUESTS,
      RATE_LIMIT_WINDOW_MS
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again in a few minutes." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const data = await req.formData();

    if (data.get("honeypot")) {
      console.warn("Bot detected via honeypot field");
      return NextResponse.json({ ok: true });
    }

    const bizname = cleanText(data.get("bizname"), 120);
    const yourname = cleanText(data.get("yourname"), 120);
    const contact = cleanText(data.get("contact"), 320);
    const trade = cleanText(data.get("trade") ?? "Not specified", 120);
    const notes = cleanMultilineText(data.get("notes") ?? "None", 3000);

    if (!bizname || !yourname || !contact) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: "Missoula Legends <claims@missoulalegends.com>",
      to: "trevor@truepath406.com",
      replyTo: isValidEmail(contact) ? contact : undefined,
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
