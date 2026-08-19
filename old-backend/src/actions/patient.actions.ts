"use server";
import { faker } from "@faker-js/faker";

import { db } from "../db";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  try {
    // Backend-agnostic stub: generate a fake user id and return minimal shape
    const fakeUser = {
      $id: `user_${faker.string.alphanumeric(12)}`,
      name: user.name,
      phone: user.phone,
    };

    // Attempt to check registration status via db adapter (will throw until implemented)
    let isRegistered = false;
    try {
      const patient = await getPatient(fakeUser.$id);
      isRegistered = !!patient;
    } catch {
      isRegistered = false;
    }

    return parseStringify({ ...fakeUser, isRegistered });
  } catch (error: any) {
    console.error("An error occurred while creating a new user:", error);
  }
};

// GET PATIENT from database
export const getPatient = async (userId: string) => {
  try {
    const patient = await db.patients.findByUserId(userId);
    return parseStringify(patient);
  } catch (error) {
    // Railway DB not wired yet, return null to indicate no patient found
    return null;
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // Backend-agnostic stub: try db.create, fallback to local object
    try {
      const newPatient = await db.patients.create({
        ...patient,
        // For now, ignore file handling; will wire when Railway storage is ready
      } as any);
      return parseStringify(newPatient);
    } catch {
      const newPatient = {
        $id: `patient_${faker.string.alphanumeric(12)}`,
        userId: patient.userId,
        name: patient.name,
        phone: patient.phone,
        primaryPhysician: patient.primaryPhysician,
      };
      return parseStringify(newPatient);
    }
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT COUNT
export const getPatientCount = async () => {
  try {
    const count = await db.patients.count();
    return count ?? 0;
  } catch (error) {
    // Return 0 until Railway DB is wired
    return 0;
  }
};
