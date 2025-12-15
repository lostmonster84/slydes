import crypto from 'node:crypto'
import { base64UrlEncode } from './base64url'

export type JwtHeader = {
  alg: 'HS256'
  typ?: 'JWT'
  kid?: string
}

export function signHs256Jwt(payload: Record<string, unknown>, secret: string, header?: Partial<JwtHeader>) {
  const hdr: JwtHeader = {
    alg: 'HS256',
    typ: 'JWT',
    ...header,
  }

  const headerPart = base64UrlEncode(JSON.stringify(hdr))
  const payloadPart = base64UrlEncode(JSON.stringify(payload))
  const signingInput = `${headerPart}.${payloadPart}`
  const sig = crypto.createHmac('sha256', secret).update(signingInput).digest()
  const sigPart = base64UrlEncode(sig)
  return `${signingInput}.${sigPart}`
}


