import { createClient } from '@supabase/supabase-js'

// Use placeholder values during build if env vars aren't set
// This prevents build failures - API routes will need proper env vars at runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

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

