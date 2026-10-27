import 'package:flutter/material.dart';
import 'wateen_logo.dart';

export 'wateen_logo.dart';

/// Backward-compatible wrapper aliasing the official WateenBookLogoWidget
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
    return WateenBookLogoWidget(size: size, hasShadow: hasShadow);
  }
}

/// Backward-compatible wrapper aliasing WateenBrandText
class VitalBookBrandText extends StatelessWidget {
  final double fontSize;
  final bool isDark;

  const VitalBookBrandText({
    super.key,
    this.fontSize = 24,
    this.isDark = true,
  });

  @override
  Widget build(BuildContext context) {
    return WateenBrandText(fontSize: fontSize, isDark: isDark);
  }
}
