"use server";

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const getDoctors = async () => {
  try {
    const res = await axios.get(`${API_URL}/doctors`);
    return res.data.data.map((d: any) => ({
      $id: d.id,
      name: d.name,
      image: d.avatar_url,
      speciality: d.specialty?.name || "General Medicine",
      consultationFee: d.consultation_fee_cents / 100,
      feeCents: d.consultation_fee_cents,
      email: d.email,
    }));
  } catch (error) {
    return [];
  }
};

export const createDoctor = async (doctorData: any) => {
  try {
    const res = await axios.post(`${API_URL}/admin/doctors`, {
      first_name: doctorData.name?.split(" ")[0] || "Doctor",
      last_name: doctorData.name?.split(" ").slice(1).join(" ") || "Name",
      email: doctorData.email,
      specialty_id: doctorData.specialityId,
      license_number: doctorData.licenseNumber || `LIC-${Date.now()}`,
      consultation_fee_cents: (doctorData.consultationFee || 35) * 100,
    });
    return res.data.data;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
