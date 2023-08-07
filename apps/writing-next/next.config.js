const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    typedRoutes: true,
  },

  /**
   * Run locally installed packages (e.g. from this monorepo) through webpack/bable/swc/etc
   */
  transpilePackages: ['@libs', '@marbemac'],
};

module.exports = withBundleAnalyzer(nextConfig);
