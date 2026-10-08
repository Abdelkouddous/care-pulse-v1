# Architecture & Stack Guidelines: VitalBook V1

## 1. Monorepo Architecture
- **Web App (`apps/web`):** Next.js 14.2 (App Router), TypeScript, Tailwind CSS, TanStack Query, Zustand.
- **Backend API (`apps/api`):** Laravel 11 + Laravel Sanctum, PostgreSQL 18, Repository-Service pattern.
- **Mobile Client (`apps/mobile`):** Flutter cross-platform client.
- **Auth & Session Management:** `TokenManager` managing dual token storage (`vitalbook_token` / `user_token`) with synchronized cookies and local storage.

## 2. Core Guardrails & Invariants
- **Integer Money Guardrail:** Store all currency amounts in minor units (cents / centimes). E.g. $4,500$ DZD = `450,000` cents.
- **Algerian Locale Standards:**
  - Phone validation: Algerian prefix `+213` (formats `05`, `06`, `07`, `021`).
  - Insurance: CNAS / CASNOS policy validation (`DZ-CNAS-XXXXX`).
  - Wilaya and municipal directory integration under `apps/web/constants/algeria.ts`.
- **Demo vs. Live Flow Isolation:**
  - Demo interactive sessions run strictly via client-side mocks (`DemoTourModal.tsx`).
  - Live production routes (`/signin`, `/doctors/login`, `/admin/login`) connect strictly to live Laravel Sanctum endpoints.
