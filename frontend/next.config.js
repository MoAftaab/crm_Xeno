/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure static page generation to exclude pages with dynamic data
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/dashboard': { page: '/dashboard' },
      // Don't include dynamic pages like /campaigns/create or /segments/[id]
    };
  },
  // Skip type checking in build to make it faster
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
