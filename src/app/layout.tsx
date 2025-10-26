import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400"],
});

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
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 text-slate-900 antialiased`}
      >
        <a
          href="#main-content"
          className="absolute top-4 left-4 -translate-y-16 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white focus-visible:translate-y-0 focus-visible:outline-none"
        >
          Przejdź do treści
        </a>
        {children}
      </body>
    </html>
  );
}
