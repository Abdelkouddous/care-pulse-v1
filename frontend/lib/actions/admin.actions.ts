"use server";

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const getAdmin = async (adminId: string) => {
  return {
    $id: adminId,
    name: "CarePulse Admin",
    email: "admin@carepulse.com",
    role: "super_admin",
  };
};
