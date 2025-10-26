import { Cormorant_Garamond } from "next/font/google";

export const documentSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-document-serif",
  display: "swap",
});
