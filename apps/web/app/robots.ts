import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/doctors/dashboard/", "/patient/dashboard/"],
    },
    sitemap: "https://vitabook.dz/sitemap.xml",
  };
}
