import { withSentryConfig } from "@sentry/nextjs";

import { EnvironmentManager } from "./src/config/environment";

import type { NextConfig } from "next";

const environmentManager = new EnvironmentManager(process.env);
const environment = environmentManager.getEnvironment();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CLARIVUM_ENVIRONMENT: environment.name,
  },
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/skin/blog/:category/:slug",
        destination: "/skin/:category/:slug",
        permanent: true,
      },
      { source: "/skin/blog/:category", destination: "/skin/:category", permanent: true },
      {
        source: "/fuel/blog/:category/:slug",
        destination: "/fuel/:category/:slug",
        permanent: true,
      },
      { source: "/fuel/blog/:category", destination: "/fuel/:category", permanent: true },
      {
        source: "/habits/blog/:category/:slug",
        destination: "/habits/:category/:slug",
        permanent: true,
      },
      { source: "/habits/blog/:category", destination: "/habits/:category", permanent: true },
      { source: "/ebooks/nutrition/:path*", destination: "/ebooks/fuel/:path*", permanent: true },
      { source: "/ebooks/health/:path*", destination: "/ebooks/habits/:path*", permanent: true },
      {
        source: "/narzedzia/nutrition/:path*",
        destination: "/narzedzia/fuel/:path*",
        permanent: true,
      },
      {
        source: "/narzedzia/health/:path*",
        destination: "/narzedzia/habits/:path*",
        permanent: true,
      },
    ];
  },
  serverExternalPackages: [
    "@tailwindcss/postcss",
    "lightningcss",
    "lightningcss-linux-x64-gnu",
    "lightningcss-linux-x64-musl",
  ],
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "dailydoses-4t",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env["CI"],

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
