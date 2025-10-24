import { EnvironmentManager } from "./src/config/environment";

import type { NextConfig } from "next";

const environmentManager = new EnvironmentManager(process.env);
const environment = environmentManager.getEnvironment();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CLARIVUM_ENVIRONMENT: environment.name,
  },
  serverExternalPackages: [
    "@tailwindcss/postcss",
    "lightningcss",
    "lightningcss-linux-x64-gnu",
    "lightningcss-linux-x64-musl",
  ],
};

export default nextConfig;
