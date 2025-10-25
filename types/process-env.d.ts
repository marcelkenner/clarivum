declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_OTEL_SERVICE_NAME?: string;
    NEXT_PUBLIC_DEPLOYMENT_ENV?: string;
    NEXT_PUBLIC_OTEL_PROXY_URL?: string;
    NEXT_PUBLIC_OTEL_SERVICE_NAME?: string;
    NEXT_PUBLIC_APP_VERSION?: string;
    NEXT_RUNTIME?: string;
    NEXT_OTEL_LAMBDA_SERVICE?: string;
    VERCEL_ENV?: string;
    VERCEL_REGION?: string;
    VERCEL_URL?: string;
    VERCEL_GIT_COMMIT_SHA?: string;
    DEPLOYMENT_ENV?: string;
    CLARIVUM_VERTICAL?: string;
    CLARIVUM_ENV_OWNER?: string;
    GIT_COMMIT?: string;
    INSTANCE_ID?: string;
    HOSTNAME?: string;
    AWS_REGION?: string;
    NODE_ENV?: string;
    OTEL_DIAG_LOG_LEVEL?: string;
    OTEL_TRACE_RATIO?: string;
    OTEL_TRACES_SAMPLER_ARG?: string;
    OTEL_METRIC_EXPORT_INTERVAL?: string;
    OTEL_EXPORTER_OTLP_ENDPOINT?: string;
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT?: string;
    OTEL_EXPORTER_OTLP_METRICS_ENDPOINT?: string;
    OTEL_EXPORTER_OTLP_LOGS_ENDPOINT?: string;
    GRAFANA_OTLP_ENDPOINT?: string;
    GRAFANA_OTLP_USERNAME?: string;
    GRAFANA_OTLP_PASSWORD?: string;
    GRAFANA_OTLP_BASIC_AUTH?: string;
  }
}
