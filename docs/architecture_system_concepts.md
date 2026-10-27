# VitalBook: Full-Stack System Architecture & Engineering Specifications

> **Status:** Production Architecture Blueprint (MVP Verified)  
> **Audience:** Principal Architects, Full-Stack Engineers, Security & DevOps Leads  
> **Stack:** Next.js 14.2 (App Router) · Flutter 3.x (Mobile) · Laravel 11 (REST API) · PostgreSQL (Supabase) · Twilio WhatsApp Gateway

---

## 1. Architectural Foundations & Invariants

VitalBook enforces four non-negotiable computer science foundations across web, mobile, and backend tiers:

1. **Deterministic Financial Arithmetic (Zero IEEE 754 Drift):**
   Standard floating-point representation (`FLOAT` / `DOUBLE`) introduces silent rounding errors. In healthcare billing, all consultation fees and balances are strictly stored and computed as integer centimes (`int consultation_fee_cents` in Algerian Dinars DZD). Presentation layers format currency strictly at the display boundary.
2. **Deterministic Multi-Tenant Scoping:**
   Clinic tenant isolation is enforced at the persistence layer using Eloquent Global Scopes. Middleware validates the `X-Clinic-ID` UUID header against the authenticated user's assigned tenant, completely preventing cross-tenant medical record leaks.
3. **Universally Unique Entity Identity (UUIDv4):**
   Auto-incrementing serial IDs (`BIGSERIAL`) introduce enumeration vulnerabilities and sharding bottlenecks. All core entities (`clinics`, `doctors`, `patients`, `appointments`) utilize pseudorandom UUIDv4 identifiers.
4. **Strict Concurrency Control (Anti-Double-Booking):**
   Consultation slots represent shared finite inventory. VitalBook prevents double-booking via database transactions combined with a composite unique database index: `(doctor_id, scheduled_at)`.

---

## 2. Decoupled Monorepo Topography

The platform is architected as an encapsulated multi-client ecosystem sharing a centralized Laravel 11 REST API:

```mermaid
graph TD
    subgraph Clients ["Client Applications"]
        Web["Next.js 14 Web Portal (Port 3000)<br/>• Patient Portal<br/>• Doctor Portal<br/>• Admin Console<br/>• Demo Sandbox"]
        Mobile["Flutter 3.x Mobile App<br/>• Riverpod 3 & GoRouter<br/>• SMS OTP Patient Auth<br/>• Doctor Booking & Directory<br/>• Carte Chifa Verification"]
    end

    subgraph API_Gateway ["Backend Application (Laravel 11 / PHP 8.4)"]
        Sanctum["Sanctum Token Guard & RBAC"]
        TenantMW["TenantContext Middleware (X-Clinic-ID)"]
        Services["Domain Services (Appointment, Doctor, Auth)"]
        Repo["Repository Layer & Eloquent Scopes"]
        WAGateway["Twilio WhatsApp Notification Service"]
    end

    subgraph External_Services ["External Infrastructure"]
        Supabase[("PostgreSQL via Supabase<br/>UUIDv4, Generated Columns, Strict FKs")]
        Twilio["Twilio WhatsApp Business API<br/>Two-Way Triage Webhook"]
    end

    Web -->|HTTP REST / Sanctum Bearer| TenantMW
    Mobile -->|Dio Client / Bearer Token| TenantMW
    TenantMW --> Sanctum
    Sanctum --> Services
    Services --> Repo
    Repo --> Supabase
    Services --> WAGateway
    WAGateway <-->|Two-Way Webhooks & Outbound Prompts| Twilio
```

---

## 3. Multi-Tenant Request Isolation Flow

Every API transaction resolves and locks tenant context before executing queries:

```mermaid
sequenceDiagram
    autonumber
    actor Client as Web / Mobile Client
    participant MW as ResolveTenantContext Middleware
    participant Ctx as TenantContext Container Singleton
    participant Auth as Sanctum Guard
    participant Scope as ClinicScope (Eloquent Global)
    participant DB as PostgreSQL Database

    Client->>MW: HTTP Request + [X-Clinic-ID] + [Bearer Token]
    MW->>MW: Validate UUIDv4 format of X-Clinic-ID
    alt Invalid Format
        MW-->>Client: 422 Unprocessable Entity
    end

    MW->>DB: Query Clinic by UUID (active check)
    alt Inactive or Missing Clinic
        MW-->>Client: 404 Not Found / Inactive Clinic
    end

    MW->>Ctx: Bind Active Tenant
    MW->>Auth: Authenticate Token & User Context
    alt Tenant Mismatch
        Auth-->>Client: 403 Forbidden (Cross-Tenant Boundary Breach)
    end

    Auth->>Scope: Apply WHERE clinic_id = tenant.id
    Scope->>DB: Execute Filtered Query
    DB-->>Client: Return Isolated Tenant Records
```

