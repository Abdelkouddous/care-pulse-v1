import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/network/dio_client.dart';
import '../domain/auth_models.dart';

part 'auth_repository.g.dart';

class AuthRepository {
  final Dio _dio;

  AuthRepository(this._dio);

  Future<PhoneAuthResult> verifyFirebasePhone({
    required String phone,
    String? idToken,
  }) async {
    final response = await _dio.post(
      '/auth/firebase-phone',
      data: {
        'phone': phone,
        ...?idToken == null ? null : {'id_token': idToken},
      },
    );

    final data = response.data['data'] as Map<String, dynamic>;
    return PhoneAuthResult.fromJson(data);
  }

  Future<bool> checkPhoneExists(String phone) async {
    final response = await _dio.post(
      '/auth/check-phone',
      data: {'phone': phone},
    );
    return response.data['data']['exists'] as bool? ?? false;
  }

  Future<PhoneAuthResult> registerWizard(Map<String, dynamic> payload) async {
    final response = await _dio.post(
      '/auth/register-wizard',
      data: payload,
    );

    final data = response.data['data'] as Map<String, dynamic>;
    return PhoneAuthResult.fromJson({
      ...data,
      'registered': true,
    });
  }
}

@riverpod
AuthRepository authRepository(Ref ref) {
  final dio = ref.watch(dioProvider);
  return AuthRepository(dio);
}
