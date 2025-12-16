/**
 * Vercel Domains API Integration
 *
 * Handles programmatic domain registration for customer custom domains.
 * When a customer adds m.theirdomain.com, we automatically register it with Vercel.
 */

const VERCEL_API = 'https://api.vercel.com'
const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID // Studio project ID
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID // Optional team ID

interface VercelDomainResponse {
  name: string
  apexName: string
  projectId: string
  verified: boolean
  verification?: Array<{
    type: string
    domain: string
    value: string
    reason: string
  }>
  error?: {
    code: string
    message: string
  }
}

interface AddDomainResult {
  success: boolean
  verified: boolean
  domain: string
  vercelVerification?: VercelDomainResponse['verification']
  error?: string
}

interface VerifyDomainResult {
  success: boolean
  verified: boolean
  error?: string
}

/**
 * Add a custom domain to the Studio Vercel project
 */
export async function addDomainToVercel(domain: string): Promise<AddDomainResult> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return {
      success: false,
      verified: false,
      domain,
      error: 'Vercel API not configured. Missing VERCEL_API_TOKEN or VERCEL_PROJECT_ID.',
    }
  }

  try {
    const url = new URL(`${VERCEL_API}/v10/projects/${VERCEL_PROJECT_ID}/domains`)
    if (VERCEL_TEAM_ID) {
      url.searchParams.set('teamId', VERCEL_TEAM_ID)
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    })

    const data: VercelDomainResponse = await response.json()

    if (!response.ok) {
      // Domain might already exist - that's fine
      if (data.error?.code === 'domain_already_in_use') {
        return {
          success: true,
          verified: true,
          domain,
        }
      }

      return {
        success: false,
        verified: false,
        domain,
        error: data.error?.message || `Vercel API error: ${response.status}`,
      }
    }

    return {
      success: true,
      verified: data.verified,
      domain: data.name,
      vercelVerification: data.verification,
    }
  } catch (error) {
    return {
      success: false,
      verified: false,
      domain,
      error: error instanceof Error ? error.message : 'Failed to add domain to Vercel',
    }
  }
}

/**
 * Verify a domain on Vercel (after DNS is configured)
 */
export async function verifyDomainOnVercel(domain: string): Promise<VerifyDomainResult> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return {
      success: false,
      verified: false,
      error: 'Vercel API not configured',
    }
  }

  try {
    const url = new URL(`${VERCEL_API}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}/verify`)
    if (VERCEL_TEAM_ID) {
      url.searchParams.set('teamId', VERCEL_TEAM_ID)
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        verified: false,
        error: data.error?.message || `Verification failed: ${response.status}`,
      }
    }

    return {
      success: true,
      verified: data.verified === true,
    }
  } catch (error) {
    return {
      success: false,
      verified: false,
      error: error instanceof Error ? error.message : 'Failed to verify domain',
    }
  }
}

/**
 * Remove a domain from Vercel project
 */
export async function removeDomainFromVercel(domain: string): Promise<{ success: boolean; error?: string }> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return {
      success: false,
      error: 'Vercel API not configured',
    }
  }

  try {
    const url = new URL(`${VERCEL_API}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`)
    if (VERCEL_TEAM_ID) {
      url.searchParams.set('teamId', VERCEL_TEAM_ID)
    }

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    })

    if (!response.ok && response.status !== 404) {
      const data = await response.json()
      return {
        success: false,
        error: data.error?.message || `Failed to remove domain: ${response.status}`,
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove domain',
    }
  }
}

/**
 * Get domain configuration status from Vercel
 */
export async function getDomainConfig(domain: string): Promise<{
  configured: boolean
  verified: boolean
  error?: string
}> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return {
      configured: false,
      verified: false,
      error: 'Vercel API not configured',
    }
  }

  try {
    const url = new URL(`${VERCEL_API}/v6/domains/${domain}/config`)
    if (VERCEL_TEAM_ID) {
      url.searchParams.set('teamId', VERCEL_TEAM_ID)
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    })

    if (!response.ok) {
      return {
        configured: false,
        verified: false,
      }
    }

    const data = await response.json()

    return {
      configured: data.configuredBy !== null,
      verified: data.misconfigured === false,
    }
  } catch (error) {
    return {
      configured: false,
      verified: false,
      error: error instanceof Error ? error.message : 'Failed to get domain config',
    }
  }
}
