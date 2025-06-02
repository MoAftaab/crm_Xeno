/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/dashboard/settings',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
