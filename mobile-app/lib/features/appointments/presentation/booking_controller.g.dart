// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking_controller.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(doctorSlots)
final doctorSlotsProvider = DoctorSlotsFamily._();

final class DoctorSlotsProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<String>>,
          List<String>,
          FutureOr<List<String>>
        >
    with $FutureModifier<List<String>>, $FutureProvider<List<String>> {
  DoctorSlotsProvider._({
    required DoctorSlotsFamily super.from,
    required ({String doctorId, DateTime date}) super.argument,
  }) : super(
         retry: null,
         name: r'doctorSlotsProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$doctorSlotsHash();

  @override
  String toString() {
    return r'doctorSlotsProvider'
        ''
        '$argument';
  }

  @$internal
  @override
  $FutureProviderElement<List<String>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<String>> create(Ref ref) {
    final argument = this.argument as ({String doctorId, DateTime date});
    return doctorSlots(ref, doctorId: argument.doctorId, date: argument.date);
  }

  @override
  bool operator ==(Object other) {
    return other is DoctorSlotsProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$doctorSlotsHash() => r'adea67584be0171687e2b42752b60c0ff124625e';

final class DoctorSlotsFamily extends $Family
    with
        $FunctionalFamilyOverride<
          FutureOr<List<String>>,
          ({String doctorId, DateTime date})
        > {
  DoctorSlotsFamily._()
    : super(
        retry: null,
        name: r'doctorSlotsProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  DoctorSlotsProvider call({
    required String doctorId,
    required DateTime date,
  }) => DoctorSlotsProvider._(
    argument: (doctorId: doctorId, date: date),
    from: this,
  );

  @override
  String toString() => r'doctorSlotsProvider';
}

@ProviderFor(BookingController)
final bookingControllerProvider = BookingControllerProvider._();

final class BookingControllerProvider
    extends $NotifierProvider<BookingController, BookingState> {
  BookingControllerProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'bookingControllerProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$bookingControllerHash();

  @$internal
  @override
  BookingController create() => BookingController();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(BookingState value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<BookingState>(value),
    );
  }
}

String _$bookingControllerHash() => r'8dd013460220a2a4b1d98477c9bca0b0a54b4c7f';

abstract class _$BookingController extends $Notifier<BookingState> {
  BookingState build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<BookingState, BookingState>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<BookingState, BookingState>,
              BookingState,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

@ProviderFor(PatientAppointmentsController)
final patientAppointmentsControllerProvider =
    PatientAppointmentsControllerProvider._();

final class PatientAppointmentsControllerProvider
    extends
        $AsyncNotifierProvider<
          PatientAppointmentsController,
          List<AppointmentModel>
        > {
  PatientAppointmentsControllerProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'patientAppointmentsControllerProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$patientAppointmentsControllerHash();

  @$internal
  @override
  PatientAppointmentsController create() => PatientAppointmentsController();
}

String _$patientAppointmentsControllerHash() =>
    r'9fabebccb68bc0c7e3609abc5762e7174e9e6ce1';

abstract class _$PatientAppointmentsController
    extends $AsyncNotifier<List<AppointmentModel>> {
  FutureOr<List<AppointmentModel>> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref =
        this.ref
            as $Ref<AsyncValue<List<AppointmentModel>>, List<AppointmentModel>>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<
                AsyncValue<List<AppointmentModel>>,
                List<AppointmentModel>
              >,
              AsyncValue<List<AppointmentModel>>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
