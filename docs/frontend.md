ROLE
You are a senior product designer + senior frontend engineer. Your job is to
redesign and professionalize the UI/UX of "CarePulse", a healthcare appointment
booking web app, to the quality level of products like Zocdoc, Doctolib, Linear,
and Stripe Dashboard: clean, calm, trustworthy, and information-dense without
clutter.

STEP 0: DISCOVER BEFORE CHANGING

1. Inspect the codebase: framework, router, styling approach (Tailwind/CSS
   modules/etc.), component library, existing routes, and data-fetching.
2. List all existing pages/routes per role (Patient, Doctor, Admin, Auth).
3. Reuse the existing stack. Do NOT add a new UI framework unless clearly
   justified. Do NOT break existing routes, auth flow, API calls, or business logic.
4. Output a short plan (pages to change, shared components to create) and then
   implement in the phases below.

PHASE 1: DESIGN SYSTEM (single source of truth)

- Design tokens (CSS variables or Tailwind theme): colors, typography scale,
  spacing (4/8px grid), radii, shadows, z-index.
- Palette: keep the brand green/teal as primary. Add neutral greys, plus semantic
  colors: success, warning, danger, info. One consistent app background and
  one surface (card) color. Minimum WCAG AA contrast (4.5:1 for text).
- Typography: ONE sans-serif family (e.g. Inter or Plus Jakarta Sans) with a
  defined scale (display, h1, h2, h3, body, small, caption). Remove stray serif fonts.
- Full dark mode via tokens (the toggle already exists; make it work everywhere
  with no hard-coded colors).
- Build reusable components: Button (primary/secondary/ghost/danger, loading
  state), Input, Select, Textarea, DatePicker/TimeSlotPicker, Card, StatCard,
  Badge/StatusPill, Avatar (initials derived from the REAL name), DataTable
  (sort, search, filter, pagination, row actions, empty/loading/error states),
  Modal/Dialog, Toast, Tabs, Breadcrumbs, Skeleton loaders, EmptyState, PageHeader.

PHASE 2: APP SHELL & NAVIGATION
Create ONE shared layout with role-based navigation:

- Desktop: collapsible left sidebar (logo, nav items with icons, active state,
  user card + logout at the bottom) and a slim top bar (page title + breadcrumbs,
  global search, notifications bell, theme toggle, avatar menu).
- Mobile: top bar + hamburger drawer or bottom tab bar. Fully responsive
  (375px, 768px, 1024px, 1440px).
- Patient nav: Dashboard, My Appointments, Book Appointment, Health Profile,
  Settings.
- Doctor nav: Dashboard, Today's Schedule, Appointments, Patients, Prescriptions,
  Health Plans, Profile.
- Admin nav: Overview, Appointments, Doctors, Patients, Reports, Settings.
- Fix page titles so the header reflects the current page (never "Profile" everywhere).
- Remove duplicated links (navbar AND avatar dropdown both listing the same items).

PHASE 3: PAGE-BY-PAGE REDESIGN

AUTH (patient sign-in / OTP / doctor login / admin)

- Split layout: brand panel + form card. Clear steps: phone number -> OTP
  (6 separate digit boxes, auto-advance, paste support, resend timer) -> success.
- Fix the broken Back button icon. Add inline validation and error messages.
- Keep the test-credentials box but make it readable, clearly labeled "Demo
  account", with a working auto-fill button.
- Replace bare spinners with a branded loading screen or skeleton.

PATIENT DASHBOARD

- Greeting with the real patient name, a "Next appointment" hero card (doctor,
  date/time, location, Join/Reschedule/Cancel), quick stats (upcoming, past,
  medications), recent medical history timeline with status badges, prominent
  "Book appointment" CTA.

BOOK APPOINTMENT (multi-step wizard with progress indicator)

1. Choose doctor: searchable cards with avatar, specialty, rating, next
   availability; filter by specialty.
2. Choose date + available time slots (calendar + slot chips, disabled past/booked).
3. Reason + notes (helper text, character counter).
4. Review & confirm summary, then success screen with "Add to calendar".

- Fix typos ("Annual monthly check-up", "Submit Appointment").

MY APPOINTMENTS

- Tabs: Upcoming / Past / Cancelled. Appointment cards or table with doctor,
  specialty, date/time, status badge, actions (reschedule, cancel with confirm
  dialog). Designed empty state with illustration and "Book your first
  appointment" CTA. Remove the stray "Back home" heading and horizontal scroll.

HEALTH PROFILE

- Balanced 2-column layout: identity card (real initials, patient ID, blood type,
  primary physician, member since), stats row, medical history timeline,
  medications list, allergies, documents/records with a "Request records" action.

DOCTOR DASHBOARD

- KPI cards (today's appointments, total patients, pending requests, prescriptions).
- "Today's schedule" timeline with patient NAMES (not "Patient #1"), status, and
  quick actions (start, reschedule, add notes).
- Recent patients table, quick actions (new prescription, schedule appointment)
  that are fully visible, and a weekly appointments chart.
- Fix initials/name mismatch and the specialty label (one clear specialty).

ADMIN DASHBOARD

- Replace the current header with a proper page header ("Overview" + date range picker).
- StatCards for Scheduled / Pending / Cancelled / Total with trend indicators
  and clearly readable numbers (no low-contrast text).
- Appointments DataTable: columns ID, Patient (avatar + name), Status (colored
  badge), Appointment date/time, Doctor, Actions (confirm, reschedule, cancel,
  view). Include search, status filter, date filter, sorting, pagination with
  "Showing 1-10 of N", and bulk actions.
- Charts: appointments over time, status distribution, top doctors.
- Make the stats and the table use the SAME data source so they never disagree.

PHASE 4: STATES, UX & QUALITY

- Every data view needs loading (skeleton), empty, error (with retry), and
  success states.
- Toasts for all mutations; confirmation dialogs for destructive actions.
- Microinteractions: 150-200ms transitions, hover/focus/active states, subtle
  shadows. No gratuitous animation; respect prefers-reduced-motion.
- Accessibility: semantic HTML, visible focus rings, keyboard navigation, ARIA
  labels, alt text, color never the only signal, WCAG AA.
- Consistency: all dates/times formatted through one utility; all status colors
  from one map; no hard-coded colors or magic numbers.
- Replace placeholder/mock text and remove typos everywhere.

CONSTRAINTS

- Preserve existing functionality, routes, and API contracts.
- Healthcare context: prioritize clarity, trust, and privacy. Mask sensitive
  data where appropriate.
- Clean, typed, componentized code with no duplicated markup.
- Work in small, reviewable steps. After each phase, summarize what changed and
  list files touched.

DELIVERABLES

1. Short plan (Step 0 findings).
2. Design system + shared components.
3. App shell + navigation per role.
4. Redesigned pages in the order above.
5. Final checklist confirming: responsive, dark mode, a11y, all states, no
   data inconsistencies, no typos.
