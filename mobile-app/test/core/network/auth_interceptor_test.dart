import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vitalbook_mobile/core/network/auth_interceptor.dart';
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

class MockErrorHandler extends Fake implements ErrorInterceptorHandler {
  DioException? forwardedError;

  @override
  void next(DioException err) {
    forwardedError = err;
  }
}

void main() {
  group('AuthInterceptor', () {
    late TokenStorage tokenStorage;
    late AuthInterceptor interceptor;
    bool unauthorizedCalled = false;

    setUp(() {
      final mock = MockSecureStorage();
      tokenStorage = TokenStorage(mock);
      unauthorizedCalled = false;
      interceptor = AuthInterceptor(
        tokenStorage: tokenStorage,
        onUnauthorized: () => unauthorizedCalled = true,
      );
    });

    test('injects Bearer token into outgoing requests when present', () async {
      await tokenStorage.saveTokens(
        vitalBookToken: 'my_sanctum_token_123',
        userToken: 'user_jwt',
      );

      final options = RequestOptions(path: '/patient/profile');
      final handler = RequestInterceptorHandler();

      await interceptor.onRequest(options, handler);

      expect(options.headers['Authorization'], 'Bearer my_sanctum_token_123');
      expect(options.headers['Accept'], 'application/json');
    });

    test('clears tokens and triggers callback on 401 response error', () async {
      await tokenStorage.saveTokens(
        vitalBookToken: 'expired_token',
        userToken: 'user_jwt',
      );

      final dioError = DioException(
        requestOptions: RequestOptions(path: '/patient/profile'),
        response: Response(
          requestOptions: RequestOptions(path: '/patient/profile'),
          statusCode: 401,
        ),
      );

      final handler = MockErrorHandler();
      interceptor.onError(dioError, handler);

      expect(await tokenStorage.hasValidToken(), isFalse);
      expect(unauthorizedCalled, isTrue);
      expect(handler.forwardedError, equals(dioError));
    });
  });
}
