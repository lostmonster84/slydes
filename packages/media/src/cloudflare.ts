import { signHs256Jwt } from './jwt'

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env var: ${name}`)
  return v
}

export type CloudflareStreamDirectUploadResult = {
  uid: string
  uploadURL: string
  expiry?: string
}

export type CloudflareImagesDirectUploadResult = {
  id: string
  uploadURL: string
  expiry?: string
}

export async function createCloudflareStreamDirectUpload(opts?: {
  accountId?: string
  apiToken?: string
  maxDurationSeconds?: number
  expirySeconds?: number
  requireSignedURLs?: boolean
}) {
  const accountId = opts?.accountId ?? requireEnv('CLOUDFLARE_ACCOUNT_ID')
  const apiToken = opts?.apiToken ?? requireEnv('CLOUDFLARE_STREAM_TOKEN')

  const nowSeconds = Math.floor(Date.now() / 1000)
  const expirySeconds = opts?.expirySeconds ?? 10 * 60
  const exp = new Date((nowSeconds + expirySeconds) * 1000).toISOString()

  const body = {
    maxDurationSeconds: opts?.maxDurationSeconds,
    requireSignedURLs: opts?.requireSignedURLs ?? true,
    expiry: exp,
  }

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const json = (await res.json()) as any
  if (!res.ok || json?.success !== true) {
    const msg =
      json?.errors?.map((e: any) => e?.message).filter(Boolean).join('; ') ||
      json?.messages?.map((m: any) => m?.message).filter(Boolean).join('; ') ||
      `Cloudflare Stream direct upload failed (status ${res.status})`
    throw new Error(msg)
  }

  return {
    uid: json.result.uid as string,
    uploadURL: json.result.uploadURL as string,
    expiry: json.result.expiry as string | undefined,
  } satisfies CloudflareStreamDirectUploadResult
}

export async function createCloudflareImagesDirectUpload(opts?: {
  accountId?: string
  apiToken?: string
  expirySeconds?: number
  requireSignedURLs?: boolean
}) {
  const accountId = opts?.accountId ?? requireEnv('CLOUDFLARE_ACCOUNT_ID')
  const apiToken = opts?.apiToken ?? requireEnv('CLOUDFLARE_IMAGES_TOKEN')

  const nowSeconds = Math.floor(Date.now() / 1000)
  const expirySeconds = opts?.expirySeconds ?? 10 * 60
  const exp = new Date((nowSeconds + expirySeconds) * 1000).toISOString()

  const body = {
    requireSignedURLs: opts?.requireSignedURLs ?? true,
    expiry: exp,
  }

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const json = (await res.json()) as any
  if (!res.ok || json?.success !== true) {
    const msg =
      json?.errors?.map((e: any) => e?.message).filter(Boolean).join('; ') ||
      json?.messages?.map((m: any) => m?.message).filter(Boolean).join('; ') ||
      `Cloudflare Images direct upload failed (status ${res.status})`
    throw new Error(msg)
  }

  return {
    id: json.result.id as string,
    uploadURL: json.result.uploadURL as string,
    expiry: json.result.expiry as string | undefined,
  } satisfies CloudflareImagesDirectUploadResult
}

export function mintCloudflareStreamPlaybackToken(params: {
  videoUid: string
  expiresInSeconds?: number
  secret?: string
  keyId?: string
}) {
  const secret = params.secret ?? requireEnv('CLOUDFLARE_STREAM_SIGNING_KEY')
  const keyId = params.keyId ?? process.env.CLOUDFLARE_STREAM_KEY_ID

  const now = Math.floor(Date.now() / 1000)
  const exp = now + (params.expiresInSeconds ?? 10 * 60)

  // Cloudflare Stream tokenized playback expects a JWT where `sub` is the video UID.
  // We keep the payload intentionally minimal.
  const payload = { sub: params.videoUid, exp }
  return signHs256Jwt(payload, secret, keyId ? { kid: keyId } : undefined)
}

export function buildCloudflareImageUrl(params: {
  accountHash?: string
  imageId: string
  variant?: string
}) {
  const accountHash = params.accountHash ?? requireEnv('CLOUDFLARE_IMAGES_ACCOUNT_HASH')
  const variant = params.variant ?? (process.env.CLOUDFLARE_IMAGES_DEFAULT_VARIANT || 'hero')
  return `https://imagedelivery.net/${accountHash}/${params.imageId}/${variant}`
}


