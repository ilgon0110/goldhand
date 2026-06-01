import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'goldhand-5fd6c.firebasestorage.app',
        pathname: '/**',
      },
    ],
  },
};

const analyze = process.env.ANALYZE === 'true';
export default analyze
  ? require('@next/bundle-analyzer')({ enabled: true })(nextConfig)
  : nextConfig;
