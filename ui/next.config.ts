import { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trustwork-api.dedicateddevelopers.us',
      },
      {
        protocol: 'https',
        hostname: 'api.trustwork.live',
      },
    ],
  },
  compress: true,
  devIndicators: {
    position: 'bottom-right',
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  env: {
    NEXT_APP_STRIPE_PUBLIC_KEY: process.env.NEXT_APP_STRIPE_PUBLIC_KEY,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    NEXT_APP_TOKEN_NAME: process.env.NEXT_APP_TOKEN_NAME,
  },
};
export default nextConfig;
