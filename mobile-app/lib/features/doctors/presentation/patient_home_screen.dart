import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../auth/presentation/auth_controller.dart';
import 'doctor_controller.dart';
import 'widgets/doctor_card.dart';
import 'widgets/hero_banner.dart';
import 'widgets/specialty_chip.dart';

class PatientHomeScreen extends ConsumerStatefulWidget {
  const PatientHomeScreen({super.key});

  @override
  ConsumerState<PatientHomeScreen> createState() => _PatientHomeScreenState();
}

class _PatientHomeScreenState extends ConsumerState<PatientHomeScreen> {
  int _currentNavIndex = 0;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final authState = ref.watch(authControllerProvider);
    final user = authState.user;
    final specialtiesAsync = ref.watch(specialtiesListProvider);
    final featuredAsync = ref.watch(featuredDoctorsProvider);

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          color: AppColors.primaryTeal,
          onRefresh: () async {
            ref.invalidate(specialtiesListProvider);
            ref.invalidate(featuredDoctorsProvider);
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Header Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 24,
                          backgroundColor: AppColors.primaryTeal.withOpacity(0.15),
                          child: Text(
                            user?.name.isNotEmpty == true ? user!.name[0].toUpperCase() : 'P',
                            style: const TextStyle(
                              color: AppColors.primaryTeal,
                              fontWeight: FontWeight.w800,
                              fontSize: 18,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.location_on_rounded, size: 14, color: AppColors.primaryTeal),
                                const SizedBox(width: 2),
                                Text(
                                  user?.address ?? '16 - Alger, DZ',
                                  style: TextStyle(
                                    color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              user?.name.isNotEmpty == true ? 'Hello, ${user!.name}' : 'Welcome to VitalBook',
                              style: theme.textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w800,
                                fontSize: 17,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),

                    // Notification & Logout
                    Row(
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.darkCard : AppColors.card,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: isDark ? AppColors.darkBorder : AppColors.border,
                            ),
                          ),
                          child: IconButton(
                            icon: const Icon(Icons.notifications_none_rounded, size: 22),
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('No new notifications')),
                              );
                            },
                          ),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.darkCard : AppColors.card,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: isDark ? AppColors.darkBorder : AppColors.border,
                            ),
                          ),
                          child: IconButton(
                            icon: const Icon(Icons.logout_rounded, size: 20, color: Colors.redAccent),
                            onPressed: () {
                              ref.read(authControllerProvider.notifier).logout();
                            },
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 18),

                // 2. Search Bar Shortcut
                GestureDetector(
                  onTap: () => context.push('/patient/doctors'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkInputBg : AppColors.inputBg,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isDark ? AppColors.darkBorder : AppColors.border,
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.search_rounded, color: AppColors.primaryTeal, size: 22),
                        const SizedBox(width: 10),
                        Text(
                          'Search doctors, clinics, specialties...',
                          style: TextStyle(
                            color: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
                            fontSize: 14,
                          ),
                        ),
                        const Spacer(),
                        const Icon(Icons.tune_rounded, color: AppColors.primaryTeal, size: 18),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // 3. Hero Promo Banner
                HomeHeroBanner(
                  onBookNow: () => context.push('/patient/doctors'),
                ),

                const SizedBox(height: 24),

                // 4. Doctor Specialty Section Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Doctor Specialty',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                        fontSize: 18,
                      ),
                    ),
                    TextButton(
                      onPressed: () => context.push('/patient/categories'),
                      child: const Text(
                        'See All',
                        style: TextStyle(
                          color: AppColors.primaryTeal,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Specialty horizontal list
                specialtiesAsync.when(
                  data: (specialties) {
                    return SizedBox(
                      height: 120,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: specialties.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 12),
                        itemBuilder: (context, index) {
                          final spec = specialties[index];
                          return SizedBox(
                            width: 105,
                            child: SpecialtyGridItem(
                              specialty: spec,
                              onTap: () {
                                ref.read(doctorFilterProvider.notifier).resetFilters();
                                ref.read(doctorFilterProvider.notifier).selectSpecialty(spec.id);
                                context.push('/patient/doctors');
                              },
                            ),
                          );
                        },
                      ),
                    );
                  },
                  loading: () => const Center(
                    child: Padding(
                      padding: EdgeInsets.all(16.0),
                      child: CircularProgressIndicator(color: AppColors.primaryTeal),
                    ),
                  ),
                  error: (_, __) => const Text('Could not load specialties'),
                ),

                const SizedBox(height: 24),

                // 5. Top Doctors Section Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Top Rated Doctors',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                        fontSize: 18,
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        ref.read(doctorFilterProvider.notifier).resetFilters();
                        context.push('/patient/doctors');
                      },
                      child: const Text(
                        'See All',
                        style: TextStyle(
                          color: AppColors.primaryTeal,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Featured Doctors List
                featuredAsync.when(
                  data: (doctors) {
                    if (doctors.isEmpty) {
                      return const Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Text('No doctors available at this time.'),
                      );
                    }

                    return Column(
                      children: doctors.map((doc) {
                        return DoctorCard(
                          doctor: doc,
                          onTap: () => context.push('/patient/doctors/${doc.id}'),
                          onBookTap: () => context.push('/patient/doctors/${doc.id}/book'),
                        );
                      }).toList(),
                    );
                  },
                  loading: () => const Center(
                    child: Padding(
                      padding: EdgeInsets.all(16.0),
                      child: CircularProgressIndicator(color: AppColors.primaryTeal),
                    ),
                  ),
                  error: (err, _) => Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text('Could not load doctors: $err'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),

      // Bottom Navigation Bar
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkCard : AppColors.card,
          border: Border(
            top: BorderSide(
              color: isDark ? AppColors.darkBorder : AppColors.border,
            ),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentNavIndex,
          selectedItemColor: AppColors.primaryTeal,
          unselectedItemColor: isDark ? AppColors.darkTextSecondary : AppColors.textSecondary,
          backgroundColor: Colors.transparent,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 12),
          onTap: (index) {
            setState(() {
              _currentNavIndex = index;
            });
            if (index == 1) {
              ref.read(doctorFilterProvider.notifier).resetFilters();
              context.push('/patient/doctors');
            } else if (index == 2) {
              context.push('/patient/appointments');
            } else if (index == 3) {
              context.push('/patient/profile');
            }
          },
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_filled),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.search_rounded),
              label: 'Doctors',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.calendar_month_rounded),
              label: 'Bookings',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_rounded),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}
