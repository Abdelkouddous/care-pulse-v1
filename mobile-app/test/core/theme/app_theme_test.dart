import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:carepulse_mobile/core/theme/app_colors.dart';
import 'package:carepulse_mobile/core/theme/app_theme.dart';

void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  group('AppTheme Token Porting', () {
    test('LightTheme defines Vital Soft brand tokens correctly', () {
      final theme = AppTheme.lightTheme;

      expect(theme.colorScheme.primary, equals(AppColors.lightPrimary));
      expect(theme.colorScheme.secondary, equals(AppColors.aquaGreen));
      expect(theme.colorScheme.surface, equals(AppColors.lightCard));
      expect(theme.scaffoldBackgroundColor, equals(AppColors.lightBackground));
      expect(theme.colorScheme.error, equals(AppColors.destructive));
    });

    test('DarkTheme defines high-contrast dark tokens correctly', () {
      final theme = AppTheme.darkTheme;

      expect(theme.colorScheme.primary, equals(AppColors.darkPrimary));
      expect(theme.colorScheme.surface, equals(AppColors.darkCard));
      expect(theme.scaffoldBackgroundColor, equals(AppColors.darkBackground));
    });

    testWidgets('Core components render with theme properties', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.lightTheme,
          home: Scaffold(
            body: Center(
              child: Column(
                children: [
                  ElevatedButton(
                    onPressed: () {},
                    child: const Text('Book Appointment'),
                  ),
                  const TextField(
                    decoration: InputDecoration(
                      hintText: 'Enter phone number',
                    ),
                  ),
                  const Card(
                    child: Text('Doctor Card'),
                  ),
                ],
              ),
            ),
          ),
        ),
      );

      final button = tester.widget<ElevatedButton>(find.byType(ElevatedButton));
      expect(button, isNotNull);

      final textField = tester.widget<TextField>(find.byType(TextField));
      expect(textField.decoration?.hintText, equals('Enter phone number'));

      final card = tester.widget<Card>(find.byType(Card));
      expect(card, isNotNull);
    });
  });
}
