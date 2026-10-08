import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../data/appointment_repository.dart';
import '../domain/appointment_models.dart';
import 'booking_controller.dart';

final appointmentDetailsProvider = FutureProvider.family<AppointmentModel, String>((ref, id) async {
  final repo = ref.watch(appointmentRepositoryProvider);
  return repo.getAppointmentById(id);
});

class AppointmentDetailsScreen extends ConsumerWidget {
  final String appointmentId;

  const AppointmentDetailsScreen({
    super.key,
    required this.appointmentId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final appointmentAsync = ref.watch(appointmentDetailsProvider(appointmentId));

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
      appBar: AppBar(
        title: const Text('Booking Details', style: TextStyle(fontWeight: FontWeight.w700)),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => context.pop(),
        ),
      ),
      body: appointmentAsync.when(
        data: (appointment) {
          final doctor = appointment.doctor;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Status Banner
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: _statusBg(appointment.status),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      Icon(_statusIcon(appointment.status), color: _statusFg(appointment.status), size: 28),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Status: ${appointment.status.toUpperCase()}',
                              style: TextStyle(
                                color: _statusFg(appointment.status),
                                fontWeight: FontWeight.w800,
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Ref ID: ${appointment.id.substring(0, 8)}...',
                              style: TextStyle(
                                color: _statusFg(appointment.status).withValues(alpha: 0.8),
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // 2. Doctor Information Card
                Text(
                  'Doctor Information',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w800,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkCard : AppColors.card,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isDark ? AppColors.darkBorder : AppColors.border,
                    ),
                  ),
                  child: Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(14),
                        child: Container(
                          width: 60,
                          height: 60,
                          color: AppColors.primaryTeal.withValues(alpha: 0.12),
                          child: doctor?.avatarUrl != null && doctor!.avatarUrl!.isNotEmpty
                              ? Image.network(
                                  doctor.avatarUrl!,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, _, _) => const Icon(
                                    Icons.person_rounded,
                                    color: AppColors.primaryTeal,
                                    size: 36,
                                  ),
                                )
                              : const Icon(
                                  Icons.person_rounded,
                                  color: AppColors.primaryTeal,
                                  size: 36,
                                ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              doctor?.name ?? 'Dr. Specialist',
                              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              doctor?.specialty?.name ?? 'Specialty',
                              style: const TextStyle(color: AppColors.primaryTeal, fontSize: 13, fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              doctor?.clinicName ?? 'Clinique El Chifa, Hydra',
                              style: TextStyle(
                                fontSize: 12,
                                color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // 3. Appointment Schedule & Pricing
                Text(
                  'Appointment Schedule',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w800,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkCard : AppColors.card,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isDark ? AppColors.darkBorder : AppColors.border,
                    ),
                  ),
                  child: Column(
                    children: [
                      _buildDetailRow(
                        Icons.calendar_month_rounded,
                        'Date & Time',
                        _formatDate(appointment.scheduledAt),
                        isDark,
                      ),
                      const Divider(height: 20),
                      _buildDetailRow(
                        Icons.timer_outlined,
                        'Duration',
                        '30 Minutes',
                        isDark,
                      ),
                      const Divider(height: 20),
                      _buildDetailRow(
                        Icons.payments_outlined,
                        'Consultation Fee',
                        appointment.formattedFee,
                        isDark,
                        isHighlight: true,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // 4. Clinical Reason & Patient Notes
                Text(
                  'Reason for Visit',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w800,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 10),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkCard : AppColors.card,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isDark ? AppColors.darkBorder : AppColors.border,
                    ),
                  ),
                  child: Text(
                    appointment.reason.isNotEmpty ? appointment.reason : 'General clinical consultation',
                    style: TextStyle(
                      fontSize: 14,
                      color: isDark ? AppColors.darkTextPrimary : AppColors.textPrimary,
                    ),
                  ),
                ),

                // If cancelled: show reason
                if (appointment.isCancelled && appointment.cancellationReason != null) ...[
                  const SizedBox(height: 20),
                  Text(
                    'Cancellation Reason',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                      fontSize: 16,
                      color: Colors.redAccent,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.red.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.red.withValues(alpha: 0.2)),
                    ),
                    child: Text(
                      '${appointment.cancellationReason} (Cancelled by: ${appointment.cancelledBy ?? 'system'})',
                      style: const TextStyle(fontSize: 13, color: Colors.red),
                    ),
                  ),
                ],

                // Action buttons
                if (appointment.isUpcoming) ...[
                  const SizedBox(height: 28),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: () => _showCancelDialog(context, ref, appointment.id),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.redAccent,
                        side: const BorderSide(color: Colors.redAccent),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: const Text('Cancel Appointment', style: TextStyle(fontWeight: FontWeight.w700)),
                    ),
                  ),
                ],
              ],
            ),
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primaryTeal),
        ),
        error: (err, _) => Center(child: Text('Error: $err')),
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value, bool isDark, {bool isHighlight = false}) {
    return Row(
      children: [
        Icon(icon, size: 20, color: isHighlight ? AppColors.primaryTeal : AppColors.textSecondary),
        const SizedBox(width: 10),
        Text(
          label,
          style: TextStyle(
            color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
            fontSize: 13,
          ),
        ),
        const Spacer(),
        Text(
          value,
          style: TextStyle(
            fontWeight: FontWeight.w700,
            fontSize: 14,
            color: isHighlight
                ? AppColors.primaryTeal
                : (isDark ? AppColors.darkTextPrimary : AppColors.textPrimary),
          ),
        ),
      ],
    );
  }

  Color _statusBg(String status) {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return const Color(0xFFDCFCE7);
      case 'completed':
        return const Color(0xFFE0F2FE);
      case 'cancelled':
        return const Color(0xFFFEE2E2);
      default:
        return const Color(0xFFFEF3C7);
    }
  }

  Color _statusFg(String status) {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return const Color(0xFF16A34A);
      case 'completed':
        return const Color(0xFF0284C7);
      case 'cancelled':
        return const Color(0xFFDC2626);
      default:
        return const Color(0xFFD97706);
    }
  }

  IconData _statusIcon(String status) {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return Icons.verified_rounded;
      case 'completed':
        return Icons.task_alt_rounded;
      case 'cancelled':
        return Icons.cancel_rounded;
      default:
        return Icons.pending_actions_rounded;
    }
  }

  String _formatDate(DateTime dt) {
    final local = dt.toLocal();
    final hour = local.hour.toString().padLeft(2, '0');
    final minute = local.minute.toString().padLeft(2, '0');
    return '${local.day.toString().padLeft(2, '0')}/${local.month.toString().padLeft(2, '0')}/${local.year} at $hour:$minute';
  }

  void _showCancelDialog(BuildContext context, WidgetRef ref, String id) {
    final reasonController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Cancel Appointment', style: TextStyle(fontWeight: FontWeight.w700)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Are you sure you want to cancel? Please provide a cancellation reason:',
              style: TextStyle(fontSize: 13),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: reasonController,
              decoration: const InputDecoration(hintText: 'Reason for cancellation...'),
              maxLines: 2,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Back'),
          ),
          ElevatedButton(
            onPressed: () async {
              final reason = reasonController.text.trim();
              if (reason.isEmpty) return;

              Navigator.of(ctx).pop();
              final success = await ref
                  .read(patientAppointmentsControllerProvider.notifier)
                  .cancelAppointment(id, reason);

              if (context.mounted) {
                ref.invalidate(appointmentDetailsProvider(id));
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      success ? 'Appointment cancelled' : 'Failed to cancel appointment',
                    ),
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent, foregroundColor: Colors.white),
            child: const Text('Confirm Cancel'),
          ),
        ],
      ),
    );
  }
}
