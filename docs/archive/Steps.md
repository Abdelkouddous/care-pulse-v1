# VitalBook — Clinic Appointment Booking App
## Master Agent Execution Prompt (`Steps.md`)

> **Instruction to the agent**: Execute every phase sequentially. Do NOT jump ahead.
> Before starting each phase, read and confirm the current state of the codebase.
> Enforce every architectural guardrail listed in § 0 at all times.

---

## § 0 — Immutable Architectural Guardrails

These rules are **non-negotiable** and apply to every line of code generated.

| Guardrail | Rule |
| :--- | :--- |
| **Architecture Pattern** | Strict **Service → Repository → Controller** pipeline. Controllers receive `FormRequest`-validated data only. No raw DB queries in controllers. |
| **Primary Keys** | All DB tables use **UUIDv4** (`uuid` type, `$table->uuid('id')->primary()`). Zero auto-incrementing integers. |
| **Currency / Money** | All monetary values stored as **integer cents** (`int`, e.g., `consultation_fee_cents`). No `float`, `decimal`, or string money fields. |
| **SOLID** | Single Responsibility Principle enforced per class. One reason to change. Dependency Inversion via service container binding. |
| **API Contract** | All backend responses follow **JSON:API-inspired envelope**: `{ "data": ..., "meta": ..., "errors": [...] }`. |
| **Auth** | JWT-based stateless auth (`laravel/sanctum` with token guard). No sessions on API routes. |
| **Type Safety** | Frontend: TypeScript strict mode (`"strict": true`). Backend: PHP 8.3 typed properties, union types, named arguments. |
| **Environment Secrets** | Backend `.env` holds all DB credentials. Frontend `.env.local` holds only `NEXT_PUBLIC_API_URL`. Zero secrets leak to the client. |
| **Migrations** | Every schema change is a new timestamped migration. Never modify an existing migration file after it has been committed. |
| **Low Code Output** | Provide architectural designs, state machines, pseudo-logic, and boilerplate with descriptive comments. Avoid writing full business logic unless it is critical boilerplate. |

---

## § 1 — System Architecture Overview

```
vitalbook-v1/                          Monorepo root (npm workspaces)
|
+-- frontend/                           Next.js 14 (App Router) — Vercel
|   +-- app/                            Route segments (pages)
|   +-- components/                     Reusable UI components (shadcn/ui)
|   +-- lib/
|   |   +-- api/                        Axios/Fetch abstraction layer (HTTP client)
|   |   +-- hooks/                      React Query custom hooks
|   |   +-- utils.ts                    Strictly frontend utilities only
|   +-- types/                          Global TypeScript interfaces/types
|   +-- .env.local                      NEXT_PUBLIC_API_URL only
|
+-- laravel-backend/                    Laravel 13 REST API — AWS ECS Fargate
|   +-- app/
|   |   +-- Http/
|   |   |   +-- Controllers/            Thin controllers (call services only)
|   |   |   +-- Requests/               FormRequest validation classes
|   |   |   +-- Resources/              API Resource transformers (JSON output)
|   |   +-- Services/                   Business logic layer (SRP)
|   |   +-- Repositories/               Eloquent persistence abstraction
|   |   +-- Models/                     Eloquent models (UUIDv4 primary keys)
|   +-- database/
|   |   +-- migrations/                 One migration per schema change
|   |   +-- seeders/                    Dev/staging data seeders
|   +-- routes/api.php                  Versioned API routes (/api/v1/...)
|
+-- docs/                               Architecture docs, ERD, API contracts
```

### Request Lifecycle (Data Flow)

```
Browser (Next.js) → HTTPS → AWS ALB → Laravel API (ECS Fargate)
                                           |
                              FormRequest Validation
                                           |
                              Service Layer (Business Logic)
                                           |
                              Repository Layer (Eloquent ORM)
                                           |
                              PostgreSQL (AWS RDS)
```

---

## § 2 — Database Schema (PostgreSQL, ERD)

> All `id` columns are `uuid`. All `*_cents` columns are `integer`. Timestamps: `created_at`, `updated_at` on every table.

### Core Tables

