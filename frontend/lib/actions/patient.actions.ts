"use server";

// Mock Patient Actions

export const createUser = async (user: any) => {
  return {
    $id: `mock_user_${Date.now()}`,
    name: user.name || "Test User",
    phone: user.phone,
    isRegistered: true,
  };
};

export const getPatient = async (userId: string) => {
  return {
    $id: userId,
    name: "Aymen Benali",
    phone: "+213550123456",
    primaryPhysician: "Mohamed Benali",
  };
};

export const registerPatient = async (patient: any) => {
  return {
    $id: `mock_patient_${Date.now()}`,
    ...patient,
  };
};

export const getPatientCount = async () => {
  return 42;
};
