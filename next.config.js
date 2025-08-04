/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase Functions 환경에서도 standalone 활성화
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 