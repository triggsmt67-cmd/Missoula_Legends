import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  checkRateLimit,
  cleanEmail,
  cleanText,
  escapeHtml,
  formatHtmlText,
  getClientIp,
  isValidEmail,
} from '@/lib/request-security'

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5

function buildRateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: 'Too many submissions. Please try again in a few minutes.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
      },
    }
  )
}

export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json({ error: 'Email service unavailable' }, { status: 503 })
    }

    const rateLimit = checkRateLimit(
      `send-email:${getClientIp(request)}`,
      RATE_LIMIT_MAX_REQUESTS,
      RATE_LIMIT_WINDOW_MS
    )

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit.retryAfterSeconds)
    }

    const data = await request.json()
    const { formType, ...formData } = data
    const resend = new Resend(resendApiKey)

    let subject = '[Missoula Legends] New Form Submission'
    let htmlContent = `<h1>New Submission</h1><pre>${escapeHtml(JSON.stringify(formData, null, 2))}</pre>`
    let replyTo = cleanEmail(formData.email || formData.nominatorEmail || formData.contactEmail)

    if (formType === 'nominate') {
      subject = `[Missoula Legends - Nomination] ${cleanText(formData.businessName, 120) || 'New Business'}`
      htmlContent = `
        <h2>New Local Legend Nomination</h2>
        <p><strong>Business Name:</strong> ${formatHtmlText(formData.businessName, 120)}</p>
        <p><strong>Address/Neighborhood:</strong> ${formatHtmlText(formData.address, 240)}</p>
        <p><strong>Website:</strong> ${formatHtmlText(formData.website || 'N/A', 300)}</p>
        <hr />
        <h3>Nominator Details</h3>
        <p><strong>Name:</strong> ${formatHtmlText(formData.nominatorName || 'Anonymous', 120)}</p>
        <p><strong>Email:</strong> ${formatHtmlText(formData.nominatorEmail || 'N/A', 320)}</p>
        <p><strong>Reason:</strong><br />${formatHtmlText(formData.reason || 'None provided.', 3000)}</p>
      `
    } else if (formType === 'intake') {
      subject = `[Missoula Legends - Business Intake] ${cleanText(formData.businessName, 120) || 'New Business'}`
      htmlContent = `
        <h2>Business Intake Form Submission</h2>
        <p><strong>Business Name:</strong> ${formatHtmlText(formData.businessName, 120)}</p>
        <p><strong>Category:</strong> ${formatHtmlText(formData.category, 120)}</p>
        <p><strong>Neighborhood:</strong> ${formatHtmlText(formData.neighborhood, 120)}</p>
        <p><strong>Description:</strong><br />${formatHtmlText(formData.description, 3000)}</p>
        <hr />
        <h3>Contact Info</h3>
        <p><strong>Phone:</strong> ${formatHtmlText(formData.phone || 'N/A', 80)}</p>
        <p><strong>Website:</strong> ${formatHtmlText(formData.website || 'N/A', 300)}</p>
        <p><strong>Instagram:</strong> ${formatHtmlText(formData.instagram || 'N/A', 120)}</p>
        <p><strong>Address:</strong> ${formatHtmlText(formData.address, 240)}</p>
        <hr />
        <h3>Submitter Details</h3>
        <p><strong>Submitter Name:</strong> ${formatHtmlText(formData.submitterName || 'N/A', 120)}</p>
        <p><strong>Submitter Email:</strong> ${formatHtmlText(formData.submitterEmail || 'N/A', 320)}</p>
      `
      replyTo = cleanEmail(formData.submitterEmail) || replyTo
    } else if (formType === 'business-update') {
      subject = `[Missoula Legends - Business Update] ${cleanText(formData.businessName, 120) || 'Update Request'}`
      htmlContent = `
        <h2>Business Update Request</h2>
        <p><strong>Business Name:</strong> ${formatHtmlText(formData.businessName, 120)}</p>
        <p><strong>Requester Name:</strong> ${formatHtmlText(formData.requesterName, 120)}</p>
        <p><strong>Requester Email:</strong> ${formatHtmlText(formData.requesterEmail, 320)}</p>
        <p><strong>Relationship:</strong> ${formatHtmlText(formData.relationship, 120)}</p>
        <hr />
        <h3>Requested Updates</h3>
        <p><strong>Update Details:</strong><br />${formatHtmlText(formData.updateDetails, 3000)}</p>
      `
      replyTo = cleanEmail(formData.requesterEmail) || replyTo
    } else if (formType === 'spotlight') {
      subject = `[Missoula Legends - Spotlight Inquiry] ${cleanText(formData.businessName, 120) || 'New Inquiry'}`
      htmlContent = `
        <h2>Editorial Spotlight Inquiry</h2>
        <p><strong>Business Name:</strong> ${formatHtmlText(formData.businessName, 120)}</p>
        <p><strong>Contact Name & Role:</strong> ${formatHtmlText(formData.contactNameRole, 160)}</p>
        <p><strong>Email or Phone:</strong> ${formatHtmlText(formData.businessEmailPhone, 320)}</p>
        <p><strong>Website or Social Links:</strong> ${formatHtmlText(formData.website || 'None', 300)}</p>
        <hr />
        <h3>Spotlight Highlights</h3>
        <p>${formatHtmlText(formData.highlights, 3000)}</p>
        <p><strong>Optional Offer:</strong> ${formatHtmlText(formData.offer || 'None', 500)}</p>
      `

      const businessContact = cleanText(formData.businessEmailPhone, 320)
      const emailMatch = businessContact.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
      replyTo = emailMatch?.[0] || replyTo
    } else if (formType === 'newsletter') {
      const newsletterEmail = cleanEmail(formData.email)
      if (!isValidEmail(newsletterEmail)) {
        return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
      }

      subject = `[Missoula Legends - Newsletter Signup] ${newsletterEmail}`
      htmlContent = `
        <h2>New Newsletter Subscriber</h2>
        <p><strong>Email:</strong> ${escapeHtml(newsletterEmail)}</p>
      `
      replyTo = newsletterEmail
    } else {
      return NextResponse.json({ error: 'Unsupported form submission.' }, { status: 400 })
    }

    const senderEmail = process.env.RESEND_SENDER_EMAIL || 'hello@missoulalegends.com'
    const safeReplyTo = isValidEmail(replyTo) ? replyTo : undefined

    const { data: emailData, error } = await resend.emails.send({
      from: `Missoula Legends <${senderEmail}>`,
      to: ['trevor@truepath406.com'],
      replyTo: safeReplyTo,
      subject,
      html: htmlContent,
    })

    if (error) {
      console.error('Resend API Error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: emailData })
  } catch (error) {
    console.error('Server Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
