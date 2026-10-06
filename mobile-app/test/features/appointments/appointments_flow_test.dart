import 'package:carepulse_mobile/core/theme/app_theme.dart';
import 'package:carepulse_mobile/features/appointments/data/appointment_repository.dart';
import 'package:carepulse_mobile/features/appointments/domain/appointment_models.dart';
import 'package:carepulse_mobile/features/appointments/presentation/booking_controller.dart';
import 'package:carepulse_mobile/features/appointments/presentation/widgets/appointment_card.dart';
import 'package:carepulse_mobile/features/appointments/presentation/widgets/calendar_strip.dart';
import 'package:carepulse_mobile/features/doctors/domain/doctor_models.dart';
import 'package:carepulse_mobile/features/doctors/domain/specialty_models.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

class MockAppointmentRepository implements AppointmentRepository {
  final List<AppointmentModel> mockAppointments = [
    AppointmentModel(
      id: 'apt-001',
      patientId: 'patient-1',
      doctorId: 'doc-1',
      clinicId: 'clinic-1',
      scheduledAt: DateTime.now().add(const Duration(days: 1)),
      status: 'confirmed',
      reason: 'Hypertension consultation and cardiovascular assessment',
      consultationFeeCents: 450000,
      doctor: const DoctorModel(
        id: 'doc-1',
        firstName: 'Amine',
        lastName: 'Mansouri',
        name: 'Dr. Amine Mansouri',
        consultationFeeCents: 450000,
        specialty: SpecialtyModel(id: 'spec-1', name: 'Cardiology'),
        clinicName: 'Clinique El Chifa, Hydra',
      ),
    ),
    AppointmentModel(
      id: 'apt-002',
      patientId: 'patient-1',
      doctorId: 'doc-2',
      clinicId: 'clinic-1',
      scheduledAt: DateTime.now().subtract(const Duration(days: 5)),
      status: 'completed',
      reason: 'Pediatric annual checkup and vaccination schedule',
      consultationFeeCents: 350000,
      doctor: const DoctorModel(
        id: 'doc-2',
        firstName: 'Yasmine',
        lastName: 'Benali',
        name: 'Dr. Yasmine Benali',
        consultationFeeCents: 350000,
        specialty: SpecialtyModel(id: 'spec-2', name: 'Pediatrics'),
        clinicName: 'Cabinet Médical, Oran',
      ),
    ),
  ];

  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);

  @override
  Future<List<AppointmentModel>> getPatientAppointments() async => mockAppointments;

  @override
  Future<AppointmentModel> getAppointmentById(String id) async {
    return mockAppointments.firstWhere((a) => a.id == id);
  }

  @override
  Future<AppointmentModel> bookAppointment(CreateBookingDto dto) async {
    final newAppointment = AppointmentModel(
      id: 'apt-new-999',
      patientId: 'patient-1',
      doctorId: dto.doctorId,
      clinicId: dto.clinicId,
      scheduledAt: dto.scheduledAt,
      status: 'pending',
      reason: dto.reason,
      notes: dto.notes,
      consultationFeeCents: 450000,
    );
    mockAppointments.add(newAppointment);
    return newAppointment;
  }

  @override
  Future<bool> cancelAppointment(String id, String reason) async {
    final idx = mockAppointments.indexWhere((a) => a.id == id);
    if (idx != -1) {
      final old = mockAppointments[idx];
      mockAppointments[idx] = AppointmentModel(
        id: old.id,
        patientId: old.patientId,
        doctorId: old.doctorId,
        clinicId: old.clinicId,
        scheduledAt: old.scheduledAt,
        status: 'cancelled',
        reason: old.reason,
        notes: old.notes,
        cancellationReason: reason,
        cancelledBy: 'patient',
        consultationFeeCents: old.consultationFeeCents,
        doctor: old.doctor,
      );
      return true;
    }
    return false;
  }
}

