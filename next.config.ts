import { EnvironmentManager } from "./src/config/environment";

import type { NextConfig } from "next";

const environmentManager = new EnvironmentManager(process.env);
const environment = environmentManager.getEnvironment();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CLARIVUM_ENVIRONMENT: environment.name,
  },
};

export default nextConfig;
