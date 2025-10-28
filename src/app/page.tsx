import { HomepageStructuredData, homepageMetadata } from "@/lib/seo/routes/homepage";

export const metadata = homepageMetadata;

export default function HomePlaceholder() {
  return (
    <>
      <HomepageStructuredData />
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
          Tools-first Clarivum start
        </h1>
        <p
          className="text-ink-soft"
          style={{ maxWidth: "min(560px, 90vw)", fontSize: "1.125rem", lineHeight: 1.5 }}
        >
          Zbieramy wszystkie guardraile z Skin, Fuel i Habits w jeden plan. Przejdź do narzędzi,
          ebooków lub bibliotek i wróć tu na launch sprintu 02.
        </p>
      </main>
    </>
  );
}
