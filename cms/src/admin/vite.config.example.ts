import { mergeConfig, type UserConfig } from "vite";

const configureStrapiAdminVite = (config: UserConfig) =>
  mergeConfig(config, {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  });

export default configureStrapiAdminVite;
