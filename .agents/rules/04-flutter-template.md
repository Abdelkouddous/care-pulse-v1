
### ROLE & OBJECTIVE

You are a Principal Mobile Architect and Senior Flutter Engineer. Your task is to audit an inventory of 29 mobile UI screens from a healthcare/service booking template against my existing backend MVP, filter out non-essential or unbuilt features, and generate an actionable Flutter implementation roadmap that strictly adheres to my brand design tokens defined in `globals.css`.

---

### CONTEXT & INPUTS

1. **Current Backend MVP Scope (Laravel / Database Schema):**

   <!-- PASTE YOUR EXISTING DATABASE TABLES, MODELS, AND API ENDPOINTS HERE -->

   <!-- Example: users, doctors/providers, services, appointments, time_slots -->
2. **Frontend Brand Tokens (`globals.css`):**

   <!-- PASTE YOUR GLOBALS.CSS CONTENT OR CSS VARIABLES HERE -->

   <!-- Example: --primary: #...; --background: #...; --font-sans: 'Inter', ... -->
3. **Complete Screen Inventory (29 Screens):**

   - **Client Experience:** `PatientHome`, `Category`, `Doctor List`, `Filter`, `Doctor Gallery`, `Packages Details`, `Booking Details`, `My Bookings`, `My Addresses`, `My Ratings`, `Saved`
   - **Provider Operations:** `Provider Home`, `Provider Appointments`, `Provider Pending Appointments`, `Provider Booking Details`, `Provider Slot Management`, `Provider My Services`, `Provider Packages`, `Provider Setting`, `Slot Management Edit`, `Provider Suggest Category`
   - **Wallet & Billing:** `My Wallet`, `Add Money`, `Available Offers`, `Payment Method`, `Provider Wallet`, `Provider Earnings`, `Credits & Referrals`
   - **Communication & Social:** `Chat Inbox`, `Chat Conversation`, `Notification`, `Provider Chat`, `Provider Notification`, `Video Call`, `Reels`, `Shorts Videos`

---

### EVALUATION CRITERIA

Classify every screen into one of three strict tiers:

- **TIER 1: MVP READY (Critical Path)**
  Screens whose required data models, state transitions, and business logic are 100% supported by the current backend schema.
- **TIER 2: ADAPTABLE (Scope Down)**
  Screens essential to the user journey that contain supplementary UI components not yet backed by the API (e.g., complex coupon validation, loyalty coins, secondary filter chips). These must be adapted by hiding or mocking non-core elements without breaking UX.
- **TIER 3: DEFERRED (Phase 2 / Omit)**
  Screens requiring dedicated, heavy backend infrastructure not present in an MVP (e.g., WebRTC signaling servers for `Video Call`, media transcoding/CDN delivery pipelines for `Shorts Videos`/`Reels`, automated payment escrow for `Add Money`/`Provider Wallet`). Omit these completely from the navigation tree.

---

### REQUIRED OUTPUTS

#### 1. Screen Audit & Triage Matrix

Provide a Markdown table with the following columns:

| Screen Name | Target Persona (Client/Provider) | Classification (MVP Ready / Adaptable / Deferred) | Associated Backend Entity / Endpoint | UI Adaptations Needed |
| :---------- | :------------------------------- | :------------------------------------------------ | :----------------------------------- | :-------------------- |

#### 2. MVP Critical User Journey (Screen Sequence)

Outline the minimal end-to-end routing graph for both Client and Provider personas:

- **Client Flow:** Discovery $\rightarrow$ Provider Details $\rightarrow$ Slot Selection $\rightarrow$ Booking Confirmation $\rightarrow$ Appointment Tracking.
- **Provider Flow:** Dashboard $\rightarrow$ Availability/Slot Configuration $\rightarrow$ Request Acceptance $\rightarrow$ Appointment Execution.

#### 3. Flutter Clean Architecture Scaffold

Generate the concrete Flutter scaffolding according to the Repository-Service pattern and SOLID principles:

- **Design Tokens Layer:** A typed, immutable `ThemeExtension<AppColorsExtension>` and a `ThemeData` setup that maps 1:1 to the provided `globals.css` variables (colors, borders, typography).
- **Core Atomic Widgets:** Clean, decoupled implementations for reusable elements identified across the screens (e.g., `SlotSelectionGrid`, `StatusBadge`, `ProviderCard`).
- **Feature Module Layout:** A modular directory structure (`features/<feature_name>/{data,domain,presentation}`) showing where the validated screens, DTOs, and state managers (BLoC/Cubit) reside.

#### 4. Backend Gap Analysis

List any missing foreign keys, enum states, or REST endpoints required to fully support the Tier 1 and Tier 2 screens without workarounds.
