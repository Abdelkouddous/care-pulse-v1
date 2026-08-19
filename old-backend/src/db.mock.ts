// Backend-agnostic in-memory mock DB adapter
// This replaces all data flows with mock data for development/demo purposes.
// When ready, implement these methods against Railway Postgres and remove the mocks.

// Local Status type to avoid importing from ambient declarations
// Matches global Status in types/index.d.ts
export type Status = "pending" | "scheduled" | "cancelled";

// Core domain record shapes used by the UI
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

// -----------------------------
// In-memory store and seed data
// -----------------------------

const adminsStore: AdminRecord[] = [
  { $id: "admin_1", adminName: "Pulse Admin" },
];

const doctorsStore: DoctorRecord[] = [
  { $id: "doc_green", name: "John Green", email: "john.green@example.com", isActive: true },
  { $id: "doc_cameron", name: "Leila Cameron", email: "leila.cameron@example.com", isActive: true },
  { $id: "doc_livingston", name: "David Livingston", email: "david.livingston@example.com", isActive: true },
  { $id: "doc_peter", name: "Evan Peter", email: "evan.peter@example.com", isActive: false },
  { $id: "doc_powell", name: "Jane Powell", email: "jane.powell@example.com", isActive: true },
  { $id: "doc_ramirez", name: "Alex Ramirez", email: "alex.ramirez@example.com", isActive: true },
  { $id: "doc_lee", name: "Jasmine Lee", email: "jasmine.lee@example.com", isActive: true },
  { $id: "doc_cruz", name: "Alyana Cruz", email: "alyana.cruz@example.com", isActive: true },
];

const patientsStore: PatientRecord[] = [];

const appointmentsStore: AppointmentRecord[] = [];

function genId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomStatus(): Status {
  return pick(["scheduled", "pending", "cancelled"]);
}

function randomFutureDate(daysAhead: number = 14): Date {
  const now = new Date();
  const offset = Math.floor(Math.random() * daysAhead) + 1; // 1..daysAhead
  now.setDate(now.getDate() + offset);
  now.setHours(Math.floor(Math.random() * 8) + 9); // 9..16
  now.setMinutes([0, 15, 30, 45][Math.floor(Math.random() * 4)]);
  return now;
}

// Seed a few mock appointments globally for admin views
for (let i = 0; i < 6; i++) {
  const doc = pick(doctorsStore);
  appointmentsStore.push({
    $id: genId("appt"),
    userId: `user_${i % 3}`,
    status: randomStatus(),
    schedule: randomFutureDate(),
    reason: pick([
      "General Checkup",
      "Follow-up Consultation",
      "Routine Screening",
      "Lab Results Review",
      "Specialist Referral",
    ]),
    primaryPhysician: doc.name,
    note: Math.random() > 0.5 ? "Bring previous reports." : null,
    cancellationReason: null,
    patient: `patient_${i}`,
  });
}

// -----------------------------
// Public DB API (mocked)
// -----------------------------
export const mockDb = {
  admins: {
    async findByAdminId(adminId: string): Promise<AdminRecord | null> {
      const found = adminsStore.find((a) => a.$id === adminId) || adminsStore[0];
      return found || null;
    },
  },

  patients: {
    async findByUserId(userId: string): Promise<PatientRecord | null> {
      return patientsStore.find((p) => p.userId === userId) || null;
    },

    async create(data: Partial<PatientRecord>): Promise<PatientRecord> {
      const record: PatientRecord = {
        $id: data.$id || genId("patient"),
        userId: data.userId || genId("user"),
        name: data.name || "New Patient",
        phone: data.phone,
      };
      patientsStore.push(record);
      return record;
    },

    async count(): Promise<number> {
      return patientsStore.length;
    },
  },

  doctors: {
    async create(data: Partial<DoctorRecord>): Promise<DoctorRecord> {
      const record: DoctorRecord = {
        $id: data.$id || genId("doc"),
        name: data.name || "New Doctor",
        email: data.email,
        isActive: data.isActive ?? true,
      };
      doctorsStore.push(record);
      return record;
    },

    async list(): Promise<DoctorRecord[]> {
      return [...doctorsStore];
    },

    async count(): Promise<number> {
      return doctorsStore.length;
    },

    async countActive(): Promise<number> {
      return doctorsStore.filter((d) => d.isActive).length;
    },
  },

  appointments: {
    async listRecent(): Promise<AppointmentRecord[]> {
      // Sort descending by schedule if possible
      return [...appointmentsStore].sort((a, b) => {
        const ad = new Date(a.schedule).getTime();
        const bd = new Date(b.schedule).getTime();
        return bd - ad;
      });
    },

    async forPatient(userId: string): Promise<AppointmentRecord[]> {
      const list = appointmentsStore.filter((a) => a.userId === userId);
      if (list.length > 0) return [...list];

      // If none exist for this user, generate a few mock entries on-the-fly and store them
      const generated: AppointmentRecord[] = [];
      const count = 3;
      for (let i = 0; i < count; i++) {
        const doc = pick(doctorsStore);
        const appt: AppointmentRecord = {
          $id: genId("appt"),
          userId,
          status: i === 0 ? "scheduled" : randomStatus(),
          schedule: randomFutureDate(),
          reason: pick([
            "Consultation",
            "Follow-up",
            "Diagnostic Test",
            "Annual Physical",
          ]),
          primaryPhysician: doc.name,
          note: Math.random() > 0.5 ? "Fasting required." : null,
          cancellationReason: null,
          patient: `patient_${userId}`,
        };
        generated.push(appt);
        appointmentsStore.push(appt);
      }
      return generated;
    },

    async create(data: Partial<AppointmentRecord>): Promise<AppointmentRecord> {
      const record: AppointmentRecord = {
        $id: data.$id || genId("appt"),
        userId: data.userId || genId("user"),
        status: (data.status as Status) || "scheduled",
        schedule: data.schedule || randomFutureDate(),
        reason: data.reason,
        primaryPhysician: data.primaryPhysician,
        note: data.note ?? null,
        cancellationReason: data.cancellationReason ?? null,
        patient: data.patient,
      };
      appointmentsStore.push(record);
      return record;
    },

    async update(id: string, data: Partial<AppointmentRecord>): Promise<AppointmentRecord> {
      const idx = appointmentsStore.findIndex((a) => a.$id === id);
      if (idx === -1) throw new Error(`Mock DB: appointment ${id} not found`);
      const current = appointmentsStore[idx];
      const updated: AppointmentRecord = {
        ...current,
        ...data,
        // Ensure schedule stays a Date/string
        schedule: data.schedule ?? current.schedule,
        status: (data.status as Status) ?? current.status,
      };
      appointmentsStore[idx] = updated;
      return updated;
    },

    async get(id: string): Promise<AppointmentRecord | null> {
      return appointmentsStore.find((a) => a.$id === id) || null;
    },

    async delete(id: string): Promise<void> {
      const idx = appointmentsStore.findIndex((a) => a.$id === id);
      if (idx !== -1) {
        appointmentsStore.splice(idx, 1);
      }
    },
  },
};