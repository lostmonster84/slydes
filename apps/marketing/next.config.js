/** @type {import('next').NextConfig} */
const path = require("node:path");

const nextConfig = {
  reactStrictMode: true,
  // Fix Turbopack in pnpm workspaces/monorepos by explicitly declaring the repo root.
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
  // NOTE: Must match `outputFileTracingRoot` if both are set.
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  outputFileTracingRoot: path.join(__dirname, "../.."),
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

module.exports = nextConfig;

