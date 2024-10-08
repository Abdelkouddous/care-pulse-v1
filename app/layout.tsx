// import type { Metadata } from "next";
// import "./globals.css";
// import { Plus_Jakarta_Sans as FontSans } from "next/font/google";
// import { ThemeProvider } from "next-themes";

// import { cn } from "@/lib/utils";

// const fontSans = FontSans({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   variable: "--font-sans",
// });

// export const metadata: Metadata = {
//   title: "CarePulse",
//   description:
//     "A healthcare patient management System designed to streamline patient registration, appointment scheduling, and medical records management for healthcare providers.",
//   icons: {
//     icon: "/assets/icons/logo-icon.svg",
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={cn(
//           "min-h-screen bg-dark-300 font-sans antialiased",
//           fontSans.variable
//         )}
//       >
//         <ThemeProvider attribute="class" defaultTheme="dark">
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

import "@/styles/globals.css";
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
          <div className=" flex flex-col max-w-screen fade-in-page">
            <SiteHeader />

            {children}

            {/* <SiteFooter></SiteFooter> */}
          </div>
          {/* <TailwindIndicator /> */}
        </ThemeProvider>
        <div className=" min-h-full min-w-screen bottom-0 flex justify-center items-center mt-2 ">
          <SiteFooter></SiteFooter>
        </div>
      </body>
    </html>
  );
}
