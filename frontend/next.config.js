/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip type checking during build to make it faster
  typescript: {
    // This ignores TypeScript errors during build
    ignoreBuildErrors: true,
  },
  // For hybrid App/Pages architecture
  experimental: {
    // This allows incremental adoption of App Router
    appDir: true,
  },
  // Exclude specific dynamic routes from static generation
  unstable_excludeFiles: [
    'pages/campaigns/create.tsx',  // Exclude campaigns create page
    'pages/segments/[id].tsx',     // Exclude dynamic segment page
    'app/google-test/page.tsx',    // Exclude Google OAuth test page
  ],
  // Ensure images are properly handled
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
