import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiEndpoints {
  ApiEndpoints._();

  /// Automatically adapts base URL based on running platform:
  /// - Android emulator uses 10.0.2.2 to reach host machine
  /// - iOS Simulator / macOS / Web uses localhost
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:8000/api/v1';
    if (Platform.isAndroid) return 'http://10.0.2.2:8000/api/v1';
    return 'http://localhost:8000/api/v1';
  }

  // Auth endpoints
  static const String loginWithPhone = '/auth/login-phone';
  static const String verifyOtp = '/auth/verify-otp';
  static const String logout = '/auth/logout';
  static const String currentUser = '/auth/user';

  // Patient endpoints
  static const String patientRegister = '/patients/register';
  static const String patientProfile = '/patient/profile';
  static const String patientAppointments = '/patient/appointments';

  // Doctor & Directory endpoints
  static const String specialties = '/specialties';
  static const String doctors = '/doctors';
  static const String featuredDoctors = '/doctors/featured';
  static String doctorDetails(String id) => '/doctors/$id';
  static String doctorSlots(String id) => '/doctors/$id/available-slots';

  // Appointment endpoints
  static const String appointments = '/appointments';
  static const String patients = '/patients';
  static const String createAppointment = '/appointments';
  static String appointmentDetails(String id) => '/appointments/$id';
  static String cancelAppointment(String id) => '/appointments/$id/cancel';
}
