# Project VitalWork / VitalBook: System Architecture & Engineering Concepts

> **Status:** Production Architecture Blueprint
> **Audience:** Principal Architects, Staff Software Engineers, Security & Infrastructure Leads
> **Stack:** Next.js 14 (App Router) · Laravel 13 (REST API) · PostgreSQL 18 · Redis 7 · Docker

---

## 1. Computer Science Foundations & Architectural Philosophy

### 1.1 The "Concept First" Paradigm

Enterprise healthcare systems require extreme data guarantees: zero tolerance for financial rounding drift, deterministic multi-tenant isolation, cryptographic audit trails, and mathematically sound concurrency control.

Building VitalBook upon modern software design principles requires understanding four fundamental computer science pillars:

1. **State Isolation & Memory Footprint:**
   State must never leak across concurrent execution threads. In a multi-tenant medical environment, request context must be strictly scoped to the tenant's execution lifecycle. Global singleton state in long-running processes (e.g., Octane, Swoole, or worker pools) causes cross-tenant data corruption if not bound to ephemeral container instances.
2. **Deterministic Financial Arithmetic (IEEE 754 Avoidance):**
   Standard double-precision floating-point numbers (`IEEE 754`) cannot accurately represent base-10 fractions (e.g., `0.1 + 0.2 !== 0.3`). In healthcare billing, floating-point arithmetic introduces silent penny-shaving errors and reconciliation divergence. Currency is fundamentally a discrete quantity: all balances, prices, and line items must strictly exist as integer cents (`int consultation_fee_cents`).
3. **Distributed Sharding & Entity Identity:**
   Centralized auto-incrementing serial IDs (`BIGSERIAL`) create synchronization bottlenecks, facilitate enumeration attacks, and prevent zero-collision database partitioning. Universally Unique Identifiers (UUIDv4, 128-bit pseudorandom numbers) allow client or service nodes to generate collision-free primary keys asynchronously without cross-node locks.
4. **Concurrency & Linearizability:**
   Doctor appointment calendars represent finite shared resources. Concurrent attempts to reserve the identical time slice constitute a race condition. VitalBook enforces concurrency control at both the application tier (Redis distributed locks) and the database engine tier (PostgreSQL transactional row-level isolation and compound unique index constraints).

---

## 2. Comparative Framework

The following matrix contrasts common junior engineering anti-patterns against the senior architectural implementations enforced within Project VitalWork / VitalBook:

| Dimension                        | Junior / Fragile Approach                                                              | Senior / Elite Engineering Architecture                                                                                                 | Architectural Rationale                                                                                                      |
| :------------------------------- | :------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **Multi-Tenancy**                | Manual`where('clinic_id', $id)` appended in individual controller queries.             | Automated Eloquent Global Scopes registered in tenant-aware abstract models, resolved via immutable middleware context.                 | Eliminates human oversight; a missed`where` clause in junior code leaks private medical records to neighboring clinics.      |
| **Financial Representation**     | Storing fees as`DECIMAL(10,2)` or `FLOAT` in models, with manual formatting in UI.     | Strict integer centimes (`int consultation_fee_cents`), normalized via value objects and formatted solely at the presentation boundary. | Eliminates IEEE 754 precision drift, rounding discrepancies across processors, and currency mismatch bugs.                   |
| **Entity Identity**              | Auto-incrementing sequential integers (`id: 1, 2, 3...`).                              | Universally Unique Identifiers (UUIDv4:`85bc27d0-30e9-4743-88f9-1c799602c3b7`).                                                         | Prevents competitive enumeration scraping; enables database sharding, offline synchronization, and multi-region replication. |
| **Layer Coupling**               | Controllers call ORM directly:`Appointment::create($request->all())`.                  | Decoupled Service-Repository pattern with Data Transfer Objects (DTOs) and Form Request validation.                                     | Adheres to Single Responsibility (SRP) and Dependency Inversion (DIP). Insulates business domains from persistence drivers.  |
| **Concurrency & Double-Booking** | "Check-then-act" (`if (!Appointment::where(...)->exists()) Appointment::create(...)`). | Database compound unique constraint`(doctor_id, scheduled_at)` wrapped in an atomic database transaction.                               | Eliminates Time-of-Check to Time-of-Use (TOCTOU) race conditions during high-volume appointment traffic.                     |
| **Client-Server State**          | Shared state or direct database calls inside Next.js Server Components.                | Decoupled HTTP API with Sanctum Bearer tokens and strict OpenAPI contracts.                                                             | Preserves clear physical and network boundaries between presentation and business logic.                                     |

---

## 3. High-Level System Architecture & Topography

