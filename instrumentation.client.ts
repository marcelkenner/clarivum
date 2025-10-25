import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

if (typeof window !== "undefined") {
  const proxyUrl = process.env.NEXT_PUBLIC_OTEL_PROXY_URL ?? "/api/observability/v1/traces";

  const resource = resourceFromAttributes({
    [SemanticResourceAttributes.SERVICE_NAME]:
      process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME ?? "clarivum-web",
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
      process.env.NEXT_PUBLIC_DEPLOYMENT_ENV ?? "development",
    "clarivum.surface": "client",
  });

  const exporter = new OTLPTraceExporter({
    url: proxyUrl,
    headers: {
      "x-otel-client": "clarivum-nextjs",
    },
  });

  const provider = new WebTracerProvider({
    resource,
    spanProcessors: [new BatchSpanProcessor(exporter)],
  });

  provider.register({
    contextManager: new ZoneContextManager(),
  });

  registerInstrumentations({
    instrumentations: [
      new DocumentLoadInstrumentation({ enabled: true }),
      new FetchInstrumentation({
        enabled: true,
        propagateTraceHeaderCorsUrls: [/.*/],
        clearTimingResources: true,
      }),
    ],
  });
}
