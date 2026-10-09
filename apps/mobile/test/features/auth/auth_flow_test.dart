import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:vitalbook_mobile/core/storage/token_storage.dart';
import 'package:vitalbook_mobile/features/auth/data/auth_repository.dart';
import 'package:vitalbook_mobile/features/auth/domain/auth_models.dart';
import 'package:vitalbook_mobile/features/auth/presentation/auth_controller.dart';

// In-memory mock storage
class MockTokenStorage extends Fake implements TokenStorage {
  String? savedVitalBookToken;
  String? savedRole;

  @override
  Future<bool> hasValidToken() async => savedVitalBookToken != null;

  @override
  Future<void> saveTokens({
    required String vitalBookToken,
    required String userToken,
    String? role,
  }) async {
    savedVitalBookToken = vitalBookToken;
    savedRole = role;
  }

  @override
  Future<void> clearTokens() async {
    savedVitalBookToken = null;
    savedRole = null;
  }
}

// Mock auth repository
class MockAuthRepository extends Fake implements AuthRepository {
  @override
  Future<PhoneAuthResult> verifyFirebasePhone({
    required String phone,
    String? idToken,
  }) async {
    if (phone == '+213555998877') {
      // Existing patient Sarah Benali
      return const PhoneAuthResult(
        registered: true,
        token: 'mock_sanctum_token_sarah',
        role: 'patient',
        user: UserProfile(
          id: 'sarah-uuid',
          name: 'Sarah Benali',
          phone: '+213555998877',
          carteChifaNumber: '9504121234',
        ),
      );
    } else {
      // New patient
      return const PhoneAuthResult(
        registered: false,
        phone: '+213555000000',
        onboardingToken: 'mock_onboarding_token_123',
      );
    }
  }

  @override
  Future<PhoneAuthResult> registerWizard(Map<String, dynamic> payload) async {
    return PhoneAuthResult(
      registered: true,
      token: 'mock_registered_token',
      role: 'patient',
      user: UserProfile(
        id: 'new-user-uuid',
        name: '${payload['first_name']} ${payload['last_name']}',
        phone: '+213555000000',
        nationalIdNin: payload['national_id_nin'] as String?,
      ),
    );
  }
}

void main() {
  group('AuthController & Patient Auth Flow (VTB-15 & VTB-20)', () {
    late ProviderContainer container;
    late MockTokenStorage mockStorage;
    late MockAuthRepository mockRepo;

    setUp(() {
      mockStorage = MockTokenStorage();
      mockRepo = MockAuthRepository();

      container = ProviderContainer(
        overrides: [
          tokenStorageProvider.overrideWithValue(mockStorage),
          authRepositoryProvider.overrideWithValue(mockRepo),
        ],
      );
    });

    tearDown(() => container.dispose());

    test('normalizes Algerian phone format (0555 -> +213555)', () async {
      final controller = container.read(authControllerProvider.notifier);

      final valid = await controller.sendPhoneOtp('05 55 99 88 77');
      expect(valid, isTrue);

      final state = container.read(authControllerProvider);
      expect(state.status, equals(AuthStatus.awaitingOtp));
      expect(state.pendingPhone, equals('+213555998877'));
    });

    test('rejects invalid short phone numbers', () async {
      final controller = container.read(authControllerProvider.notifier);

      final valid = await controller.sendPhoneOtp('12345');
      expect(valid, isFalse);

      final state = container.read(authControllerProvider);
      expect(state.errorMessage, isNotNull);
    });

    test('logs in existing patient Sarah Benali directly', () async {
      final controller = container.read(authControllerProvider.notifier);
      await controller.sendPhoneOtp('0555998877');

      final success = await controller.verifyOtp('123456');
      expect(success, isTrue);

      final state = container.read(authControllerProvider);
      expect(state.status, equals(AuthStatus.authenticated));
      expect(state.user?.name, equals('Sarah Benali'));
      expect(mockStorage.savedVitalBookToken, equals('mock_sanctum_token_sarah'));
    });

    test('routes new patient to registration wizard with onboarding token', () async {
      final controller = container.read(authControllerProvider.notifier);
      await controller.sendPhoneOtp('0555000000');

      final success = await controller.verifyOtp('123456');
      expect(success, isFalse); // False because not yet registered

      final state = container.read(authControllerProvider);
      expect(state.status, equals(AuthStatus.awaitingRegistration));
      expect(state.onboardingToken, equals('mock_onboarding_token_123'));

      // Complete registration
      final regSuccess = await controller.completeRegistration({
        'first_name': 'Amine',
        'last_name': 'Hamel',
        'national_id_nin': '119951600000123456',
        'wilaya_code': 16,
      });

      expect(regSuccess, isTrue);
      final finalState = container.read(authControllerProvider);
      expect(finalState.status, equals(AuthStatus.authenticated));
      expect(finalState.user?.name, equals('Amine Hamel'));
    });
  });
}
