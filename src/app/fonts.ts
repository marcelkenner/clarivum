import { Cormorant_Garamond, Inter } from "next/font/google";

export const brandSans = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-clarivum-sans",
});

export const brandSerif = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-clarivum-serif",
});