void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  group('Appointment Lifecycle & Slot Booking (VTB-36, VTB-41, VTB-47, VTB-52)', () {
    late MockAppointmentRepository mockRepo;

    setUp(() {
      mockRepo = MockAppointmentRepository();
    });

    test('AppointmentModel formats Algerian currency in DZD correctly', () {
      final apt = AppointmentModel(
        id: '1',
        patientId: 'p1',
        doctorId: 'd1',
        scheduledAt: DateTime.now(),
        status: 'confirmed',
        reason: 'General checkup',
        consultationFeeCents: 450000,
      );

      expect(apt.formattedFee, equals('4500 DZD'));
      expect(apt.isUpcoming, isTrue);
      expect(apt.isCancelled, isFalse);
    });

    test('BookingController validates slot selection and consultation reason', () async {
      final container = ProviderContainer(
        overrides: [
          appointmentRepositoryProvider.overrideWithValue(mockRepo),
        ],
      );
      addTearDown(container.dispose);

      final controller = container.read(bookingControllerProvider.notifier);

      // Attempt booking without selecting slot
      final fail1 = await controller.confirmBooking(doctorId: 'doc-1');
      expect(fail1, isFalse);
      expect(container.read(bookingControllerProvider).errorMessage, contains('time slot'));

      // Select slot but no reason
      controller.selectSlot('2026-10-06T10:00:00Z');
      final fail2 = await controller.confirmBooking(doctorId: 'doc-1');
      expect(fail2, isFalse);
      expect(container.read(bookingControllerProvider).errorMessage, contains('reason'));

      // Provide reason and confirm
      controller.updateReason('Cardiology follow-up');
      final success = await controller.confirmBooking(doctorId: 'doc-1');
      expect(success, isTrue);

      final state = container.read(bookingControllerProvider);
      expect(state.bookedAppointment, isNotNull);
      expect(state.bookedAppointment?.status, equals('pending'));
      expect(state.bookedAppointment?.reason, equals('Cardiology follow-up'));
    });

    test('PatientAppointmentsController fetches and cancels appointment correctly', () async {
      final container = ProviderContainer(
        overrides: [
          appointmentRepositoryProvider.overrideWithValue(mockRepo),
        ],
      );
      addTearDown(container.dispose);

      final controller = container.read(patientAppointmentsControllerProvider.notifier);

      final initialList = await container.read(patientAppointmentsControllerProvider.future);
      expect(initialList.length, equals(2));
      expect(initialList.first.isUpcoming, isTrue);

      // Cancel upcoming appointment
      final cancelled = await controller.cancelAppointment('apt-001', 'Personal conflict');
      expect(cancelled, isTrue);

      final updatedList = await container.read(patientAppointmentsControllerProvider.future);
      final cancelledApt = updatedList.firstWhere((a) => a.id == 'apt-001');
      expect(cancelledApt.status, equals('cancelled'));
      expect(cancelledApt.cancellationReason, equals('Personal conflict'));
    });

    testWidgets('CalendarStrip renders 14 days and fires onDateSelected callback', (tester) async {
      DateTime? tappedDate;
      final today = DateTime.now();

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.lightTheme,
          home: Scaffold(
            body: CalendarStrip(
              selectedDate: today,
              onDateSelected: (d) => tappedDate = d,
            ),
          ),
        ),
      );

      expect(find.byType(CalendarStrip), findsOneWidget);
      final dayNumber = today.day.toString().padLeft(2, '0');
      expect(find.text(dayNumber), findsOneWidget);

      // Tap on today
      await tester.tap(find.text(dayNumber));
      expect(tappedDate, isNotNull);
    });

    testWidgets('AppointmentCard renders appointment info, doctor, status and handles taps', (tester) async {
      bool tapped = false;
      bool cancelled = false;

      final apt = mockRepo.mockAppointments.first;

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.lightTheme,
          home: Scaffold(
            body: AppointmentCard(
              appointment: apt,
              onTap: () => tapped = true,
              onCancel: () => cancelled = true,
            ),
          ),
        ),
      );

      expect(find.text('Dr. Amine Mansouri'), findsOneWidget);
      expect(find.text('Cardiology'), findsOneWidget);
      expect(find.text('Confirmed'), findsOneWidget);
      expect(find.text('View Details'), findsOneWidget);
      expect(find.text('Cancel'), findsOneWidget);

      await tester.tap(find.text('Cancel'));
      expect(cancelled, isTrue);

      await tester.tap(find.text('View Details'));
      expect(tapped, isTrue);
    });
  });
}