```
clinics
  id                uuid PK
  name              varchar(255)
  address           text
  phone             varchar(20)
  email             varchar(255) unique
  timezone          varchar(50)         -- e.g. "Africa/Algiers"
  logo_url          varchar(500)
  is_active         boolean default true

specialties
  id                uuid PK
  name              varchar(100) unique -- e.g. "Cardiology"
  description       text

doctors
  id                uuid PK
  clinic_id         uuid FK → clinics.id
  specialty_id      uuid FK → specialties.id
  first_name        varchar(100)
  last_name         varchar(100)
  email             varchar(255) unique
  phone             varchar(20)
  avatar_url        varchar(500)
  bio               text
  consultation_fee_cents  integer NOT NULL  -- Money guardrail: integer cents only
  license_number    varchar(100) unique
  is_active         boolean default true

users (patients)
  id                uuid PK
  first_name        varchar(100)
  last_name         varchar(100)
  email             varchar(255) unique
  phone             varchar(20)
  date_of_birth     date
  gender            enum('male','female','other')
  address           text
  emergency_contact_name    varchar(200)
  emergency_contact_phone   varchar(20)
  insurance_provider        varchar(200)
  insurance_policy_number   varchar(100)
  allergies         text
  current_medications       text
  primary_physician_id      uuid FK → doctors.id nullable
  email_verified_at datetime nullable
  password          varchar(255)        -- hashed

admins
  id                uuid PK
  clinic_id         uuid FK → clinics.id
  name              varchar(200)
  email             varchar(255) unique
  password          varchar(255)
  role              enum('super_admin','clinic_admin','receptionist')

doctor_availabilities
  id                uuid PK
  doctor_id         uuid FK → doctors.id
  day_of_week       smallint            -- 0=Monday, 6=Sunday
  start_time        time
  end_time          time
  slot_duration_minutes  smallint default 30
  is_active         boolean default true

appointments
  id                uuid PK
  patient_id        uuid FK → users.id
  doctor_id         uuid FK → doctors.id
  clinic_id         uuid FK → clinics.id
  scheduled_at      timestamptz         -- appointment datetime (with timezone)
  status            enum('pending','scheduled','cancelled','completed','no_show')
  reason            text
  notes             text                -- doctor/admin notes
  cancellation_reason text nullable
  cancelled_by      enum('patient','doctor','admin') nullable
  reminder_sent_at  timestamptz nullable

medical_records
  id                uuid PK
  appointment_id    uuid FK → appointments.id unique
  patient_id        uuid FK → users.id
  doctor_id         uuid FK → doctors.id
  diagnosis         text
  prescription      text
  follow_up_date    date nullable
  attachments       jsonb               -- array of S3 file URLs
```

---

## § 3 — API Contract (Laravel Routes)

> All routes are versioned under `/api/v1/`. Auth routes use Sanctum token guard.
> Response envelope: `{ "data": ..., "meta": {}, "errors": [] }`

### Authentication (`/api/v1/auth`)

