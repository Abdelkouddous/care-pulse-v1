import '../../doctors/domain/doctor_models.dart';

class AppointmentModel {
  final String id;
  final String patientId;
  final String doctorId;
  final String? clinicId;
  final DateTime scheduledAt;
  final String status;
  final String reason;
  final String? notes;
  final String? cancellationReason;
  final String? cancelledBy;
  final int consultationFeeCents;
  final DoctorModel? doctor;
  final DateTime? createdAt;

  const AppointmentModel({
    required this.id,
    required this.patientId,
    required this.doctorId,
    this.clinicId,
    required this.scheduledAt,
    required this.status,
    required this.reason,
    this.notes,
    this.cancellationReason,
    this.cancelledBy,
    required this.consultationFeeCents,
    this.doctor,
    this.createdAt,
  });

  String get formattedFee {
    final dinars = (consultationFeeCents / 100).toStringAsFixed(0);
    return '$dinars DZD';
  }

  bool get isUpcoming => status == 'pending' || status == 'confirmed';
  bool get isCancelled => status == 'cancelled';
  bool get isCompleted => status == 'completed';

  factory AppointmentModel.fromJson(Map<String, dynamic> json) {
    DoctorModel? doctorModel;
    if (json['doctor'] != null && json['doctor'] is Map<String, dynamic>) {
      doctorModel = DoctorModel.fromJson(json['doctor'] as Map<String, dynamic>);
    }

    return AppointmentModel(
      id: json['id'] as String,
      patientId: json['patient_id'] as String? ?? '',
      doctorId: json['doctor_id'] as String? ?? '',
      clinicId: json['clinic_id'] as String?,
      scheduledAt: DateTime.parse(json['scheduled_at'] as String),
      status: json['status'] as String? ?? 'pending',
      reason: json['reason'] as String? ?? '',
      notes: json['notes'] as String?,
      cancellationReason: json['cancellation_reason'] as String?,
      cancelledBy: json['cancelled_by'] as String?,
      consultationFeeCents: (json['consultation_fee_cents'] as num?)?.toInt() ?? 0,
      doctor: doctorModel,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at'] as String) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'patient_id': patientId,
      'doctor_id': doctorId,
      'clinic_id': clinicId,
      'scheduled_at': scheduledAt.toIso8601String(),
      'status': status,
      'reason': reason,
      'notes': notes,
      'cancellation_reason': cancellationReason,
      'cancelled_by': cancelledBy,
      'consultation_fee_cents': consultationFeeCents,
      'doctor': doctor?.toJson(),
      'created_at': createdAt?.toIso8601String(),
    };
  }
}

class CreateBookingDto {
  final String doctorId;
  final String? clinicId;
  final DateTime scheduledAt;
  final String reason;
  final String? notes;

  const CreateBookingDto({
    required this.doctorId,
    this.clinicId,
    required this.scheduledAt,
    required this.reason,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'doctor_id': doctorId,
      if (clinicId != null) 'clinic_id': clinicId,
      'scheduled_at': scheduledAt.toIso8601String(),
      'reason': reason,
      if (notes != null) 'notes': notes,
    };
  }
}
