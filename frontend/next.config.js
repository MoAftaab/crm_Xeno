/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output configuration for static export
  output: 'export',
  distDir: 'out',
  
  // Ensure images are properly handled
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
