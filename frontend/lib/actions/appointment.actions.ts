"use server";

// Mock Appointment Actions

const mockAppointments: any[] = [
  {
    $id: "appt_1",
    patient: { 
      name: "Aymen Benali", 
      phone: "+213550123456",
      userId: "mock_user_1",
      birthDate: new Date(),
      gender: "Male" as any,
      address: "Didouche Mourad St, Algiers",
      occupation: "Software Engineer",
      emergencyContactName: "Karim Benali",
      emergencyContactNumber: "+213661789012",
      primaryPhysician: "Mohamed Benali",
      insuranceProvider: "CNAS",
      insurancePolicyNumber: "12345-DZ",
      privacyConsent: true,
    },
    status: "scheduled" as any,
    schedule: new Date(Date.now() + 86400000).toISOString(),
    primaryPhysician: "Mohamed Benali",
    reason: "General Checkup",
    note: null,
    userId: "mock_user_1",
    cancellationReason: null,
  },
  {
    $id: "appt_2",
    patient: { 
      name: "Aymen Benali", 
      phone: "+213550123456",
      userId: "mock_user_1",
      birthDate: new Date(),
      gender: "Male" as any,
      address: "Didouche Mourad St, Algiers",
      occupation: "Software Engineer",
      emergencyContactName: "Karim Benali",
      emergencyContactNumber: "+213661789012",
      primaryPhysician: "Meriem Belkacem",
      insuranceProvider: "CNAS",
      insurancePolicyNumber: "12345-DZ",
      privacyConsent: true,
    },
    status: "pending" as any,
    schedule: new Date(Date.now() + 172800000).toISOString(),
    primaryPhysician: "Meriem Belkacem",
    reason: "Follow up",
    note: null,
    userId: "mock_user_1",
    cancellationReason: null,
  },
];

export const createAppointment = async (appointment: any) => {
  return {
    $id: `mock_appt_${Date.now()}`,
    ...appointment,
    status: "pending",
  };
};

export const getRecentAppointmentList = async () => {
  return {
    totalCount: mockAppointments.length,
    scheduledCount: mockAppointments.filter(a => a.status === "scheduled").length,
    pendingCount: mockAppointments.filter(a => a.status === "pending").length,
    cancelledCount: mockAppointments.filter(a => a.status === "cancelled").length,
    documents: mockAppointments,
  };
};

export const getRecentAppointmentsForPatient = async (userId: string) => {
  return getRecentAppointmentList();
};

export const updateAppointment = async ({ appointmentId, appointment }: any) => {
  return {
    $id: appointmentId,
    ...appointment,
  };
};

export const getAppointment = async (appointmentId: string) => {
  return mockAppointments.find(a => a.$id === appointmentId) || mockAppointments[0];
};

export const deleteAppointment = async (appointmentId: string) => {
  return { success: true };
};
