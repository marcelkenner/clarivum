"use client";

import { useReportWebVitals } from "next/web-vitals";

import { dispatchAnalyticsEvent } from "@/lib/analytics/dispatch";

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    dispatchAnalyticsEvent("WebVitalsMetric", {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      navigationType: metric.navigationType ?? "navigate",
    });
  });

  return null;
}
