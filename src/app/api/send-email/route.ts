import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend with the API key from the environment
// We'll fall back to a placeholder just so it compiles if the key isn't set yet
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { formType, ...formData } = data

    // Determine the subject and formatting based on the formType
    let subject = '[Missoula Legends] New Form Submission'
    let htmlContent = `<h1>New Submission</h1><pre>${JSON.stringify(formData, null, 2)}</pre>`
    let replyTo = formData.email || formData.nominatorEmail || formData.contactEmail

    if (formType === 'nominate') {
      subject = `[Missoula Legends - Nomination] ${formData.businessName || 'New Business'}`
      htmlContent = `
        <h2>New Local Legend Nomination</h2>
        <p><strong>Business Name:</strong> ${formData.businessName}</p>
        <p><strong>Address/Neighborhood:</strong> ${formData.address}</p>
        <p><strong>Website:</strong> ${formData.website || 'N/A'}</p>
        <hr />
        <h3>Nominator Details</h3>
        <p><strong>Name:</strong> ${formData.nominatorName || 'Anonymous'}</p>
        <p><strong>Email:</strong> ${formData.nominatorEmail || 'N/A'}</p>
        <p><strong>Reason:</strong><br />${formData.reason || 'None provided.'}</p>
      `
    } else if (formType === 'intake') {
      subject = `[Missoula Legends - Business Intake] ${formData.businessName || 'New Business'}`
      htmlContent = `
        <h2>Business Intake Form Submission</h2>
        <p><strong>Business Name:</strong> ${formData.businessName}</p>
        <p><strong>Category:</strong> ${formData.category}</p>
        <p><strong>Neighborhood:</strong> ${formData.neighborhood}</p>
        <p><strong>Description:</strong><br />${formData.description}</p>
        <hr />
        <h3>Contact Info</h3>
        <p><strong>Phone:</strong> ${formData.phone || 'N/A'}</p>
        <p><strong>Website:</strong> ${formData.website || 'N/A'}</p>
        <p><strong>Instagram:</strong> ${formData.instagram || 'N/A'}</p>
        <p><strong>Address:</strong> ${formData.address}</p>
        <hr />
        <h3>Submitter Details</h3>
        <p><strong>Submitter Name:</strong> ${formData.submitterName || 'N/A'}</p>
        <p><strong>Submitter Email:</strong> ${formData.submitterEmail || 'N/A'}</p>
      `
      replyTo = formData.submitterEmail || replyTo
    } else if (formType === 'business-update') {
      subject = `[Missoula Legends - Business Update] ${formData.businessName || 'Update Request'}`
      htmlContent = `
        <h2>Business Update Request</h2>
        <p><strong>Business Name:</strong> ${formData.businessName}</p>
        <p><strong>Requester Name:</strong> ${formData.requesterName}</p>
        <p><strong>Requester Email:</strong> ${formData.requesterEmail}</p>
        <p><strong>Relationship:</strong> ${formData.relationship}</p>
        <hr />
        <h3>Requested Updates</h3>
        <p><strong>Update Details:</strong><br />${formData.updateDetails}</p>
      `
      replyTo = formData.requesterEmail || replyTo
    } else if (formType === 'spotlight') {
      subject = `[Missoula Legends - Spotlight Inquiry] ${formData.businessName || 'New Inquiry'}`
      htmlContent = `
        <h2>Editorial Spotlight Inquiry</h2>
        <p><strong>Business Name:</strong> ${formData.businessName}</p>
        <p><strong>Contact Name:</strong> ${formData.contactName}</p>
        <p><strong>Contact Email:</strong> ${formData.contactEmail}</p>
        <p><strong>Contact Phone:</strong> ${formData.contactPhone || 'N/A'}</p>
        <hr />
        <h3>Story Idea</h3>
        <p><strong>Details:</strong><br />${formData.storyIdea}</p>
      `
      replyTo = formData.contactEmail || replyTo
    } else if (formType === 'newsletter') {
      subject = `[Missoula Legends - Newsletter Signup] ${formData.email}`
      htmlContent = `
        <h2>New Newsletter Subscriber</h2>
        <p><strong>Email:</strong> ${formData.email}</p>
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
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: emailData })
  } catch (error) {
    console.error('Server Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
