import { EnvironmentManager } from "./src/config/environment";

import type { NextConfig } from "next";

const environmentManager = new EnvironmentManager(process.env);
const environment = environmentManager.getEnvironment();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CLARIVUM_ENVIRONMENT: environment.name,
  },
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

export default nextConfig;
