import { siteConfig } from "@/config/site";

import { MainNav } from "@/components/main-nav";

export function SiteHeader() {
  return (
    <>
      <MainNav items={siteConfig.mainNav} />
    </>
  );
}
