/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.vercel.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Allow images from your Supabase project
      },
      {
        protocol: 'https',
        hostname: '**.supabase.com', // Allow images from your Supabase project
      },
    ],
    domains: ['placeholder.svg'],
    unoptimized: true,
  },
};

export default nextConfig;
