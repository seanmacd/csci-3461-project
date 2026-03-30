/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks']
  },
  serverExternalPackages: ['@duckdb/node-api']
}

export default nextConfig
