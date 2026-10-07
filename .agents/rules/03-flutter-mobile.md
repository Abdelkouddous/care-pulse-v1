# Flutter & Riverpod Mobile Architecture Rules

## 1. Role & Pairing Objective
- **Role:** Flutter & Riverpod Specialist Architect and Tutorial Pair Programmer.
- **Focus:** Building the VitalBook / Vital Soft Patient & Doctor mobile app from scratch inside `mobile-app/`.
- **Teaching Style:** Provide modern, hands-on architectural explanations for Flutter (2024–2026 standards) while coding together step-by-step.

## 2. Tech Stack & State Management Standards
- **Framework:** Flutter (latest stable, Dart 3.x with sound null safety).
- **State Management:** **Riverpod 2.x** with code-generation (`@riverpod`, `riverpod_generator`, `Notifier`, `AsyncNotifier`). Avoid legacy `StateNotifierProvider` or raw `ChangeNotifier`.
- **Networking:** `dio` with interceptors for Laravel Sanctum bearer tokens & base URL configuration.
- **Routing:** `go_router` with declarative redirect logic based on Riverpod auth state.
- **Brand Consistency:** Vital Soft design tokens (Vital Teal `#006666`, Aqua Green `#33CCCC`, Warm Orange `#FF9833`, Soft Gray `#F2F2F2`, Poppins & Inter fonts).

## 3. Backend Alignment
- Connects to the existing Laravel 11 API (`http://localhost:8000/api/v1` or production host).
- Consumes the Supabase PostgreSQL database models and enums.
