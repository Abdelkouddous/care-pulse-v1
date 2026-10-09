import 'package:flutter/material.dart';

/// Pixel-perfect vector implementation of the official VitalBook brand logo.
/// Faithfully reproduces the SVG specifications:
/// - Rounded teal gradient tile
/// - White calendar notebook sheet
/// - Orange binder rings
/// - Emerald medical cross
/// - Verified checkmark with protective white halo
class VitalBookLogoWidget extends StatelessWidget {
  final double size;
  final bool hasShadow;

  const VitalBookLogoWidget({
    super.key,
    this.size = 56,
    this.hasShadow = true,
  });

  @override
  Widget build(BuildContext context) {
    // RepaintBoundary + willChange: false ensures the raster cache
    // renders once and is retained in GPU memory across parent rebuilds/animations.
    final Widget painterWidget = RepaintBoundary(
      child: CustomPaint(
        size: Size(size, size),
        isComplex: true,
        willChange: false,
        painter: const _VitalBookLogoPainter(),
      ),
    );

    if (!hasShadow) return painterWidget;

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(size * (232 / 1024)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0D9488).withValues(alpha: 0.28),
            blurRadius: size * 0.35,
            offset: Offset(0, size * 0.12),
          ),
        ],
      ),
      child: painterWidget,
    );
  }
}

class _VitalBookLogoPainter extends CustomPainter {
  const _VitalBookLogoPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final double s = size.width / 1024.0;
    canvas.save();
    canvas.scale(s, s);

    // 1. Background tile with 3-stop teal linear gradient
    final bgRect = const Rect.fromLTWH(0, 0, 1024, 1024);
    final bgRRect = RRect.fromRectAndRadius(bgRect, const Radius.circular(232));
    final bgPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          Color(0xFF14B8A6),
          Color(0xFF0D9488),
          Color(0xFF006666),
        ],
        stops: [0.0, 0.45, 1.0],
      ).createShader(bgRect);
    canvas.drawRRect(bgRRect, bgPaint);

    // 1b. Inner subtle stroke border
    final innerBorderRect = const Rect.fromLTWH(20, 20, 984, 984);
    final innerBorderRRect = RRect.fromRectAndRadius(innerBorderRect, const Radius.circular(214));
    final innerBorderPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 16
      ..color = const Color(0xFF33CCCC).withValues(alpha: 0.55);
    canvas.drawRRect(innerBorderRRect, innerBorderPaint);

    // 2. White calendar page
    final calRect = const Rect.fromLTWH(232, 276, 560, 512);
    final calRRect = RRect.fromRectAndRadius(calRect, const Radius.circular(76));
    final calPaint = Paint()..color = Colors.white;
    canvas.drawRRect(calRRect, calPaint);

    // 3. Orange binder rings
    final ringPaint = Paint()..color = const Color(0xFFFF9833);
    final ring1 = RRect.fromRectAndRadius(
      const Rect.fromLTWH(340, 200, 64, 148),
      const Radius.circular(32),
    );
    final ring2 = RRect.fromRectAndRadius(
      const Rect.fromLTWH(620, 200, 64, 148),
      const Radius.circular(32),
    );
    canvas.drawRRect(ring1, ringPaint);
    canvas.drawRRect(ring2, ringPaint);

    // 4. Medical cross in emerald teal (#0D9488)
    final crossPath = Path()
      ..moveTo(412, 404)
      ..lineTo(492, 404)
      ..arcToPoint(const Offset(508, 420), radius: const Radius.circular(16))
      ..lineTo(508, 496)
      ..lineTo(584, 496)
      ..arcToPoint(const Offset(600, 512), radius: const Radius.circular(16))
      ..lineTo(600, 592)
      ..arcToPoint(const Offset(584, 608), radius: const Radius.circular(16))
      ..lineTo(508, 608)
      ..lineTo(508, 684)
      ..arcToPoint(const Offset(492, 700), radius: const Radius.circular(16))
      ..lineTo(412, 700)
      ..arcToPoint(const Offset(396, 684), radius: const Radius.circular(16))
      ..lineTo(396, 608)
      ..lineTo(320, 608)
      ..arcToPoint(const Offset(304, 592), radius: const Radius.circular(16))
      ..lineTo(304, 512)
      ..arcToPoint(const Offset(320, 496), radius: const Radius.circular(16))
      ..lineTo(396, 496)
      ..lineTo(396, 420)
      ..arcToPoint(const Offset(412, 404), radius: const Radius.circular(16))
      ..close();
    final crossPaint = Paint()..color = const Color(0xFF0D9488);
    canvas.drawPath(crossPath, crossPaint);

    // 5. Confirmation checkmark
    // 5a. White halo stroke
    final checkPath = Path()
      ..moveTo(528, 596)
      ..lineTo(612, 680)
      ..lineTo(780, 484);

    final checkHaloPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 128
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    canvas.drawPath(checkPath, checkHaloPaint);

    // 5b. Inner teal stroke
    final checkMainPaint = Paint()
      ..color = const Color(0xFF006666)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 64
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    canvas.drawPath(checkPath, checkMainPaint);

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Unified Brand Text Widget (Vital [bold] + Book [light])
class VitalBookBrandText extends StatelessWidget {
  final double fontSize;
  final bool isDark;

  const VitalBookBrandText({
    super.key,
    this.fontSize = 24,
    this.isDark = false,
  });

  @override
  Widget build(BuildContext context) {
    return RichText(
      text: TextSpan(
        style: TextStyle(
          fontSize: fontSize,
          letterSpacing: -0.5,
          fontFamily: 'Inter',
        ),
        children: [
          TextSpan(
            text: 'Vital',
            style: TextStyle(
              fontWeight: FontWeight.w800,
              color: isDark ? Colors.white : const Color(0xFF0F172A),
            ),
          ),
          const TextSpan(
            text: 'Book',
            style: TextStyle(
              fontWeight: FontWeight.w300,
              color: Color(0xFF0D9488),
            ),
          ),
        ],
      ),
    );
  }
}
