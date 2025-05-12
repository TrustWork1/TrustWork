import { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domains: ['trustwork-api.dedicateddevelopers.us'],
  },
  compress: true,
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
export default nextConfig;
