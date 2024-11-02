import { users } from "@/lib/appwrite.config";

export type profileConfig = typeof profileConfig;

// Define the response structure from the API call
export const profileConfig = {
  name: "Profile",
  description: "A healthcare management app ",
  mainNav: [
    {
      title: "My profile",
      href: "profile",
    },

    {
      title: "My appointments",
      href: `my-appointments`,
    },

    {
      title: "Edit profile",
      href: `edit-profile`,
    },
    {
      title: "Logout",
      href: `logout`,
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

export default profileConfig;
