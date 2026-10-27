import 'package:flutter/material.dart';

/// WateenSoft & Wateen Book Central Brand Configuration for Mobile
/// Single Source of Truth for corporate identity, tokens, and store metadata.
class BrandConfig {
  BrandConfig._();

  // Corporate & Product Nomenclature
  static const String companyName = 'WateenSoft';
  static const String companyNameArabic = 'وتين سوفت';
  static const String companyTagline = 'WateenSoft HealthTech Solutions';

  static const String appName = 'Wateen Book';
  static const String appNameArabic = 'وتين بوك';
  static const String appShortName = 'Wateen Book';
  static const String appShortNameArabic = 'وتين بوك';

  static const String appDescription =
      'Wateen Book by WateenSoft — Medical Appointment & Clinical Operations Platform.';

  // Identifiers
  static const String bundleId = 'com.wateensoft.wateenbook';
  static const String deepLinkScheme = 'wateenbook';
  static const String supportEmail = 'support@wateensoft.com';
  static const String contactEmail = 'contact@wateensoft.com';

  // Production Domains
  static const String webDomain = 'book.wateensoft.com';
  static const String apiDomain = 'api.wateensoft.com';

  // Signature Color Palette
  static const Color brandPrimary = Color(0xFF008668); // Wateen Teal
  static const Color brandAqua = Color(0xFF33CCCC); // Pulse Aqua
  static const Color brandAccent = Color(0xFFFF9B33); // Warm Empathy Orange
  static const Color brandSurfaceLight = Color(0xFFF2F2F2); // Soft Clinical Gray
  static const Color brandSurfaceDark = Color(0xFF0B131E); // Enterprise Slate
  static const Color brandSurfaceDarkSecondary = Color(0xFF111C2D);
}
