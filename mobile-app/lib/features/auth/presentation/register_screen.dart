import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/algeria_wilayas.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import 'auth_controller.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();

  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _ninController = TextEditingController();
  final _chifaController = TextEditingController();
  final _addressController = TextEditingController();
  final _emergencyNameController = TextEditingController();
  final _emergencyPhoneController = TextEditingController();

  int _selectedWilaya = 16; // Alger default
  String _selectedBloodType = 'O+';
  String _selectedGender = 'male';
  final DateTime _selectedDob = DateTime(1995, 1, 1);

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _ninController.dispose();
    _chifaController.dispose();
    _addressController.dispose();
    _emergencyNameController.dispose();
    _emergencyPhoneController.dispose();
    super.dispose();
  }

  Future<void> _submitRegistration() async {
    if (!_formKey.currentState!.validate()) return;

    final payload = {
      'first_name': _firstNameController.text.trim(),
      'last_name': _lastNameController.text.trim(),
      'national_id_nin': _ninController.text.trim(),
      if (_chifaController.text.isNotEmpty)
        'carte_chifa_number': _chifaController.text.trim(),
      'wilaya_code': _selectedWilaya,
      'blood_type': _selectedBloodType,
      'date_of_birth': '${_selectedDob.year}-${_selectedDob.month.toString().padLeft(2, '0')}-${_selectedDob.day.toString().padLeft(2, '0')}',
      'gender': _selectedGender,
      if (_addressController.text.isNotEmpty)
        'address': _addressController.text.trim(),
      'emergency_contact_name': _emergencyNameController.text.trim(),
      'emergency_contact_phone': _emergencyPhoneController.text.trim(),
    };

    final success = await ref.read(authControllerProvider.notifier).completeRegistration(payload);
    if (!success && mounted) {
      final error = ref.read(authControllerProvider).errorMessage;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(error ?? 'Registration failed. Please check your data.'),
          backgroundColor: AppColors.destructive,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final authState = ref.watch(authControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Patient Registration'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'Complete Your Profile',
                  style: theme.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.vitalTeal,
                  ),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  'Algerian CNAS / Health Registry Compliant',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),

                // Name Fields
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _firstNameController,
                        decoration: const InputDecoration(labelText: 'First Name *'),
                        validator: (v) => (v == null || v.trim().length < 2) ? 'Required' : null,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: TextFormField(
                        controller: _lastNameController,
                        decoration: const InputDecoration(labelText: 'Last Name *'),
                        validator: (v) => (v == null || v.trim().length < 2) ? 'Required' : null,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),

                // National ID (NIN)
                TextFormField(
                  controller: _ninController,
                  keyboardType: TextInputType.number,
                  maxLength: 18,
                  decoration: const InputDecoration(
                    labelText: 'National ID (NIN - 18 digits) *',
                    hintText: '119951600000123456',
                    counterText: '',
                  ),
                  validator: (v) {
                    if (v == null || v.trim().length != 18 || !RegExp(r'^\d{18}$').hasMatch(v.trim())) {
                      return 'NIN must be exactly 18 digits';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: AppSpacing.md),

                // Carte Chifa
                TextFormField(
                  controller: _chifaController,
                  keyboardType: TextInputType.number,
                  maxLength: 10,
                  decoration: const InputDecoration(
                    labelText: 'Carte Chifa Number (10 digits, Optional)',
                    hintText: '9504121234',
                    counterText: '',
                  ),
                  validator: (v) {
                    if (v != null && v.isNotEmpty && !RegExp(r'^\d{10}$').hasMatch(v.trim())) {
                      return 'Chifa number must be 10 digits';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: AppSpacing.md),

                // Wilaya Dropdown (58 Wilayas)
                DropdownButtonFormField<int>(
                  initialValue: _selectedWilaya,
                  decoration: const InputDecoration(labelText: 'Wilaya of Residence *'),
                  items: AlgeriaWilayas.all.map((w) {
                    return DropdownMenuItem<int>(
                      value: w.code,
                      child: Text(w.name),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedWilaya = val);
                  },
                ),
                const SizedBox(height: AppSpacing.md),

                // Blood Type & Gender
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        initialValue: _selectedBloodType,
                        decoration: const InputDecoration(labelText: 'Blood Type *'),
                        items: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) {
                          return DropdownMenuItem<String>(value: bt, child: Text(bt));
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _selectedBloodType = val);
                        },
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        initialValue: _selectedGender,
                        decoration: const InputDecoration(labelText: 'Gender *'),
                        items: const [
                          DropdownMenuItem(value: 'male', child: Text('Male')),
                          DropdownMenuItem(value: 'female', child: Text('Female')),
                        ],
                        onChanged: (val) {
                          if (val != null) setState(() => _selectedGender = val);
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),

                // Emergency Contact
                TextFormField(
                  controller: _emergencyNameController,
                  decoration: const InputDecoration(labelText: 'Emergency Contact Name *'),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
                ),
                const SizedBox(height: AppSpacing.md),
                TextFormField(
                  controller: _emergencyPhoneController,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    labelText: 'Emergency Contact Phone *',
                    hintText: '+213 555 11 22 33',
                  ),
                  validator: (v) => (v == null || v.trim().length < 8) ? 'Valid phone required' : null,
                ),
                const SizedBox(height: AppSpacing.xl),

                // Submit Button
                ElevatedButton(
                  onPressed: authState.isLoading ? null : _submitRegistration,
                  child: authState.isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Complete & Enter VitalBook'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
