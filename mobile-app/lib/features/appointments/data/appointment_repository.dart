import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/constants/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import '../domain/appointment_models.dart';

part 'appointment_repository.g.dart';

@Riverpod(keepAlive: true)
AppointmentRepository appointmentRepository(Ref ref) {
  final dio = ref.watch(dioProvider);
  return AppointmentRepository(dio);
}

class AppointmentRepository {
  final Dio _dio;

  AppointmentRepository(this._dio);

  Future<AppointmentModel> bookAppointment(CreateBookingDto dto) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.appointments,
        data: dto.toJson(),
      );

      final data = response.data['data'] as Map<String, dynamic>;
      return AppointmentModel.fromJson(data);
    } on DioException catch (e) {
      final errorMsg = e.response?.data?['errors']?[0]?['detail'] ??
          e.response?.data?['message'] ??
          'Failed to book appointment';
      throw Exception(errorMsg);
    }
  }

  Future<List<AppointmentModel>> getPatientAppointments() async {
    try {
      final response = await _dio.get('${ApiEndpoints.patients}/me/appointments');
      final list = (response.data['data'] as List<dynamic>?) ?? [];
      return list.map((item) => AppointmentModel.fromJson(item as Map<String, dynamic>)).toList();
    } on DioException catch (e) {
      final errorMsg = e.response?.data?['errors']?[0]?['detail'] ??
          e.response?.data?['message'] ??
          'Failed to load appointments';
      throw Exception(errorMsg);
    }
  }

  Future<AppointmentModel> getAppointmentById(String id) async {
    try {
      final response = await _dio.get('${ApiEndpoints.appointments}/$id');
      final data = response.data['data'] as Map<String, dynamic>;
      return AppointmentModel.fromJson(data);
    } on DioException catch (e) {
      final errorMsg = e.response?.data?['errors']?[0]?['detail'] ??
          e.response?.data?['message'] ??
          'Appointment not found';
      throw Exception(errorMsg);
    }
  }

  Future<bool> cancelAppointment(String id, String reason) async {
    try {
      final response = await _dio.put(
        '${ApiEndpoints.appointments}/$id/cancel',
        data: {'reason': reason},
      );
      return response.statusCode == 200;
    } on DioException catch (e) {
      final errorMsg = e.response?.data?['errors']?[0]?['detail'] ??
          e.response?.data?['message'] ??
          'Failed to cancel appointment';
      throw Exception(errorMsg);
    }
  }
}
