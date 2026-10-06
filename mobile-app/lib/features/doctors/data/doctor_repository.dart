import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/constants/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import '../domain/doctor_models.dart';
import '../domain/specialty_models.dart';

part 'doctor_repository.g.dart';

@Riverpod(keepAlive: true)
DoctorRepository doctorRepository(Ref ref) {
  final dio = ref.watch(dioProvider);
  return DoctorRepository(dio);
}

class DoctorRepository {
  final Dio _dio;

  DoctorRepository(this._dio);

  Future<List<SpecialtyModel>> getSpecialties() async {
    try {
      final response = await _dio.get(ApiEndpoints.specialties);
      final list = (response.data['data'] as List<dynamic>?) ?? [];
      return list.map((item) => SpecialtyModel.fromJson(item as Map<String, dynamic>)).toList();
    } on DioException catch (e) {
      throw Exception(e.response?.data?['errors']?[0]?['detail'] ?? 'Failed to load specialties');
    }
  }

  Future<DoctorListResult> getDoctors({
    String? query,
    String? specialtyId,
    int page = 1,
    int perPage = 12,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'per_page': perPage,
      };
      if (query != null && query.trim().isNotEmpty) {
        queryParams['search'] = query.trim();
      }
      if (specialtyId != null && specialtyId.isNotEmpty) {
        queryParams['specialty_id'] = specialtyId;
      }

      final response = await _dio.get(
        ApiEndpoints.doctors,
        queryParameters: queryParams,
      );

      final list = (response.data['data'] as List<dynamic>?) ?? [];
      final doctors = list.map((item) => DoctorModel.fromJson(item as Map<String, dynamic>)).toList();

      final meta = response.data['meta'] as Map<String, dynamic>?;
      final currentPage = meta?['current_page'] as int? ?? 1;
      final lastPage = meta?['last_page'] as int? ?? 1;
      final total = meta?['total'] as int? ?? doctors.length;

      return DoctorListResult(
        doctors: doctors,
        currentPage: currentPage,
        lastPage: lastPage,
        total: total,
      );
    } on DioException catch (e) {
      throw Exception(e.response?.data?['errors']?[0]?['detail'] ?? 'Failed to load doctors');
    }
  }

  Future<DoctorModel> getDoctorById(String doctorId) async {
    try {
      final response = await _dio.get('${ApiEndpoints.doctors}/$doctorId');
      final data = response.data['data'] as Map<String, dynamic>;
      return DoctorModel.fromJson(data);
    } on DioException catch (e) {
      throw Exception(e.response?.data?['errors']?[0]?['detail'] ?? 'Doctor not found');
    }
  }

  Future<List<String>> getAvailableSlots({
    required String doctorId,
    required DateTime date,
  }) async {
    try {
      final dateStr = '${date.year.toString().padLeft(4, '0')}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
      final response = await _dio.get(
        '${ApiEndpoints.doctors}/$doctorId/slots',
        queryParameters: {'date': dateStr},
      );

      final slotList = (response.data['data']?['slots'] as List<dynamic>?) ?? [];
      return slotList.map((s) => s.toString()).toList();
    } on DioException catch (e) {
      throw Exception(e.response?.data?['errors']?[0]?['detail'] ?? 'Failed to load available slots');
    }
  }
}
