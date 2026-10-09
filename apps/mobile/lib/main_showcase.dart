import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'core/widgets/vitalbook_logo.dart';
import 'features/appointments/domain/appointment_models.dart';
import 'features/appointments/presentation/appointment_list_screen.dart';
import 'features/appointments/presentation/booking_controller.dart';
import 'features/appointments/presentation/doctor_booking_screen.dart';
import 'features/auth/domain/auth_models.dart';
import 'features/auth/presentation/auth_controller.dart';
import 'features/auth/presentation/login_screen.dart';
import 'features/doctors/domain/doctor_models.dart';
import 'features/doctors/domain/specialty_models.dart';
import 'features/doctors/presentation/doctor_list_screen.dart';
import 'features/doctors/presentation/doctor_profile_screen.dart';
import 'features/doctors/presentation/patient_home_screen.dart';

class MockAuthController extends AuthController {
  @override
  AuthState build() {
    return const AuthState(
      status: AuthStatus.authenticated,
      user: UserProfile(
        id: 'patient-sarah-1',
        name: 'Sarah Benali',
        firstName: 'Sarah',
        lastName: 'Benali',
        email: 'sarah.benali@vitalbook.com',
        phone: '+213555998877',
        bloodType: 'O+',
        gender: 'female',
      ),
    );
  }
}

class MockPatientAppointmentsController extends PatientAppointmentsController {
  @override
  FutureOr<List<AppointmentModel>> build() {
    return [
      AppointmentModel(
        id: 'app-001',
        patientId: 'patient-sarah-1',
        doctorId: '01a1176a-65a3-7158-b42f-441e166f42a8',
        clinicId: '58b759e3-41f6-47d2-aa1d-35e004849e52',
        scheduledAt: DateTime.now().add(const Duration(days: 1, hours: 3)),
        status: 'confirmed',
        reason: 'Consultation cardiologique de contrôle annuel',
        consultationFeeCents: 450000,
        doctor: const DoctorModel(
          id: '01a1176a-65a3-7158-b42f-441e166f42a8',
          firstName: 'Amine',
          lastName: 'Mansouri',
          name: 'Dr. Amine Mansouri',
          consultationFeeCents: 450000,
          specialty: SpecialtyModel(id: '1', name: 'Cardiology'),
          avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop',
        ),
      ),
      AppointmentModel(
        id: 'app-002',
        patientId: 'patient-sarah-1',
        doctorId: '01a1176a-6de5-724a-a1be-e51194bcdb85',
        clinicId: '58b759e3-41f6-47d2-aa1d-35e004849e52',
        scheduledAt: DateTime.now().add(const Duration(days: 5, hours: 2)),
        status: 'pending',
        reason: 'Bilan pédiatrique préventif',
        consultationFeeCents: 350000,
        doctor: const DoctorModel(
          id: '01a1176a-6de5-724a-a1be-e51194bcdb85',
          firstName: 'Sofia',
          lastName: 'Hamidi',
          name: 'Dr. Sofia Hamidi',
          consultationFeeCents: 350000,
          specialty: SpecialtyModel(id: '2', name: 'Pediatrics'),
          avatarUrl: 'https://images.unsplash.com/photo-1594824813627-2c99a093e0b2?w=300&h=300&fit=crop',
        ),
      ),
    ];
  }
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    ProviderScope(
      overrides: [
        authControllerProvider.overrideWith(() => MockAuthController()),
        patientAppointmentsControllerProvider.overrideWith(() => MockPatientAppointmentsController()),
      ],
      child: const ShowcaseApp(),
    ),
  );
}

class ShowcaseApp extends StatefulWidget {
  const ShowcaseApp({super.key});

  @override
  State<ShowcaseApp> createState() => _ShowcaseAppState();
}

class _ShowcaseAppState extends State<ShowcaseApp> {
  // Screen index:
  // 0: Patient Home
  // 1: Doctor Directory
  // 2: Doctor Profile
  // 3: Doctor Booking
  // 4: My Appointments
  // 5: Professional Login Screen
  // 6: Animated Typewriter Splash Loader
  static const int currentScreen = 6;

  @override
  Widget build(BuildContext context) {
    Widget screen;
    switch (currentScreen) {
      case 0:
        screen = const PatientHomeScreen();
        break;
      case 1:
        screen = const DoctorListScreen();
        break;
      case 2:
        screen = const DoctorProfileScreen(
          doctorId: '01a1176a-65a3-7158-b42f-441e166f42a8',
        );
        break;
      case 3:
        screen = const DoctorBookingScreen(
          doctorId: '01a1176a-65a3-7158-b42f-441e166f42a8',
        );
        break;
      case 4:
        screen = const AppointmentListScreen();
        break;
      case 5:
        screen = const LoginScreen();
        break;
      case 6:
        screen = const TypewriterSplashPreview();
        break;
      default:
        screen = const PatientHomeScreen();
    }

    return MaterialApp(
      title: 'VitalBook Showcase',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.light,
      home: screen,
    );
  }
}

class TypewriterSplashPreview extends StatefulWidget {
  const TypewriterSplashPreview({super.key});

  @override
  State<TypewriterSplashPreview> createState() => _TypewriterSplashPreviewState();
}

class _TypewriterSplashPreviewState extends State<TypewriterSplashPreview> {
  String _typed = 'VitalBo';
  bool _cursor = true;
  Timer? _anim;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _anim?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    String vitalPart = '';
    String bookPart = '';
    if (_typed.length <= 5) {
      vitalPart = _typed;
    } else {
      vitalPart = 'Vital';
      bookPart = _typed.substring(5);
    }

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(),
              const VitalBookLogoWidget(size: 96),
              const SizedBox(height: 28),
              RichText(
                text: TextSpan(
                  style: const TextStyle(
                    fontSize: 38,
                    letterSpacing: -0.5,
                    fontFamily: 'Inter',
                  ),
                  children: [
                    TextSpan(
                      text: vitalPart,
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    TextSpan(
                      text: bookPart,
                      style: const TextStyle(
                        fontWeight: FontWeight.w300,
                        color: Color(0xFF0D9488),
                      ),
                    ),
                    if (_cursor)
                      const TextSpan(
                        text: '▎',
                        style: TextStyle(
                          color: Color(0xFF0D9488),
                          fontSize: 34,
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'HealthTech Solutions • Algérie',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF64748B),
                  letterSpacing: 0.3,
                ),
              ),
              const Spacer(),
              const Padding(
                padding: EdgeInsets.only(bottom: 28.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(
                      width: 14,
                      height: 14,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF0D9488)),
                      ),
                    ),
                    SizedBox(width: 10),
                    Text(
                      'Chargement de la plateforme...',
                      style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

