import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/api_endpoints.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/vitalbook_logo.dart';
import 'auth_controller.dart';

class LoginScreen extends ConsumerStatefulWidget {
  final bool autoStartSplash;

  const LoginScreen({
    super.key,
    this.autoStartSplash = true,
  });

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> with TickerProviderStateMixin {
  final _phoneController = TextEditingController(text: '0555998877');
  final _otpController = TextEditingController(text: '123456');

  // Splash typewriter state
  bool _isShowingSplash = true;
  String _typedText = '';
  static const String _fullTargetText = 'VitalBook';
  Timer? _typewriterTimer;
  bool _showCursor = true;
  Timer? _cursorTimer;
  double _splashOpacity = 1.0;

  // Live Backend status
  bool _isCheckingBackend = false;
  bool _isSuccess = false;
  String _backendStatus = 'Checking API...';

  @override
  void initState() {
    super.initState();
    _checkBackendConnection();

    if (widget.autoStartSplash) {
      _startTypewriterAnimation();
    } else {
      _isShowingSplash = false;
    }
  }

  @override
  void dispose() {
    _typewriterTimer?.cancel();
    _cursorTimer?.cancel();
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _startTypewriterAnimation() {
    _typedText = '';
    _isShowingSplash = true;
    _splashOpacity = 1.0;

    // Blinking cursor
    _cursorTimer = Timer.periodic(const Duration(milliseconds: 400), (timer) {
      if (mounted) {
        setState(() {
          _showCursor = !_showCursor;
        });
      }
    });

    int charIndex = 0;
    _typewriterTimer = Timer.periodic(const Duration(milliseconds: 140), (timer) {
      if (!mounted) return;
      if (charIndex < _fullTargetText.length) {
        setState(() {
          _typedText = _fullTargetText.substring(0, charIndex + 1);
        });
        charIndex++;
      } else {
        timer.cancel();
        // Pause briefly after completing "VitalBook", then transition smoothly into login form
        Future.delayed(const Duration(milliseconds: 800), () {
          if (!mounted) return;
          setState(() {
            _splashOpacity = 0.0;
          });
          Future.delayed(const Duration(milliseconds: 400), () {
            if (!mounted) return;
            setState(() {
              _isShowingSplash = false;
            });
          });
        });
      }
    });
  }

  void _skipSplash() {
    _typewriterTimer?.cancel();
    _cursorTimer?.cancel();
    setState(() {
      _isShowingSplash = false;
    });
  }

  void _showErrorSnackBar(String message, {VoidCallback? onRetry}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: const Color(0xFFDC2626),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        content: Row(
          children: [
            const Icon(Icons.wifi_off_rounded, color: Colors.white, size: 20),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
        action: onRetry != null
            ? SnackBarAction(
                label: 'Retry',
                textColor: Colors.white,
                onPressed: onRetry,
              )
            : null,
        duration: const Duration(seconds: 4),
      ),
    );
  }

  Future<void> _checkBackendConnection() async {
    setState(() {
      _isCheckingBackend = true;
      _backendStatus = 'Pinging API...';
    });

    try {
      final dio = ref.read(dioProvider);
      final response = await dio.get(ApiEndpoints.specialties);
      final data = response.data['data'] as List<dynamic>?;

      if (mounted) {
        setState(() {
          _isCheckingBackend = false;
          _isSuccess = true;
          _backendStatus = 'Live API Connected (${data?.length ?? 0} Specialties)';
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _isCheckingBackend = false;
          _isSuccess = false;
          _backendStatus = 'API Offline';
        });
        _showErrorSnackBar(
          'Cannot connect to backend server (localhost:8000). Please verify API is running.',
          onRetry: _checkBackendConnection,
        );
      }
    }
  }

  Future<void> _submitPhone() async {
    final notifier = ref.read(authControllerProvider.notifier);
    final success = await notifier.sendPhoneOtp(_phoneController.text);
    if (!success && mounted) {
      final error = ref.read(authControllerProvider).errorMessage;
      _showErrorSnackBar(error ?? 'Invalid phone number or server connection error');
    }
  }

  Future<void> _verifyOtp() async {
    final notifier = ref.read(authControllerProvider.notifier);
    final success = await notifier.verifyOtp(_otpController.text);
    if (!success && mounted) {
      final state = ref.read(authControllerProvider);
      if (state.status != AuthStatus.awaitingRegistration && state.errorMessage != null) {
        _showErrorSnackBar(state.errorMessage!);
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
        _showErrorSnackBar(
          error ?? 'Demo sign in failed. Backend server may be offline.',
          onRetry: _quickMockPatientLogin,
        );
      }
    } else if (mounted) {
      final error = ref.read(authControllerProvider).errorMessage;
      _showErrorSnackBar(
        error ?? 'Unable to send OTP. Backend server unreachable.',
        onRetry: _quickMockPatientLogin,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : const Color(0xFFF8FAFC),
      body: Stack(
        children: [
          // Main Professional Login Form
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Unified Brand Icon
                    const Center(
                      child: VitalBookLogoWidget(size: 72),
                    ),
                    const SizedBox(height: 16),

                    // Unified Brand Title (Vital [bold] + Book [light])
                    Center(
                      child: VitalBookBrandText(
                        fontSize: 30,
                        isDark: isDark,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Plateforme Médicale • Algérie',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: isDark ? AppColors.darkTextSecondary : const Color(0xFF64748B),
                        letterSpacing: 0.2,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Discrete Subtle API Status Pill
                    Center(
                      child: InkWell(
                        onTap: _checkBackendConnection,
                        borderRadius: BorderRadius.circular(20),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                          decoration: BoxDecoration(
                            color: _isSuccess
                                ? const Color(0xFF10B981).withValues(alpha: 0.1)
                                : const Color(0xFFEF4444).withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: _isSuccess
                                  ? const Color(0xFF10B981).withValues(alpha: 0.3)
                                  : const Color(0xFFEF4444).withValues(alpha: 0.3),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: _isSuccess ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                _backendStatus,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: _isSuccess ? const Color(0xFF047857) : const Color(0xFFB91C1C),
                                ),
                              ),
                              if (_isCheckingBackend) ...[
                                const SizedBox(width: 6),
                                const SizedBox(
                                  width: 10,
                                  height: 10,
                                  child: CircularProgressIndicator(strokeWidth: 1.5),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Modern Medical Login Card
                    _buildLoginFormCard(context, isDark),

                    const SizedBox(height: 24),

                    // Subtle Replay Intro Link
                    Center(
                      child: TextButton.icon(
                        icon: const Icon(Icons.play_circle_outline_rounded, size: 16),
                        label: const Text(
                          'Replay Brand Intro',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                        ),
                        onPressed: _startTypewriterAnimation,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Animated Typewriter Splash Overlay
          if (_isShowingSplash)
            AnimatedOpacity(
              duration: const Duration(milliseconds: 400),
              opacity: _splashOpacity,
              child: GestureDetector(
                onTap: _skipSplash,
                child: Container(
                  width: double.infinity,
                  height: double.infinity,
                  color: isDark ? AppColors.darkBackground : Colors.white,
                  child: SafeArea(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Spacer(),
                        // Animated Brand Logo Entrance
                        const VitalBookLogoWidget(size: 88),
                        const SizedBox(height: 24),

                        // Letter-by-letter Typewriter Text
                        _buildTypewriterText(isDark),

                        const SizedBox(height: 12),
                        Text(
                          'HealthTech Solutions by Vital Soft',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: isDark ? AppColors.darkTextSecondary : const Color(0xFF64748B),
                            letterSpacing: 0.3,
                          ),
                        ),
                        const Spacer(),

                        // Subtle bottom loader indicator
                        Padding(
                          padding: const EdgeInsets.only(bottom: 24.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const SizedBox(
                                width: 14,
                                height: 14,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF0D9488)),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Text(
                                'Initialisation...',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: isDark ? AppColors.darkTextSecondary : const Color(0xFF94A3B8),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildTypewriterText(bool isDark) {
    // Splits typed text between "Vital" (bold) and "Book" (light teal)
    String vitalPart = '';
    String bookPart = '';

    if (_typedText.length <= 5) {
      vitalPart = _typedText;
    } else {
      vitalPart = 'Vital';
      bookPart = _typedText.substring(5);
    }

    return RichText(
      text: TextSpan(
        style: const TextStyle(
          fontSize: 34,
          letterSpacing: -0.5,
          fontFamily: 'Inter',
        ),
        children: [
          TextSpan(
            text: vitalPart,
            style: TextStyle(
              fontWeight: FontWeight.w800,
              color: isDark ? Colors.white : const Color(0xFF0F172A),
            ),
          ),
          TextSpan(
            text: bookPart,
            style: const TextStyle(
              fontWeight: FontWeight.w300,
              color: Color(0xFF0D9488),
            ),
          ),
          if (_showCursor)
            const TextSpan(
              text: '▎',
              style: TextStyle(
                fontWeight: FontWeight.w400,
                color: Color(0xFF0D9488),
                fontSize: 30,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildLoginFormCard(BuildContext context, bool isDark) {
    final theme = Theme.of(context);
    final authState = ref.watch(authControllerProvider);
    final isAwaitingOtp = authState.status == AuthStatus.awaitingOtp;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.25 : 0.04),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      padding: const EdgeInsets.all(22.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (!isAwaitingOtp) ...[
            Text(
              'Patient Sign In',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
                fontSize: 17,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Enter your Algerian mobile number to receive an instant SMS verification code.',
              style: TextStyle(
                fontSize: 13,
                color: isDark ? AppColors.darkTextSecondary : const Color(0xFF64748B),
                height: 1.4,
              ),
            ),
            const SizedBox(height: 18),

            // Algerian Phone Field
            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              decoration: InputDecoration(
                prefixIcon: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 12),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('🇩🇿', style: TextStyle(fontSize: 18)),
                      SizedBox(width: 8),
                      Text(
                        '+213',
                        style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                      ),
                      SizedBox(width: 8),
                      Text('|', style: TextStyle(color: Color(0xFFCBD5E1))),
                    ],
                  ),
                ),
                hintText: '0555 99 88 77',
                hintStyle: const TextStyle(color: Color(0xFF94A3B8)),
                filled: true,
                fillColor: isDark ? AppColors.darkBackground : const Color(0xFFF8FAFC),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide(
                    color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0),
                  ),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFF0D9488), width: 1.8),
                ),
              ),
            ),
            const SizedBox(height: 18),

            // Submit Button
            SizedBox(
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0D9488),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                onPressed: authState.isLoading ? null : _submitPhone,
                child: authState.isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Send Verification Code (OTP)',
                            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.arrow_forward_rounded, size: 18),
                        ],
                      ),
              ),
            ),
            const SizedBox(height: 14),

            // Demo Patient Button
            OutlinedButton.icon(
              icon: const Icon(Icons.flash_on_rounded, color: Color(0xFF0D9488), size: 18),
              label: const Text(
                'Demo Quick Sign In (Sarah Benali)',
                style: TextStyle(
                  color: Color(0xFF0D9488),
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                ),
              ),
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: const Color(0xFF0D9488).withValues(alpha: 0.3)),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              onPressed: authState.isLoading ? null : _quickMockPatientLogin,
            ),
          ] else ...[
            Text(
              'Enter Verification Code',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
                fontSize: 17,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'A 6-digit code was sent to ${authState.pendingPhone ?? '+213 555 99 88 77'}.',
              style: TextStyle(
                fontSize: 13,
                color: isDark ? AppColors.darkTextSecondary : const Color(0xFF64748B),
              ),
            ),
            const SizedBox(height: 18),

            // OTP Input
            TextField(
              controller: _otpController,
              keyboardType: TextInputType.number,
              maxLength: 6,
              textAlign: TextAlign.center,
              style: const TextStyle(
                letterSpacing: 10,
                fontWeight: FontWeight.w800,
                fontSize: 22,
                color: Color(0xFF0D9488),
              ),
              decoration: InputDecoration(
                hintText: '123456',
                counterText: '',
                filled: true,
                fillColor: isDark ? AppColors.darkBackground : const Color(0xFFF8FAFC),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide(
                    color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0),
                  ),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFF0D9488), width: 1.8),
                ),
              ),
            ),
            const SizedBox(height: 18),

            // Verify Button
            SizedBox(
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0D9488),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                onPressed: authState.isLoading ? null : _verifyOtp,
                child: authState.isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Text(
                        'Verify & Proceed',
                        style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                      ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
