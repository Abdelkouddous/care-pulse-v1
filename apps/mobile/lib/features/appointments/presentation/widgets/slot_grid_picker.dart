import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../booking_controller.dart';

class SlotGridPicker extends ConsumerWidget {
  final String doctorId;
  final DateTime date;
  final String? selectedSlot;
  final ValueChanged<String> onSlotSelected;

  const SlotGridPicker({
    super.key,
    required this.doctorId,
    required this.date,
    required this.selectedSlot,
    required this.onSlotSelected,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final slotsAsync = ref.watch(
      doctorSlotsProvider(doctorId: doctorId, date: date),
    );
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return slotsAsync.when(
      data: (slots) {
        if (slots.isEmpty) {
          return Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkCard : AppColors.card,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isDark ? AppColors.darkBorder : AppColors.border,
              ),
            ),
            child: const Center(
              child: Column(
                children: [
                  Icon(Icons.event_busy_rounded, size: 36, color: AppColors.textSecondary),
                  SizedBox(height: 8),
                  Text(
                    'No available slots for this day',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Please select another date on the calendar above.',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
                  ),
                ],
              ),
            ),
          );
        }

        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 2.2,
          ),
          itemCount: slots.length,
          itemBuilder: (context, index) {
            final slotIso = slots[index];
            final isSelected = selectedSlot == slotIso;
            final timeLabel = _formatSlotTime(slotIso);

            return GestureDetector(
              onTap: () => onSlotSelected(slotIso),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                decoration: BoxDecoration(
                  color: isSelected
                      ? AppColors.primaryTeal
                      : (isDark ? AppColors.darkCard : AppColors.card),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isSelected
                        ? AppColors.primaryTeal
                        : (isDark ? AppColors.darkBorder : AppColors.border),
                    width: 1.5,
                  ),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: AppColors.primaryTeal.withValues(alpha: 0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ]
                      : null,
                ),
                child: Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.access_time_rounded,
                        size: 14,
                        color: isSelected ? Colors.white : AppColors.primaryTeal,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        timeLabel,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                          color: isSelected
                              ? Colors.white
                              : (isDark ? AppColors.darkTextPrimary : AppColors.textPrimary),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
      loading: () => const Center(
        child: Padding(
          padding: EdgeInsets.all(24.0),
          child: CircularProgressIndicator(color: AppColors.primaryTeal),
        ),
      ),
      error: (err, _) => Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Text('Could not load slots: $err'),
        ),
      ),
    );
  }

  String _formatSlotTime(String isoString) {
    try {
      final dt = DateTime.parse(isoString).toLocal();
      final hour = dt.hour.toString().padLeft(2, '0');
      final minute = dt.minute.toString().padLeft(2, '0');
      return '$hour:$minute';
    } catch (_) {
      return isoString;
    }
  }
}
