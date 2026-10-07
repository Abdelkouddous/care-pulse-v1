import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'token_storage.g.dart';

class TokenStorage {
  final FlutterSecureStorage _storage;

  TokenStorage([FlutterSecureStorage? storage])
      : _storage = storage ??
            const FlutterSecureStorage(
              aOptions: AndroidOptions(),
              iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
            );

  static const String _vitalBookTokenKey = 'vitalbook_token';
  static const String _userTokenKey = 'user_token';
  static const String _userRoleKey = 'user_role';

  Future<void> saveTokens({
    required String vitalBookToken,
    required String userToken,
    String? role,
  }) async {
    await Future.wait([
      _storage.write(key: _vitalBookTokenKey, value: vitalBookToken),
      _storage.write(key: _userTokenKey, value: userToken),
      if (role != null) _storage.write(key: _userRoleKey, value: role),
    ]);
  }

  Future<String?> getVitalBookToken() => _storage.read(key: _vitalBookTokenKey);
  Future<String?> getUserToken() => _storage.read(key: _userTokenKey);
  Future<String?> getUserRole() => _storage.read(key: _userRoleKey);

  Future<bool> hasValidToken() async {
    final token = await getVitalBookToken();
    return token != null && token.isNotEmpty;
  }

  Future<void> clearTokens() async {
    await Future.wait([
      _storage.delete(key: _vitalBookTokenKey),
      _storage.delete(key: _userTokenKey),
      _storage.delete(key: _userRoleKey),
    ]);
  }
}

@riverpod
TokenStorage tokenStorage(Ref ref) {
  return TokenStorage();
}
