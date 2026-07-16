/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // real photos are downloaded into /public, so no remote patterns needed
    formats: ['image/avif', 'image/webp'],
  },
};
export default nextConfig;
