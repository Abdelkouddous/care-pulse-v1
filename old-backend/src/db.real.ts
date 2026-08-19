// Placeholder real DB adapter for Railway Postgres
// Implement these methods to connect to your actual database.
// The MOCK MODE will switch between this adapter and the in-memory mock.

export type Status = "pending" | "scheduled" | "cancelled";
export type AdminRecord = { $id: string; adminName: string };
export type PatientRecord = { $id: string; userId: string; name: string; phone?: string };
export type DoctorRecord = { $id: string; name: string; email?: string; isActive?: boolean };
export type AppointmentRecord = {
  $id: string;
  userId: string;
  status: Status;
  schedule: Date | string;
  reason?: string;
  primaryPhysician?: string;
  note?: string | null;
  cancellationReason?: string | null;
  patient?: string | PatientRecord;
};

export const realDb = {
  admins: {
    async findByAdminId(adminId: string): Promise<AdminRecord | null> {
      throw new Error("Real DB not implemented. Implement admins.findByAdminId on Railway.");
    },
  },
  patients: {
    async findByUserId(userId: string): Promise<PatientRecord | null> {
      throw new Error("Real DB not implemented. Implement patients.findByUserId on Railway.");
    },
    async create(data: Partial<PatientRecord>): Promise<PatientRecord> {
      throw new Error("Real DB not implemented. Implement patients.create on Railway.");
    },
    async count(): Promise<number> {
      throw new Error("Real DB not implemented. Implement patients.count on Railway.");
    },
  },
  doctors: {
    async create(data: Partial<DoctorRecord>): Promise<DoctorRecord> {
      throw new Error("Real DB not implemented. Implement doctors.create on Railway.");
    },
    async list(): Promise<DoctorRecord[]> {
      throw new Error("Real DB not implemented. Implement doctors.list on Railway.");
    },
    async count(): Promise<number> {
      throw new Error("Real DB not implemented. Implement doctors.count on Railway.");
    },
    async countActive(): Promise<number> {
      throw new Error("Real DB not implemented. Implement doctors.countActive on Railway.");
    },
  },
  appointments: {
    async listRecent(): Promise<AppointmentRecord[]> {
      throw new Error("Real DB not implemented. Implement appointments.listRecent on Railway.");
    },
    async forPatient(userId: string): Promise<AppointmentRecord[]> {
      throw new Error("Real DB not implemented. Implement appointments.forPatient on Railway.");
    },
    async create(data: Partial<AppointmentRecord>): Promise<AppointmentRecord> {
      throw new Error("Real DB not implemented. Implement appointments.create on Railway.");
    },
    async update(id: string, data: Partial<AppointmentRecord>): Promise<AppointmentRecord> {
      throw new Error("Real DB not implemented. Implement appointments.update on Railway.");
    },
    async get(id: string): Promise<AppointmentRecord | null> {
      throw new Error("Real DB not implemented. Implement appointments.get on Railway.");
    },
    async delete(id: string): Promise<void> {
      throw new Error("Real DB not implemented. Implement appointments.delete on Railway.");
    },
  },
};