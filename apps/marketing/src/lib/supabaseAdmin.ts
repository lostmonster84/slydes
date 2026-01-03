import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase admin client (service role).
 *
 * - Use ONLY in server contexts (API routes / server actions).
 * - Bypasses RLS, so be strict about validation.
 */
export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}









