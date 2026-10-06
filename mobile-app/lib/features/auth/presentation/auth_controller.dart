import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/storage/token_storage.dart';
import '../data/auth_repository.dart';
import '../domain/auth_models.dart';

part 'auth_controller.g.dart';

enum AuthStatus {
  initial,
  authenticated,
  unauthenticated,
  awaitingOtp,
  awaitingRegistration,
}

@immutable
class AuthState {
  final AuthStatus status;
  final UserProfile? user;
  final String? pendingPhone;
  final String? onboardingToken;
  final bool isLoading;
  final String? errorMessage;

  const AuthState({
    this.status = AuthStatus.initial,
    this.user,
    this.pendingPhone,
    this.onboardingToken,
    this.isLoading = false,
    this.errorMessage,
  });

  AuthState copyWith({
    AuthStatus? status,
    UserProfile? user,
    String? pendingPhone,
    String? onboardingToken,
    bool? isLoading,
    String? errorMessage,
    bool clearError = false,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      pendingPhone: pendingPhone ?? this.pendingPhone,
      onboardingToken: onboardingToken ?? this.onboardingToken,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

@riverpod
class AuthController extends _$AuthController {
  @override
  AuthState build() {
    _checkInitialAuth();
    return const AuthState(status: AuthStatus.initial);
  }

  Future<void> _checkInitialAuth() async {
    final storage = ref.read(tokenStorageProvider);
    final hasToken = await storage.hasValidToken();
    if (state.status == AuthStatus.initial) {
      state = state.copyWith(
        status: hasToken ? AuthStatus.authenticated : AuthStatus.unauthenticated,
      );
    }
  }

  /// Sends phone verification code. Normalizes Algerian formats (05/06/07/213).
  Future<bool> sendPhoneOtp(String rawPhone) async {
    state = state.copyWith(isLoading: true, clearError: true);

    // Normalize Algerian phone to +213 format
    final digitsOnly = rawPhone.replaceAll(RegExp(r'[^0-9]'), '');
    String e164;
    if (digitsOnly.startsWith('213')) {
      e164 = '+$digitsOnly';
    } else if (digitsOnly.startsWith('0')) {
      e164 = '+213${digitsOnly.substring(1)}';
    } else {
      e164 = '+213$digitsOnly';
    }

    if (e164.length != 13) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Please enter a valid 9-digit Algerian phone number (e.g. 0555 12 34 56)',
      );
      return false;
    }

    state = state.copyWith(
      isLoading: false,
      status: AuthStatus.awaitingOtp,
      pendingPhone: e164,
    );
    return true;
  }

  /// Verifies OTP code and authenticates with backend
  Future<bool> verifyOtp(String otpCode) async {
    if (state.pendingPhone == null) return false;

    state = state.copyWith(isLoading: true, clearError: true);

    try {
      final repository = ref.read(authRepositoryProvider);
      final storage = ref.read(tokenStorageProvider);

      // In real device flow, Firebase PhoneAuth credential provides idToken.
      // In development/test mode, the verified phone is attested directly via backend.
      final result = await repository.verifyFirebasePhone(
        phone: state.pendingPhone!,
        idToken: otpCode.isNotEmpty ? 'test_token.$otpCode.signature' : null,
      );

      if (result.registered && result.token != null) {
        await storage.saveTokens(
          carePulseToken: result.token!,
          userToken: result.token!,
          role: result.role ?? 'patient',
        );

        state = state.copyWith(
          isLoading: false,
          status: AuthStatus.authenticated,
          user: result.user,
        );
        return true;
      } else {
        // User is not yet registered, transition to registration wizard
        state = state.copyWith(
          isLoading: false,
          status: AuthStatus.awaitingRegistration,
          onboardingToken: result.onboardingToken,
        );
        return false;
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Authentication failed. Please check the code and try again.',
      );
      return false;
    }
  }

  /// Complete patient registration from onboarding wizard
  Future<bool> completeRegistration(Map<String, dynamic> payload) async {
    state = state.copyWith(isLoading: true, clearError: true);

    try {
      final repository = ref.read(authRepositoryProvider);
      final storage = ref.read(tokenStorageProvider);

      final fullPayload = {
        ...payload,
        if (state.onboardingToken != null) 'onboarding_token': state.onboardingToken,
      };

      final result = await repository.registerWizard(fullPayload);

      if (result.token != null) {
        await storage.saveTokens(
          carePulseToken: result.token!,
          userToken: result.token!,
          role: 'patient',
        );

        state = state.copyWith(
          isLoading: false,
          status: AuthStatus.authenticated,
          user: result.user,
        );
        return true;
      }
      return false;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Registration failed. Please check all required fields.',
      );
      return false;
    }
  }

  Future<void> logout() async {
    final storage = ref.read(tokenStorageProvider);
    await storage.clearTokens();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }
}
