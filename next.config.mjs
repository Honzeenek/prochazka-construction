/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // real photos are downloaded into /public, so no remote patterns needed
    formats: ['image/avif', 'image/webp'],
  },
  // Allow the site to be embedded in an iframe (e.g. preview / aside browser).
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: 'frame-ancestors *' }],
      },
    ];
  },
};
export default nextConfig;
