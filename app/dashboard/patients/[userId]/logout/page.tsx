"use client";
import { useRouter } from "next/navigation";
import React from "react";

const logout = () => {
  const router = useRouter();
  // Clear the session cookies
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

  // Redirect to the login page
  router.push("/");

  // Return a success message
  return <div>Logged out successfully!</div>;
};

export default logout;
