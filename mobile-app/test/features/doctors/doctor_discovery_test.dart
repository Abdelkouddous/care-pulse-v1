import 'package:vitalbook_mobile/core/theme/app_theme.dart';
import 'package:vitalbook_mobile/features/doctors/data/doctor_repository.dart';
import 'package:vitalbook_mobile/features/doctors/domain/doctor_models.dart';
import 'package:vitalbook_mobile/features/doctors/domain/specialty_models.dart';
import 'package:vitalbook_mobile/features/doctors/presentation/category_list_screen.dart';
import 'package:vitalbook_mobile/features/doctors/presentation/doctor_list_screen.dart';
import 'package:vitalbook_mobile/features/doctors/presentation/widgets/doctor_card.dart';
import 'package:vitalbook_mobile/features/doctors/presentation/widgets/hero_banner.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

class MockDoctorRepository implements DoctorRepository {
  final List<SpecialtyModel> mockSpecialties = const [
    SpecialtyModel(id: 'spec-1', name: 'Cardiology', doctorsCount: 2),
    SpecialtyModel(id: 'spec-2', name: 'Pediatrics', doctorsCount: 1),
    SpecialtyModel(id: 'spec-3', name: 'Dermatology', doctorsCount: 3),
  ];

  final List<DoctorModel> mockDoctors = const [
    DoctorModel(
      id: 'doc-1',
      firstName: 'Amine',
      lastName: 'Mansouri',
      name: 'Dr. Amine Mansouri',
      specialtyId: 'spec-1',
      consultationFeeCents: 450000,
      specialty: SpecialtyModel(id: 'spec-1', name: 'Cardiology'),
      rating: 4.9,
      reviewsCount: 42,
      clinicName: 'Clinique El Chifa, Hydra',
      wilaya: '16 - Alger',
    ),
    DoctorModel(
      id: 'doc-2',
      firstName: 'Yasmine',
      lastName: 'Benali',
      name: 'Dr. Yasmine Benali',
      specialtyId: 'spec-2',
      consultationFeeCents: 350000,
      specialty: SpecialtyModel(id: 'spec-2', name: 'Pediatrics'),
      rating: 4.8,
      reviewsCount: 30,
      clinicName: 'Cabinet Médical, Oran',
      wilaya: '31 - Oran',
    ),
  ];

  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);

  @override
  Future<List<SpecialtyModel>> getSpecialties() async => mockSpecialties;

  @override
  Future<DoctorListResult> getDoctors({
    String? query,
    String? specialtyId,
    int page = 1,
    int perPage = 12,
  }) async {
    var filtered = mockDoctors;
    if (query != null && query.trim().isNotEmpty) {
      filtered = filtered
          .where((d) => d.name.toLowerCase().contains(query.toLowerCase()) ||
              (d.specialty?.name.toLowerCase().contains(query.toLowerCase()) ?? false))
          .toList();
    }
    if (specialtyId != null && specialtyId.isNotEmpty) {
      filtered = filtered.where((d) => d.specialtyId == specialtyId).toList();
    }

    return DoctorListResult(
      doctors: filtered,
      currentPage: page,
      lastPage: 1,
      total: filtered.length,
    );
  }

  @override
  Future<DoctorModel> getDoctorById(String doctorId) async {
    return mockDoctors.firstWhere((d) => d.id == doctorId);
  }

  @override
  Future<List<String>> getAvailableSlots({required String doctorId, required DateTime date}) async {
    return ['2026-10-06T09:00:00Z', '2026-10-06T09:30:00Z'];
  }
}