The system uses a completely decoupled Monorepo topography. The presentation layer (Next.js 14) and business persistence layer (Laravel 13 API) communicate over JSON REST interfaces authenticated via Laravel Sanctum.

```mermaid
graph TD
    subgraph Client_Presentation_Layer ["Next.js 14 Client Layer (Port 3000)"]
        UI[React 18 Presentation Components]
        RQ[TanStack React Query Cache]
        ClientAPI[Axios API Client & Interceptors]
        UI --> RQ
        RQ --> ClientAPI
    end

    subgraph Gateway_Proxy ["Edge & Routing Layer"]
        Nginx[Nginx Reverse Proxy / Port 8000]
    end

    subgraph Laravel_Domain_Core ["Laravel 13 Core Domain Layer"]
        Middleware[Tenant Context Resolver Middleware]
        Sanctum[Sanctum Auth & Token Guard]
        Controller[Domain API Controllers]
        Service[Domain Services - SRP/DIP]
        Repo[Repository Layer]
        GlobalScope[Multi-Tenant Global Scopes]

        Middleware --> Sanctum
        Sanctum --> Controller
        Controller --> Service
        Service --> Repo
        Repo --> GlobalScope
    end

    subgraph Persistence_Cache ["Infrastructure Layer"]
        Postgres[("PostgreSQL 18 DB (Port 5433)\nUUIDv4 PKs & Strict Constraints")]
        Redis[("Redis 7 Cache & Queue (Port 6379)\nSession & Token Driver")]
    end

    ClientAPI -->|HTTP Bearer + X-Clinic-ID| Nginx
    Nginx --> Middleware
    GlobalScope -->|Scoped Queries| Postgres
    Service -->|Atomic Locks & Cache| Redis
```

---

## 4. Multi-Tenant Context Resolution & Global Scope Enforcement

Each request entering the API passes through tenant boundary validation. The clinic context is resolved, verified for active status, and bound to a scoped execution singleton:

```mermaid
sequenceDiagram
    autonumber
    actor Client as Next.js Frontend
    participant Proxy as Nginx Proxy (:8000)
    participant MW as ResolveTenantFromHeader Middleware
    participant Ctx as TenantContext (Container Singleton)
    participant Auth as Sanctum Guard
    participant Scope as ClinicScope (Eloquent Global)
    participant DB as PostgreSQL 18 Engine

    Client->>Proxy: HTTP Request + [X-Clinic-ID Header] + [Bearer Token]
    Proxy->>MW: Ingest Request
    MW->>MW: Validate UUIDv4 format of X-Clinic-ID
    alt Invalid UUID format
        MW-->>Client: 422 Unprocessable Entity
    end

    MW->>DB: Query Clinic by UUID (SELECT * FROM clinics WHERE id = ?)
    alt Clinic Not Found or Inactive
        MW-->>Client: 404 Not Found / Inactive
    end

    MW->>Ctx: Set Active Tenant (Clinic Model)
    MW->>Auth: Validate Bearer Token
    alt User Clinic != Header Clinic
        Auth-->>Client: 403 Forbidden (Cross-Tenant Breach Attempt)
    end

    Auth->>Scope: Apply Global Scope: WHERE clinic_id = tenant.id
    Scope->>DB: Execute Query with Automated Isolation
    DB-->>Client: Return Filtered Tenant Domain Data
```

---

## 5. End-to-End Appointment Booking & Anti-Double-Booking Guardrail

To prevent overbooking, the system combines database transactions with a unique compound database index: `idx_unique_doctor_scheduled_slot (doctor_id, scheduled_at)`.

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Patient Client
    participant API as AppointmentController
    participant Service as AppointmentService
    participant DB as PostgreSQL Engine
    participant Queue as Redis Queue Worker

    Patient->>API: POST /api/v1/appointments {doctor_id, scheduled_at, reason}
    API->>API: BookAppointmentRequest (Validate UUID, Date, String limits)
    API->>Service: bookAppointment(payload)

    Service->>DB: BEGIN TRANSACTION (SERIALIZABLE / READ COMMITTED)
    Service->>DB: SELECT FOR UPDATE / Check Existing Slot

    alt Slot is already occupied
        DB-->>Service: Conflict Detected (Unique constraint violation)
        Service->>DB: ROLLBACK TRANSACTION
        Service-->>API: ConflictException
        API-->>Patient: 422 Unprocessable Entity ("This slot has already been booked")
    else Slot is available
        Service->>DB: INSERT INTO appointments (id, patient_id, doctor_id, clinic_id, fee_cents, status)
        DB-->>Service: Appointment Record Created
        Service->>DB: COMMIT TRANSACTION
        Service->>Queue: Dispatch AppointmentBookedNotification Event
        Service-->>API: Hydrated Appointment Entity
        API-->>Patient: 201 Created + Appointment Resource JSON
    end
