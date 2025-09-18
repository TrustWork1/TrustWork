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
};
export default nextConfig;
