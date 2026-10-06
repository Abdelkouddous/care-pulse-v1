class UserProfile {
  final String id;
  final String name;
  final String? firstName;
  final String? lastName;
  final String? email;
  final String phone;
  final String? nationalIdNin;
  final String? carteChifaNumber;
  final int? wilayaCode;
  final String? bloodType;
  final String? gender;
  final String? address;

  const UserProfile({
    required this.id,
    required this.name,
    this.firstName,
    this.lastName,
    this.email,
    required this.phone,
    this.nationalIdNin,
    this.carteChifaNumber,
    this.wilayaCode,
    this.bloodType,
    this.gender,
    this.address,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] as String,
      name: json['name'] as String? ?? '${json['first_name'] ?? ''} ${json['last_name'] ?? ''}'.trim(),
      firstName: json['first_name'] as String?,
      lastName: json['last_name'] as String?,
      email: json['email'] as String?,
      phone: json['phone'] as String? ?? '',
      nationalIdNin: json['national_id_nin'] as String?,
      carteChifaNumber: json['carte_chifa_number'] as String?,
      wilayaCode: json['wilaya_code'] as int?,
      bloodType: json['blood_type'] as String?,
      gender: json['gender'] as String?,
      address: json['address'] as String?,
    );
  }
}

class PhoneAuthResult {
  final bool registered;
  final String? token;
  final UserProfile? user;
  final String? role;
  final String? phone;
  final String? onboardingToken;

  const PhoneAuthResult({
    required this.registered,
    this.token,
    this.user,
    this.role,
    this.phone,
    this.onboardingToken,
  });

  factory PhoneAuthResult.fromJson(Map<String, dynamic> json) {
    final registered = json['registered'] as bool? ?? false;
    return PhoneAuthResult(
      registered: registered,
      token: json['token'] as String?,
      user: json['user'] != null ? UserProfile.fromJson(json['user'] as Map<String, dynamic>) : null,
      role: json['role'] as String?,
      phone: json['phone'] as String?,
      onboardingToken: json['onboarding_token'] as String?,
    );
  }
}
