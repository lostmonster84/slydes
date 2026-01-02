import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { hexToTailwindClass } from '@/lib/scraper'
import type {
  GenerateSlydeContentRequest,
  GenerateSlydeContentResponse,
  GeneratedDemo,
  GeneratedCategorySlyde,
  ScrapedBusiness,
} from '@/types/generator'
import type { DemoHomeSlydeCategory } from '@/lib/demoHomeSlyde'
import type { FrameData, FAQItem } from '@/components/slyde-demo'

/**
 * POST /api/dev/generate-slyde-content
 *
 * Uses Claude to generate complete Slyde content from scraped business data.
 * DEV ONLY - Only works in development mode.
 */

// Icon mapping for categories
const CATEGORY_ICONS: Record<string, string> = {
  // Food & Drink
  menu: '🍽️',
  food: '🍴',
  drinks: '🍹',
  coffee: '☕',
  wine: '🍷',
  beer: '🍺',
  dessert: '🍰',

  // Services
  services: '⚡',
  booking: '📅',
  appointments: '📆',
  consultation: '💬',

  // Beauty & Wellness
  hair: '💇',
  nails: '💅',
  spa: '🧖',
  massage: '💆',
  beauty: '✨',
  skincare: '🧴',
  wellness: '🌿',

  // Accommodation & Travel
  rooms: '🛏️',
  accommodation: '🏠',
  stay: '🏨',
  rental: '🚗',
  tours: '🗺️',
  experiences: '🎯',
  adventure: '🏔️',

  // Fitness
  fitness: '💪',
  gym: '🏋️',
  classes: '🧘',
  training: '🏃',

  // Retail
  products: '📦',
  shop: '🛍️',
  store: '🏪',
  collection: '👗',

  // Business
  about: 'ℹ️',
  team: '👥',
  contact: '📞',
  location: '📍',
  reviews: '⭐',
  gallery: '📸',
  portfolio: '🎨',

  // Default
  default: '✨',
}

function getCategoryIcon(name: string): string {
  const lower = name.toLowerCase()
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon
  }
  return CATEGORY_ICONS.default
}

function buildSystemPrompt(business: ScrapedBusiness): string {
  return `You are a premium Slydes demo generator. Your job is to create stunning, conversion-focused mobile experiences that make businesses look AMAZING.

## ABOUT SLYDES
Slydes is a mobile-first platform where businesses create vertical, swipeable experiences (like TikTok/Instagram Stories, but for business). Users swipe up to see the next "frame" (screen).

## THE BUSINESS YOU'RE CREATING FOR
Name: ${business.name}
Industry: ${business.industry}
Tagline: ${business.tagline || 'Not provided'}
Location: ${business.location || 'Not specified'}
About: ${business.aboutText?.slice(0, 500) || 'Not provided'}

Services/Offerings found:
${business.services.map((s) => `- ${s.name}: ${s.description?.slice(0, 100) || 'No description'}`).join('\n')}

Reviews found:
${business.reviews.slice(0, 3).map((r) => `- "${r.text.slice(0, 100)}..." - ${r.author}`).join('\n')}

## YOUR TASK
Generate 4-5 category Slydes with 4-6 frames each. Each frame must follow AIDA:
- Hook (Attention): Grab attention with a bold, short headline
- What (Interest): Explain key features/benefits
- Who (Desire): Show who it's for / use cases
- Proof (Trust): Social proof, reviews, credentials
- Action (Convert): Clear CTA

## CRITICAL REQUIREMENTS

1. **Every headline must be SHORT and PUNCHY** - Max 4 words for title, 6 words for subtitle
2. **Copy must be SPECIFIC to this business** - No generic placeholder text
3. **CTAs must be action-oriented** - "Book Now", "View Menu", "Get Started", not "Learn More"
4. **Match the brand voice** - A fancy restaurant sounds different than a gym

## AVAILABLE IMAGES
You MUST use these real images from their website:
${business.heroImages.slice(0, 5).map((img, i) => `Hero ${i + 1}: ${img}`).join('\n')}
${business.galleryImages.slice(0, 10).map((img, i) => `Gallery ${i + 1}: ${img}`).join('\n')}
${business.services.flatMap((s) => s.images.slice(0, 2)).slice(0, 10).map((img, i) => `Service ${i + 1}: ${img}`).join('\n')}

## OUTPUT FORMAT
Return a JSON object with this exact structure:
{
  "categories": [
    {
      "id": "unique-id",
      "name": "Category Name",
      "icon": "emoji",
      "description": "Brief description",
      "frames": [
        {
          "templateType": "hook|what|who|proof|action",
          "title": "Short Title",
          "subtitle": "Slightly longer subtitle",
          "badge": "Optional Badge Text",
          "ctaText": "CTA Button Text",
          "ctaAction": "URL or 'info' or 'reviews' or 'faq'",
          "backgroundImage": "IMAGE_URL_FROM_ABOVE",
          "infoHeadline": "Info sheet headline",
          "infoDescription": "Longer description for info sheet",
          "infoItems": ["Bullet point 1", "Bullet point 2"]
        }
      ],
      "faqs": [
        {
          "question": "Question text?",
          "answer": "Answer text"
        }
      ]
    }
  ]
}

IMPORTANT:
- Use REAL image URLs from the available images above
- Create 4-5 categories based on their actual services
- Each category needs 4-6 frames
- Each category needs 3-5 FAQs
- Make them look INCREDIBLE`
}

