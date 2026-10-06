import 'specialty_models.dart';

class DoctorModel {
  final String id;
  final String? clinicId;
  final String? specialtyId;
  final String firstName;
  final String lastName;
  final String name;
  final String? email;
  final String? phone;
  final String? avatarUrl;
  final String? bio;
  final int consultationFeeCents;
  final String? licenseNumber;
  final bool isActive;
  final SpecialtyModel? specialty;
  final double rating;
  final int reviewsCount;
  final String? clinicName;
  final String wilaya;

  const DoctorModel({
    required this.id,
    this.clinicId,
    this.specialtyId,
    required this.firstName,
    required this.lastName,
    required this.name,
    this.email,
    this.phone,
    this.avatarUrl,
    this.bio,
    required this.consultationFeeCents,
    this.licenseNumber,
    this.isActive = true,
    this.specialty,
    this.rating = 4.9,
    this.reviewsCount = 38,
    this.clinicName = 'Clinique El Chifa, Hydra',
    this.wilaya = '16 - Alger',
  });

  String get formattedFee {
    final dinars = (consultationFeeCents / 100).toStringAsFixed(0);
    return '$dinars DZD';
  }

  factory DoctorModel.fromJson(Map<String, dynamic> json) {
    SpecialtyModel? specialtyModel;
    if (json['specialty'] != null && json['specialty'] is Map<String, dynamic>) {
      specialtyModel = SpecialtyModel.fromJson(json['specialty'] as Map<String, dynamic>);
    }

    return DoctorModel(
      id: json['id'] as String,
      clinicId: json['clinic_id'] as String?,
      specialtyId: json['specialty_id'] as String?,
      firstName: json['first_name'] as String? ?? '',
      lastName: json['last_name'] as String? ?? '',
      name: json['name'] as String? ?? 'Dr. ${json['first_name'] ?? ''} ${json['last_name'] ?? ''}'.trim(),
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      avatarUrl: json['avatar_url'] as String?,
      bio: json['bio'] as String?,
      consultationFeeCents: (json['consultation_fee_cents'] as num?)?.toInt() ?? 300000,
      licenseNumber: json['license_number'] as String?,
      isActive: json['is_active'] as bool? ?? true,
      specialty: specialtyModel,
      rating: (json['rating'] as num?)?.toDouble() ?? 4.9,
      reviewsCount: (json['reviews_count'] as num?)?.toInt() ?? 38,
      clinicName: json['clinic'] != null && json['clinic'] is Map
          ? (json['clinic']['name'] as String?)
          : 'Clinique El Chifa, Hydra',
      wilaya: '16 - Alger',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'clinic_id': clinicId,
      'specialty_id': specialtyId,
      'first_name': firstName,
      'last_name': lastName,
      'name': name,
      'email': email,
      'phone': phone,
      'avatar_url': avatarUrl,
      'bio': bio,
      'consultation_fee_cents': consultationFeeCents,
      'license_number': licenseNumber,
      'is_active': isActive,
      'specialty': specialty?.toJson(),
      'rating': rating,
      'reviews_count': reviewsCount,
      'clinic_name': clinicName,
      'wilaya': wilaya,
    };
  }
}

class DoctorFilter {
  final String? query;
  final String? specialtyId;
  final String? wilaya;
  final double? minRating;

  const DoctorFilter({
    this.query,
    this.specialtyId,
    this.wilaya,
    this.minRating,
  });

  DoctorFilter copyWith({
    String? query,
    String? specialtyId,
    String? wilaya,
    double? minRating,
    bool clearSpecialty = false,
    bool clearWilaya = false,
  }) {
    return DoctorFilter(
      query: query ?? this.query,
      specialtyId: clearSpecialty ? null : (specialtyId ?? this.specialtyId),
      wilaya: clearWilaya ? null : (wilaya ?? this.wilaya),
      minRating: minRating ?? this.minRating,
    );
  }

  bool get hasActiveFilters =>
      (query != null && query!.trim().isNotEmpty) ||
      specialtyId != null ||
      wilaya != null ||
      (minRating != null && minRating! > 0);
}

class DoctorListResult {
  final List<DoctorModel> doctors;
  final int currentPage;
  final int lastPage;
  final int total;

  const DoctorListResult({
    required this.doctors,
    this.currentPage = 1,
    this.lastPage = 1,
    this.total = 0,
  });
}