```
POST   /api/v1/auth/register           -- patient self-registration
POST   /api/v1/auth/login              -- patient login → returns Bearer token
POST   /api/v1/auth/admin/login        -- admin login → returns Bearer token
POST   /api/v1/auth/doctor/login       -- doctor login → returns Bearer token
POST   /api/v1/auth/logout             -- revoke current token (auth:sanctum)
POST   /api/v1/auth/refresh            -- refresh token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

### Patients (`/api/v1/patients` — auth:sanctum)

```
GET    /api/v1/patients/me             -- current patient profile
PUT    /api/v1/patients/me             -- update profile
GET    /api/v1/patients/me/appointments
GET    /api/v1/patients/me/appointments/{id}
```

### Doctors (public + auth)

```
GET    /api/v1/doctors                 -- list all active doctors (public)
GET    /api/v1/doctors/{id}            -- doctor profile + availabilities (public)
GET    /api/v1/doctors/{id}/slots      -- available booking slots for a date range
GET    /api/v1/doctors/me              -- doctor's own profile (auth:doctor)
PUT    /api/v1/doctors/me              -- update doctor profile (auth:doctor)
GET    /api/v1/doctors/me/appointments -- doctor's appointment list (auth:doctor)
PUT    /api/v1/doctors/me/appointments/{id}/status  -- update appointment status
```

### Appointments (`/api/v1/appointments`)

```
POST   /api/v1/appointments            -- book appointment (auth:sanctum, patient)
GET    /api/v1/appointments/{id}       -- get single appointment
PUT    /api/v1/appointments/{id}/cancel -- cancel (patient or doctor or admin)
```

### Admin (`/api/v1/admin` — auth:admin)

```
GET    /api/v1/admin/dashboard         -- stats: total, pending, cancelled, completed
GET    /api/v1/admin/appointments      -- paginated list with filters (status, date, doctor)
PUT    /api/v1/admin/appointments/{id}/status
GET    /api/v1/admin/patients          -- paginated patient list
GET    /api/v1/admin/doctors           -- manage doctors
POST   /api/v1/admin/doctors           -- create doctor account
PUT    /api/v1/admin/doctors/{id}
DELETE /api/v1/admin/doctors/{id}      -- soft delete (is_active = false)
```

### Specialties (public)

```
GET    /api/v1/specialties             -- list all specialties
```

---

## § 4 — Frontend Route Map (Next.js App Router)

```
app/
+-- layout.tsx                          root layout (ThemeProvider, ReactQueryProvider)
+-- page.tsx                            Landing page (hero, search doctors, CTA)
|
+-- (auth)/
|   +-- signin/page.tsx                 Patient login form
|   +-- register/page.tsx               Patient registration form
|
+-- (patient)/
|   +-- layout.tsx                      Protected layout (auth check)
|   +-- dashboard/page.tsx              Patient dashboard: upcoming appointments
|   +-- appointments/
|   |   +-- new/page.tsx                Book new appointment (multi-step wizard)
|   |   +-- [id]/page.tsx               Appointment detail + cancel action
|   +-- profile/page.tsx                Patient profile editor
|
+-- doctors/
|   +-- page.tsx                        Doctor listing + search + filters
|   +-- [id]/page.tsx                   Doctor public profile + booking CTA
|
+-- (doctor)/
|   +-- layout.tsx                      Doctor portal protected layout
|   +-- doctors/login/page.tsx          Doctor login
|   +-- doctors/[doctorId]/
|       +-- dashboard/page.tsx          Doctor appointment schedule (today/week)
|       +-- appointments/[id]/page.tsx  Appointment detail + add clinical notes
|
+-- (admin)/
|   +-- layout.tsx                      Admin portal protected layout
|   +-- admin/login/page.tsx            Admin login + passkey verification
|   +-- admin/[adminId]/
|       +-- dashboard/page.tsx          Stats dashboard (StatCards + charts)
|       +-- appointments/page.tsx       Appointments table with filters
|       +-- patients/page.tsx           Patients management table
|
+-- api/                                Next.js API routes (proxy use only)
```

---

## § 5 — State Management & Data Fetching Strategy

```
Frontend Data Architecture:

  React Query (TanStack Query v5)
    Manages all server state: caching, background refetch, optimistic updates
    Custom hooks live in frontend/lib/hooks/

  Axios Instance (frontend/lib/api/client.ts)
    Interceptor: attach Authorization: Bearer <token> from secure storage
    Interceptor: handle 401 → clear token and redirect to /signin
    Interceptor: normalize and unwrap data.data from API envelope

  Zustand (client state only)
    Manages: auth user object, active theme, open modal IDs
    Rule: NO server state in Zustand — server state lives in React Query only
```

---

## § 6 — Execution Phases

---

### PHASE 1 — Backend Foundation (Laravel + PostgreSQL)

**Goal**: Running Laravel API with DB connected, migrations applied, health endpoint live.

#### Step 1.1 — Install Required Composer Packages

```bash
# Run inside laravel-backend/
composer require laravel/sanctum spatie/laravel-permission
```

#### Step 1.2 — Configure PostgreSQL in `.env`

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=vitalbook
DB_USERNAME=vitalbook_user
DB_PASSWORD=<strong_password>
```

#### Step 1.3 — Write Database Migrations (in dependency order)

Create migrations in this exact order to respect FK dependency graph:

1. `create_clinics_table`
2. `create_specialties_table`
3. `create_admins_table` (FK → clinics)
4. `create_users_table` (patients — extend default migration)
5. `create_doctors_table` (FK → clinics, specialties)
6. `create_doctor_availabilities_table` (FK → doctors)
7. `create_appointments_table` (FK → users, doctors, clinics)
8. `create_medical_records_table` (FK → appointments, users, doctors)

> Guardrail Check: Every `id` column must use `$table->uuid('id')->primary()`.
> Every money field must use `$table->integer('*_cents')`. No exceptions.

#### Step 1.4 — Create Eloquent Models