function parseClaudeResponse(
  response: string,
  business: ScrapedBusiness
): GeneratedCategorySlyde[] {
  // Extract JSON from response
  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in response')
  }

  const parsed = JSON.parse(jsonMatch[0])
  const categories = parsed.categories || []

  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error('No categories generated')
  }

  const accentColor = hexToTailwindClass(business.primaryColor)

  return categories.map((cat: any, catIndex: number): GeneratedCategorySlyde => {
    const frames: FrameData[] = (cat.frames || []).map((frame: any, frameIndex: number): FrameData => {
      return {
        id: `${cat.id}-frame-${frameIndex + 1}`,
        order: frameIndex + 1,
        templateType: frame.templateType || 'custom',
        title: frame.title || '',
        subtitle: frame.subtitle || '',
        badge: frame.badge || undefined,
        heartCount: Math.floor(Math.random() * 2000) + 500,
        rating: 5.0,
        reviewCount: business.reviews.length || Math.floor(Math.random() * 100) + 50,
        cta: frame.ctaText
          ? {
              text: frame.ctaText,
              icon: frame.ctaAction?.startsWith('http') ? 'arrow' : 'view',
              action: frame.ctaAction || 'info',
            }
          : undefined,
        background: {
          type: 'image',
          src: frame.backgroundImage || business.heroImages[0] || '',
          filter: 'cinematic',
          vignette: true,
        },
        accentColor,
        infoContent: frame.infoHeadline
          ? {
              headline: frame.infoHeadline,
              description: frame.infoDescription,
              items: frame.infoItems,
            }
          : undefined,
      }
    })

    const faqs: FAQItem[] = (cat.faqs || []).map((faq: any, faqIndex: number): FAQItem => ({
      id: `${cat.id}-faq-${faqIndex + 1}`,
      question: faq.question,
      answer: faq.answer,
      views: 0,
      clicks: 0,
      published: true,
    }))

    return {
      categoryId: cat.id || `category-${catIndex + 1}`,
      categoryName: cat.name || `Category ${catIndex + 1}`,
      categoryIcon: cat.icon || getCategoryIcon(cat.name || ''),
      categoryDescription: cat.description || '',
      frames,
      faqs,
    }
  })
}

export async function POST(request: Request): Promise<NextResponse<GenerateSlydeContentResponse>> {
  // Dev-only check
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { ok: false, error: 'This endpoint is only available in development mode' },
      { status: 403 }
    )
  }

  // Parse request body
  let body: GenerateSlydeContentRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }

  const { scrapedBusiness } = body
  if (!scrapedBusiness) {
    return NextResponse.json(
      { ok: false, error: 'Scraped business data is required' },
      { status: 400 }
    )
  }

  // Check API key
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: 'Anthropic API key not configured' },
      { status: 503 }
    )
  }

  try {
    const anthropic = new Anthropic({ apiKey })

    const systemPrompt = buildSystemPrompt(scrapedBusiness)

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate the complete Slydes demo for ${scrapedBusiness.name}. Remember to use REAL image URLs from the available images, create compelling copy specific to this business, and follow the AIDA framework for each frame. Return ONLY valid JSON.`,
        },
      ],
    })

    const assistantMessage =
      response.content[0].type === 'text' ? response.content[0].text : ''

    // Parse Claude's response into structured data
    const categorySlydes = parseClaudeResponse(assistantMessage, scrapedBusiness)

    // Build home slyde categories
    const homeCategories: DemoHomeSlydeCategory[] = categorySlydes.map((cat) => ({
      id: cat.categoryId,
      icon: cat.categoryIcon,
      name: cat.categoryName,
      description: cat.categoryDescription,
      childSlydeId: cat.categoryId,
    }))

    // Determine quality
    const hasVideos = scrapedBusiness.youtubeVideos.length > 0 || scrapedBusiness.vimeoVideos.length > 0
    const hasEnoughImages = scrapedBusiness.heroImages.length + scrapedBusiness.galleryImages.length >= 10
    const hasEnoughCategories = categorySlydes.length >= 4

    let quality: 'high' | 'medium' | 'low' = 'high'
    const qualityNotes: string[] = []

    if (!hasVideos) {
      quality = 'medium'
      qualityNotes.push('No videos found - using images with filters')
    }
    if (!hasEnoughImages) {
      quality = quality === 'high' ? 'medium' : 'low'
      qualityNotes.push('Limited images found on website')
    }
    if (!hasEnoughCategories) {
      quality = quality === 'high' ? 'medium' : 'low'
      qualityNotes.push('Fewer than 4 service categories found')
    }

    const generatedDemo: GeneratedDemo = {
      brand: {
        name: scrapedBusiness.name,
        tagline: scrapedBusiness.tagline,
        location: scrapedBusiness.location,
        accentColor: hexToTailwindClass(scrapedBusiness.primaryColor),
      },
      homeSlyde: {
        backgroundImage: scrapedBusiness.heroImages[0] || '',
        backgroundVideo: scrapedBusiness.youtubeVideos[0] || scrapedBusiness.vimeoVideos[0],
        categories: homeCategories,
      },
      categorySlydes,
      sourceUrl: scrapedBusiness.sourceUrl,
      generatedAt: new Date().toISOString(),
      quality,
      qualityNotes,
    }

    return NextResponse.json({
      ok: true,
      data: generatedDemo,
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to generate content',
      },
      { status: 500 }
    )
  }
}
