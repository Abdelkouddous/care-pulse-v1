// lib/profile-config.ts

import { logout } from "@/lib/auth";

// Define a type for navigation items
type NavItem = {
  title: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  external?: boolean;
};

export type ProfileConfig = {
  name: string;
  description: string;
  mainNav: NavItem[];
  links: Record<string, string>;
};

// Define the profile configuration
export const profileConfig: ProfileConfig = {
  name: "Profile",
  description: "A healthcare management app",
  mainNav: [
    { title: "My appointments", href: `my-appointments` },
    { title: "New appointment", href: "new-appointment" },
    { title: "My profile", href: "profile" },
    { title: "Edit profile", href: `edit-profile` },
    {
      title: "Logout",
      onClick: logout, // Use the logout function instead of a href
    },
  ],
  links: {
    // twitter: "https://twitter.com/shadcn",
    // github: "https://github.com/shadcn/ui",
    // docs: "https://ui.shadcn.com",
  },
};

export default profileConfig;
