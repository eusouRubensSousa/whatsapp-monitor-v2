import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@supabase/ssr'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
