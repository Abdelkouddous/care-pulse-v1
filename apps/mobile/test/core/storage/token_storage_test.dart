import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vitalbook_mobile/core/storage/token_storage.dart';

class MockSecureStorage extends Fake implements FlutterSecureStorage {
  final Map<String, String> _data = {};

  @override
  dynamic noSuchMethod(Invocation invocation) {
    if (invocation.memberName == #write) {
      final key = invocation.namedArguments[#key] as String;
      final value = invocation.namedArguments[#value] as String?;
      if (value != null) _data[key] = value;
      return Future<void>.value();
    }
    if (invocation.memberName == #read) {
      final key = invocation.namedArguments[#key] as String;
      return Future<String?>.value(_data[key]);
    }
    if (invocation.memberName == #delete) {
      final key = invocation.namedArguments[#key] as String;
      _data.remove(key);
      return Future<void>.value();
    }
    return super.noSuchMethod(invocation);
  }
}

void main() {
  group('TokenStorage', () {
    late MockSecureStorage mockStorage;
    late TokenStorage tokenStorage;

    setUp(() {
      mockStorage = MockSecureStorage();
      tokenStorage = TokenStorage(mockStorage);
    });

    test('saves and retrieves dual tokens correctly', () async {
      await tokenStorage.saveTokens(
        vitalBookToken: 'vitalbook_abc123',
        userToken: 'user_xyz789',
        role: 'patient',
      );

      expect(await tokenStorage.getVitalBookToken(), 'vitalbook_abc123');
      expect(await tokenStorage.getUserToken(), 'user_xyz789');
      expect(await tokenStorage.getUserRole(), 'patient');
      expect(await tokenStorage.hasValidToken(), isTrue);
    });

    test('clears all tokens upon logout', () async {
      await tokenStorage.saveTokens(
        vitalBookToken: 'vitalbook_token',
        userToken: 'user_token',
      );

      await tokenStorage.clearTokens();

      expect(await tokenStorage.getVitalBookToken(), isNull);
      expect(await tokenStorage.getUserToken(), isNull);
      expect(await tokenStorage.hasValidToken(), isFalse);
    });
  });
}
