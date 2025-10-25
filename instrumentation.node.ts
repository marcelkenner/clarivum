import { ensureNodeSDK, shutdownNodeSDK } from "./observability/node-sdk";

const sdk = ensureNodeSDK();

try {
  sdk.start();
  if (process.env.NODE_ENV !== "production") {
    console.warn("[otel] NodeSDK started");
  }
} catch (error) {
  console.error("[otel] failed to start NodeSDK", error);
}

const signals: NodeJS.Signals[] = ["SIGTERM", "SIGINT"];

signals.forEach((signal) => {
  process.once(signal, () => {
    shutdownNodeSDK()
      .then(() => process.exit(0))
      .catch((error: unknown) => {
        console.error("[otel] shutdown error", error);
        process.exit(1);
      });
  });
});
