"use server";

export const getAdmin = async (adminId: string) => {
  return {
    $id: adminId,
    adminName: "Mock Admin",
    role: "Administrator",
  };
};
