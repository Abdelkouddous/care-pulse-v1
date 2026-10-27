# VitalBook API — Core Domain & Services

> **Laravel 11 RESTful Medical Engine** · PHP 8.4 · Laravel Sanctum · PostgreSQL (Supabase) · Twilio WhatsApp Gateway

---

## 🏗️ Architecture & Core Principles

The VitalBook API acts as the central business logic, persistence, and notification authority for the entire ecosystem (Web & Mobile).

- **Service-Repository Pattern:** Controllers remain lean by delegating validation to Form Requests, domain rules to Domain Services (`AppointmentService`, `WhatsAppNotificationService`), and persistence to Eloquent Repositories.
- **Strict Integer Money:** All consultation fees and ledger records are stored as integer centimes (`int consultation_fee_cents`) in Algerian Dinars (DZD).
- **Anti-Double-Booking Guardrail:** Database-level compound unique constraint on `(doctor_id, scheduled_at)` with ACID transaction rollback.
- **Two-Way WhatsApp Engine:** Integration with Twilio WhatsApp Business API for outbound booking prompts and inbound interactive triage webhooks (`1/CONFIRM` vs `2/CANCEL`).
- **Multi-Tenant Isolation:** Requests require an `X-Clinic-ID` UUID header, resolved and verified via middleware against user tenancy and automated Eloquent Global Scopes.

---

## 📡 Key Endpoints

| Method | URI | Description | Auth Guard |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Patient authentication & token issuance | Public |
| `POST` | `/api/v1/auth/doctor/login` | Physician login | Public |
| `POST` | `/api/v1/auth/admin/login` | Clinic Administrator login | Public |
| `GET` | `/api/v1/specialties` | Medical domain catalog | Public / Tenant |
| `GET` | `/api/v1/doctors` | Active physician directory | Public / Tenant |
| `GET` | `/api/v1/doctors/{id}/slots` | 30-minute dynamic consultation slot generator | Public / Tenant |
| `POST` | `/api/v1/appointments` | Patient consultation reservation | Sanctum (`patient`) |
| `GET` | `/api/v1/patients/me/appointments` | Authenticated patient bookings ledger | Sanctum (`patient`) |
| `GET` | `/api/v1/doctor-portal/appointments` | Physician consultation roster | Sanctum (`doctor`) |
| `PUT` | `/api/v1/doctor-portal/appointments/{id}/status` | Doctor triage transition (`scheduled`, `completed`) | Sanctum (`doctor`) |
| `GET` | `/api/v1/admin/dashboard` | Clinic operational KPIs & metrics | Sanctum (`admin`) |
| `GET` | `/api/v1/admin/appointments` | Live triage queue | Sanctum (`admin`) |
| `POST` | `/api/v1/admin/appointments/{id}/whatsapp-ping` | On-demand WhatsApp prompt dispatch | Sanctum (`admin`) |
| `POST` | `/api/v1/webhooks/whatsapp` | Two-way incoming WhatsApp webhook triage | Webhook Public / Verified |

---

## 🧪 Testing & Quality Assurance

Run the automated Pest PHP test suite:

```bash
# Run all backend feature & unit tests
php artisan test

# Run WhatsApp integration test specifically
php artisan test --filter WhatsAppIntegrationTest
```

---

## 🚀 Production Deployment ($0/Month Zero-Cost Stack)

The API is packaged as a multi-stage production container designed for Render Free Web Service or Koyeb Free Nano:

- **Runtime:** `php:8.4-fpm-alpine` + Nginx reverse proxy managed by Supervisord.
- **Queue Workers:** 2 background worker processes consuming the Supabase `database` queue (`notifications,default`).
- **Database Pooling:** Supabase PostgreSQL Supavisor transaction pooler on port `6543`.
- **Healthcheck:** Natively verified on `/up` (HTTP 200).
- **Deployment Audit:** Detailed governance sign-off in [`docs/reports/production_deployment_gate_audit.md`](file:///Users/morsistoredz/Desktop/Aymen%20HML/Informatique/Projects/Full%20Stack%20Projects/care-pulse-v1/docs/reports/production_deployment_gate_audit.md).

