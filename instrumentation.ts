import { registerOTel } from "@vercel/otel";

import { readTelemetryConfig } from "./observability/config";

export async function register() {
  const config = readTelemetryConfig();

  registerOTel({
    serviceName: config.serviceName,
  });

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation.node");
  }
}
