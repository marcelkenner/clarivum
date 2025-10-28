import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clarivum · Homepage refresh in progress",
  description:
    "The Clarivum homepage is being rebuilt. Visit our other sections while we prepare the refreshed experience.",
};

export default function HomePlaceholder() {
  return (
    <main
      className="container"
      style={{
        paddingBlock: "var(--space-11)",
        textAlign: "center",
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-5)",
      }}
    >
      <h1
        className="font-display text-ink"
        style={{ fontSize: "clamp(2.75rem, 6vw, 3.75rem)", lineHeight: 1.1 }}
      >
        Homepage refresh in progress
      </h1>
      <p
        className="text-ink-soft"
        style={{ maxWidth: "min(560px, 90vw)", fontSize: "1.125rem", lineHeight: 1.5 }}
      >
        We&apos;re rebuilding the Clarivum introduction so it better reflects Skin, Fuel, and
        Habits. Explore the library, blog, or tools while we prepare the new experience.
      </p>
    </main>
  );
}
