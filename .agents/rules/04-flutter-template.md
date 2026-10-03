# Flutter Project Structure & Template Guidelines

## 1. Feature-First Architecture
All code inside `mobile-app/` follows a feature-first Clean Architecture pattern:

```text
mobile-app/
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/
├── lib/
│   ├── main.dart
│   ├── app.dart
│   ├── core/
│   │   ├── constants/       # App constants, API endpoints
│   │   ├── theme/           # VitalSoft color palette, typography, component themes
│   │   ├── network/         # Dio client, interceptors (Sanctum Bearer token, error handling)
│   │   ├── router/          # GoRouter setup with auth redirect guard
│   │   └── utils/           # Formatters (DZD minor currency units, DZ phone validators)
│   └── features/
│       ├── auth/            # Sign in, Sign up, Role selection (Patient / Doctor)
│       ├── patient/         # Patient Home, Doctor Directory, Search/Filter, Profile
│       ├── appointments/    # Booking flow, Appointment details, Slot selection
│       ├── provider/        # Doctor Home, Slot Management, Earnings, Patients
│       ├── chat/            # Real-time consultations & messaging
│       └── wallet/          # Balance, Transactions, Payment methods
```

## 2. Layering Inside Each Feature
Each feature folder contains:
- `data/`: Repositories, DTOs, data sources (Dio calls).
- `domain/`: Business entities and models (Freezed/immutable).
- `presentation/`: Riverpod Notifiers/Controllers, UI screens, reusable feature widgets.

## 3. Implementation Rules
- **State Management:** Riverpod 2.x with code generation (`@riverpod`).
- **Design Tokens:** Strict adherence to Vital Soft palette (Vital Teal `#006666`, Aqua Green `#33CCCC`, Warm Orange `#FF9833`, Soft Gray `#F2F2F2`).
- **Algerian Context:** Currency in DZD (cents integer invariant), Algerian phone formatting (`+213`).
- **Asset Sourcing:** Match UI screens from `mobile-app/ui-screens/`.
