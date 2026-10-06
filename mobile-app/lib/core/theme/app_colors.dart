import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Vital Soft Signature Brand Palette
  static const Color vitalTeal = Color(0xFF006666);
  static const Color aquaGreen = Color(0xFF33CCCC);
  static const Color warmOrange = Color(0xFFFF9833);
  static const Color softGray = Color(0xFFF2F2F2);

  // Healthcare Light Theme Tokens (from Next.js globals.css)
  static const Color lightPrimary = Color(0xFF0D9488);
  static const Color lightPrimaryForeground = Colors.white;
  static const Color lightBackground = Color(0xFFF8FAFC);
  static const Color lightForeground = Color(0xFF0F172A);
  static const Color lightCard = Colors.white;
  static const Color lightCardForeground = Color(0xFF0F172A);
  static const Color lightSecondary = Color(0xFFF1F5F9);
  static const Color lightSecondaryForeground = Color(0xFF0F172A);
  static const Color lightMuted = Color(0xFFF1F5F9);
  static const Color lightMutedForeground = Color(0xFF64748B);
  static const Color lightAccent = Color(0xFFCCFBF1);
  static const Color lightBorder = Color(0xFFE2E8F0);
  static const Color lightInput = Color(0xFFE2E8F0);

  // Healthcare Dark Theme Tokens (from Next.js globals.css)
  static const Color darkPrimary = Color(0xFF14B8A6);
  static const Color darkPrimaryForeground = Color(0xFF042F2E);
  static const Color darkBackground = Color(0xFF090E17);
  static const Color darkForeground = Color(0xFFF8FAFC);
  static const Color darkCard = Color(0xFF0F172A);
  static const Color darkCardForeground = Color(0xFFF8FAFC);
  static const Color darkSecondary = Color(0xFF1E293B);
  static const Color darkSecondaryForeground = Color(0xFFF8FAFC);
  static const Color darkMuted = Color(0xFF1E293B);
  static const Color darkMutedForeground = Color(0xFF94A3B8);
  static const Color darkAccent = Color(0xFF134E4A);
  static const Color darkBorder = Color(0xFF1E293B);
  static const Color darkInput = Color(0xFF1E293B);

  // Shared Semantic Feedback Colors
  static const Color destructive = Color(0xFFEF4444);
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF0284C7);

  // Convenient Aliases
  static const Color primaryTeal = lightPrimary;
  static const Color card = lightCard;
  static const Color background = lightBackground;
  static const Color border = lightBorder;
  static const Color inputBg = lightSecondary;
  static const Color darkInputBg = darkSecondary;
  static const Color textPrimary = lightForeground;
  static const Color darkTextPrimary = darkForeground;
  static const Color textSecondary = lightMutedForeground;
  static const Color darkTextSecondary = darkMutedForeground;
}
