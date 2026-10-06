import 'package:flutter/material.dart';

class SpecialtyModel {
  final String id;
  final String name;
  final String? description;
  final int doctorsCount;

  const SpecialtyModel({
    required this.id,
    required this.name,
    this.description,
    this.doctorsCount = 0,
  });

  factory SpecialtyModel.fromJson(Map<String, dynamic> json) {
    return SpecialtyModel(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      doctorsCount: (json['doctors_count'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'doctors_count': doctorsCount,
    };
  }

  IconData get icon {
    final lower = name.toLowerCase();
    if (lower.contains('cardio')) return Icons.favorite_rounded;
    if (lower.contains('pediatric') || lower.contains('child')) return Icons.child_care_rounded;
    if (lower.contains('derma') || lower.contains('skin')) return Icons.face_retouching_natural_rounded;
    if (lower.contains('neuro')) return Icons.psychology_rounded;
    if (lower.contains('ortho') || lower.contains('bone')) return Icons.accessibility_new_rounded;
    if (lower.contains('dent') || lower.contains('tooth')) return Icons.cleaning_services_rounded;
    if (lower.contains('eye') || lower.contains('ophthal')) return Icons.visibility_rounded;
    return Icons.medical_services_rounded;
  }

  Color get accentColor {
    final lower = name.toLowerCase();
    if (lower.contains('cardio')) return const Color(0xFFE11D48); // Rose / Red
    if (lower.contains('pediatric')) return const Color(0xFF0284C7); // Sky Blue
    if (lower.contains('derma')) return const Color(0xFFD97706); // Amber
    if (lower.contains('neuro')) return const Color(0xFF7C3AED); // Purple
    if (lower.contains('ortho')) return const Color(0xFF059669); // Emerald
    return const Color(0xFF0D9488); // Teal
  }
}
