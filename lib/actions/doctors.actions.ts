"use server";
import { ID, Query } from "node-appwrite";

import {
  DATABASE_ID,
  databases,
  DOCTOR_COLLECTION_ID,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// export const enum Speciality {
//   CARDIO = "Cardiologist",
//   OPHTALMO = "Ophtalmologist",
//   ORTHO = "Orthopedic Surgeon",
//   PEDIATRICS = "Pediatrician",
//   GENERAL_PRACTITIONER = "General Practitioner",
//   DENTIST = "Dentist",
//   GYNAECOLOGY = "Gynaecologist",
//   NEUROLOGY = "Neurologist",
//   GASTRO = "Gastrologist",
// }
export async function createDoctor({
  name,
  email,
  password,
  // specialty,
}: {
  name: string;
  email: string;
  password: string;
  // specialty: Speciality;
}) {
  try {
    // Create the doctor user
    const newDoctor = await users.create(ID.unique(), email, password, name);

    // Add doctor details (including specialty) to the database
    await databases.createDocument(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      newDoctor.$id,
      { name, email }
      // specialty }
    );

    return newDoctor;
  } catch (error) {
    console.error("Error creating doctor:", error);
    throw error;
  }
}
// GET ALL DOCTORS AND COUNT THEM
export const getDoctorCount = async () => {
  try {
    const appointment = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!
    );

    return parseStringify(appointment.total);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing doctors count",
      error
    );
  }
};

export const getActiveDoctorCount = async () => {
  try {
    const appointment = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      [Query.equal("isActive", [true])]
    );
    console.log(appointment.total);
    return parseStringify(appointment.total);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing doctors count",
      error
    );
  }
};

export const getDoctors = async () => {
  try {
    const appointment = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_COLLECTION_ID!,
      [Query.equal("doctorName", true)]
    );
    console.log(appointment.total);
    return parseStringify(appointment.total);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing doctors count",
      error
    );
  }
};