```

---

## 6. Role-Based Access Control (RBAC) & Actor Lifecycle

The VitalBook ecosystem supports three distinct primary actors with explicit boundaries:

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated

    Unauthenticated --> PatientRole: POST /api/v1/auth/login or /register
    Unauthenticated --> DoctorRole: POST /api/v1/auth/doctor/login
    Unauthenticated --> AdminRole: POST /api/v1/auth/admin/login

    state PatientRole {
        [*] --> PatientSession
        PatientSession --> BrowseDoctors: GET /api/v1/doctors
        PatientSession --> BookAppointment: POST /api/v1/appointments
        PatientSession --> ViewHistory: GET /api/v1/patients/me/appointments
        PatientSession --> CancelOwnAppointment: PUT /api/v1/appointments/{id}/cancel
    }

    state DoctorRole {
        [*] --> DoctorSession
        DoctorSession --> ViewAssignedSchedule: GET /api/v1/doctor-portal/appointments
        DoctorSession --> TriageAppointmentStatus: PUT /api/v1/doctor-portal/appointments/{id}/status
        DoctorSession --> RecordDiagnosis: POST /api/v1/medical-records
    }

    state AdminRole {
        [*] --> AdminSession
        AdminSession --> ViewClinicKPIs: GET /api/v1/admin/dashboard
        AdminSession --> OverseeAllAppointments: GET /api/v1/admin/appointments
        AdminSession --> ManageStaffRoster: POST/PUT/DELETE /api/v1/admin/doctors
        AdminSession --> AuditClinicTenancy: GET /api/v1/admin/patients
    }

    PatientRole --> [*]: POST /api/v1/auth/logout (Revoke Token)
    DoctorRole --> [*]: POST /api/v1/auth/logout (Revoke Token)
    AdminRole --> [*]: POST /api/v1/auth/logout (Revoke Token)
```

---

## 7. Database Entity-Relationship Architecture (UUIDv4 & Integer Cents)

All foreign keys use UUIDv4 identifiers. Financial transactions explicitly store integer cents.

```mermaid
erDiagram
    CLINICS ||--o{ ADMINS : "employs"
    CLINICS ||--o{ DOCTORS : "contracts"
    CLINICS ||--o{ APPOINTMENTS : "hosts"
    SPECIALTIES ||--o{ DOCTORS : "classifies"
    DOCTORS ||--o{ DOCTOR_AVAILABILITIES : "defines"
    USERS ||--o{ APPOINTMENTS : "books"
    DOCTORS ||--o{ APPOINTMENTS : "attends"
    APPOINTMENTS ||--o| MEDICAL_RECORDS : "documents"

    CLINICS {
        uuid id PK "UUIDv4"
        string name "Clinic Name"
        string address "Physical Address"
        string phone "Contact Number"
        string timezone "IANA Timezone"
        boolean is_active "Tenant Status"
        timestamp created_at
    }

    SPECIALTIES {
        uuid id PK "UUIDv4"
        string name "Medical Domain"
        text description
    }

    ADMINS {
        uuid id PK "UUIDv4"
        uuid clinic_id FK "UUIDv4"
        string name "Admin Full Name"
        string email "Unique Login Email"
        string password "Bcrypt Hash"
        string role "super_admin | clinic_admin"
    }

    DOCTORS {
        uuid id PK "UUIDv4"
        uuid clinic_id FK "UUIDv4"
        uuid specialty_id FK "UUIDv4"
        string first_name
        string last_name
        string email "Unique Login Email"
        string license_number "Unique Medical ID"
        int consultation_fee_cents "Strict Integer Cents"
        boolean is_active "Operational Status"
    }

    DOCTOR_AVAILABILITIES {
        uuid id PK "UUIDv4"
        uuid doctor_id FK "UUIDv4"
        tinyint day_of_week "0-6 ISO Weekday"
        time start_time "Slot Window Start"
        time end_time "Slot Window End"
        smallint slot_duration_minutes "Default: 30"
    }

    USERS {
        uuid id PK "UUIDv4"
        string first_name
        string last_name
        string email "Unique Patient Email"
        string phone "Phone with Country Code"
        string insurance_provider "CNAS / Private"
        string insurance_policy_number
    }

    APPOINTMENTS {
        uuid id PK "UUIDv4"
        uuid patient_id FK "UUIDv4 (Users)"
        uuid doctor_id FK "UUIDv4"
        uuid clinic_id FK "UUIDv4"
        timestamptz scheduled_at "Slot Timestamp"
        string status "pending | scheduled | completed | cancelled"
        int consultation_fee_cents "Strict Integer Cents"
        string cancelled_by "patient | doctor | admin"
    }

    MEDICAL_RECORDS {
        uuid id PK "UUIDv4"
        uuid appointment_id FK "Unique UUIDv4"
        uuid patient_id FK "UUIDv4"
        uuid doctor_id FK "UUIDv4"
        uuid clinic_id FK "UUIDv4"
        text diagnosis "Clinical Diagnosis"
        text prescription "Medication Schedule"
        date follow_up_date
    }
```

