
Integrating these rules establishes a strict, enterprise-grade architecture for `mobile-app/` by anchoring your stack on Riverpod 2.x code generation, a headless Dio networking layer authenticated with Laravel Sanctum, and an immutable Design System mapped directly to Vital Soft's brand tokens.

A beginner builds Flutter apps by mixing state management paradigms, scattering `ChangeNotifier` listeners across UI widgets, and writing inline colors and untyped HTTP calls. A professional systems architect enforces strict compile-time safety using Riverpod code generation (`@riverpod`), isolates infrastructure behind repository contracts, and binds routing declaratively to domain auth states.

---

## 1. Vital Soft Design Tokens Implementation

To maintain strict visual parity with your brand without polluting widgets with static hex literals, encapsulate your tokens in a type-safe `ThemeExtension`.

### Token Definition (`lib/core/theme/app_colors_extension.dart`)

```dart
import 'package:flutter/material.dart';

@immutable
class AppColorsExtension extends ThemeExtension<AppColorsExtension> {
  final Color vitalTeal;    // Brand Primary: #006666
  final Color aquaGreen;    // Brand Secondary: #33CCCC
  final Color warmOrange;   // Accent / Alert: #FF9833
  final Color softGray;     // Surface Background: #F2F2F2
  final Color cardSurface;  // Pure White: #FFFFFF
  final Color textPrimary;  // Slate 900: #0F172A
  final Color textMuted;    // Slate 500: #64748B
  final Color borderSubtle; // Border Outline: #E2E8F0

  const AppColorsExtension({
    required this.vitalTeal,
    required this.aquaGreen,
    required this.warmOrange,
    required this.softGray,
    required this.cardSurface,
    required this.textPrimary,
    required this.textMuted,
    required this.borderSubtle,
  });

  static const light = AppColorsExtension(
    vitalTeal: Color(0xFF006666),
    aquaGreen: Color(0xFF33CCCC),
    warmOrange: Color(0xFFFF9833),
    softGray: Color(0xFFF2F2F2),
    cardSurface: Color(0xFFFFFFFF),
    textPrimary: Color(0xFF0F172A),
    textMuted: Color(0xFF64748B),
    borderSubtle: Color(0xFFE2E8F0),
  );

  @override
  AppColorsExtension copyWith({
    Color? vitalTeal,
    Color? aquaGreen,
    Color? warmOrange,
    Color? softGray,
    Color? cardSurface,
    Color? textPrimary,
    Color? textMuted,
    Color? borderSubtle,
  }) {
    return AppColorsExtension(
      vitalTeal: vitalTeal ?? this.vitalTeal,
      aquaGreen: aquaGreen ?? this.aquaGreen,
      warmOrange: warmOrange ?? this.warmOrange,
      softGray: softGray ?? this.softGray,
      cardSurface: cardSurface ?? this.cardSurface,
      textPrimary: textPrimary ?? this.textPrimary,
      textMuted: textMuted ?? this.textMuted,
      borderSubtle: borderSubtle ?? this.borderSubtle,
    );
  }

  @override
  AppColorsExtension lerp(ThemeExtension<AppColorsExtension>? other, double t) {
    if (other is! AppColorsExtension) return this;
    return AppColorsExtension(
      vitalTeal: Color.lerp(vitalTeal, other.vitalTeal, t)!,
      aquaGreen: Color.lerp(aquaGreen, other.aquaGreen, t)!,
      warmOrange: Color.lerp(warmOrange, other.warmOrange, t)!,
      softGray: Color.lerp(softGray, other.softGray, t)!,
      cardSurface: Color.lerp(cardSurface, other.cardSurface, t)!,
      textPrimary: Color.lerp(textPrimary, other.textPrimary, t)!,
      textMuted: Color.lerp(textMuted, other.textMuted, t)!,
      borderSubtle: Color.lerp(borderSubtle, other.borderSubtle, t)!,
    );
  }
}

extension AppThemeContext on BuildContext {
  AppColorsExtension get colors => Theme.of(this).extension<AppColorsExtension>()!;
  TextTheme get typography => Theme.of(this).textTheme;
}

```

### Global Typography Configuration (`lib/core/theme/app_theme.dart`)

