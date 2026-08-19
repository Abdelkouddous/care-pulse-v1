"use server";

import { Doctors } from "@/constants";

// Mock Doctor Actions

export const createDoctor = async (data: any) => {
  return {
    $id: `mock_doctor_${Date.now()}`,
    ...data,
  };
};

export const getDoctorCount = async () => {
  return Doctors.length;
};

export const getActiveDoctorCount = async () => {
  return Math.floor(Doctors.length * 0.8);
};

export const getDoctors = async () => {
  // Return the static list mapped to mock DB format
  return Doctors.map((doc, idx) => ({
    $id: `doc_${idx}`,
    name: doc.name,
    email: `${doc.name.toLowerCase().replace(" ", ".")}@mock.com`,
    image: doc.image,
    speciality: doc.speciality,
    rating: doc.rating,
  }));
};