---

## 8. Low-Code Architectural Pseudo-Logic & State Machines

In compliance with the Low-Code Pattern, core invariants are specified via structural state machines and architectural pseudo-logic.

### 8.1 Multi-Tenant Middleware Execution Flow

```text
FUNCTION ResolveTenantFromHeader(Request req, Next next):
    headerClinicId := req.GetHeader("X-Clinic-ID")
    authenticatedUser := req.GetUser()

    IF authenticatedUser != NULL AND authenticatedUser.HasAttribute("clinic_id"):
        IF headerClinicId != NULL AND headerClinicId != authenticatedUser.clinic_id:
            ABORT WITH 403 Forbidden ("Cross-tenant boundary breach detected.")
        headerClinicId = authenticatedUser.clinic_id

    IF headerClinicId != NULL:
        IF NOT IsValidUUIDv4(headerClinicId):
            ABORT WITH 422 Unprocessable ("Invalid tenant UUID format.")

        clinicRecord := QueryDatabase("SELECT * FROM clinics WHERE id = ? AND is_active = true", headerClinicId)
        IF clinicRecord == NULL:
            ABORT WITH 404 Not Found ("Clinic tenant not found or deactivated.")

        TenantContext.BindActiveTenant(clinicRecord)

    RETURN next(req)
```

### 8.2 Appointment Booking Concurrency State Machine

```text
FUNCTION BookAppointment(PatientId, DoctorId, ScheduledSlot, Reason):
    ASSERT ScheduledSlot > CurrentTimestamp() + MinimumLeadTime
    ASSERT DoctorIsActive(DoctorId)

    BEGIN SERIALIZED DATABASE TRANSACTION:
        // Pessimistic or Constraint Lock
        existingSlot := QueryDatabase(
            "SELECT id FROM appointments WHERE doctor_id = ? AND scheduled_at = ? AND status != 'cancelled'",
            DoctorId, ScheduledSlot
        )

        IF existingSlot != NULL:
            ROLLBACK TRANSACTION
            RAISE ConcurrencyConflictException("Slot collision: Double booking prevented.")

        doctorFee := QueryDatabase("SELECT consultation_fee_cents FROM doctors WHERE id = ?", DoctorId)

        appointmentRecord := InsertDatabase("appointments", {
            id: GenerateUUIDv4(),
            patient_id: PatientId,
            doctor_id: DoctorId,
            clinic_id: TenantContext.GetActiveTenantId(),
            scheduled_at: ScheduledSlot,
            status: "pending",
            consultation_fee_cents: doctorFee.consultation_fee_cents,
            reason: Sanitize(Reason)
        })

    COMMIT TRANSACTION

    EmitEvent("AppointmentCreated", appointmentRecord)
    RETURN appointmentRecord
```

---

## 9. Socratic Guard & System Robustness Checkpoints

Before moving to continuous multi-region deployment, the engineering team must resolve the following architectural boundaries:

1. **Data Isolation Under Worker Concurrency:**
   _Question:_ When background workers (`supervisord` / `queue:work`) process queued appointment reminders across multiple clinics, does the worker leak tenant context between jobs?_Mitigation:_ Queue jobs must explicitly serialize the `clinic_id` onto the job payload, and the worker must re-hydrate and flush `TenantContext` upon every individual job invocation (`TenantContext::flush()`).
2. **Network Partitioning & Distributed Locks:**
   _Question:_ If the Redis cluster encounters a failover split-brain scenario during appointment booking, can two patients book the same slot simultaneously?_Mitigation:_ The primary source of truth remains the PostgreSQL composite unique constraint `(doctor_id, scheduled_at)`. Redis acts as an optimistic rate limiter; PostgreSQL acts as the ACID invariant boundary.
3. **Client-Side Auth Token Invalidation:**
   _Question:_ If an admin revokes a doctor's credential in the backend, what guarantees exist that the Next.js client does not continue rendering cached patient records?
   _Mitigation:_ Next.js uses TanStack React Query with strict cache TTLs and an Axios response interceptor that purges `localStorage` and redirects to `/signin` upon receiving any `401 Unauthorized` response.
