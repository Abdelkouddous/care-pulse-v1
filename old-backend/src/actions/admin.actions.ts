"use server";
import { parseStringify } from "../utils";
import { db } from "../db";

export const getAdmin = async (adminId: string) => {
  try {
    const admin = await db.admins.findByAdminId(adminId);
    return parseStringify(admin) || null;
  } catch (err) {
    console.error("Error fetching admin:", err);
    return null;
  }
};