For every model, define:
- `protected $keyType = 'string'; public $incrementing = false;`
- `protected $fillable = [...]`
- All relationship methods (`hasMany`, `belongsTo`, `hasOne`)

#### Step 1.5 — Scaffold Service-Repository Pattern

Create the following directory structure:

```
laravel-backend/app/
  Repositories/
    Contracts/              ← Interfaces (IAppointmentRepository, IDoctorRepository, etc.)
    Eloquent/               ← Concrete Eloquent implementations
  Services/
    AppointmentService.php
    DoctorService.php
    PatientService.php
    AuthService.php
    SlotAvailabilityService.php
```

Register all bindings in `AppServiceProvider`:
```php
// Pseudo-logic in register() method:
// $this->app->bind(IAppointmentRepository::class, EloquentAppointmentRepository::class);
// Repeat for each interface/implementation pair
```

#### Step 1.6 — Implement Authentication

- Publish Sanctum: `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`
- Configure three auth guards in `config/auth.php`: `patient`, `doctor`, `admin`
- Create `AuthController` with: `register`, `login`, `adminLogin`, `doctorLogin`, `logout`
- Create FormRequest classes: `RegisterPatientRequest`, `LoginRequest`

#### Step 1.7 — Implement Core API Endpoints (Priority Order)

1. **AuthController** — register + login (returns Bearer token)
2. **DoctorController** — index, show, slots (public, no auth required)
3. **AppointmentController** — store, show, cancel (patient auth)
4. **PatientController** — profile, my appointments (patient auth)
5. **AdminController** — dashboard stats, appointment management (admin auth)

Rule per controller action:
- Accept only injected `FormRequest` (validated data)
- Call exactly one `Service` method
- Return an `ApiResource` or `ApiResourceCollection`

#### Step 1.8 — Slot Availability Logic

```
SlotAvailabilityService::getAvailableSlots(Doctor $doctor, Carbon $date): array

Pseudo-logic:
1. Fetch doctor's availability record matching $date->dayOfWeek
2. If no availability record found, return empty array
3. Generate all time slots between start_time and end_time using slot_duration_minutes as step
4. Fetch all existing appointments for this doctor on this date where status != 'cancelled'
5. Map booked appointments to their scheduled_at timestamps (slot format)
6. Filter generated slots: remove any slot that exists in booked list
7. Return array of available slot timestamps (ISO 8601 format)
```

#### Step 1.9 — Write Feature Tests (Pest)

Minimum required test coverage for MVP:
- `AuthTest`: register success, login success, invalid credentials return 401
- `AppointmentTest`: book success, cancel success, double-book same slot returns 422
- `SlotAvailabilityTest`: slots generated correctly, booked slot excluded from results
- `AdminTest`: admin can update appointment status, patient cannot access admin routes

---

### PHASE 2 — Frontend API Integration (Next.js)

**Goal**: Remove all legacy Appwrite/direct DB calls. Frontend communicates via HTTP only.

#### Step 2.1 — Create Axios API Client

File: `frontend/lib/api/client.ts`

```typescript
// Boilerplate structure:
// 1. Create axios instance: baseURL = process.env.NEXT_PUBLIC_API_URL
// 2. Request interceptor: read token from store → set Authorization: Bearer <token>
// 3. Response interceptor: on 401 → clear auth state, redirect to /signin
// 4. Response interceptor: unwrap response.data.data from API envelope
// Export typed get/post/put/delete wrapper functions
```

#### Step 2.2 — Create Typed API Service Modules

```
frontend/lib/api/
  auth.service.ts         ← login, register, logout, refreshToken
  doctor.service.ts       ← getDoctors, getDoctorById, getDoctorSlots
  appointment.service.ts  ← bookAppointment, cancelAppointment, getMyAppointments
  patient.service.ts      ← getMyProfile, updateMyProfile
  admin.service.ts        ← getDashboardStats, getAppointments, updateAppointmentStatus
  specialty.service.ts    ← getSpecialties
```

#### Step 2.3 — Create React Query Custom Hooks

```
frontend/lib/hooks/
  useAuth.ts              ← useLogin, useRegister, useLogout mutations
  useDoctors.ts           ← useDoctorsList, useDoctorDetail, useDoctorSlots queries
  useAppointments.ts      ← useBookAppointment (mutation), useMyAppointments (query)
  useAdminDashboard.ts    ← useDashboardStats, useAdminAppointments queries
  useSpecialties.ts       ← useSpecialties query
```

