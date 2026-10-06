<div align="center">
  <img src="frontend/public/assets/icons/vitalsoft-logo.svg" alt="VitalSoft HealthTech Solutions" width="340" />

---

## 📋 Table of Contents

1. 🏥 [System Overview](#-system-overview)
2. 🛠️ [Tech Stack &amp; Architecture](#️-tech-stack--architecture)
3. 💡 [Core Features](#-core-features)
4. 🚦 [Quick Start &amp; Setup](#-quick-start--setup)
   - [Frontend (Next.js 14)](#1-frontend-setup)
   - [Backend (Laravel 11 + Supabase)](#2-backend-setup)
5. 📁 [Monorepo Structure](#-monorepo-structure)
6. 🔒 [Security &amp; Compliance](#-security--compliance)
7. 📞 [Contact &amp; Leadership](#-contact--leadership)

---

## 🏥 System Overview

**VitalBook V1** is a full-stack, enterprise-grade healthcare management system developed by **[Vital Soft](https://vitalsoft.aymenhamel.com)** to modernize clinical appointments and practice operations. Built with Algerian locale integration (CNAS/Chifa insurance, phone validations, and Wilaya mapping), the platform seamlessly connects patients, attending physicians, and clinic administrators.

--- 

## 🛠️ Tech Stack & Architecture

| Layer                     | Technologies                                                                                | Key Responsibilities                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Frontend**        | Next.js 14.2 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons                 | Responsive UI, client-side triage, 3-step registration wizard, 4-step booking wizard    |
| **Backend API**     | Laravel 11, PHP 8.4, Service-Repository Pattern, Laravel Sanctum                            | Token-based auth, slot generation, appointment state machines, integer money guardrails |
| **Database**        | PostgreSQL 18 via**Supabase** (Session Pooler & Direct Connection)                    | Relational schema, UUIDv4 primary keys, stored generated columns, automated migrations  |
| **Session & Auth**  | `TokenManager` (dual tokens: `carepulse_token` + `user_token`), Cookies, LocalStorage | Cross-route session lifecycle, SSR route protection, role-based boundaries              |
| **Testing & CI/CD** | Pest PHP (PHP 8.4), TypeScript`tsc --noEmit`, GitHub Actions                              | Automated backend tests, frontend build checks, Dockerized production build             |

---

## 💡 Core Features

### 👤 Patient Onboarding & Portal

- **3-Step Registration Wizard:** Structured progressive disclosure (Identity & Credentials $\rightarrow$ Clinical & CNAS Insurance $\rightarrow$ Emergency & Consents).
- **4-Step Booking Wizard:** Real-time physician selection, dynamic 30-minute consultation slot calculation, clinical triage reasons, and confirmation.
- **Health Profile:** Digital health record, CNAS policy tracking, and appointment management with 1-click status reviews.

### 🩺 Physician Workspace

- Dedicated clinical schedule portal (`/doctors/login` and `/doctors/dashboard`).
- Daily patient consultation rosters, visit check-ins, cancellation reasons, and patient medical history inspection.

### 🛡️ Clinic Administration Control Center

- Tri-tab operational dashboard (`/admin/dashboard`):
  - **Appointments:** Live appointment status workflows (Scheduled, Completed, Cancelled).
  - **Doctors:** Physician directory, licensing, consultation fees, and availability slots.
  - **Patients:** Registered patient records with CNAS policy verification.

### 🧪 MVP Interactive Demo Sandbox

- 1-click credential-free simulator embedded in navigation ([`DemoTourModal.tsx`](file:///frontend/components/DemoTourModal.tsx)) for test-driving Patient, Doctor, or Super Admin personas without mutating production database tables.

---

## 🚦 Quick Start & Setup

### Prerequisites

- **Node.js**: `v20+` & `npm`
- **PHP**: `8.4+` & **Composer** `2.8+`
- **Database**: Active Supabase PostgreSQL instance (or local PostgreSQL 18)

---

### 1. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 (or production API)

# Run development server
npm run dev
# Accessible at http://localhost:3000
```

---

### 2. Backend Setup (Laravel + Supabase)

```bash
# Navigate to backend directory
cd laravel-backend

# Install PHP dependencies
composer install

# Configure environment
cp .env.example .env

# Configure your Supabase PostgreSQL credentials in .env:
# DB_CONNECTION=pgsql
# DB_HOST=aws-0-eu-west-2.pooler.supabase.com
# DB_PORT=5432
# DB_DATABASE=postgres
# DB_USERNAME=postgres.mkmsjpfjvsbahydhthbp
# DB_PASSWORD=your_password
# DB_SSLMODE=require

# Run database migrations and seed default test data
php artisan migrate:fresh --seed

# Start Laravel development server
php artisan serve
# API active at http://localhost:8000/api/v1
```

---

## 📁 Monorepo Structure

```bash
care-pulse-v1/
├── .agents/                 # Unified instructions & rules for AI assistants & Gemini
│   ├── README.md            # Guidelines index
│   └── rules/               # Auto-discovered brand, protocol, and stack rules
├── docs/                    # Architectural reports, brand guidelines, and UI archives
│   ├── brand/               # VitalSoft brand identity guidelines & logos
│   ├── reports/             # MVP audit & validation reports
│   └── archive/             # Historical execution steps and logs
├── frontend/                # Next.js 14 App Router application
│   ├── app/                 # Routes: (auth), appointments, patient, doctors, admin
│   ├── components/          # Reusable UI components & multi-step wizards
│   ├── lib/                 # Auth TokenManager, API client, Server Actions
│   └── constants/           # Algerian wilayas, specialties, dictionary
├── laravel-backend/         # Laravel 11 RESTful API
│   ├── app/Http/            # Controllers, Form Requests, Resources
│   ├── app/Services/        # Domain business logic
│   ├── app/Repositories/    # Eloquent database abstractions
│   └── database/            # PostgreSQL migrations and seeders
└── .github/workflows/       # GitHub Actions CI/CD test and build pipelines
```

---

## 🔒 Security & Compliance

- **Role-Based Access Control (RBAC):** Strict boundaries separating Patient, Physician, and Admin API endpoints enforced via Laravel Sanctum and Next.js middleware.
- **Integer Money Guardrail:** Financial consultation fees are strictly stored as integers in minor currency units (cents/centimes) to prevent float-rounding inaccuracies.
- **Algerian Locale Validation:** Built-in sanitization for Algerian National Identification Numbers (18 digits), Carte Chifa insurance, and `+213` mobile prefixes.

---

## 📞 Contact & Leadership

**Vital Soft Engineering Team**
✉️ [contact@vitalsoft.com](mailto:contact@vitalsoft.com)
🌍 [https://vitalsoft.aymenhamel.com](https://vitalsoft.aymenhamel.com)

**Hamel Aymen** — *Founder & Chief Architect*
💼 [LinkedIn](https://linkedin.com/in/aymenehamel) · 🐙 [GitHub](https://github.com/aymenehamel)

<div align="center" style="margin-top: 40px;">
  <sub>Built with ❤️ by Vital Soft · © 2026 All rights reserved</sub>
</div>
