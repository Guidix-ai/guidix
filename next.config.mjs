/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Compress responses
  compress: true,

  // Production optimizations
  swcMinify: true,

  // Image optimization
  images: {
    domains: ['localhost', 'api.guidix.ai', 'app.guidix.ai'],
    unoptimized: false,
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_RESUME_API_URL: process.env.NEXT_PUBLIC_RESUME_API_URL,
    NEXT_PUBLIC_AUTO_APPLY_API_URL: process.env.NEXT_PUBLIC_AUTO_APPLY_API_URL,
    NEXT_PUBLIC_JOB_SERVICE_URL: process.env.NEXT_PUBLIC_JOB_SERVICE_URL,
    NEXT_PUBLIC_RESUME_SERVICE_URL: process.env.NEXT_PUBLIC_RESUME_SERVICE_URL,
  },
};

export default nextConfig;
