import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  cleanHeaderValue,
  escapeHtml,
  getRequestIp,
  getValidEmail,
  hasAcceptableBodySize,
  isRateLimited,
  isSameOriginRequest,
} from '@/lib/request-security'

// Initialize Resend with the API key from the environment
// We'll fall back to a placeholder just so it compiles if the key isn't set yet
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

export async function POST(request: Request) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
    }
    if (!hasAcceptableBodySize(request)) {
      return NextResponse.json({ error: 'Request is too large' }, { status: 413 })
    }
    if (isRateLimited(`send-email:${getRequestIp(request)}`, 8, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const data = await request.json()
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
    }

    const { formType, ...formData } = data as Record<string, unknown>
    const allowedFormTypes = new Set(['nominate', 'intake', 'business-update', 'spotlight', 'newsletter'])
    if (typeof formType !== 'string' || !allowedFormTypes.has(formType)) {
      return NextResponse.json({ error: 'Invalid submission type' }, { status: 400 })
    }

    const field = (name: string, maximumLength = 5_000) => escapeHtml(formData[name], maximumLength)
    const subjectField = (name: string) => cleanHeaderValue(formData[name])

    // Determine the subject and formatting based on the formType
    let subject = '[Missoula Legends] New Form Submission'
    let htmlContent = '<h1>New Submission</h1>'
    let replyTo = getValidEmail(formData.email) || getValidEmail(formData.nominatorEmail) || getValidEmail(formData.contactEmail)

    if (formType === 'nominate') {
      subject = `[Missoula Legends - Nomination] ${subjectField('businessName') || 'New Business'}`
      htmlContent = `
        <h2>New Local Legend Nomination</h2>
        <p><strong>Business Name:</strong> ${field('businessName', 160)}</p>
        <p><strong>Address/Neighborhood:</strong> ${field('address', 240)}</p>
        <p><strong>Website:</strong> ${field('website', 500) || 'N/A'}</p>
        <hr />
        <h3>Nominator Details</h3>
        <p><strong>Name:</strong> ${field('nominatorName', 160) || 'Anonymous'}</p>
        <p><strong>Email:</strong> ${field('nominatorEmail', 254) || 'N/A'}</p>
        <p><strong>Reason:</strong><br />${field('reason') || 'None provided.'}</p>
      `
    } else if (formType === 'intake') {
      subject = `[Missoula Legends - Business Intake] ${subjectField('businessName') || 'New Business'}`
      htmlContent = `
        <h2>Business Intake Form Submission</h2>
        <p><strong>Business Name:</strong> ${field('businessName', 160)}</p>
        <p><strong>Category:</strong> ${field('category', 80)}</p>
        <p><strong>Neighborhood:</strong> ${field('neighborhood', 100)}</p>
        <p><strong>Description:</strong><br />${field('description')}</p>
        <hr />
        <h3>Contact Info</h3>
        <p><strong>Phone:</strong> ${field('phone', 80) || 'N/A'}</p>
        <p><strong>Website:</strong> ${field('website', 500) || 'N/A'}</p>
        <p><strong>Instagram:</strong> ${field('instagram', 120) || 'N/A'}</p>
        <p><strong>Address:</strong> ${field('address', 240)}</p>
        <hr />
        <h3>Submitter Details</h3>
        <p><strong>Submitter Name:</strong> ${field('submitterName', 160) || 'N/A'}</p>
        <p><strong>Submitter Email:</strong> ${field('submitterEmail', 254) || 'N/A'}</p>
      `
      replyTo = getValidEmail(formData.submitterEmail) || replyTo
    } else if (formType === 'business-update') {
      subject = `[Missoula Legends - Business Update] ${subjectField('businessName') || 'Update Request'}`
      htmlContent = `
        <h2>Business Update Request</h2>
        <p><strong>Business Name:</strong> ${field('businessName', 160)}</p>
        <p><strong>Requester Name:</strong> ${field('requesterName', 160)}</p>
        <p><strong>Requester Email:</strong> ${field('requesterEmail', 254)}</p>
        <p><strong>Relationship:</strong> ${field('relationship', 160)}</p>
        <hr />
        <h3>Requested Updates</h3>
        <p><strong>Update Details:</strong><br />${field('updateDetails')}</p>
      `
      replyTo = getValidEmail(formData.requesterEmail) || replyTo
    } else if (formType === 'spotlight') {
      subject = `[Missoula Legends - Spotlight Inquiry] ${subjectField('businessName') || 'New Inquiry'}`
      htmlContent = `
        <h2>Editorial Spotlight Inquiry</h2>
        <p><strong>Business Name:</strong> ${field('businessName', 160)}</p>
        <p><strong>Contact Name & Role:</strong> ${field('contactNameRole', 200)}</p>
        <p><strong>Email or Phone:</strong> ${field('businessEmailPhone', 254)}</p>
        <p><strong>Website or Social Links:</strong> ${field('website', 500) || 'None'}</p>
        <hr />
        <h3>Spotlight Highlights</h3>
        <p>${field('highlights').replace(/\n/g, '<br />')}</p>
        <p><strong>Optional Offer:</strong> ${field('offer') || 'None'}</p>
      `

      let replyToEmail: string | undefined
      const businessEmailPhone = cleanHeaderValue(formData.businessEmailPhone, 254)
      if (businessEmailPhone) {
        const emailMatch = businessEmailPhone.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
        if (emailMatch) {
          replyToEmail = getValidEmail(emailMatch[0])
        }
      }
      replyTo = replyToEmail || replyTo
    } else if (formType === 'newsletter') {
      const email = getValidEmail(formData.email)
      if (!email) {
        return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
      }
      subject = `[Missoula Legends - Newsletter Signup] ${email}`
      htmlContent = `
        <h2>New Newsletter Subscriber</h2>
        <p><strong>Email:</strong> ${escapeHtml(email, 254)}</p>
      `
    }

    // Default sender to an environment variable or a fallback dummy address (must be verified in Resend!)
    const senderEmail = process.env.RESEND_SENDER_EMAIL || 'hello@missoulalegends.com'

    const { data: emailData, error } = await resend.emails.send({
      from: `Missoula Legends <${senderEmail}>`,
      to: ['trevor@truepath406.com'],
      replyTo: replyTo || undefined,
      subject,
      html: htmlContent,
    })

    if (error) {
      console.error('Resend API Error:', error)
      return NextResponse.json({ error: 'Unable to send submission' }, { status: 502 })
    }

    return NextResponse.json({ success: true, id: emailData?.id })
  } catch (error) {
    console.error('Server Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
