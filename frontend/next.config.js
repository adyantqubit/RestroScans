/** @type {import('next').NextConfig} */
const apiOrigin = process.env.NEXT_PUBLIC_API_ORIGIN || 'http://127.0.0.1:8000';

const nextConfig = {
  reactStrictMode: false,
  // Restaurant sites are opened as tenant1.restroscans.com, not localhost.
  allowedDevOrigins: ['restroscans.com', '*.restroscans.com'],
  // The API paths end in "/". Next would redirect them to the slashless form, and Django would redirect back, forever.
  skipTrailingSlashRedirect: true,
  images: { unoptimized: true },
  async rewrites() {
    return [
      { source: '/api/:path*/', destination: `${apiOrigin}/api/:path*/` },
      { source: '/api/:path*', destination: `${apiOrigin}/api/:path*` },
      { source: '/media/:path*', destination: `${apiOrigin}/media/:path*` },
    ];
  },
};

module.exports = nextConfig;