#### Step 2.4 — Define TypeScript Types

```
frontend/types/
  auth.types.ts           ← PatientUser, DoctorUser, AdminUser, AuthState
  doctor.types.ts         ← Doctor, DoctorAvailability, TimeSlot
  appointment.types.ts    ← Appointment, AppointmentStatus, BookingPayload
  patient.types.ts        ← Patient, PatientProfile
  admin.types.ts          ← DashboardStats, AdminAppointment
  api.types.ts            ← ApiEnvelope<T>, ApiError, PaginatedResponse<T>
```

#### Step 2.5 — Audit & Cleanse Existing Components

Scan every file in `frontend/components/` and `frontend/app/` for:
- Any import from `@/lib/actions/...` → remove, replace with hook call
- Any direct Appwrite SDK calls → remove entirely
- Any hardcoded legacy fetch URLs → replace using `client.ts`

Priority components to audit:
- `components/forms/PatientForm.tsx`
- `components/AppointmentModal.tsx`
- `components/PasskeyModal.tsx`
- `components/PassKeyDoctorModal.tsx`
- `app/admin/[adminId]/` all pages
- `app/doctors/[doctorId]/` all pages

#### Step 2.6 — Build Core Pages (Missing or Incomplete)

##### Landing Page (`app/page.tsx`)
- Hero section: headline, sub-headline, primary CTA ("Book Appointment")
- Specialties carousel (data from `useSpecialties`)
- Top doctors grid (data from `useDoctorsList`, limit 6)
- "How it works" section (3 steps: Search → Book → Confirm)
- Testimonials section
- Footer with clinic info

##### Doctor Listing (`app/doctors/page.tsx`)
- Search bar: filter by name or specialty name
- Filter sidebar: specialty dropdown, available day selector
- Paginated doctor cards: photo, name, specialty, fee (formatted from cents)
- "Load more" pagination or infinite scroll

##### Doctor Profile (`app/doctors/[id]/page.tsx`)
- Doctor photo, full name, specialty, consultation fee
- Bio section
- Availability calendar (days they are available)
- "Book Appointment" CTA → redirect to booking flow with doctorId pre-filled

##### Booking Flow (`app/(patient)/appointments/new/page.tsx`)

Multi-step wizard with progress indicator:
```
Step 1: Select Doctor (if not pre-selected from profile page)
Step 2: Select Date → fetch and display available slots for that date
Step 3: Select Time Slot from available list
Step 4: Enter Appointment Reason (textarea, required)
Step 5: Review & Confirm (summary of all selections)
Step 6: Success screen (appointment ID, scheduled time, doctor name, CTA to dashboard)
```

##### Patient Dashboard (`app/(patient)/dashboard/page.tsx`)
- Upcoming appointments list (sorted by date asc)
- Past appointments list (sorted by date desc)
- Cancel appointment action button (only for status = pending or scheduled)
- Redirect to booking flow CTA

##### Admin Dashboard (`app/(admin)/admin/[adminId]/dashboard/page.tsx`)
- Four StatCards: Total / Pending / Scheduled / Cancelled
- Recent appointments data table with columns: Patient, Doctor, Date, Status, Actions
- Inline status update action (change to scheduled, cancelled, completed)
- Quick filter tabs: Today | This Week | All

##### Doctor Dashboard (`app/(doctor)/doctors/[doctorId]/dashboard/page.tsx`)
- Today's appointment timeline (chronological list)
- Upcoming appointments (next 7 days)
- Appointment detail panel: patient info, reason, notes input
- Status update: mark as completed or no_show

---

### PHASE 3 — Auth & Route Protection

#### Step 3.1 — Auth State Management

```typescript
// Zustand store pseudo-structure:
interface AuthState {
  user: PatientUser | DoctorUser | AdminUser | null
  token: string | null
  role: 'patient' | 'doctor' | 'admin' | null
  isLoading: boolean
  login: (token: string, user: User, role: Role) => void
  logout: () => void
  initialize: () => Promise<void>  // called on app boot: validate token via /auth/me
}
// Token stored in localStorage (development) or httpOnly cookie (production via BFF)
```

#### Step 3.2 — Route Protection Middleware (`frontend/middleware.ts`)

