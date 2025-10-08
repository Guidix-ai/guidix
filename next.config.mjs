import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Compress responses
  compress: true,

  // Image optimization
  images: {
    domains: ['localhost', 'api.guidix.ai', 'app.guidix.ai', 'logo.clearbit.com'],
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

  // Webpack configuration for module resolution
  webpack: (config, { dev, isServer, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    };

    // Disable CSS minification in production to avoid PostCSS errors
    if (!dev) {
      config.optimization.minimize = false;
    }

    return config;
  },
};

export default nextConfig;
