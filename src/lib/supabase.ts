import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface WaitlistEntry {
  id?: string
  email: string
  first_name?: string
  industry?: string
  source?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  created_at?: string
}

