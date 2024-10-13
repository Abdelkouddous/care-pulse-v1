import "@/styles/globals.css";
import "@/app/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
// import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider";
import { SiteFooter } from "@/components/site-footer";

//setting up text to plus jarakrta
const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
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
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased fade-in-page",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className=" flex flex-col w-screen relative ">
            <div
              className=" sticky top-0 z-50 w-screen 
            
            
            "
            >
              <SiteHeader />
            </div>

            {children}

            {/* <SiteFooter></SiteFooter> */}
          </div>
          {/* <TailwindIndicator /> */}
        </ThemeProvider>
        <div className=" min-h-full min-w-screen bottom-0 flex justify-center items-center mt-2  ">
          <SiteFooter></SiteFooter>
        </div>
      </body>
    </html>
  );
}
