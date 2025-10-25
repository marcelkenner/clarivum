import { SpanStatusCode, context as otelContext, metrics, trace } from "@opentelemetry/api";

import { ensureNodeSDK } from "../../observability/node-sdk";

import type { Context, SQSEvent } from "aws-lambda";

const sdk = ensureNodeSDK({
  serviceName: process.env.NEXT_OTEL_LAMBDA_SERVICE ?? "clarivum-lambda",
});

void sdk.start();

const tracer = trace.getTracer("clarivum.lambda.worker");
const meter = metrics.getMeter("clarivum.lambda.worker");

const messageCounter = meter.createCounter("worker.messages.processed", {
  description: "Number of queue messages processed per invocation",
});

const latencyHistogram = meter.createHistogram("worker.latency.ms", {
  description: "End-to-end processing latency per invocation",
});

export function withTelemetry<Event, Result>(
  operation: string,
  handler: (event: Event, context: Context) => Promise<Result>,
) {
  return async (event: Event, context: Context) =>
    tracer.startActiveSpan(operation, async (span) => {
      const start = Date.now();
      span.setAttribute("aws.lambda.request_id", context.awsRequestId);
      span.setAttribute("clarivum.worker.operation", operation);
      try {
        const result = await handler(event, context);
        messageCounter.add(
          Array.isArray((event as SQSEvent).Records) ? (event as SQSEvent).Records.length : 1,
          {
            operation,
          },
        );
        return result;
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        logWithTraceContext("worker_error", {
          operation,
          error: (error as Error).message,
        });
        throw error;
      } finally {
        span.end();
        latencyHistogram.record(Date.now() - start, { operation });
      }
    });
}

export function logWithTraceContext(message: string, fields?: Record<string, unknown>) {
  const activeSpan = trace.getSpan(otelContext.active());
  const spanContext = activeSpan?.spanContext();
  console.warn(
    JSON.stringify({
      severity: "INFO",
      message,
      traceId: spanContext?.traceId,
      spanId: spanContext?.spanId,
      ...fields,
    }),
  );
}

export const handler = withTelemetry<SQSEvent, void>("process-mission-events", async (event) => {
  for (const record of event.Records ?? []) {
    await tracer.startActiveSpan("mission-event", async (span) => {
      span.setAttribute("sqs.message_id", record.messageId);
      span.setAttribute("sqs.queue_arn", record.eventSourceARN ?? "unknown");
      logWithTraceContext("processing_message", {
        recordId: record.messageId,
      });
      // TODO: invoke mission business logic here.
      span.end();
    });
  }
});
