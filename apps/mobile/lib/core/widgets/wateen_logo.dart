import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../config/brand_config.dart';

/// Pixel-perfect vector implementation of the official WateenSoft Shield + Pulse brand logo.
/// Features:
/// - Clinical shield tile with #008668 (Wateen Teal) to #33CCCC (Pulse Aqua) gradient
/// - Clean ECG pulse wave with apex glow
/// - Protective medical cross geometry
class WateenBookLogoWidget extends StatelessWidget {
  final double size;
  final bool hasShadow;

  const WateenBookLogoWidget({
    super.key,
    this.size = 56,
    this.hasShadow = true,
  });

  @override
  Widget build(BuildContext context) {
    final Widget painterWidget = RepaintBoundary(
      child: CustomPaint(
        size: Size(size, size),
        isComplex: true,
        willChange: false,
        painter: const _WateenLogoPainter(),
      ),
    );

    if (!hasShadow) return painterWidget;

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(size * 0.22),
        boxShadow: [
          BoxShadow(
            color: BrandConfig.brandPrimary.withValues(alpha: 0.28),
            blurRadius: size * 0.35,
            offset: Offset(0, size * 0.12),
          ),
        ],
      ),
      child: painterWidget,
    );
  }
}

class _WateenLogoPainter extends CustomPainter {
  const _WateenLogoPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final double s = size.width / 100.0;
    canvas.save();
    canvas.scale(s, s);

    // 1. Clinical Shield with Wateen Teal -> Pulse Aqua linear gradient
    final Rect shieldRect = Rect.fromLTWH(8, 8, 84, 84);
    final Paint shieldPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          Color(0xFF008668), // Wateen Teal
          Color(0xFF33CCCC), // Pulse Aqua
        ],
      ).createShader(shieldRect)
      ..style = PaintingStyle.fill;

    final Path shieldPath = Path()
      ..moveTo(50, 8)
      ..cubicTo(68, 18, 84, 18, 88, 32)
      ..cubicTo(92, 56, 78, 80, 50, 92)
      ..cubicTo(22, 80, 8, 56, 12, 32)
      ..cubicTo(16, 18, 32, 18, 50, 8)
      ..close();

    canvas.drawPath(shieldPath, shieldPaint);

    // 2. Inner Shield Highlight Ring
    final Paint innerBorderPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.25)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    final Path innerPath = Path()
      ..moveTo(50, 13)
      ..cubicTo(66, 22, 79, 22, 83, 34)
      ..cubicTo(86, 54, 74, 74, 50, 85)
      ..cubicTo(26, 74, 14, 54, 17, 34)
      ..cubicTo(21, 22, 34, 22, 50, 13)
      ..close();

    canvas.drawPath(innerPath, innerBorderPaint);

    // 3. Heart & Medical Cross Outline Overlay (subtle watermark)
    final Paint watermarkPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.12)
      ..strokeWidth = 3.0
      ..style = PaintingStyle.stroke;

    final Path crossPath = Path()
      ..moveTo(50, 26)
      ..lineTo(50, 74)
      ..moveTo(26, 50)
      ..lineTo(74, 50);

    canvas.drawPath(crossPath, watermarkPaint);

    // 4. Glowing ECG Pulse Line
    final Paint pulseGlowPaint = Paint()
      ..color = const Color(0xFF33CCCC).withValues(alpha: 0.5)
      ..strokeWidth = 7.0
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..style = PaintingStyle.stroke;

    final Paint pulsePaint = Paint()
      ..color = Colors.white
      ..strokeWidth = 4.5
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..style = PaintingStyle.stroke;

    final Path pulsePath = Path()
      ..moveTo(22, 52)
      ..lineTo(34, 52)
      ..lineTo(40, 40)
      ..lineTo(48, 64)
      ..lineTo(54, 44)
      ..lineTo(60, 56)
      ..lineTo(66, 52)
      ..lineTo(78, 52);

    canvas.drawPath(pulsePath, pulseGlowPaint);
    canvas.drawPath(pulsePath, pulsePaint);

    // 5. Vital Pulse Node Dot
    final Paint dotPaint = Paint()..color = Colors.white;
    canvas.drawCircle(const Offset(54, 44), 3.5, dotPaint);

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Styled brand text: "Wateen Book" + "وتين بوك" badge + "BY WATEENSOFT"
class WateenBrandText extends StatelessWidget {
  final double fontSize;
  final bool isDark;
  final bool showBadge;

  const WateenBrandText({
    super.key,
    this.fontSize = 24,
    this.isDark = true,
    this.showBadge = true,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              'Wateen',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: fontSize,
                fontWeight: FontWeight.w800,
                color: isDark ? Colors.white : const Color(0xFF0F172A),
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(width: 3),
            Text(
              'Book',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: fontSize,
                fontWeight: FontWeight.w600,
                color: BrandConfig.brandAqua,
                letterSpacing: -0.5,
              ),
            ),
            if (showBadge) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: BrandConfig.brandPrimary.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text(
                  BrandConfig.appNameArabic,
                  textDirection: TextDirection.rtl,
                  style: TextStyle(
                    fontFamily: 'Cairo',
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: BrandConfig.brandAqua,
                  ),
                ),
              ),
            ],
          ],
        ),
        const SizedBox(height: 3),
        Text(
          'BY WATEENSOFT',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: fontSize * 0.38,
            fontWeight: FontWeight.w700,
            color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
            letterSpacing: 2.2,
          ),
        ),
      ],
    );
  }
}
