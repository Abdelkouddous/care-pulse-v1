<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\DoctorAvailability;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Default Clinic (Deterministic Anchor UUID)
        $defaultClinicId = '58b759e3-41f6-47d2-aa1d-35e004849e52';
        $clinic = Clinic::firstOrCreate(
            ['id' => $defaultClinicId],
            [
                'id' => $defaultClinicId,
                'name' => 'VitalBook Medical Center',
                'email' => 'contact@vitalsoft.aymenhamel.com',
                'address' => '12 Rue Didouche Mourad, Algiers',
                'phone' => '+213 21 00 11 22',
                'timezone' => 'Africa/Algiers',
                'logo_url' => 'https://vitalsoft.aymenhamel.com/assets/icons/logo-full.svg',
                'is_active' => true,
            ]
        );

        // 2. Create Specialties
        $specialtiesData = [
            ['name' => 'General Medicine', 'description' => 'Comprehensive adult primary healthcare and health screenings.'],
            ['name' => 'Cardiology', 'description' => 'Disorders of the heart and cardiovascular blood vessels.'],
            ['name' => 'Dermatology', 'description' => 'Diagnosis and treatment of skin, hair, and nail conditions.'],
            ['name' => 'Pediatrics', 'description' => 'Medical care for infants, children, and adolescents.'],
            ['name' => 'Neurology', 'description' => 'Disorders of the nervous system, brain, and spinal cord.'],
            ['name' => 'Orthopedics', 'description' => 'Musculoskeletal system including bones, joints, and ligaments.'],
        ];

        $specialtyModels = [];
        foreach ($specialtiesData as $data) {
            $specialtyModels[$data['name']] = Specialty::firstOrCreate(
                ['name' => $data['name']],
                ['id' => (string) Str::uuid(), 'description' => $data['description']]
            );
        }

        // 3. Create Admin
        Admin::firstOrCreate(
            ['email' => 'admin@vitalbook.com'],
            [
                'id' => (string) Str::uuid(),
                'clinic_id' => $clinic->id,
                'name' => 'Dr. Aymen Hamel (Lead Admin)',
                'password' => Hash::make('password123'),
                'role' => 'super_admin',
            ]
        );

        // 4. Create Doctors (Algerian National Physician Roster)
        $doctorsData = [
            [
                'first_name' => 'Amine',
                'last_name' => 'Mansouri',
                'email' => 'dr.mansouri@vitalbook.com',
                'phone' => '+213 550 11 22 33',
                'specialty' => 'Cardiology',
                'fee_cents' => 450000, // 4,500.00 DZD
                'license' => 'DZ-MSPRH-16-10492',
                'bio' => 'Cardiologue spécialiste des explorations fonctionnelles cardiovasculaires, échocardiographie et du suivi de l’hypertension artérielle.',
            ],
            [
                'first_name' => 'Yasmine',
                'last_name' => 'Benali',
                'email' => 'dr.lee@vitalbook.com',
                'phone' => '+213 550 22 33 44',
                'specialty' => 'Pediatrics',
                'fee_cents' => 350000, // 3,500.00 DZD
                'license' => 'DZ-MSPRH-16-20831',
                'bio' => 'Pédiatre référente pour le suivi de la croissance infantile, calendrier vaccinal national algérien et néonatalogie.',
            ],
            [
                'first_name' => 'Sofiane',
                'last_name' => 'Brahimi',
                'email' => 'dr.sharma@vitalbook.com',
                'phone' => '+213 550 33 44 55',
                'specialty' => 'General Medicine',
                'fee_cents' => 300000, // 3,000.00 DZD
                'license' => 'DZ-MSPRH-16-30114',
                'bio' => 'Médecin généraliste d’orientation médecine de famille, dépistage précoce, diabétologie et gériatrie.',
            ],
            [
                'first_name' => 'Leila',
                'last_name' => 'Khelifi',
                'email' => 'dr.cruz@vitalbook.com',
                'phone' => '+213 550 44 55 66',
                'specialty' => 'Dermatology',
                'fee_cents' => 400000, // 4,000.00 DZD
                'license' => 'DZ-MSPRH-16-40992',
                'bio' => 'Dermatologue vénérologue, prise en charge des affections cutanées chroniques, acné sévère et dépistage cutané.',
            ],
        ];

        foreach ($doctorsData as $doc) {
            $doctor = Doctor::withoutGlobalScopes()->updateOrCreate(
                ['email' => $doc['email']],
                [
                    'clinic_id' => $clinic->id,
                    'specialty_id' => $specialtyModels[$doc['specialty']]->id,
                    'first_name' => $doc['first_name'],
                    'last_name' => $doc['last_name'],
                    'password' => Hash::make('password123'),
                    'phone' => $doc['phone'],
                    'avatar_url' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop',
                    'bio' => $doc['bio'],
                    // Strict Integer Money Guardrail
                    'consultation_fee_cents' => $doc['fee_cents'],
                    'license_number' => $doc['license'],
                    'is_active' => true,
                ]
            );

            // Add Availabilities for doctor (Monday to Friday, 09:00 to 17:00, 30 min slots)
            // 1=Monday ... 5=Friday
            for ($day = 1; $day <= 5; $day++) {
                DoctorAvailability::firstOrCreate(
                    ['doctor_id' => $doctor->id, 'day_of_week' => $day],
                    [
                        'id' => (string) Str::uuid(),
                        'start_time' => '09:00:00',
                        'end_time' => '17:00:00',
                        'slot_duration_minutes' => 30,
                        'is_active' => true,
                    ]
                );
            }
        }

        // 5. Create Test Patient (Sarah Benali with Algerian Civic Identifiers)
        User::updateOrCreate(
            ['email' => 'patient@vitalbook.com'],
            [
                'first_name' => 'Sarah',
                'last_name' => 'Benali',
                'phone' => '+213 555 99 88 77',
                'national_id_nin' => '119951600000123456',
                'carte_chifa_number' => '9504121234',
                'wilaya_code' => 16,
                'blood_type' => 'O+',
                'date_of_birth' => '1995-04-12',
                'gender' => 'female',
                'address' => '45 Boulevard des Martyrs, Alger',
                'emergency_contact_name' => 'Karim Benali',
                'emergency_contact_phone' => '+213 555 11 22 33',
                'insurance_provider' => 'CNAS Algérie',
                'insurance_policy_number' => 'DZ-CNAS-99887711',
                'allergies' => 'Penicillin',
                'current_medications' => 'None',
                'password' => Hash::make('password123'),
            ]
        );
    }
}
