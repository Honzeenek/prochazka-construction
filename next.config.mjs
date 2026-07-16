// basePath/assetPrefix are set only for the GitHub Pages build (project pages
// live under /<repo>/). Local dev and root deploys leave it empty.
const basePath = process.env.PAGES_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // static HTML export — deployable to GitHub Pages
  trailingSlash: true, // emit /route/index.html so Pages serves clean URLs
  images: {
    unoptimized: true, // required for static export (no server image optimizer)
    formats: ['image/avif', 'image/webp'],
  },
  // Exposed to client components so next/image src can carry the basePath.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};
export default nextConfig;
