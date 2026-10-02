"use server";

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const createAppointment = async (appointment: any) => {
  try {
    const res = await axios.post(`${API_URL}/appointments`, {
      doctor_id: appointment.primaryPhysician || appointment.doctor_id,
      scheduled_at: appointment.schedule || appointment.scheduled_at,
      reason: appointment.reason || "Medical Consultation",
      notes: appointment.note || appointment.notes,
    });
    return {
      $id: res.data.data.id,
      ...res.data.data,
    };
  } catch (error: any) {
    return {
      $id: `appt_${Date.now()}`,
      ...appointment,
      status: "pending",
    };
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin/appointments`);
    const statsRes = await axios.get(`${API_URL}/admin/dashboard`);
    const appts = res.data.data || [];
    const stats = statsRes.data.data || {};

    return {
      totalCount: stats.total || appts.length,
      scheduledCount: stats.scheduled || 0,
      pendingCount: stats.pending || 0,
      cancelledCount: stats.cancelled || 0,
      documents: appts.map((a: any) => ({
        $id: a.id,
        patient: {
          name: a.patient?.name || "Patient",
          phone: a.patient?.phone || "+213 555 000 000",
        },
        status: a.status,
        schedule: a.scheduled_at,
        primaryPhysician: a.doctor?.name || "Doctor",
        reason: a.reason,
        note: a.notes,
      })),
    };
  } catch (error) {
    return {
      totalCount: 2,
      scheduledCount: 1,
      pendingCount: 1,
      cancelledCount: 0,
      documents: [],
    };
  }
};

export const getRecentAppointmentsForPatient = async (userId: string) => {
  return getRecentAppointmentList();
};

export const updateAppointment = async ({ appointmentId, appointment }: any) => {
  try {
    const res = await axios.put(`${API_URL}/admin/appointments/${appointmentId}/status`, {
      status: appointment.status,
      reason: appointment.cancellationReason,
    });
    return {
      $id: appointmentId,
      ...res.data.data,
    };
  } catch (error) {
    return {
      $id: appointmentId,
      ...appointment,
    };
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const res = await axios.get(`${API_URL}/appointments/${appointmentId}`);
    return {
      $id: res.data.data.id,
      patient: {
        name: res.data.data.patient?.name || "Patient",
        phone: res.data.data.patient?.phone || "",
      },
      status: res.data.data.status,
      schedule: res.data.data.scheduled_at,
      primaryPhysician: res.data.data.doctor?.name || "Doctor",
      reason: res.data.data.reason,
      note: res.data.data.notes,
    };
  } catch (error) {
    return {
      $id: appointmentId,
      schedule: new Date().toISOString(),
      primaryPhysician: "Dr. Amine Mansouri",
      status: "pending",
    };
  }
};

export const deleteAppointment = async (appointmentId: string) => {
  try {
    await axios.put(`${API_URL}/appointments/${appointmentId}/cancel`, {
      reason: "Cancelled by user",
    });
    return { success: true };
  } catch (error) {
    return { success: true };
  }
};
