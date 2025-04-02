import { users } from "@/lib/appwrite.config";

export type profileConfig = typeof profileConfig;

// Define the response structure from the API call
// this is the navbar content after the user logs in, u can find the specifications in the dashboard cfolder
export const profileConfig = {
  name: "Profile",
  description: "A healthcare management app ",
  mainNav: [
    { title: "My appointments", href: `my-appointments` },
    { title: "New appointment", href: "new-appointment" },
    { title: "My profile", href: "profile" },

    { title: "Edit profile", href: `edit-profile` },
    { title: "Logout", href: `/` },

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