```typescript
// Pseudo-logic:
// 1. Read token from cookie header (prefer httpOnly) or Authorization header
// 2. Define protection matrix:
//    /patient/*     → requires role === 'patient'
//    /admin/*       → requires role === 'admin'
//    /doctors/me/*  → requires role === 'doctor'
// 3. Token missing or invalid → redirect to /signin with returnUrl param
// 4. Role mismatch → redirect to correct role dashboard
// 5. Public routes (/, /doctors, /doctors/[id], /signin, /register) → always pass
```

#### Step 3.3 — Protected Layout Components

- `app/(patient)/layout.tsx` — validates patient token, redirects to /signin if invalid
- `app/(admin)/layout.tsx` — validates admin token + checks passkey cookie
- `app/(doctor)/layout.tsx` — validates doctor token, redirects to /doctors/login

---

### PHASE 4 — Notifications

#### Step 4.1 — Email Notifications (Laravel Mail + AWS SES)

Configure mail driver in production:
```
MAIL_MAILER=ses
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_DEFAULT_REGION=eu-west-1
```

Notification triggers and templates:

| Event | Recipient | Email Template |
| :--- | :--- | :--- |
| Appointment booked | Patient | Booking confirmation + appointment details |
| Appointment booked | Doctor | New appointment notification |
| Appointment cancelled | Patient | Cancellation confirmation |
| Appointment cancelled | Doctor | Appointment removed from schedule |
| Appointment reminder | Patient | 24h before: reminder with details + cancel link |

Use Laravel `Notification` classes dispatched via `Queue` (async, do not block API response).

#### Step 4.2 — SMS Notifications (Phase 4b — optional for MVP+)

- Move Twilio integration to Laravel backend only (remove from frontend entirely)
- Trigger: appointment booked confirmation SMS, 1h before reminder SMS

---

### PHASE 5 — Deployment Architecture (AWS + Vercel)

#### Frontend — Vercel

```
Deployment: git push to main → Vercel auto-deploys Next.js app
Environment Variables (set in Vercel Dashboard):
  NEXT_PUBLIC_API_URL = https://api.vitalbook.com
  NEXTAUTH_SECRET = <generated secret>
Custom Domain: app.vitalbook.com
Preview deployments: enabled for all PRs automatically
```

#### Backend — AWS

```
Infrastructure:
  AWS ECR            ← Docker image registry (one repo: vitalbook-api)
  AWS ECS Fargate    ← Serverless container (no EC2 to manage)
  AWS ALB            ← HTTPS load balancer (SSL via AWS Certificate Manager)
  AWS RDS PostgreSQL ← Multi-AZ for high availability
  AWS S3             ← File uploads: avatars, medical record attachments
  AWS SES            ← Transactional email delivery
  AWS Secrets Manager ← Secure storage of all credentials
  AWS CloudWatch     ← Logs and monitoring

API Domain: api.vitalbook.com → ALB → ECS Task → Laravel app
```

#### Dockerfile (Laravel API — Multi-Stage)

```dockerfile
# Stage 1 — Composer dependencies (no dev packages)
# FROM composer:2 AS vendor
# COPY composer.json composer.lock ./
# RUN composer install --no-dev --optimize-autoloader

# Stage 2 — Final image
# FROM php:8.3-fpm-alpine
# Install: pgsql extension, nginx, supervisor
# COPY --from=vendor /app/vendor ./vendor
# COPY . .
# RUN php artisan config:cache && php artisan route:cache
# EXPOSE 8000
# CMD: supervisord (manages php-fpm + nginx)
```

#### CI/CD Pipeline (GitHub Actions skeleton)

```yaml
# .github/workflows/deploy-backend.yml
# Triggers: push to main
# Jobs:
#   1. test: run php artisan test (Pest) with pgsql service container
#   2. build: docker build, tag with git SHA, push to ECR
#   3. deploy: aws ecs update-service --force-new-deployment --cluster vitalbook --service api
```

#### Environment Strategy

```
Development:  laravel-backend/.env         → localhost:5432
Staging:      AWS Secrets Manager          → ECS Task Definition (staging cluster)
Production:   AWS Secrets Manager          → ECS Task Definition (prod cluster)

Secrets never committed to git. .env is in .gitignore.
```

---

### PHASE 6 — MVP Acceptance Checklist

Before declaring MVP complete, verify every item below.

#### Core User Flows

