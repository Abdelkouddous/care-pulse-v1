import BRAND_CONFIG from "./brand.config";

export const siteConfig = {
  name: BRAND_CONFIG.app.name,
  nameArabic: BRAND_CONFIG.app.nameArabic,
  description: BRAND_CONFIG.app.description,
  company: BRAND_CONFIG.company.name,
  mainNav: [
    {
      title: "How it works",
      href: "/#how-it-works",
    },
    {
      title: "Doctors",
      href: "/#doctors",
    },
    {
      title: "Clinics",
      href: "/#clinics",
    },
    {
      title: "Pricing",
      href: "/#pricing",
    },
    {
      title: "Contact",
      href: "/#contact",
    },
  ],
  links: {
    support: `mailto:${BRAND_CONFIG.company.supportEmail}`,
    contact: `mailto:${BRAND_CONFIG.company.contactEmail}`,
  },
};

export default siteConfig;
