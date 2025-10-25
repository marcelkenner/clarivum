import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";

import { buildResourceAttributes, readTelemetryConfig } from "./config";

import type { TelemetryConfig } from "./config";

const DiagLogLevelMap: Record<string, DiagLogLevel> = {
  ALL: DiagLogLevel.ALL,
  VERBOSE: DiagLogLevel.VERBOSE,
  DEBUG: DiagLogLevel.DEBUG,
  INFO: DiagLogLevel.INFO,
  WARN: DiagLogLevel.WARN,
  ERROR: DiagLogLevel.ERROR,
  NONE: DiagLogLevel.NONE,
};

let sdk: NodeSDK | undefined;

const diagLevel = (process.env.OTEL_DIAG_LOG_LEVEL as keyof typeof DiagLogLevelMap) ?? "ERROR";

export function ensureNodeSDK(configOverrides?: Partial<TelemetryConfig>) {
  if (sdk) {
    return sdk;
  }

  const config = { ...readTelemetryConfig(), ...configOverrides };

  diag.setLogger(new DiagConsoleLogger(), DiagLogLevelMap[diagLevel] ?? DiagLogLevel.ERROR);

  const authorizationHeader = config.basicAuthToken ? `Basic ${config.basicAuthToken}` : undefined;

  sdk = new NodeSDK({
    resource: resourceFromAttributes(buildResourceAttributes(config)),
    traceExporter: new OTLPTraceExporter(
      authorizationHeader
        ? { url: config.traceEndpoint, headers: { Authorization: authorizationHeader } }
        : { url: config.traceEndpoint },
    ),
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-fs": {
          enabled: false,
        },
        "@opentelemetry/instrumentation-http": {
          ignoreIncomingRequestHook: (request) => request.headers["x-telemetry-ignore"] === "true",
        },
      }),
    ],
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter(
        authorizationHeader
          ? { url: config.metricsEndpoint, headers: { Authorization: authorizationHeader } }
          : { url: config.metricsEndpoint },
      ),
      exportIntervalMillis: config.metricIntervalMs,
    }),
    logRecordProcessor: new BatchLogRecordProcessor(
      new OTLPLogExporter(
        authorizationHeader
          ? { url: config.logsEndpoint, headers: { Authorization: authorizationHeader } }
          : { url: config.logsEndpoint },
      ),
    ),
  });

  return sdk;
}

export async function shutdownNodeSDK() {
  if (!sdk) return;

  await sdk.shutdown();
  sdk = undefined;
}
