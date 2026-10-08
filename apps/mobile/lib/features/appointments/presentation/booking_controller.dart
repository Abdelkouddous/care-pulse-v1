import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../doctors/data/doctor_repository.dart';
import '../data/appointment_repository.dart';
import '../domain/appointment_models.dart';

part 'booking_controller.g.dart';

@riverpod
Future<List<String>> doctorSlots(
  Ref ref, {
  required String doctorId,
  required DateTime date,
}) async {
  final repository = ref.watch(doctorRepositoryProvider);
  return repository.getAvailableSlots(doctorId: doctorId, date: date);
}

@immutable
class BookingState {
  final DateTime selectedDate;
  final String? selectedSlot;
  final String reason;
  final bool isSubmitting;
  final String? errorMessage;
  final AppointmentModel? bookedAppointment;

  const BookingState({
    required this.selectedDate,
    this.selectedSlot,
    this.reason = '',
    this.isSubmitting = false,
    this.errorMessage,
    this.bookedAppointment,
  });

  BookingState copyWith({
    DateTime? selectedDate,
    String? selectedSlot,
    String? reason,
    bool? isSubmitting,
    String? errorMessage,
    AppointmentModel? bookedAppointment,
    bool clearSlot = false,
    bool clearError = false,
  }) {
    return BookingState(
      selectedDate: selectedDate ?? this.selectedDate,
      selectedSlot: clearSlot ? null : (selectedSlot ?? this.selectedSlot),
      reason: reason ?? this.reason,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      bookedAppointment: bookedAppointment ?? this.bookedAppointment,
    );
  }
}

@riverpod
class BookingController extends _$BookingController {
  @override
  BookingState build() {
    return BookingState(
      selectedDate: DateTime.now(),
    );
  }

  void selectDate(DateTime date) {
    state = state.copyWith(
      selectedDate: date,
      clearSlot: true,
      clearError: true,
    );
  }

  void selectSlot(String slotIso) {
    state = state.copyWith(
      selectedSlot: slotIso,
      clearError: true,
    );
  }

  void updateReason(String reason) {
    state = state.copyWith(reason: reason);
  }

  Future<bool> confirmBooking({
    required String doctorId,
    String? clinicId,
  }) async {
    if (state.selectedSlot == null) {
      state = state.copyWith(errorMessage: 'Please select an appointment time slot.');
      return false;
    }

    if (state.reason.trim().isEmpty) {
      state = state.copyWith(errorMessage: 'Please enter the reason for your consultation.');
      return false;
    }

    state = state.copyWith(isSubmitting: true, clearError: true);

    try {
      final repository = ref.read(appointmentRepositoryProvider);
      final scheduledAt = DateTime.parse(state.selectedSlot!);

      final appointment = await repository.bookAppointment(
        CreateBookingDto(
          doctorId: doctorId,
          clinicId: clinicId,
          scheduledAt: scheduledAt,
          reason: state.reason.trim(),
        ),
      );

      state = state.copyWith(
        isSubmitting: false,
        bookedAppointment: appointment,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isSubmitting: false,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
      return false;
    }
  }
}

@riverpod
class PatientAppointmentsController extends _$PatientAppointmentsController {
  @override
  FutureOr<List<AppointmentModel>> build() async {
    final repository = ref.watch(appointmentRepositoryProvider);
    return repository.getPatientAppointments();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(appointmentRepositoryProvider);
      return repository.getPatientAppointments();
    });
  }

  Future<bool> cancelAppointment(String appointmentId, String reason) async {
    try {
      final repository = ref.read(appointmentRepositoryProvider);
      final success = await repository.cancelAppointment(appointmentId, reason);
      if (success) {
        await refresh();
      }
      return success;
    } catch (e) {
      return false;
    }
  }
}
