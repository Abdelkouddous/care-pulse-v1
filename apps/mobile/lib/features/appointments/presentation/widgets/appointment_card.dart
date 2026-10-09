import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/appointment_models.dart';

class AppointmentCard extends StatelessWidget {
  final AppointmentModel appointment;
  final VoidCallback onTap;
  final VoidCallback? onCancel;

  const AppointmentCard({
    super.key,
    required this.appointment,
    required this.onTap,
    this.onCancel,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final doctor = appointment.doctor;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.border,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.25 : 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top row: Doctor info + Status pill
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(14),
                      child: Container(
                        width: 56,
                        height: 56,
                        color: AppColors.primaryTeal.withValues(alpha: 0.12),
                        child: doctor?.avatarUrl != null && doctor!.avatarUrl!.isNotEmpty
                            ? Image.network(
                                doctor.avatarUrl!,
                                fit: BoxFit.cover,
                                errorBuilder: (_, _, _) => const Icon(
                                  Icons.person_rounded,
                                  color: AppColors.primaryTeal,
                                  size: 32,
                                ),
                              )
                            : const Icon(
                                Icons.person_rounded,
                                color: AppColors.primaryTeal,
                                size: 32,
                              ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            doctor?.name ?? 'Dr. Medical Specialist',
                            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 2),
                          Text(
                            doctor?.specialty?.name ?? 'Specialist Consultation',
                            style: TextStyle(
                              color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    _buildStatusPill(appointment.status),
                  ],
                ),

                const SizedBox(height: 12),
                Divider(
                  color: isDark ? AppColors.darkBorder : AppColors.border.withValues(alpha: 0.6),
                  height: 1,
                ),
                const SizedBox(height: 12),

                // Scheduled Time & Location row
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkInputBg : AppColors.inputBg,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.calendar_today_rounded, size: 15, color: AppColors.primaryTeal),
                          const SizedBox(width: 8),
                          Text(
                            _formatDateTime(appointment.scheduledAt),
                            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Icon(
                            Icons.location_on_outlined,
                            size: 15,
                            color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              doctor?.clinicName ?? 'Clinique El Chifa, Hydra',
                              style: TextStyle(
                                fontSize: 12,
                                color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Action row if upcoming
                if (appointment.isUpcoming) ...[
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      if (onCancel != null)
                        Expanded(
                          child: OutlinedButton(
                            onPressed: onCancel,
                            style: OutlinedButton.styleFrom(
                              minimumSize: Size.zero,
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              foregroundColor: Colors.redAccent,
                              side: const BorderSide(color: Colors.redAccent),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: const Text('Cancel', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                          ),
                        ),
                      if (onCancel != null) const SizedBox(width: 10),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: onTap,
                          style: ElevatedButton.styleFrom(
                            minimumSize: Size.zero,
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            backgroundColor: AppColors.primaryTeal,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: const Text('View Details', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatusPill(String status) {
    Color bg;
    Color fg;
    String label;

    switch (status.toLowerCase()) {
      case 'confirmed':
        bg = const Color(0xFFDCFCE7);
        fg = const Color(0xFF16A34A);
        label = 'Confirmed';
        break;
      case 'completed':
        bg = const Color(0xFFE0F2FE);
        fg = const Color(0xFF0284C7);
        label = 'Completed';
        break;
      case 'cancelled':
        bg = const Color(0xFFFEE2E2);
        fg = const Color(0xFFDC2626);
        label = 'Cancelled';
        break;
      default:
        bg = const Color(0xFFFEF3C7);
        fg = const Color(0xFFD97706);
        label = 'Pending';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: fg,
          fontWeight: FontWeight.w700,
          fontSize: 11,
        ),
      ),
    );
  }

  String _formatDateTime(DateTime dt) {
    final local = dt.toLocal();
    final hour = local.hour.toString().padLeft(2, '0');
    final minute = local.minute.toString().padLeft(2, '0');
    final day = local.day.toString().padLeft(2, '0');
    final month = _monthName(local.month);
    return '$day $month ${local.year} at $hour:$minute';
  }

  String _monthName(int month) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  }
}
