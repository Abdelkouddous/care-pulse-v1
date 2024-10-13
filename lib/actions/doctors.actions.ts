"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

import {
  DATABASE_ID,
  databases,
  DOCTOR_COLLECTION_ID,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";

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

//GET ALL ACTIVE DOCTORS
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
//GET DOCTORS NAMES
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
