import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.17.176.1'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
}

export default nextConfig
