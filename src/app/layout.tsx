import "./globals.css";

import { brandSans, brandSerif } from "./fonts";

import type { Metadata } from "next";

const siteUrl = process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://clarivum.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Clarivum",
    template: "%s · Clarivum",
  },
  description:
    "Clarivum Skin, Clarivum Fuel i Clarivum Habits prowadzą mnie przez diagnostyki, zadania i guardraile w duchu fińskiego ciągłego doskonalenia opisanym w docs/PRDs/first_configuration.md.",
  openGraph: {
    title: "Clarivum",
    description:
      "W jednym miejscu dostaję narzędzia Skin, Fuel i Habits oraz jasne kroki wdrożenia — do czasu aż Strapi dostarczy finalne treści rośnie tu szkic produkcyjny.",
    url: siteUrl,
    siteName: "Clarivum",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body
        className={`${brandSans.variable} ${brandSerif.variable} bg-beige text-ink font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="bg-jade text-snow focus-visible:ring-offset-beige focus-visible:ring-jade absolute top-4 left-4 -translate-y-16 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Przejdź do treści
        </a>
        {children}
      </body>
    </html>
  );
}
