import "@/styles/globals.css";
import "@/app/globals.css";

import { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// setting up text to plus jarakrta
const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s - ${siteConfig.name}` },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("font-sans antialiased", fontSans.variable)}>
        <ThemeProvider
          attribute="data-theme" // Changed from 'class' to 'data-theme'
          defaultTheme="medical-light"
          enableSystem={false}
          themes={["medical-light", "medical-dark"]}
        >
          <div className="min-h-screen">{children}</div>
          <SiteFooter></SiteFooter>
        </ThemeProvider>
      </body>
    </html>
  );
}
