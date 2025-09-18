// next.config.js
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // ✅ for app/ router projects
  },
};

export default withPWA(nextConfig);
