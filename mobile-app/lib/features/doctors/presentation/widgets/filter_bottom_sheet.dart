import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/algeria_wilayas.dart';
import '../../../../core/theme/app_colors.dart';
import '../doctor_controller.dart';

class FilterBottomSheet extends ConsumerWidget {
  const FilterBottomSheet({super.key});

  static Future<void> show(BuildContext context) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const FilterBottomSheet(),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final filter = ref.watch(doctorFilterProvider);
    final filterNotifier = ref.read(doctorFilterProvider.notifier);
    final specialtiesAsync = ref.watch(specialtiesListProvider);

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.card,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      ),
      padding: EdgeInsets.only(
        top: 20,
        left: 20,
        right: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.withOpacity(0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Filter Doctors',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w700,
                  fontSize: 18,
                ),
              ),
              if (filter.hasActiveFilters)
                TextButton(
                  onPressed: () {
                    filterNotifier.resetFilters();
                  },
                  child: const Text(
                    'Reset All',
                    style: TextStyle(
                      color: AppColors.primaryTeal,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),

          // Wilaya filter
          Text(
            'Wilaya (Province)',
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w700,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            value: filter.wilaya,
            hint: const Text('All Wilayas (National)'),
            isExpanded: true,
            decoration: InputDecoration(
              filled: true,
              fillColor: isDark ? AppColors.darkInputBg : AppColors.inputBg,
              prefixIcon: const Icon(Icons.location_on_outlined, color: AppColors.primaryTeal),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: isDark ? AppColors.darkBorder : AppColors.border,
                ),
              ),
            ),
            items: [
              const DropdownMenuItem<String>(
                value: null,
                child: Text('All Wilayas (National)'),
              ),
              ...AlgeriaWilayas.all.map((wilaya) {
                return DropdownMenuItem<String>(
                  value: wilaya.name,
                  child: Text(wilaya.name),
                );
              }),
            ],
            onChanged: (val) {
              filterNotifier.selectWilaya(val);
            },
          ),
          const SizedBox(height: 18),

          // Specialty filter
          Text(
            'Medical Specialty',
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w700,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 8),
          specialtiesAsync.when(
            data: (specialties) => Wrap(
              spacing: 8,
              runSpacing: 8,
              children: specialties.map((spec) {
                final isSelected = filter.specialtyId == spec.id;
                return ChoiceChip(
                  label: Text(spec.name),
                  selected: isSelected,
                  selectedColor: AppColors.primaryTeal.withOpacity(0.15),
                  labelStyle: TextStyle(
                    color: isSelected
                        ? AppColors.primaryTeal
                        : (isDark ? AppColors.darkTextPrimary : AppColors.textPrimary),
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                    fontSize: 12,
                  ),
                  onSelected: (_) {
                    filterNotifier.selectSpecialty(spec.id);
                  },
                );
              }).toList(),
            ),
            loading: () => const Center(
              child: Padding(
                padding: EdgeInsets.all(8.0),
                child: CircularProgressIndicator(),
              ),
            ),
            error: (_, __) => const Text('Could not load specialties'),
          ),
          const SizedBox(height: 18),

          // Min Rating filter
          Text(
            'Minimum Rating',
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w700,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [4.0, 4.5, 4.8].map((rating) {
              final isSelected = filter.minRating == rating;
              return Padding(
                padding: const EdgeInsets.only(right: 8.0),
                child: FilterChip(
                  label: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.star_rounded, color: AppColors.warmOrange, size: 16),
                      const SizedBox(width: 4),
                      Text('$rating+'),
                    ],
                  ),
                  selected: isSelected,
                  selectedColor: AppColors.warmOrange.withOpacity(0.15),
                  onSelected: (selected) {
                    filterNotifier.setMinRating(selected ? rating : null);
                  },
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),

          // Apply button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryTeal,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: const Text(
                'Apply Filters',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
