import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'token_storage.g.dart';

class TokenStorage {
  final FlutterSecureStorage _storage;
  static final Map<String, String> _memoryCache = {};

  TokenStorage([FlutterSecureStorage? storage])
      : _storage = storage ??
            const FlutterSecureStorage(
              aOptions: AndroidOptions(),
              iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
              webOptions: WebOptions(
                dbName: 'vitalbook_secure_storage',
                publicKey: 'vitalbook_public_key',
              ),
            );

  static const String _vitalBookTokenKey = 'vitalbook_token';
  static const String _userTokenKey = 'user_token';
  static const String _userRoleKey = 'user_role';

  Future<void> saveTokens({
    required String vitalBookToken,
    required String userToken,
    String? role,
  }) async {
    _memoryCache[_vitalBookTokenKey] = vitalBookToken;
    _memoryCache[_userTokenKey] = userToken;
    if (role != null) _memoryCache[_userRoleKey] = role;

    try {
      await Future.wait([
        _storage.write(key: _vitalBookTokenKey, value: vitalBookToken),
        _storage.write(key: _userTokenKey, value: userToken),
        if (role != null) _storage.write(key: _userRoleKey, value: role),
      ]);
    } catch (_) {}
  }

  Future<String?> getVitalBookToken() async {
    if (_memoryCache.containsKey(_vitalBookTokenKey)) {
      return _memoryCache[_vitalBookTokenKey];
    }
    try {
      final token = await _storage.read(key: _vitalBookTokenKey);
      if (token != null) _memoryCache[_vitalBookTokenKey] = token;
      return token;
    } catch (_) {
      return null;
    }
  }

  Future<String?> getUserToken() async {
    if (_memoryCache.containsKey(_userTokenKey)) {
      return _memoryCache[_userTokenKey];
    }
    try {
      final token = await _storage.read(key: _userTokenKey);
      if (token != null) _memoryCache[_userTokenKey] = token;
      return token;
    } catch (_) {
      return null;
    }
  }

  Future<String?> getUserRole() async {
    if (_memoryCache.containsKey(_userRoleKey)) {
      return _memoryCache[_userRoleKey];
    }
    try {
      final role = await _storage.read(key: _userRoleKey);
      if (role != null) _memoryCache[_userRoleKey] = role;
      return role;
    } catch (_) {
      return null;
    }
  }

  Future<bool> hasValidToken() async {
    try {
      final token = await getVitalBookToken();
      return token != null && token.isNotEmpty;
    } catch (_) {
      return false;
    }
  }

  Future<void> clearTokens() async {
    _memoryCache.clear();
    try {
      await Future.wait([
        _storage.delete(key: _vitalBookTokenKey),
        _storage.delete(key: _userTokenKey),
        _storage.delete(key: _userRoleKey),
      ]);
    } catch (_) {}
  }
}

@riverpod
TokenStorage tokenStorage(Ref ref) {
  return TokenStorage();
}
