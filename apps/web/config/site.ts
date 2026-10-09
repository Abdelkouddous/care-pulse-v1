export const siteConfig = {
  name: "VitalBook",
  description: "VitalBook — Enterprise Healthcare Appointment & Practice Management Platform by Vital Soft",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },

    {
      title: "About",
      href: "/#about",
    },
    {
      title: "Doctors",
      href: "/#doctors",
    },
    {
      title: "Services",
      href: "/#services",
    },
    {
      title: "Contact",
      href: "/#contact",
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
export default siteConfig;
