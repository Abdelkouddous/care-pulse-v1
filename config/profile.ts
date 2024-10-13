import React from "react";
import {
  getRecentAppointmentsForPatient,
  deleteAppointment,
} from "@/lib/actions/appointment.actions";
import { users } from "@/lib/appwrite.config";

export const profile = {
  name: "Pulse",
  description: "A healthcare management app ",
  mainNav: [
    {
      title: "My profile",
      href: "/profile",
    },

    {
      title: "My appointments",
      href: `patients/${users.get}/new-appointment`,
    },

    {
      title: "Edit profile",
      href: `patients/${users.get}/new-appointment`,
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
