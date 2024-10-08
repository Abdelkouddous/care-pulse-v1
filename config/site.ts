let isLoggedIn = false;

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Pulse",
  description: "A healthcare management app ",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Doctors",
      href: "#Doctors",
    },
    {
      title: "About",
      href: "#about",
    },

    {
      title: "Ressources",
      href: "#ressources",
    },
    {
      title: "Contact",
      href: "#contact",
    },

    // isLoggedIn
    //   ? {
    //       title: "My Appointments",
    //       href: `patients/${""}/new-appointment`,
    //     }
    //   : ((isLoggedIn = true),
    //     {
    //       title: "Login",
    //       href: "/",
    //     }),
  ],
  links: {
    // twitter: "https://twitter.com/shadcn",
    // github: "https://github.com/shadcn/ui",
    // docs: "https://ui.shadcn.com",
  },
};
