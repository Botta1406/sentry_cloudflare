/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    instrumentationHook: true,
  },
};

module.exports = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Suppresses source map uploading during build
  silent: true,

  // For resolving JavaScript modules into source maps in Error Stack-Trace
  // See https://docs.sentry.io/product/cli/releases/ for more info.
  org: "o4510198858579968",
  project: "4510243129655296",

  // An auth token is required for uploading source maps.
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only print logs for uploading source maps
  dryRun: true,

  // Upload source maps
  sourceMaps: {
    disable: true,
    deleteSourcemapsAfterUpload: false,
  },
});