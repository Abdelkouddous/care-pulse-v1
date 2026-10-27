import {
  Inter as FontSans,
  Poppins as FontHeading,
  Cairo as FontArabicHeading,
  IBM_Plex_Sans_Arabic as FontArabicBody,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontHeading = FontHeading({
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const fontArabicHeading = FontArabicHeading({
  subsets: ["arabic"],
  variable: "--font-arabic-heading",
  display: "swap",
});

export const fontArabicBody = FontArabicBody({
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic-body",
  display: "swap",
});
