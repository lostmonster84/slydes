/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_GIT_COMMIT: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local',
  },
  transpilePackages: ['@slydes/ui', '@slydes/database', '@slydes/types'],
  eslint: {
    // Next's build-time ESLint step is currently failing in Vercel with a
    // "Converting circular structure to JSON" error referencing the root
    // `.eslintrc.json`. We run lint separately (turbo task) instead.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  // Note: Using single-threaded @ffmpeg/core which doesn't require SharedArrayBuffer
  // No COOP/COEP headers needed
}

module.exports = nextConfig
