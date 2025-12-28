import { NextResponse } from 'next/server'
import { APP_VERSION, BUILD_TIME, GIT_COMMIT } from '@/lib/version'

export async function GET() {
  return NextResponse.json({
    version: APP_VERSION,
    buildTime: BUILD_TIME,
    gitCommit: GIT_COMMIT,
  })
}
