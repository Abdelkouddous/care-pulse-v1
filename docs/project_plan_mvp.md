# VitalBook — MVP Project Plan & Delivery Roadmap

> **Status:** Production MVP Baseline Verified  
> **Governance:** Strict Max 2-Ticket WIP Limit · Enterprise Engineering Protocol  
> **Release Target:** V1.0.0 Full-Stack Launch

---

## 1. Project Overview & MVP Objectives

VitalBook is a multi-tenant healthcare scheduling and clinic operations ecosystem engineered for the Algerian medical market. The MVP connects patients, physicians, and clinic staff across three client interfaces:
- **Web App:** Next.js 14 multi-portal system (Patient, Doctor, Admin).
- **Mobile App:** Flutter 3.x native client (iOS & Android).
- **Backend API:** Laravel 11 REST API with Supabase PostgreSQL and Twilio WhatsApp gateway.

---

## 2. Delivery Milestones & Progress

```mermaid
gantt
    title VitalBook Delivery Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1 (Completed)
    Multi-Tenant Core & Auth          :done, p1, 2026-09-01, 2026-09-15
    Slot Generation & Concurrency     :done, p2, 2026-09-16, 2026-09-30
    section Phase 2 (Completed)
    Algerian Locale & Chifa Support   :done, p3, 2026-10-01, 2026-10-05
    Interactive Demo Tour             :done, p4, 2026-10-06, 2026-10-08
    section Phase 3 (Completed)
    Flutter Mobile Architecture       :done, p5, 2026-10-08, 2026-10-12
    SMS OTP & Mobile Booking          :done, p6, 2026-10-12, 2026-10-16
    section Phase 4 (Completed)
    Twilio WhatsApp 2-Way Triage      :done, p7, 2026-10-16, 2026-10-18
    Portfolio Showcase & 4:3 Assets   :done, p8, 2026-10-18, 2026-10-19
    section Phase 5 (Current / Next)
    Automated E2E Test Suite          :active, p9, 2026-10-20, 2026-10-25
    Multi-Clinic Telehealth Rollout   :p10, 2026-10-26, 2026-11-05
```

### Milestone Breakdown

| Milestone | Deliverables | Status |
| :--- | :--- | :---: |
| **Phase 1: Core Clinical Engine** | Laravel 11 Sanctum RBAC, PostgreSQL schema, UUIDv4 PKs, integer cent financial guards, anti-double-booking unique constraints. | **Completed** |
| **Phase 2: Web Portals & Algerianization** | Next.js 14 Patient Portal, Doctor Portal, Admin Control Center, Demo Sandbox, Carte Chifa validation, 58 Wilayas mapping. | **Completed** |
| **Phase 3: Flutter Mobile Client** | Feature-Driven Clean Arch, Riverpod 3 state management, GoRouter, Algerian phone parsing, doctor booking wizard. | **Completed** |
| **Phase 4: Two-Way WhatsApp Triage** | Twilio WhatsApp gateway integration, automated confirmation prompts, inbound webhook triage (`1/CONFIRM` vs `2/CANCEL`), admin 1-click ping. | **Completed** |
| **Phase 5: Automated E2E & Hardening** | Full-flow integration test runner, Pest test suite (22/22 passed), Redis asynchronous queue workers with exponential backoff for SMS and WhatsApp. | **Completed** |

---

## 3. Jira WIP Governance & Engineering Protocol

To eliminate context-switching and ensure software quality, the engineering team enforces strict execution constraints:

1. **Strict WIP Limit:** Maximum **2 active tickets** in `In Progress` at any time across the monorepo.
2. **Definition of Done (DoD):**
   - Code adheres to SOLID principles and Clean Architecture (Service-Repository pattern).
   - Zero IEEE 754 float arithmetic in financial domains (`int consultation_fee_cents`).
   - All external endpoints guarded by Form Requests and Sanctum middleware.
   - Flutter screens compile with zero static analyzer warnings (`flutter analyze`).
   - Relevant architectural docs updated alongside code changes.
3. **Branching Strategy:** Feature branches branched from `main` (`aymen-hml-feature-*`), merged via passing CI checks.

---

## 4. Architectural Backlog & Post-MVP Horizon

1. **JIRA-101 (Completed):** End-to-end integration test runner validating patient booking through WhatsApp webhook confirmation.
2. **JIRA-102 (Completed):** Monorepo documentation and system design alignment with production MVP.
3. **JIRA-103 (Completed):** Redis-backed asynchronous queue for outbound WhatsApp and SMS dispatching.
4. **JIRA-104 (Deferred):** Teleconsultation room integration (WebRTC video consultations for remote Algerian Wilayas) — *Deferred pending Algerian healthtech regulatory and compliance review*.

---

## 5. Active Growth & UI Enhancement Sprint (Strict WIP Limit: Max 2 Active)

1. **JIRA-201 (Completed / Ready for Dispatch):** Upwork High-Ticket HealthTech Pitch Kit & Live Proposal Automation.
2. **JIRA-202 (Active):** Algiers Private Clinic Field Outreach & Beesiha Objection Buster Playbook (Sidi Yahia & Hydra target clinics).
3. **JIRA-203 (Active - Complete):** PostGIS Geolocation Discovery & Google Maps Integration:
   - Restrict active target cities strictly to **Algiers (16)** and **Tébessa (12)** in [`constants/algeria.ts`](file:///Users/morsistoredz/Desktop/Aymen%20HML/Informatique/Projects/Full%20Stack%20Projects/care-pulse-v1/apps/web/constants/algeria.ts) and [`constants/cities.ts`](file:///Users/morsistoredz/Desktop/Aymen%20HML/Informatique/Projects/Full%20Stack%20Projects/care-pulse-v1/apps/web/constants/cities.ts).
   - Implement type-safe [`clinic.service.ts`](file:///Users/morsistoredz/Desktop/Aymen%20HML/Informatique/Projects/Full%20Stack%20Projects/care-pulse-v1/apps/web/lib/api/clinic.service.ts) connecting directly to Laravel's `/clinics/cities` and `/clinics/nearby` PostGIS endpoints with zero backend modifications.
   - Implement modern dynamic Google Maps component [`ClinicGoogleMap.tsx`](file:///Users/morsistoredz/Desktop/Aymen%20HML/Informatique/Projects/Full%20Stack%20Projects/care-pulse-v1/apps/web/components/maps/ClinicGoogleMap.tsx) with medical SVG pins, bounce animations, interactive InfoWindows, and graceful fallback.
   - Embed [`ClinicGeolocationSection.tsx`](file:///Users/morsistoredz/Desktop/Aymen%20HML/Informatique/Projects/Full%20Stack%20Projects/care-pulse-v1/apps/web/components/landing/ClinicGeolocationSection.tsx) on the landing page with city segmented switcher and radius proximity controls.


