import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

// Lazy init to avoid build-time errors when env var not set
const getResend = () => new Resend(process.env.RESEND_API_KEY)

// Email to receive partner applications
const PARTNER_EMAIL = process.env.PARTNER_EMAIL || 'james@lostmonster.io'

// Helper to extract handle from URL
function extractHandle(url: string | undefined, platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter'): string | null {
  if (!url?.trim()) return null

  const patterns: Record<string, RegExp> = {
    instagram: /(?:instagram\.com\/|^@?)([a-zA-Z0-9_.]+)/i,
    tiktok: /(?:tiktok\.com\/@?|^@?)([a-zA-Z0-9_.]+)/i,
    youtube: /(?:youtube\.com\/(?:@|channel\/|c\/)?|^@?)([a-zA-Z0-9_-]+)/i,
    twitter: /(?:(?:twitter|x)\.com\/|^@?)([a-zA-Z0-9_]+)/i,
  }

  const match = url.match(patterns[platform])
  return match ? match[1].toLowerCase().replace(/^@/, '') : url.trim().replace(/^@/, '').toLowerCase()
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      name,
      email,
      businessName,
      website,
      instagramUrl,
      tiktokUrl,
      youtubeUrl,
      twitterUrl,
      industry,
      audienceSize,
      whyPartner
    } = data

    // Validate required fields
    if (!email || !name || !businessName || !industry || !audienceSize || !whyPartner) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Require at least one social profile
    if (!instagramUrl?.trim() && !tiktokUrl?.trim() && !youtubeUrl?.trim() && !twitterUrl?.trim()) {
      return NextResponse.json(
        { error: 'At least one social profile is required' },
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

    // Extract handles from URLs
    const instagramHandle = extractHandle(instagramUrl, 'instagram')
    const tiktokHandle = extractHandle(tiktokUrl, 'tiktok')
    const youtubeHandle = extractHandle(youtubeUrl, 'youtube')
    const twitterHandle = extractHandle(twitterUrl, 'twitter')

    // Derive platforms from provided URLs
    const enabledPlatforms = [
      instagramHandle && 'Instagram',
      tiktokHandle && 'TikTok',
      youtubeHandle && 'YouTube',
      twitterHandle && 'X/Twitter'
    ].filter(Boolean).join(', ')

    // Save to database
    const supabase = createSupabaseAdmin()
    const { error: dbError } = await supabase
      .from('affiliate_applications')
      .insert({
        email: email.toLowerCase(),
        name,
        business_name: businessName,
        instagram_handle: instagramHandle,
        tiktok_handle: tiktokHandle,
        youtube_handle: youtubeHandle,
        twitter_handle: twitterHandle,
        website,
        audience_description: `${audienceSize} followers on ${enabledPlatforms}`,
        why_partner: whyPartner,
      })

    if (dbError) {
      console.error('Database error:', dbError)
      // Don't fail - still send email even if DB fails
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
      'under-1k': 'Under 1,000',
      '1k-5k': '1,000 - 5,000',
      '5k-10k': '5,000 - 10,000',
      '10k-25k': '10,000 - 25,000',
      '25k-50k': '25,000 - 50,000',
      '50k-100k': '50,000 - 100,000',
      '100k+': '100,000+',
    }

    // Build social links HTML
    const socialLinks = [
      instagramHandle ? `<a href="https://instagram.com/${instagramHandle}" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; background: linear-gradient(135deg, #833AB4, #E1306C, #F77737); color: white; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 500;">IG @${instagramHandle}</a>` : null,
      tiktokHandle ? `<a href="https://tiktok.com/@${tiktokHandle}" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; background: #000; color: white; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 500;">TikTok @${tiktokHandle}</a>` : null,
      youtubeHandle ? `<a href="https://youtube.com/@${youtubeHandle}" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; background: #FF0000; color: white; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 500;">YouTube @${youtubeHandle}</a>` : null,
      twitterHandle ? `<a href="https://x.com/${twitterHandle}" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; background: #000; color: white; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 500;">X @${twitterHandle}</a>` : null,
    ].filter(Boolean).join(' ')

    // Build social links text
    const socialLinksText = [
      instagramHandle ? `Instagram: https://instagram.com/${instagramHandle}` : null,
      tiktokHandle ? `TikTok: https://tiktok.com/@${tiktokHandle}` : null,
      youtubeHandle ? `YouTube: https://youtube.com/@${youtubeHandle}` : null,
      twitterHandle ? `X/Twitter: https://x.com/${twitterHandle}` : null,
    ].filter(Boolean).join('\n')

    // Send email via Resend
    const { error } = await getResend().emails.send({
      from: 'Slydes Partner Applications <contact@mail.slydes.io>',
      to: PARTNER_EMAIL,
      replyTo: email,
      subject: `🤝 New Affiliate Application: ${businessName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🤝 New Affiliate Application</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">${businessName}</p>
          </div>

          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Applicant</p>
              <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">${name}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #2563EB;"><a href="mailto:${email}" style="color: #2563EB; text-decoration: none;">${email}</a></p>
            </div>

            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Brand / Account</p>
              <p style="margin: 0; font-size: 16px; color: #111827;">${businessName}</p>
              ${website ? `<p style="margin: 5px 0 0 0; font-size: 14px;"><a href="${website}" style="color: #2563EB; text-decoration: none;">${website}</a></p>` : ''}
            </div>

            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Social Profiles (click to review)</p>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${socialLinks}
              </div>
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
              • Click the social profile buttons above to review their content<br/>
              • Reply to this email to contact the applicant<br/>
              • Approve/reject in admin dashboard
            </p>
          </div>

          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
            This application was submitted from the Slydes Affiliate page.
          </p>
        </div>
      `,
      text: `
New Affiliate Application

Applicant: ${name}
Email: ${email}
Brand/Account: ${businessName}
Website: ${website || 'Not provided'}

Social Profiles:
${socialLinksText || 'None provided'}

Industry: ${industryLabels[industry] || industry}
Audience Size: ${audienceLabels[audienceSize] || audienceSize}

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


