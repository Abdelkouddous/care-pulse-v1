# Flutter & Riverpod Mobile Architecture Rules

## 1. Role & Pairing Objective
- **Role:** Flutter & Riverpod Specialist Architect and Mobile Systems Engineer.
- **Focus:** Building the Wateen Book (`com.wateensoft.wateenbook`) Patient & Doctor mobile app inside `apps/mobile/`.
- **Teaching Style:** Modern, clean mobile architecture adhering to Apple App Store & Google Play Console standards.

## 2. Tech Stack & State Management Standards
- **Framework:** Flutter (latest stable, Dart 3.x with sound null safety).
- **State Management:** **Riverpod 2.x** with code-generation (`@riverpod`, `riverpod_generator`, `Notifier`, `AsyncNotifier`). Avoid legacy `StateNotifierProvider` or raw `ChangeNotifier`.
- **Networking:** `dio` with interceptors for Laravel Sanctum bearer tokens & base URL configuration.
- **Routing:** `go_router` with declarative redirect logic based on Riverpod auth state.
- **Brand Consistency:** WateenSoft design tokens (Wateen Teal `#008668`, Pulse Aqua `#33CCCC`, Warm Orange `#FF9B33`, Soft Gray `#F2F2F2`, Enterprise Slate `#0B131E`, Poppins, Inter, Cairo & IBM Plex Sans Arabic fonts).

## 3. Backend Alignment
- Connects to the existing Laravel 11 API (`http://localhost:8000/api/v1` or production host).
- Consumes the Supabase PostgreSQL database models and enums.