---

## 4. Anti-Double-Booking Concurrency State Machine

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Patient (Web / Mobile)
    participant Controller as AppointmentController
    participant Service as AppointmentService
    participant DB as PostgreSQL Database
    participant WA as WhatsAppNotificationService

    Patient->>Controller: POST /api/v1/appointments {doctor_id, scheduled_at, reason}
    Controller->>Service: bookAppointment(payload)

    Service->>DB: BEGIN TRANSACTION (READ COMMITTED)
    Service->>DB: Check (doctor_id, scheduled_at) availability
    alt Slot Already Occupied
        DB-->>Service: Unique index violation / Conflict
        Service->>DB: ROLLBACK
        Service-->>Controller: ConflictException
        Controller-->>Patient: 422 Unprocessable Entity ("Slot already reserved")
    else Slot Available
        Service->>DB: INSERT INTO appointments (status = 'pending')
        Service->>DB: COMMIT TRANSACTION
        Service->>WA: sendAppointmentConfirmationRequest(appointment)
        WA-->>Service: Dispatched to Twilio
        Service-->>Controller: Hydrated Appointment Model
        Controller-->>Patient: 201 Created
    end
```

---

## 5. Automated Two-Way WhatsApp Triage Engine

VitalBook incorporates an interactive WhatsApp booking confirmation and triage system:

```mermaid
sequenceDiagram
    autonumber
    participant App as Appointment Created
    participant WA as WhatsAppNotificationService
    participant Twilio as Twilio WhatsApp API
    actor Patient as Patient Phone
    participant Hook as POST /api/v1/webhooks/whatsapp

    App->>WA: sendAppointmentConfirmationRequest(appointment)
    WA->>Twilio: Send bilingual prompt (French/Arabic):<br/>"1 / OUI to CONFIRM" or "2 / NON to CANCEL"
    Twilio->>Patient: Deliver WhatsApp message

    Patient-->>Twilio: Reply "1" (or "OUI")
    Twilio->>Hook: Inbound Webhook Payload (From, Body, MessageSid)
    Hook->>WA: handleInboundWebhook(payload)
    WA->>WA: Resolve active appointment by phone & timeframe
    WA->>WA: Update appointment (status = 'scheduled', whatsapp_status = 'confirmed')
    WA-->>Hook: Return {handled: true, action: 'confirmed'}
    Hook-->>Twilio: 200 OK
```

---

## 6. Cross-Platform Mobile Client Architecture (Flutter)

The Flutter application (`apps/mobile`) adheres to Feature-Driven Clean Architecture:

- **State Management:** Riverpod 3 with code-generation (`@riverpod`, `AsyncNotifier`, `Notifier`).
- **Routing:** Declarative `GoRouter` with auth guard redirection (`/login`, `/home`, `/doctors`, `/booking`).
- **HTTP Transport:** Dio client configured with authentication interceptors and token refreshing.
- **Algerian Localization:** Validation rules for 10-digit Algerian phone numbers (`05/06/07`), Wilaya selector (58 Wilayas), and Carte Chifa insurance validation.

```
apps/mobile/lib/
├── core/
│   ├── network/          # Dio client, API interceptors
│   ├── router/           # GoRouter route declarations & guards
│   ├── theme/            # VitalSoft brand design tokens
│   └── widgets/          # Shared atomic widgets & brand logos
└── features/
    ├── auth/             # OTP authentication, Login, Register, StateNotifiers
    ├── doctors/          # Specialties, Doctor listings, Profile reviews
    └── appointments/     # Dynamic slot selection, Booking flow, My Appointments
