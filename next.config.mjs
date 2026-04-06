/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks']
  },
  serverExternalPackages: ['mysql2']
}

export default nextConfig
