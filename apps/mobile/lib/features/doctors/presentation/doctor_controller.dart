import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../data/doctor_repository.dart';
import '../domain/doctor_models.dart';
import '../domain/specialty_models.dart';

part 'doctor_controller.g.dart';

@riverpod
Future<List<SpecialtyModel>> specialtiesList(Ref ref) async {
  final repository = ref.watch(doctorRepositoryProvider);
  return repository.getSpecialties();
}

@riverpod
Future<List<DoctorModel>> featuredDoctors(Ref ref) async {
  final repository = ref.watch(doctorRepositoryProvider);
  final result = await repository.getDoctors(perPage: 6);
  return result.doctors;
}

@riverpod
class DoctorFilterNotifier extends _$DoctorFilterNotifier {
  @override
  DoctorFilter build() {
    return const DoctorFilter();
  }

  void updateQuery(String query) {
    state = state.copyWith(query: query);
  }

  void selectSpecialty(String? specialtyId) {
    if (state.specialtyId == specialtyId) {
      state = state.copyWith(clearSpecialty: true);
    } else {
      state = state.copyWith(specialtyId: specialtyId);
    }
  }

  void selectWilaya(String? wilaya) {
    if (state.wilaya == wilaya) {
      state = state.copyWith(clearWilaya: true);
    } else {
      state = state.copyWith(wilaya: wilaya);
    }
  }

  void setMinRating(double? rating) {
    state = state.copyWith(minRating: rating);
  }

  void resetFilters() {
    state = const DoctorFilter();
  }
}

@riverpod
class DoctorSearchController extends _$DoctorSearchController {
  @override
  FutureOr<DoctorListResult> build() async {
    final filter = ref.watch(doctorFilterProvider);
    final repository = ref.watch(doctorRepositoryProvider);

    return repository.getDoctors(
      query: filter.query,
      specialtyId: filter.specialtyId,
    );
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final filter = ref.read(doctorFilterProvider);
      final repository = ref.read(doctorRepositoryProvider);
      return repository.getDoctors(
        query: filter.query,
        specialtyId: filter.specialtyId,
      );
    });
  }
}
