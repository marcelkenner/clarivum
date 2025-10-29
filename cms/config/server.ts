import type { ConfigContext } from "./types";

const serverConfig = ({ env }: ConfigContext) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
});

export default serverConfig;
