import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:carepulse_mobile/app.dart';

void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });
  testWidgets('App root initializes without crashing', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: CarePulseApp(),
      ),
    );

    // Initial render shows splash progress indicator
    expect(find.byType(CarePulseApp), findsOneWidget);
  });
}
