# TASK: UNIFY NEXT.JS ARCHITECTURE, RESOLVE ROLE ROUTING CONFUSION & PURGE DUPLICATES

## 1. CONTEXT & PROBLEM STATEMENT

The project currently has overlapping, conflicting route directories:

- `app/dashboard` was built with patient flows (`book`, `appointments`, `patients/[userId]`) while an `app/patient` directory also exists.
- `app/doctors` contains loose UI components mixed inside route folders.
- `app/admin` has an invalid nested directory bug (`admin/[adminId]/page/page.tsx`).
- There are multiple duplicate files across `components/` vs `components/ui/`, duplicate `globals.css`, and duplicate auth routes (`/login` vs `/signin`).

Your mission is to refactor this repository into a clean, professional architecture with 3 isolated role-based portals, consolidate all duplicates, and update all affected imports.

---

## 2. STRICT CONSTRAINTS (DO NOT VIOLATE)

1. **NO LOOSE COMPONENTS IN `app/`:** The `app/` folder is strictly for Next.js routing primitives (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`). All presentational UI, modals, and feature sections must live in `components/` or `features/`.
2. **DELETE `app/dashboard` ENTIRELY:** Do NOT leave a generic `app/dashboard` route. All patient flows must be housed under `app/patient/dashboard`.
3. **NO CASE CONFLICTS:** Standardize all component filenames to `kebab-case.tsx` (or maintain consistent matching conventions) to prevent macOS vs. Linux build crashes.
4. **UPDATE ALL IMPORTS:** Whenever a file is moved, renamed, or deleted, immediately search the entire codebase and update all import paths (`@/components/...`, `@/features/...`, etc.) so the TypeScript compiler passes with 0 errors.

---

## 3. STEP-BY-STEP REFACTORING INSTRUCTIONS

### PHASE 1: RESOLVE THE 3 DASHBOARD ROLES & ROUTING

#### A. Patient Portal (`app/patient/`)

- Delete the old, generic `app/dashboard` directory after migrating its contents into `app/patient/dashboard`:
  - `app/dashboard/page.tsx` -> `app/patient/dashboard/page.tsx` (Summary: Next appointment card, recent bookings list, quick "Book Appointment" button).
  - `app/dashboard/appointments/page.tsx` -> `app/patient/dashboard/appointments/page.tsx` (Full booking history & status: Pending, Confirmed, Cancelled).
  - `app/dashboard/book/page.tsx` -> `app/patient/dashboard/book/page.tsx` (Doctor selection & appointment booking wizard).
  - `app/dashboard/profile/page.tsx` -> `app/patient/dashboard/profile/page.tsx` (Patient personal info, emergency contacts, medical history).
  - Remove redundant nested route `app/dashboard/patients/[userId]/*` and consolidate its profile/appointment logic into the routes above.
- Create a dedicated layout: `app/patient/layout.tsx` (Patient-specific navigation shell: Bookings, Book Appointment, Profile, Logout).

#### B. Doctor Portal (`app/doctors/`)

- Remove all non-route files from `app/doctors/`:
  - Move `app/doctors/doctorsCard.tsx` -> `features/doctors/components/doctor-card.tsx`
  - Move `app/doctors/DoctorSignUp.tsx` -> `features/doctors/components/doctor-signup-form.tsx`
  - Move `app/doctors/components/CarouselCard.tsx` -> `features/doctors/components/carousel-card.tsx`
  - Delete `app/doctors/components/` once empty.
- Ensure the Doctor Dashboard (`app/doctors/dashboard/page.tsx`) implements the required clinical workflow:
  1. **Today's Patients Queue:** Table/cards listing patients booked for today with their queue number, appointment time, reason, and status actions (Mark "In Consultation", "Completed", "Cancelled").
  2. **Intake Capacity Setup:** An adjustable daily quota control allowing the doctor to set their maximum patient intake per day (**default value: 20 patients/day**). Include a toggle for "Accepting Walk-ins/New Bookings Today" (Open/Closed).
  3. **Queue Summary Metrics:** Quick KPI tiles: Total Booked Today, Completed, Remaining, and Current Daily Limit (e.g., "14 / 20 Patients").
- Layout: `app/doctors/layout.tsx` (Doctor-specific shell: Today's Queue, Schedule/Settings, Doctor Profile).

#### C. Admin Portal (`app/admin/`)

- Fix the nested folder routing bug:
  - Flatten `app/admin/[adminId]/page/page.tsx` -> `app/admin/[adminId]/page.tsx` (or remove if redundant with dashboard).
- Ensure Admin Dashboard (`app/admin/dashboard/page.tsx`) implements executive operations:
  1. **System KPIs:** Total Doctors active, Total Registered Patients, Appointments Completed this month, Platform Activity rate.
  2. **Doctors/Clinics Management:** Table to view, verify/approve, or suspend doctor accounts and review their specialties.
  3. **Patient Directory:** Searchable table of registered patients with account status and appointment history.
  4. **Reports & Audit Logs:** System activity log view for appointments and security events.
- Layout: `app/admin/layout.tsx`:
  - Must include `export const metadata: Metadata = { robots: { index: false, follow: false } };` to prevent search engine indexing.

---

### PHASE 2: PURGE CONFIRMED DUPLICATES & DEAD FILES

Delete the following redundant files immediately:

1. `components/StatCard.tsx` (Retain `components/ui/stat-card.tsx` or `components/ui/StatCard.tsx`)
2. `components/StatusBadge.tsx` (Retain `components/ui/status-badge.tsx` or `components/ui/StatusBadge.tsx`)
3. `components/SubmitButton.tsx` (Retain `components/ui/submit-button.tsx` or `components/ui/SubmitButton.tsx`)
4. `components/CustomFormField.tsx` (Retain `components/forms/CustomFormField.tsx`)
5. `components/card/Card.tsx` and the `components/card/` directory (Retain `components/ui/card.tsx`)
6. `app/styles/globals.css` and `styles/globals.css` (Retain ONLY `app/globals.css`)
7. `styles/datepicker-styles.css` (Merge any unique rules into `styles/datepicker.css` and delete)
8. `app/signin/` (Merge logic into `app/login/` and delete `app/signin/`)
9. `app/icons.tsx` (Consolidate into `components/icons.tsx` or `components/ui/icons.tsx`)
10. `app/Transitions.tsx`, `app/tailwind-indicator.tsx`, `app/theme-toggle.tsx` -> Move these out of `app/` into `components/common/` or `components/layout/`.

---

### PHASE 3: ORGANIZE FEATURE DOMAINS

Group domain-specific UI components into `features/<domain>/components/`:

- `features/landing/components/`:
  - `HeroSection.tsx`, `TrustedBySection.tsx`, `TrendingDoctorsSection.tsx`, `BookAppointmentSection.tsx`, `PhoneBookingSection.tsx`, `Testimonials.tsx`, `NewsLetter.tsx`
- `features/auth/components/`:
  - `PasskeyModal.tsx`, `PassKeyDoctorModal.tsx`, `RegisterForm.tsx`, `LogoutButton.tsx`
- `features/admin/components/`:
  - `AdminForm.tsx`, `ContactAdmin.tsx`, admin KPI & management tables.
- `features/doctors/components/`:
  - `DoctorForm.tsx`, `doctor-card.tsx`, `doctor-signup-form.tsx`, `carousel-card.tsx`, daily capacity settings component.
- `features/appointments/components/`:
  - `AppointmentModal.tsx`, `AppointmentForm.tsx`, `FileUploader.tsx`

---

### PHASE 4: CONSOLIDATE HOOKS & CONSTANTS

- Move all custom hooks inside `lib/hooks/` (`useAdminDashboard.ts`, `useAppointments.ts`, `useAuth.ts`, `useDoctors.ts`, `useSpecialties.ts`) into root `hooks/`. Delete `lib/hooks/`.
- Move `lib/constants/algeria.ts` into root `constants/algeria.ts`. Delete `lib/constants/`.

---

## 4. ACCEPTANCE CRITERIA

1. `app/dashboard` does not exist anywhere in the project.
2. Navigating to `/patient/dashboard` displays the patient view (my bookings, book, profile).
3. Navigating to `/doctors/dashboard` displays today's patient queue and the daily capacity limiter (default 20 patients/day).
4. Navigating to `/admin/dashboard` displays doctor/patient management, KPIs, and reports.
5. No non-route components exist inside `app/`.
6. Only one `globals.css` exists at `app/globals.css`.
7. Running `npm run build` or `npx tsc --noEmit` succeeds with zero errors.
