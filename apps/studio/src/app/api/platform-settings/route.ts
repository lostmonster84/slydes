import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch platform settings (public, used by Studio)
export async function GET() {
  try {
    const supabase = await createClient()

    // Use the public function we created
    const { data, error } = await supabase
      .rpc('get_platform_setting', { setting_key: 'features' })

    if (error) {
      console.error('[Platform Settings] RPC error:', error)
      // Return defaults on error
      return NextResponse.json({
        features: { onboardingPulse: false }
      })
    }

    return NextResponse.json({
      features: data || { onboardingPulse: false }
    })
  } catch (error) {
    console.error('[Platform Settings] Error:', error)
    return NextResponse.json({
      features: { onboardingPulse: false }
    })
  }
}
