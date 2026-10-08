"use server";
import { faker } from "@faker-js/faker";
import { db } from "../db";
import { parseStringify } from "../utils";

export async function createDoctor({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    // Backend-agnostic stub: try db.create, fallback to local object
    try {
      const newDoctor = await db.doctors.create({ name, email } as any);
      return parseStringify(newDoctor);
    } catch {
      const newDoctor = {
        $id: `doctor_${faker.string.alphanumeric(12)}`,
        name,
        email,
      };
      return parseStringify(newDoctor);
    }
  } catch (error) {
    console.error("Error creating doctor:", error);
    throw error;
  }
}

// GET ALL DOCTORS AND COUNT THEM
export const getDoctorCount = async () => {
  try {
    const count = await db.doctors.count();
    return parseStringify(count ?? 0);
  } catch (error) {
    return parseStringify(0);
  }
};

export const getActiveDoctorCount = async () => {
  try {
    const count = await db.doctors.countActive();
    return parseStringify(count ?? 0);
  } catch (error) {
    return parseStringify(0);
  }
};

export const getDoctors = async () => {
  try {
    const doctors = await db.doctors.list();
    return parseStringify(doctors);
  } catch (error) {
    // Until DB is wired, return empty list so UI doesn't break
    return parseStringify([]);
  }
};
