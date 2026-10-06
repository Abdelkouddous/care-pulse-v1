import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import 'doctor_controller.dart';
import 'widgets/doctor_card.dart';
import 'widgets/filter_bottom_sheet.dart';
import 'widgets/specialty_chip.dart';

class DoctorListScreen extends ConsumerStatefulWidget {
  const DoctorListScreen({super.key});

  @override
  ConsumerState<DoctorListScreen> createState() => _DoctorListScreenState();
}

class _DoctorListScreenState extends ConsumerState<DoctorListScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final currentQuery = ref.read(doctorFilterProvider).query;
    if (currentQuery != null && currentQuery.isNotEmpty) {
      _searchController.text = currentQuery;
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final filter = ref.watch(doctorFilterProvider);
    final filterNotifier = ref.read(doctorFilterProvider.notifier);
    final searchAsync = ref.watch(doctorSearchControllerProvider);
    final specialtiesAsync = ref.watch(specialtiesListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Find Doctors',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => context.pop(),
        ),
      ),
      body: Column(
        children: [
          // Search & Filter Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search doctor, specialty, clinic...',
                      prefixIcon: const Icon(Icons.search_rounded, color: AppColors.primaryTeal),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear_rounded, size: 20),
                              onPressed: () {
                                _searchController.clear();
                                filterNotifier.updateQuery('');
                              },
                            )
                          : null,
                      filled: true,
                      fillColor: isDark ? AppColors.darkInputBg : AppColors.inputBg,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    onChanged: (value) {
                      filterNotifier.updateQuery(value);
                      setState(() {});
                    },
                  ),
                ),
                const SizedBox(width: 10),

                // Filter icon button with badge
                Stack(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        color: filter.hasActiveFilters
                            ? AppColors.primaryTeal
                            : (isDark ? AppColors.darkCard : AppColors.card),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: filter.hasActiveFilters
                              ? AppColors.primaryTeal
                              : (isDark ? AppColors.darkBorder : AppColors.border),
                        ),
                      ),
                      child: IconButton(
                        icon: Icon(
                          Icons.tune_rounded,
                          color: filter.hasActiveFilters
                              ? Colors.white
                              : (isDark ? AppColors.darkTextPrimary : AppColors.textPrimary),
                        ),
                        onPressed: () => FilterBottomSheet.show(context),
                      ),
                    ),
                    if (filter.hasActiveFilters)
                      Positioned(
                        top: 6,
                        right: 6,
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.warmOrange,
                          ),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),

          // Horizontal Specialties selector
          specialtiesAsync.when(
            data: (specialties) => SizedBox(
              height: 48,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                scrollDirection: Axis.horizontal,
                itemCount: specialties.length + 1,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  if (index == 0) {
                    final isAllSelected = filter.specialtyId == null;
                    return GestureDetector(
                      onTap: () => filterNotifier.selectSpecialty(null),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        decoration: BoxDecoration(
                          color: isAllSelected
                              ? AppColors.primaryTeal
                              : (isDark ? AppColors.darkCard : AppColors.card),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isAllSelected
                                ? AppColors.primaryTeal
                                : (isDark ? AppColors.darkBorder : AppColors.border),
                          ),
                        ),
                        child: Center(
                          child: Text(
                            'All Specialties',
                            style: TextStyle(
                              color: isAllSelected
                                  ? Colors.white
                                  : (isDark ? AppColors.darkTextPrimary : AppColors.textPrimary),
                              fontWeight: isAllSelected ? FontWeight.w700 : FontWeight.w500,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ),
                    );
                  }

                  final spec = specialties[index - 1];
                  return SpecialtyFilterChip(
                    specialty: spec,
                    isSelected: filter.specialtyId == spec.id,
                    onTap: () => filterNotifier.selectSpecialty(spec.id),
                  );
                },
              ),
            ),
            loading: () => const SizedBox(height: 48),
            error: (_, __) => const SizedBox.shrink(),
          ),

          const SizedBox(height: 12),

          // Active filter badges row
          if (filter.hasActiveFilters)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Row(
                children: [
                  const Text(
                    'Filters:',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          if (filter.wilaya != null)
                            Padding(
                              padding: const EdgeInsets.only(right: 6.0),
                              child: Chip(
                                label: Text(filter.wilaya!),
                                deleteIcon: const Icon(Icons.close, size: 14),
                                onDeleted: () => filterNotifier.selectWilaya(null),
                              ),
                            ),
                          if (filter.minRating != null)
                            Padding(
                              padding: const EdgeInsets.only(right: 6.0),
                              child: Chip(
                                label: Text('${filter.minRating}★+'),
                                deleteIcon: const Icon(Icons.close, size: 14),
                                onDeleted: () => filterNotifier.setMinRating(null),
                              ),
                            ),
                          TextButton(
                            onPressed: () => filterNotifier.resetFilters(),
                            child: const Text('Clear All', style: TextStyle(fontSize: 12)),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

          // Doctors List View
          Expanded(
            child: searchAsync.when(
              data: (result) {
                if (result.doctors.isEmpty) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.person_search_rounded,
                            size: 64,
                            color: AppColors.textSecondary,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'No Doctors Found',
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Try adjusting your search keywords or clearing active filters.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                              fontSize: 13,
                            ),
                          ),
                          const SizedBox(height: 16),
                          OutlinedButton(
                            onPressed: () {
                              _searchController.clear();
                              filterNotifier.resetFilters();
                            },
                            child: const Text('Reset All Filters'),
                          ),
                        ],
                      ),
                    ),
                  );
                }

                return RefreshIndicator(
                  color: AppColors.primaryTeal,
                  onRefresh: () => ref.read(doctorSearchControllerProvider.notifier).refresh(),
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: result.doctors.length,
                    itemBuilder: (context, index) {
                      final doctor = result.doctors[index];
                      return DoctorCard(
                        doctor: doctor,
                        onTap: () {
                          context.push('/patient/doctors/${doctor.id}');
                        },
                        onBookTap: () {
                          context.push('/patient/doctors/${doctor.id}/book');
                        },
                      );
                    },
                  ),
                );
              },
              loading: () => const Center(
                child: CircularProgressIndicator(color: AppColors.primaryTeal),
              ),
              error: (err, _) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.wifi_off_rounded, size: 48, color: Colors.red),
                    const SizedBox(height: 12),
                    Text('Failed to load doctors: $err'),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: () => ref.read(doctorSearchControllerProvider.notifier).refresh(),
                      child: const Text('Try Again'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