```dart
import 'package:flutter/material.dart';
import 'app_colors_extension.dart';

class AppTheme {
  static ThemeData get lightTheme {
    const tokens = AppColorsExtension.light;

    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: tokens.softGray,
      extensions: const [tokens],
      colorScheme: ColorScheme.light(
        primary: tokens.vitalTeal,
        secondary: tokens.aquaGreen,
        surface: tokens.cardSurface,
        error: tokens.warmOrange,
      ),
      fontFamily: 'Inter',
      textTheme: const TextTheme(
        headlineMedium: TextStyle(
          fontFamily: 'Poppins',
          fontSize: 22,
          fontWeight: FontWeight.w700,
          color: Color(0xFF0F172A),
        ),
        titleMedium: TextStyle(
          fontFamily: 'Poppins',
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: Color(0xFF0F172A),
        ),
        bodyMedium: TextStyle(
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: Color(0xFF64748B),
        ),
      ),
    );
  }
}

```

---

## 2. Headless Network Layer (Dio + Laravel Sanctum)

In Laravel 11, mobile clients authenticate via Sanctum Personal Access Tokens (`Bearer <token>`). The Dio network engine must handle token injection, environment resolution, and standard error interceptors.

### Network Provider (`lib/core/network/dio_provider.dart`)

```dart
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'dio_provider.g.dart';

@riverpod
Dio dio(DioRef ref) {
  // Android emulator loops back to host machine via 10.0.2.2; iOS and macOS use localhost
  final host = Platform.isAndroid ? '10.0.2.2' : 'localhost';
  
  final options = BaseOptions(
    baseUrl: 'http://$host:8000/api/v1',
    connectTimeout: const Duration(seconds: 15),
    receiveTimeout: const Duration(seconds: 15),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  );

  final dio = Dio(options);

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        // Read the token securely from local storage or storage provider
        const token = String.fromEnvironment('SANCTUM_TEST_TOKEN');
        if (token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException error, handler) {
        if (error.response?.statusCode == 401) {
          // Trigger global session invalidation / redirect to login
        }
        return handler.next(error);
      },
    ),
  );

  return dio;
}

```

---

## 3. Modular Feature Architecture (`mobile-app/`)

Your codebase must adhere to Clean Architecture with strict separation between Domain entities, Data providers, and Presentation widgets.

```text
mobile-app/
├── lib/
│   ├── core/
│   │   ├── network/            # Dio instance, interceptors, error parsers
│   │   ├── router/             # go_router configuration & redirect logic
│   │   └── theme/              # AppTheme, AppColorsExtension, font declarations
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/           # AuthRepositoryImpl, remote data sources
│   │   │   ├── domain/         # User model, AuthState enum, interface contracts
│   │   │   └── presentation/   # LoginScreen, RegisterScreen, authControllerProvider
│   │   ├── appointments/
│   │   │   ├── data/           # AppointmentRepositoryImpl, DTOs
│   │   │   ├── domain/         # Appointment model, BookingStatus enum
│   │   │   └── presentation/   # MyBookingsScreen, BookingDetailsScreen
│   │   └── doctor_catalog/
│   │       ├── data/           # DoctorRepositoryImpl
│   │       ├── domain/         # Doctor, Specialty, Slot models
│   │       └── presentation/   # DoctorListScreen, DoctorProfileScreen
│   └── main.dart
└── pubspec.yaml

```

---

## 4. Modern Riverpod 2.x State Management Pattern

In Riverpod 2.x with code generation, state mutations are encapsulated in `AsyncNotifier` or `Notifier` classes. Do not use legacy manual provider declarations.

### Example: Appointment List Notifier (`lib/features/appointments/presentation/controllers/appointments_controller.dart`)

```dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/models/appointment.dart';
import '../../data/repositories/appointment_repository.dart';

part 'appointments_controller.g.dart';

@riverpod
class AppointmentsController extends _$AppointmentsController {
  @override
  FutureOr<List<Appointment>> build() async {
    return _fetchUpcomingAppointments();
  }

  Future<List<Appointment>> _fetchUpcomingAppointments() async {
    final repository = ref.watch(appointmentRepositoryProvider);
    return repository.getUpcomingAppointments();
  }

  Future<void> cancelAppointment(String appointmentId) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(appointmentRepositoryProvider);
      await repository.cancelAppointment(appointmentId);
      return _fetchUpcomingAppointments();
    });
  }
}
```
