import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../features/auth/presentation/auth_controller.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/auth/presentation/register_screen.dart';
import '../../features/appointments/presentation/appointment_details_screen.dart';
import '../../features/appointments/presentation/appointment_list_screen.dart';
import '../../features/appointments/presentation/doctor_booking_screen.dart';
import '../../features/doctors/presentation/category_list_screen.dart';
import '../../features/doctors/presentation/doctor_list_screen.dart';
import '../../features/doctors/presentation/doctor_profile_screen.dart';
import '../../features/doctors/presentation/patient_home_screen.dart';

part 'app_router.g.dart';

// Helper listenable to notify GoRouter when Riverpod auth state changes
class RouterNotifier extends ChangeNotifier {
  final Ref _ref;

  RouterNotifier(this._ref) {
    _ref.listen<AuthState>(
      authControllerProvider,
      (_, _) => notifyListeners(),
    );
  }
}

@riverpod
GoRouter appRouter(Ref ref) {
  final authNotifier = RouterNotifier(ref);

  return GoRouter(
    initialLocation: '/splash',
    refreshListenable: authNotifier,
    redirect: (context, state) {
      final authState = ref.read(authControllerProvider);
      final isLoggingIn = state.matchedLocation == '/login';
      final isSplash = state.matchedLocation == '/splash';
      final isRegistering = state.matchedLocation == '/register';

      if (authState.status == AuthStatus.initial) {
        return isSplash ? null : '/splash';
      }

      if (authState.status == AuthStatus.awaitingRegistration) {
        return isRegistering ? null : '/register';
      }

      if (authState.status == AuthStatus.unauthenticated || authState.status == AuthStatus.awaitingOtp) {
        return isLoggingIn ? null : '/login';
      }

      // If authenticated and on splash, login, or register, route to patient home
      if (isLoggingIn || isSplash || isRegistering) {
        return '/patient/home';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        name: 'splash',
        builder: (context, state) => const Scaffold(
          body: Center(child: CircularProgressIndicator()),
        ),
      ),
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/patient/home',
        name: 'patient_home',
        builder: (context, state) => const PatientHomeScreen(),
      ),
      GoRoute(
        path: '/patient/categories',
        name: 'patient_categories',
        builder: (context, state) => const CategoryListScreen(),
      ),
      GoRoute(
        path: '/patient/doctors',
        name: 'patient_doctors',
        builder: (context, state) => const DoctorListScreen(),
      ),
      GoRoute(
        path: '/patient/doctors/:id',
        name: 'doctor_profile',
        builder: (context, state) => DoctorProfileScreen(
          doctorId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/patient/doctors/:id/book',
        name: 'doctor_booking',
        builder: (context, state) => DoctorBookingScreen(
          doctorId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/patient/appointments',
        name: 'patient_appointments',
        builder: (context, state) => const AppointmentListScreen(),
      ),
      GoRoute(
        path: '/patient/appointments/:id',
        name: 'appointment_details',
        builder: (context, state) => AppointmentDetailsScreen(
          appointmentId: state.pathParameters['id']!,
        ),
      ),
    ],
  );
}
