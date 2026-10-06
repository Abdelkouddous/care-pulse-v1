// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'doctor_controller.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(specialtiesList)
final specialtiesListProvider = SpecialtiesListProvider._();

final class SpecialtiesListProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<SpecialtyModel>>,
          List<SpecialtyModel>,
          FutureOr<List<SpecialtyModel>>
        >
    with
        $FutureModifier<List<SpecialtyModel>>,
        $FutureProvider<List<SpecialtyModel>> {
  SpecialtiesListProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'specialtiesListProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$specialtiesListHash();

  @$internal
  @override
  $FutureProviderElement<List<SpecialtyModel>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<SpecialtyModel>> create(Ref ref) {
    return specialtiesList(ref);
  }
}

String _$specialtiesListHash() => r'2c39de09502164d0c0a5613de14f2b073645842f';

@ProviderFor(featuredDoctors)
final featuredDoctorsProvider = FeaturedDoctorsProvider._();

final class FeaturedDoctorsProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<DoctorModel>>,
          List<DoctorModel>,
          FutureOr<List<DoctorModel>>
        >
    with
        $FutureModifier<List<DoctorModel>>,
        $FutureProvider<List<DoctorModel>> {
  FeaturedDoctorsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'featuredDoctorsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$featuredDoctorsHash();

  @$internal
  @override
  $FutureProviderElement<List<DoctorModel>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<DoctorModel>> create(Ref ref) {
    return featuredDoctors(ref);
  }
}

String _$featuredDoctorsHash() => r'c7f2f73f9b5b055278820e8b63de9024ad7a6afc';

@ProviderFor(DoctorFilterNotifier)
final doctorFilterProvider = DoctorFilterNotifierProvider._();

final class DoctorFilterNotifierProvider
    extends $NotifierProvider<DoctorFilterNotifier, DoctorFilter> {
  DoctorFilterNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'doctorFilterProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$doctorFilterNotifierHash();

  @$internal
  @override
  DoctorFilterNotifier create() => DoctorFilterNotifier();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(DoctorFilter value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<DoctorFilter>(value),
    );
  }
}

String _$doctorFilterNotifierHash() =>
    r'fa20fa07db4c8bbee4057ef0db24634475b160ed';

abstract class _$DoctorFilterNotifier extends $Notifier<DoctorFilter> {
  DoctorFilter build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<DoctorFilter, DoctorFilter>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<DoctorFilter, DoctorFilter>,
              DoctorFilter,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

@ProviderFor(DoctorSearchController)
final doctorSearchControllerProvider = DoctorSearchControllerProvider._();

final class DoctorSearchControllerProvider
    extends $AsyncNotifierProvider<DoctorSearchController, DoctorListResult> {
  DoctorSearchControllerProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'doctorSearchControllerProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$doctorSearchControllerHash();

  @$internal
  @override
  DoctorSearchController create() => DoctorSearchController();
}

String _$doctorSearchControllerHash() =>
    r'63ad4e1acf0b2456d3dd608354a05f40120aed63';

abstract class _$DoctorSearchController
    extends $AsyncNotifier<DoctorListResult> {
  FutureOr<DoctorListResult> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref =
        this.ref as $Ref<AsyncValue<DoctorListResult>, DoctorListResult>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<DoctorListResult>, DoctorListResult>,
              AsyncValue<DoctorListResult>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
