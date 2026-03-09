import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {}, // Silence Turbopack warning for webpack config from next-pwa
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: false,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  cacheOnFrontEndNav: true,
  reloadOnOnline: false
})(nextConfig);
