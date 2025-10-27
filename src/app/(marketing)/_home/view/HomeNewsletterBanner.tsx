"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { dispatchAnalyticsEvent } from "@/lib/analytics/dispatch";

import type { HomeNewsletterViewModel } from "../viewmodel/HomeViewModel";

const STORAGE_KEY = "clarivum-home-newsletter-hidden-at";
const HIDE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 dni

type HomeNewsletterBannerProps = {
  viewModel: HomeNewsletterViewModel;
};

export function HomeNewsletterBanner({ viewModel }: HomeNewsletterBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [segments, setSegments] = useState<string[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    const hiddenAt = Number.parseInt(stored, 10);
    if (Number.isFinite(hiddenAt) && Date.now() - hiddenAt < HIDE_DURATION_MS) {
      setIsVisible(false);
    }
  }, []);

  const toggleSegment = useCallback((segmentId: string) => {
    setSegments((current) => {
      if (current.includes(segmentId)) {
        return current.filter((id) => id !== segmentId);
      }
      return [...current, segmentId];
    });
  }, []);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    dispatchAnalyticsEvent("HomepageNewsletterDismissed", {});
    window.localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      dispatchAnalyticsEvent("HomepageNewsletterSubmitted", {
        segments,
        emailProvided: email.trim().length > 0,
      });
      // Placeholder: actual ESP integration lands with TSK-MKT-004.
      handleDismiss();
    },
    [email, handleDismiss, segments],
  );

  const segmentationSummary = useMemo(() => {
    if (segments.length === 0) {
      return "Nie wybrano segmentu — podpowiemy najważniejsze nowości z wszystkich pionów.";
    }

    if (segments.length === 1) {
      const segment = viewModel.segmentation.find((item) => item.id === segments[0]);
      return segment ? `Priorytet: ${segment.label}` : null;
    }

    return `Priorytet: ${segments.length} segmenty — dopasujemy treści.`;
  }, [segments, viewModel.segmentation]);

  if (!isVisible) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="flex-1 space-y-1">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {viewModel.eyebrow}
          </p>
          <h2 className="text-lg font-semibold text-slate-900 md:text-xl">{viewModel.headline}</h2>
          <p className="text-sm text-slate-600">{viewModel.subheadline}</p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="self-start rounded-full border border-slate-300 px-4 py-1 text-xs font-semibold text-slate-500 transition hover:border-slate-900 hover:text-slate-900"
          aria-label="Zamknij pasek newslettera"
        >
          {viewModel.dismissLabel}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:gap-6"
      >
        <fieldset className="flex-1 space-y-2">
          <legend className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {viewModel.segmentationLabel}
          </legend>
          <div className="flex flex-wrap gap-2">
            {viewModel.segmentation.map((segment) => {
              const isSelected = segments.includes(segment.id);
              return (
                <button
                  key={segment.id}
                  type="button"
                  onClick={() => toggleSegment(segment.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    isSelected
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300 text-slate-900 hover:border-slate-900"
                  }`}
                  aria-pressed={isSelected}
                >
                  {segment.label}
                </button>
              );
            })}
          </div>
          {segmentationSummary ? (
            <p className="text-xs text-slate-500">{segmentationSummary}</p>
          ) : null}
        </fieldset>

        <div className="flex flex-1 flex-col gap-2 md:max-w-xs">
          <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {viewModel.emailLabel}
          </label>
          <input
            type="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={viewModel.emailPlaceholder}
            className="w-full rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
          />
          <a
            href={viewModel.privacyCopy.href}
            className="text-xs text-slate-500 underline decoration-slate-300 underline-offset-2 transition hover:decoration-slate-900"
          >
            {viewModel.privacyCopy.label}
          </a>
        </div>

        <button
          type="submit"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 md:self-center"
        >
          {viewModel.submitLabel}
        </button>
      </form>
    </section>
  );
}
