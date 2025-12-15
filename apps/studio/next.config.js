/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
}

module.exports = nextConfig