void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  group('Doctor Discovery & Booking (VTB-26 & VTB-31)', () {
    late MockDoctorRepository mockRepo;

    setUp(() {
      mockRepo = MockDoctorRepository();
    });

    test('SpecialtyModel assigns clinical icons and accent colors correctly', () {
      const cardio = SpecialtyModel(id: '1', name: 'Cardiology');
      expect(cardio.icon, equals(Icons.favorite_rounded));
      expect(cardio.accentColor, equals(const Color(0xFFE11D48)));

      const pedia = SpecialtyModel(id: '2', name: 'Pediatrics');
      expect(pedia.icon, equals(Icons.child_care_rounded));

      const derma = SpecialtyModel(id: '3', name: 'Dermatology');
      expect(derma.icon, equals(Icons.face_retouching_natural_rounded));
    });

    test('DoctorModel formats Algerian consultation fee in DZD correctly', () {
      const doctor = DoctorModel(
        id: '1',
        firstName: 'Amine',
        lastName: 'Mansouri',
        name: 'Dr. Amine Mansouri',
        consultationFeeCents: 450000,
      );
      expect(doctor.formattedFee, equals('4500 DZD'));
    });

    test('DoctorFilter handles query, specialty, wilaya, and active filter check', () {
      var filter = const DoctorFilter();
      expect(filter.hasActiveFilters, isFalse);

      filter = filter.copyWith(query: 'Mansouri');
      expect(filter.hasActiveFilters, isTrue);

      filter = filter.copyWith(specialtyId: 'spec-1', wilaya: '16 - Alger', minRating: 4.5);
      expect(filter.specialtyId, equals('spec-1'));
      expect(filter.wilaya, equals('16 - Alger'));
      expect(filter.minRating, equals(4.5));

      filter = filter.copyWith(clearSpecialty: true, clearWilaya: true);
      expect(filter.specialtyId, isNull);
      expect(filter.wilaya, isNull);
    });

    testWidgets('DoctorCard renders doctor info, badge, formatted fee, and handles tap', (tester) async {
      bool tapped = false;
      bool booked = false;

      final doctor = mockRepo.mockDoctors.first;

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.lightTheme,
          home: Scaffold(
            body: DoctorCard(
              doctor: doctor,
              onTap: () => tapped = true,
              onBookTap: () => booked = true,
            ),
          ),
        ),
      );

      expect(find.text('Dr. Amine Mansouri'), findsOneWidget);
      expect(find.text('Cardiology'), findsOneWidget);
      expect(find.text('4500 DZD'), findsOneWidget);
      expect(find.text('Clinique El Chifa, Hydra'), findsOneWidget);
      expect(find.text('4.9'), findsOneWidget);
      expect(find.text('Book Now'), findsOneWidget);

      await tester.tap(find.text('Book Now'));
      expect(booked, isTrue);

      await tester.tap(find.text('Dr. Amine Mansouri'));
      expect(tapped, isTrue);
    });

    testWidgets('HomeHeroBanner displays value prop and responds to CTA tap', (tester) async {
      bool bookNowTapped = false;

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.lightTheme,
          home: Scaffold(
            body: HomeHeroBanner(
              onBookNow: () => bookNowTapped = true,
            ),
          ),
        ),
      );

      expect(find.textContaining('Find Trusted Doctors'), findsOneWidget);
      expect(find.text('Find a Specialist'), findsOneWidget);

      await tester.tap(find.text('Find a Specialist'));
      expect(bookNowTapped, isTrue);
    });

    testWidgets('CategoryListScreen renders all categories from repository', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            doctorRepositoryProvider.overrideWithValue(mockRepo),
          ],
          child: MaterialApp(
            theme: AppTheme.lightTheme,
            home: const CategoryListScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('Specialties'), findsOneWidget);
      expect(find.text('Cardiology'), findsOneWidget);
      expect(find.text('Pediatrics'), findsOneWidget);
      expect(find.text('Dermatology'), findsOneWidget);
      expect(find.text('2 Doctors'), findsOneWidget);
    });

    testWidgets('DoctorListScreen allows searching and displays filtered doctors', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            doctorRepositoryProvider.overrideWithValue(mockRepo),
          ],
          child: MaterialApp(
            theme: AppTheme.lightTheme,
            home: const DoctorListScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('Dr. Amine Mansouri'), findsOneWidget);
      expect(find.text('Dr. Yasmine Benali'), findsOneWidget);

      // Search for 'Yasmine'
      await tester.enterText(find.byType(TextField), 'Yasmine');
      await tester.pumpAndSettle();

      expect(find.text('Dr. Yasmine Benali'), findsOneWidget);
      expect(find.text('Dr. Amine Mansouri'), findsNothing);
    });
  });
}
