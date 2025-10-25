import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

export type TelemetryConfig = {
  serviceName: string;
  deploymentEnvironment: string;
  vertical: string;
  baseOtlpEndpoint: string;
  traceEndpoint: string;
  metricsEndpoint: string;
  logsEndpoint: string;
  samplerRatio: number;
  metricIntervalMs: number;
  basicAuthToken: string | undefined;
};

const DEFAULT_BASE_ENDPOINT = "https://otlp.grafana.com";

export function readTelemetryConfig(): TelemetryConfig {
  const serviceName = process.env.NEXT_OTEL_SERVICE_NAME ?? "clarivum-web";
  const deploymentEnvironment =
    process.env.NEXT_PUBLIC_DEPLOYMENT_ENV ??
    process.env.VERCEL_ENV ??
    process.env.DEPLOYMENT_ENV ??
    process.env.NODE_ENV ??
    "development";
  const vertical = process.env.CLARIVUM_VERTICAL ?? "platform";
  const base =
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
    process.env.GRAFANA_OTLP_ENDPOINT ??
    DEFAULT_BASE_ENDPOINT;

  const username = process.env.GRAFANA_OTLP_USERNAME;
  const password = process.env.GRAFANA_OTLP_PASSWORD;
  const explicitBasic = process.env.GRAFANA_OTLP_BASIC_AUTH;
  const basicAuthToken =
    explicitBasic ??
    (username && password ? Buffer.from(`${username}:${password}`).toString("base64") : undefined);

  const samplerRatio = parseFloat(
    process.env.OTEL_TRACE_RATIO ?? process.env.OTEL_TRACES_SAMPLER_ARG ?? "0.2",
  );

  return {
    serviceName,
    deploymentEnvironment,
    vertical,
    baseOtlpEndpoint: base,
    traceEndpoint: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ?? `${base}/v1/traces`,
    metricsEndpoint: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT ?? `${base}/v1/metrics`,
    logsEndpoint: process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT ?? `${base}/v1/logs`,
    samplerRatio: Number.isNaN(samplerRatio) ? 0.2 : samplerRatio,
    metricIntervalMs: Number(process.env.OTEL_METRIC_EXPORT_INTERVAL ?? "60000"),
    basicAuthToken,
  };
}

export function buildResourceAttributes(config: TelemetryConfig) {
  const attributes: Record<string, string> = {
    [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.deploymentEnvironment,
    "clarivum.vertical": config.vertical,
    "clarivum.surface": "next-app",
  };

  const version =
    process.env.NEXT_PUBLIC_APP_VERSION ??
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.GIT_COMMIT;
  const region = process.env.VERCEL_REGION ?? process.env.AWS_REGION;
  const instanceId = process.env.VERCEL_URL ?? process.env.INSTANCE_ID ?? process.env.HOSTNAME;

  if (version) {
    attributes[SemanticResourceAttributes.SERVICE_VERSION] = version;
  }

  if (region) {
    attributes["cloud.region"] = region;
  }

  if (instanceId) {
    attributes[SemanticResourceAttributes.SERVICE_INSTANCE_ID] = instanceId;
  }

  return attributes;
}
