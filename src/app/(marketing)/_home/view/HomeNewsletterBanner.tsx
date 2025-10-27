"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { dispatchAnalyticsEvent } from "@/lib/analytics/dispatch";

import type { HomeNewsletterViewModel } from "../viewmodel/HomeViewModel";

const STORAGE_KEY = "clarivum-home-newsletter-hidden-at";
const HIDE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

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
      handleDismiss();
    },
    [email, handleDismiss, segments],
  );

  const segmentationSummary = useMemo(() => {
    if (segments.length === 0) {
      return "Nie wybrano segmentu — pokażemy esencję z Skin, Fuel i Habits.";
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
    <section
      className="border-ink-soft bg-snow rounded-full border px-4 py-3 shadow-[0_24px_38px_-32px_rgba(14,15,15,0.45)]"
      role="region"
      aria-label="Newsletter Clarivum"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4"
      >
        <div className="text-ink-soft flex flex-1 flex-col gap-1 text-xs md:flex-row md:items-center md:gap-3">
          <span className="text-ink text-xs font-semibold tracking-[0.24em] uppercase">
            {viewModel.eyebrow}
          </span>
          <span className="text-ink text-sm">
            {viewModel.headline} · {viewModel.subheadline}
          </span>
          <button
            type="button"
            onClick={handleDismiss}
            className="border-ink-soft text-ink hover:border-jade hover:text-jade focus-visible:ring-jade inline-flex items-center rounded-full border px-2 py-1 text-[0.65rem] font-semibold tracking-[0.22em] uppercase transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
            aria-label="Zamknij pasek newslettera"
          >
            × {viewModel.dismissLabel}
          </button>
        </div>

        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">{viewModel.segmentationLabel}</legend>
          {viewModel.segmentation.map((segment) => {
            const isSelected = segments.includes(segment.id);
            return (
              <label
                key={segment.id}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.7rem] font-semibold tracking-[0.18em] uppercase ${
                  isSelected
                    ? "border-jade text-jade bg-[rgba(46,107,90,0.08)]"
                    : "border-ink-soft text-ink"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSegment(segment.id)}
                  className="h-3 w-3"
                  style={{ accentColor: "var(--color-jade)" }}
                />
                {segment.label}
              </label>
            );
          })}
        </fieldset>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
          <label className="sr-only">{viewModel.emailLabel}</label>
          <input
            type="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={viewModel.emailPlaceholder}
            className="border-ink-soft text-ink focus:border-jade focus-visible:ring-jade w-full rounded-full border px-4 py-2 text-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none md:w-64"
          />
          <button
            type="submit"
            className="bg-jade text-snow focus-visible:ring-jade inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-[0.22em] uppercase transition hover:bg-[#245345] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
          >
            {viewModel.submitLabel}
          </button>
        </div>
      </form>
      {segmentationSummary ? (
        <p className="text-ink-soft mt-2 text-[0.65rem] tracking-[0.18em] uppercase">
          {segmentationSummary}
        </p>
      ) : null}
      <a
        href={viewModel.privacyCopy.href}
        className="text-ink-soft hover:decoration-jade mt-1 inline-block text-[0.65rem] tracking-[0.18em] uppercase underline decoration-[rgba(46,107,90,0.25)] underline-offset-4 transition"
      >
        {viewModel.privacyCopy.label}
      </a>
    </section>
  );
}
