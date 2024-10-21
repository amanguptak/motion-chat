/** @type {import('next').NextConfig} */

export default {
  reactStrictMode: false,
  exportPathMap: async function (defaultConfig, { dev, dir, outDir }) {
    // ... (Optional: Handle export paths if needed)
  },
  // ... (Other Next.js configuration options)
  images: {
    domains: ['herobot.app','cdn-icons-png.flaticon.com','cdn.myanimelist.net'],  // Add other domains as needed
  },
  // Adding the proxy configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.jikan.moe/v4/:path*',
      },
    ];
  },
};