```

---

## 7. Role-Based Access Control (RBAC) Matrix

| Domain Endpoint | Patient Portal | Doctor Workspace | Clinic Admin | Unauthenticated |
| :--- | :---: | :---: | :---: | :---: |
| `POST /api/v1/auth/login` | ✅ | ❌ | ❌ | ✅ |
| `POST /api/v1/appointments` | ✅ (Own) | ❌ | ✅ (All) | ❌ |
| `GET /api/v1/doctor-portal/schedule` | ❌ | ✅ (Assigned) | ✅ (All) | ❌ |
| `PUT /api/v1/doctor-portal/appointments/{id}/status` | ❌ | ✅ | ✅ | ❌ |
| `GET /api/v1/admin/dashboard` | ❌ | ❌ | ✅ | ❌ |
| `POST /api/v1/admin/appointments/{id}/ping-whatsapp` | ❌ | ❌ | ✅ | ❌ |

---

## 8. Database Entity Relationship Model (UUIDv4)

```mermaid
erDiagram
    CLINICS ||--o{ DOCTORS : "contracts"
    CLINICS ||--o{ APPOINTMENTS : "hosts"
    CLINICS ||--o{ USERS : "registers"
    SPECIALTIES ||--o{ DOCTORS : "categorizes"
    DOCTORS ||--o{ DOCTOR_AVAILABILITIES : "defines"
    USERS ||--o{ APPOINTMENTS : "books"
    DOCTORS ||--o{ APPOINTMENTS : "attends"

    CLINICS {
        uuid id PK "UUIDv4"
        string name
        string address
        string phone
        string timezone
        boolean is_active
    }

    SPECIALTIES {
        uuid id PK "UUIDv4"
        string name
        text description
    }

    DOCTORS {
        uuid id PK "UUIDv4"
        uuid clinic_id FK
        uuid specialty_id FK
        string name
        string email
        string license_number
        int consultation_fee_cents "Strict Integer DZD"
        boolean is_active
    }

    DOCTOR_AVAILABILITIES {
        uuid id PK "UUIDv4"
        uuid doctor_id FK
        tinyint day_of_week
        time start_time
        time end_time
        smallint slot_duration_minutes "30 min default"
    }

    USERS {
        uuid id PK "UUIDv4"
        uuid clinic_id FK
        string name
        string email
        string phone "Algerian format"
        string role "patient | doctor | admin"
        string insurance_provider "CNAS / Chifa"
        string insurance_policy_number
    }

    APPOINTMENTS {
        uuid id PK "UUIDv4"
        uuid patient_id FK
        uuid doctor_id FK
        uuid clinic_id FK
        timestamptz scheduled_at
        string status "pending | scheduled | completed | cancelled"
        int consultation_fee_cents
        string whatsapp_status "pending | sent | confirmed | cancelled_by_patient | failed"
        string whatsapp_message_id
        timestamptz whatsapp_confirmed_at
    }
```

---

## 7. Asynchronous Queue Architecture & Notifications Engine

Outbound patient communications (WhatsApp interactive prompts and SMS fallback alerts) are decoupled from the HTTP request-response lifecycle using a Redis-backed queue system managed by Supervisor:

```mermaid
flowchart LR
    Booking["AppointmentService<br/>bookAppointment()"] -->|Dispatch Job| RedisQueue[("Redis Queue<br/>queue: notifications")]
    RedisQueue --> Worker["Supervisor Queue Worker<br/>queue:work redis --queue=notifications,default"]
    Worker -->|Execute| WAGateway["WhatsAppNotificationService<br/>SendWhatsAppAppointmentReminderJob"]
    Worker -->|Execute| SMSGateway["SmsNotificationService<br/>SendSmsNotificationJob"]
    WAGateway --> TwilioWA["Twilio WhatsApp API"]
    SMSGateway --> TwilioSMS["Twilio SMS API"]
    Worker -.->|Retries [10s, 30s, 90s]| RedisQueue
    Worker -.->|3x Exhausted| FailedHook["failed() Hook<br/>Mark status: failed"]
```

### Queue Operational Invariants
1. **Dedicated Queue Segregation:** Notification workloads run on the isolated `notifications` queue to prevent background notifications from blocking mission-critical transactions.
2. **Exponential Backoff:** Jobs implement progressive delay intervals (`[10, 30, 90]` seconds) across 3 attempts to absorb transient upstream telecom gateway rate limits or downtime.
3. **Graceful Failure Propagation:** Upon exhausting all 3 retries, the `failed(?\Throwable $exception)` lifecycle hook updates the appointment `whatsapp_status` to `failed` and writes telemetry to Laravel error logs without unhandled crashes.
4. **Abstracted Gateway Drivers:** Both `IWhatsAppGateway` and `ISmsGateway` support hot-swappable implementations via service provider bindings (`TwilioWhatsAppGateway` / `LogWhatsAppGateway` and `TwilioSmsGateway` / `LogSmsGateway`).

