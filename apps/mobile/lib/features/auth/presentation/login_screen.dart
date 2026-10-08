import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import 'auth_controller.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _phoneController = TextEditingController(text: '0555998877');
  final _otpController = TextEditingController(text: '123456');

  bool _isCheckingBackend = false;
  String? _backendStatus;
  int? _latencyMs;
  int? _specialtiesCount;
  bool _isSuccess = false;

  @override
  void initState() {
    super.initState();
    _checkBackendConnection();
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _checkBackendConnection() async {
    setState(() {
      _isCheckingBackend = true;
      _backendStatus = 'Pinging backend...';
    });

    final stopwatch = Stopwatch()..start();
    try {
      final dio = ref.read(dioProvider);
      final response = await dio.get(ApiEndpoints.specialties);
      stopwatch.stop();

      final data = response.data['data'] as List<dynamic>?;

      setState(() {
        _isCheckingBackend = false;
        _isSuccess = true;
        _latencyMs = stopwatch.elapsedMilliseconds;
        _specialtiesCount = data?.length ?? 0;
        _backendStatus = 'Connected to Laravel API';
      });
    } catch (e) {
      stopwatch.stop();
      setState(() {
        _isCheckingBackend = false;
        _isSuccess = false;
        _latencyMs = stopwatch.elapsedMilliseconds;
        _backendStatus = 'Connection failed: $e';
      });
    }
  }

  Future<void> _submitPhone() async {
    final notifier = ref.read(authControllerProvider.notifier);
    final success = await notifier.sendPhoneOtp(_phoneController.text);
    if (!success && mounted) {
      final error = ref.read(authControllerProvider).errorMessage;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(error ?? 'Invalid phone number'),
          backgroundColor: AppColors.destructive,
        ),
      );
    }
  }

  Future<void> _verifyOtp() async {
    final notifier = ref.read(authControllerProvider.notifier);
    final success = await notifier.verifyOtp(_otpController.text);
    if (!success && mounted) {
      final state = ref.read(authControllerProvider);
      if (state.status != AuthStatus.awaitingRegistration && state.errorMessage != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(state.errorMessage!),
            backgroundColor: AppColors.destructive,
          ),
        );
      }
    }
  }

  Future<void> _quickMockPatientLogin() async {
    final notifier = ref.read(authControllerProvider.notifier);
    _phoneController.text = '0555998877';
    _otpController.text = '123456';
    final sent = await notifier.sendPhoneOtp('0555998877');
    if (sent) {
      final success = await notifier.verifyOtp('123456');
      if (!success && mounted) {
        final error = ref.read(authControllerProvider).errorMessage;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(error ?? 'Mock login failed'),
            backgroundColor: AppColors.destructive,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final authState = ref.watch(authControllerProvider);
    final isAwaitingOtp = authState.status == AuthStatus.awaitingOtp;

    return Scaffold(
      appBar: AppBar(
        title: const Text('VitalBook'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: AppSpacing.md),
              // VitalBook Brand Header
              Center(
                child: Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: AppColors.vitalTeal.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.local_hospital_rounded,
                    color: AppColors.vitalTeal,
                    size: 36,
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.md),
              Text(
                'Welcome to VitalBook',
                textAlign: TextAlign.center,
                style: theme.textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppColors.vitalTeal,
                ),
              ),
              const SizedBox(height: AppSpacing.xs),
              Text(
                'HealthTech Solutions by Vital Soft',
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Live Backend Connection Diagnostic Card
              Card(
                color: _isSuccess ? const Color(0xFFF0FDF4) : const Color(0xFFFEF2F2),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                  side: BorderSide(
                    color: _isSuccess
                        ? AppColors.success.withValues(alpha: 0.4)
                        : AppColors.destructive.withValues(alpha: 0.4),
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            _isSuccess ? Icons.cloud_done_rounded : Icons.cloud_off_rounded,
                            color: _isSuccess ? AppColors.success : AppColors.destructive,
                            size: 20,
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Text(
                            'Backend API Status',
                            style: theme.textTheme.titleSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: _isSuccess ? const Color(0xFF166534) : const Color(0xFF991B1B),
                            ),
                          ),
                          const Spacer(),
                          if (_isCheckingBackend)
                            const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          else
                            IconButton(
                              icon: const Icon(Icons.refresh_rounded, size: 18),
                              onPressed: _checkBackendConnection,
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(),
                            ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      Text(
                        'Target: ${ApiEndpoints.baseUrl}',
                        style: theme.textTheme.bodySmall?.copyWith(
                          fontFamily: 'monospace',
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      Text(
                        _backendStatus ?? 'Checking...',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w500,
                          color: _isSuccess ? const Color(0xFF15803D) : AppColors.destructive,
                        ),
                      ),
                      if (_isSuccess && _latencyMs != null) ...[
                        const SizedBox(height: AppSpacing.xs),
                        Text(
                          'Latency: ${_latencyMs}ms • Active Specialties: $_specialtiesCount',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: const Color(0xFF166534),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),

              const SizedBox(height: AppSpacing.xl),

              // Interactive Step 1: Phone Entry or Step 2: OTP Entry
              if (!isAwaitingOtp) ...[
                Text(
                  'Patient Sign In',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  'Enter your Algerian mobile number to receive an SMS verification code.',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                TextField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    prefixText: '+213 ',
                    hintText: '05 55 99 88 77',
                    prefixIcon: Icon(Icons.phone_android_rounded),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                ElevatedButton(
                  onPressed: authState.isLoading ? null : _submitPhone,
                  child: authState.isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Send Verification Code (OTP)'),
                ),
                const SizedBox(height: AppSpacing.sm),
                OutlinedButton.icon(
                  icon: const Icon(Icons.bolt_rounded, color: AppColors.primaryTeal),
                  label: const Text('Quick Sign In as Mock Patient (Sarah Benali)'),
                  onPressed: authState.isLoading ? null : _quickMockPatientLogin,
                ),
              ] else ...[
                Text(
                  'Verify Your Phone Number',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  'Enter the 6-digit code sent to ${authState.pendingPhone}',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                TextField(
                  controller: _otpController,
                  keyboardType: TextInputType.number,
                  maxLength: 6,
                  textAlign: TextAlign.center,
                  style: theme.textTheme.titleLarge?.copyWith(
                    letterSpacing: 8,
                    fontWeight: FontWeight.bold,
                  ),
                  decoration: const InputDecoration(
                    hintText: '123456',
                    counterText: '',
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                ElevatedButton(
                  onPressed: authState.isLoading ? null : _verifyOtp,
                  child: authState.isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Verify & Continue'),
                ),
                const SizedBox(height: AppSpacing.sm),
                TextButton(
                  onPressed: authState.isLoading
                      ? null
                      : () {
                          ref.read(authControllerProvider.notifier).logout();
                        },
                  child: const Text('Change Phone Number'),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
