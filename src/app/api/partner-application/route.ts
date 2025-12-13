import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Lazy init to avoid build-time errors when env var not set
const getResend = () => new Resend(process.env.RESEND_API_KEY)

// Email to receive partner applications
const PARTNER_EMAIL = process.env.PARTNER_EMAIL || 'james@lostmonter.io'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { 
      name, 
      email, 
      businessName, 
      website, 
      industry, 
      audienceSize, 
      platforms, 
      whyPartner 
    } = data

    // Validate required fields
    if (!email || !name || !businessName || !industry || !audienceSize || !whyPartner) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Format industry label
    const industryLabels: Record<string, string> = {
      hospitality: 'Restaurant / Hospitality',
      travel: 'Travel / Tourism',
      fitness: 'Fitness / Wellness',
      beauty: 'Beauty / Fashion',
      rentals: 'Rentals / Property',
      automotive: 'Automotive',
      lifestyle: 'Lifestyle / Creator',
      other: 'Other',
    }

    // Format audience size label
    const audienceLabels: Record<string, string> = {
      '5k-10k': '5,000 - 10,000',
      '10k-25k': '10,000 - 25,000',
      '25k-50k': '25,000 - 50,000',
      '50k-100k': '50,000 - 100,000',
      '100k+': '100,000+',
    }

    // Send email via Resend
    const { error } = await getResend().emails.send({
      from: 'Slydes Partner Applications <contact@mail.slydes.io>',
      to: PARTNER_EMAIL,
      replyTo: email,
      subject: `🤝 New Founding Partner Application: ${businessName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🤝 New Founding Partner Application</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">${businessName}</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Applicant</p>
              <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">${name}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #2563EB;"><a href="mailto:${email}" style="color: #2563EB; text-decoration: none;">${email}</a></p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Business / Brand</p>
              <p style="margin: 0; font-size: 16px; color: #111827;">${businessName}</p>
              ${website ? `<p style="margin: 5px 0 0 0; font-size: 14px;"><a href="${website}" style="color: #2563EB; text-decoration: none;">${website}</a></p>` : ''}
            </div>
            
            <div style="display: flex; gap: 20px; margin-bottom: 20px;">
              <div style="flex: 1;">
                <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Industry</p>
                <p style="margin: 0; font-size: 14px; color: #111827;">${industryLabels[industry] || industry}</p>
              </div>
              <div style="flex: 1;">
                <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Audience Size</p>
                <p style="margin: 0; font-size: 14px; color: #111827; font-weight: 600;">${audienceLabels[audienceSize] || audienceSize}</p>
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Platforms</p>
              <p style="margin: 0; font-size: 14px; color: #111827;">${Array.isArray(platforms) ? platforms.join(', ') : platforms || 'Not specified'}</p>
            </div>
            
            <div style="margin-bottom: 0;">
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Why They Want to Partner</p>
              <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 14px; color: #111827; white-space: pre-wrap; line-height: 1.6;">${whyPartner}</p>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
            <p style="margin: 0; font-size: 14px; color: #166534;">
              <strong>Quick Actions:</strong><br/>
              • Reply to this email to contact the applicant<br/>
              • Review their website/social profiles<br/>
              • Schedule an intro call if interested
            </p>
          </div>
          
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
            This application was submitted from the Slydes Founding Partner page.
          </p>
        </div>
      `,
      text: `
New Founding Partner Application

Applicant: ${name}
Email: ${email}
Business: ${businessName}
Website: ${website || 'Not provided'}
Industry: ${industryLabels[industry] || industry}
Audience Size: ${audienceLabels[audienceSize] || audienceSize}
Platforms: ${Array.isArray(platforms) ? platforms.join(', ') : platforms || 'Not specified'}

Why They Want to Partner:
${whyPartner}

---
Reply to this email to contact the applicant.
      `.trim(),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to submit application. Please try again.' },
        { status: 500 }
      )
    }

    console.log('Partner application received:', { name, email, businessName, industry, audienceSize })

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
    })

  } catch (error) {
    console.error('Partner application error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


