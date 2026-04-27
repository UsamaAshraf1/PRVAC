/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    turbopack: false,   // temporarily disable Turbopack
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
