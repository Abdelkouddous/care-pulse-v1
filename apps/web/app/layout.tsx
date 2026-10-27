import "@/app/globals.css";

import { Metadata, Viewport } from "next";
import {
  fontSans,
  fontHeading,
  fontArabicHeading,
  fontArabicBody,
} from "@/lib/fonts";

import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import BRAND_CONFIG from "@/config/brand.config";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#008668" },
    { media: "(prefers-color-scheme: dark)", color: "#0B131E" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(`https://${BRAND_CONFIG.domains.web}`),
  title: {
    default: "Wateen Book (وتين بوك) — Prise de Rendez-vous Médicaux (Alger & Tébessa)",
    template: "%s | Wateen Book — WateenSoft",
  },
  description:
    "Wateen Book (وتين بوك) par WateenSoft. Prenez rendez-vous en ligne avec des médecins vérifiés et centres de santé à Alger et Tébessa. 100% gratuit pour les patients.",
  keywords: [
    "wateen book",
    "wateensoft",
    "وتين بوك",
    "وتين سوفت",
    "rendez-vous médecin algérie",
    "docteur alger",
    "docteur tébessa",
    "clinique alger",
    "carte chifa",
    "santé algérie",
    "طبيب الجزائر",
    "حجز موعد طبيب",
  ],
  authors: [{ name: "WateenSoft HealthTech Solutions" }],
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    alternateLocale: ["ar_DZ", "en_DZ"],
    url: `https://${BRAND_CONFIG.domains.web}`,
    title: "Wateen Book (وتين بوك) — Plateforme Médicale & Clinique",
    description:
      "Trouvez votre spécialiste et réservez votre consultation en clinique ou téléconsultation à Alger et Tébessa avec Wateen Book.",
    siteName: "Wateen Book",
  },
  alternates: {
    canonical: `https://${BRAND_CONFIG.domains.web}`,
    languages: {
      "fr-DZ": `https://${BRAND_CONFIG.domains.web}?lang=fr`,
      "ar-DZ": `https://${BRAND_CONFIG.domains.web}?lang=ar`,
      "en-DZ": `https://${BRAND_CONFIG.domains.web}?lang=en`,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Wateen Book",
  alternateName: "وتين بوك",
  url: `https://${BRAND_CONFIG.domains.web}`,
  logo: `https://${BRAND_CONFIG.domains.web}/assets/icons/logo-icon.svg`,
  email: BRAND_CONFIG.company.contactEmail,
  telephone: "+213549882456",
  areaServed: ["Alger", "Tébessa"],
  priceRange: "0 DA - 4500 DA",
  description:
    "Wateen Book par WateenSoft: Plateforme algérienne de prise de rendez-vous médicaux et gestion clinique à Alger et Tébessa.",
  parentOrganization: {
    "@type": "Organization",
    name: "WateenSoft",
    url: BRAND_CONFIG.company.website,
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "DZ",
    addressLocality: "Alger",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={cn(
          "font-sans antialiased min-h-screen bg-background text-foreground",
          fontSans.variable,
          fontHeading.variable,
          fontArabicHeading.variable,
          fontArabicBody.variable
        )}
      >
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            themes={["light", "dark"]}
          >
            <LanguageProvider>
              <div className="min-h-screen flex flex-col">{children}</div>
            </LanguageProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