- [ ] Patient can self-register with email and phone
- [ ] Patient can log in and receive a valid JWT token
- [ ] Patient can browse paginated doctors list
- [ ] Patient can view a doctor's public profile and consultation fee
- [ ] Patient can view available time slots for a selected date
- [ ] Patient can complete the multi-step booking wizard and receive confirmation
- [ ] Patient can cancel a pending or scheduled appointment
- [ ] Patient receives a booking confirmation email
- [ ] Doctor can log in to their portal
- [ ] Doctor can view their daily and weekly appointment schedule
- [ ] Doctor can mark an appointment as completed or no-show
- [ ] Admin can log in to admin portal (with passkey)
- [ ] Admin can view the dashboard stats (4 StatCards)
- [ ] Admin can filter appointments by date, doctor, status
- [ ] Admin can change any appointment status
- [ ] Admin can create and deactivate doctor accounts

#### Technical Quality Gates

- [ ] All API endpoints return correct HTTP status codes (200, 201, 400, 401, 403, 404, 422, 500)
- [ ] All `id` fields in DB and API responses are UUID format
- [ ] Zero floating-point money values anywhere (all cents as integers)
- [ ] Zero raw DB queries in controllers (all via repositories)
- [ ] Frontend has zero direct database access
- [ ] TypeScript strict mode passes with zero `any` types
- [ ] All forms validated client-side (Zod) AND server-side (FormRequest)
- [ ] All feature tests pass: `php artisan test`
- [ ] No secrets visible in Next.js client bundle (`next build` audit)
- [ ] HTTPS enforced on all endpoints
- [ ] CORS configured: only `app.vitalbook.com` is an allowed origin on the API
- [ ] Double-booking the same slot returns 422 (tested in feature test)

---

## § 7 — Development Sprint Order (Recommended)

```
Sprint 1  (Phase 1.1 → 1.6)   DB Migrations + Models + Auth API
Sprint 2  (Phase 1.7 → 1.9)   Core API Endpoints + Feature Tests
Sprint 3  (Phase 2.1 → 2.5)   Frontend API Client + Type Layer + Component Cleanup
Sprint 4  (Phase 2.6 Part A)   Landing page + Doctor listing + Doctor profile
Sprint 5  (Phase 2.6 Part B)   Booking wizard + Patient dashboard
Sprint 6  (Phase 2.6 Part C)   Admin dashboard + Doctor dashboard
Sprint 7  (Phase 3)            Auth guards + Protected routes + Role middleware
Sprint 8  (Phase 4.1)          Email notifications via SES
Sprint 9  (Phase 5)            Docker + AWS ECS + Vercel deployment
Sprint 10 (Phase 6)            MVP acceptance checklist QA pass
```

---

## § 8 — Key Design Decisions (Rationale)

| Decision | Why |
| :--- | :--- |
| **Laravel over Node.js** | Mature ORM (Eloquent), built-in FormRequest validation, Service Container for DI, Artisan CLI — superior for CRUD-heavy healthcare data management |
| **PostgreSQL over MySQL** | JSONB for medical attachments, native UUID type, `timestamptz` for correct timezone handling, superior indexing options |
| **React Query over Redux** | Server state belongs to React Query. Zustand for UI state only. Eliminates 70% of boilerplate vs Redux Toolkit for this use case |
| **Vercel for Frontend** | Zero-config Next.js deployment, global CDN edge network, automatic preview deployments, integrated SSL |
| **AWS Fargate for API** | Serverless containers — no EC2 management, auto-scales to demand, per-second billing |
| **UUIDs everywhere** | Prevents enumeration attacks (no `/patients/1`), enables future DB sharding without collision, safe for distributed systems |
| **Integer cents for money** | Eliminates floating-point precision bugs. `0.1 + 0.2 != 0.3` in IEEE 754. Fee of 50.00 DZD stored as `5000`. Formatted to display currency only at the UI layer. |
| **Stateless JWT auth** | API is horizontally scalable. Each ECS Fargate task is independent. No shared session store or sticky sessions required. |
| **Service-Repository pattern** | Insulates controllers from ORM. Business logic is testable in isolation. Repository can be swapped (e.g., cache layer) without touching services. |
| **Monorepo structure** | Frontend and backend teams work in parallel without conflicts. Shared CI/CD. Clear physical boundaries enforce architectural rules. |

---

*Generated by Antigravity — VitalBook Architecture Engine*
*Stack: Next.js 14 + Laravel 13 + PostgreSQL | Deploy: Vercel + AWS ECS Fargate*
*Last updated: 2026-09-30*
