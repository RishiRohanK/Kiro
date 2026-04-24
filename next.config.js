const { withWorkflow } = require("workflow/next");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

module.exports = withWorkflow(withPWA({
  reactStrictMode: true,
  poweredByHeader: false, // Security: Remove X-Powered-By header
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ik.imagekit.io' },
      { protocol: 'https', hostname: 'thumbs.dreamstime.com' },
      { protocol: 'https', hostname: 'www.usnews.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  experimental: {
    // Enable any relevant security features if available
  },
  turbopack: {},
}));

