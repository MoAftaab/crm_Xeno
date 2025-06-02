/** @type {import('next').NextConfig} */
const nextConfig = {
  // We need to use the server-side rendering approach instead of static export
  // because we have pages with dynamic = 'force-dynamic'
  
  // Image configuration for Next.js
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig;
