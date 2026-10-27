<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\DoctorAvailability;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Target Cluster Clinics (Algiers & Tébessa)
        $clinicsData = [
            [
                'id' => '58b759e3-41f6-47d2-aa1d-35e004849e52',
                'name' => 'Wateen Medical Center - Alger Centre',
                'email' => 'contact@wateensoft.com',
                'address' => '12 Rue Didouche Mourad, Alger',
                'phone' => '+213 21 00 11 22',
                'city' => 'Algiers',
                'wilaya_code' => 16,
                'commune' => 'Alger Centre',
                'lat' => 36.7538,
                'lng' => 3.0588,
                'timezone' => 'Africa/Algiers',
                'logo_url' => 'https://wateensoft.com/assets/icons/logo-full.svg',
                'is_active' => true,
            ],
            [
                'id' => '77c191a2-8e3b-4c4f-9521-b3b3e61c1001',
                'name' => 'Clinique Médico-Chirurgicale Hydra',
                'email' => 'hydra@wateensoft.com',
                'address' => '24 Boulevard Sidi Yahia, Hydra, Alger',
                'phone' => '+213 21 60 77 88',
                'city' => 'Algiers',
                'wilaya_code' => 16,
                'commune' => 'Hydra',
                'lat' => 36.7441,
                'lng' => 3.0420,
                'timezone' => 'Africa/Algiers',
                'logo_url' => 'https://wateensoft.com/assets/icons/logo-full.svg',
                'is_active' => true,
            ],
            [
                'id' => '88d292b3-9f4c-5d5a-8632-c4c4f72d2002',
                'name' => 'Wateen Polyclinique Tébessa Centre',
                'email' => 'tebessa.centre@wateensoft.com',
                'address' => 'Avenue de la Paix, Tébessa Centre',
                'phone' => '+213 37 49 12 34',
                'city' => 'Tébessa',
                'wilaya_code' => 12,
                'commune' => 'Tébessa',
                'lat' => 35.4042,
                'lng' => 8.1242,
                'timezone' => 'Africa/Algiers',
                'logo_url' => 'https://wateensoft.com/assets/icons/logo-full.svg',
                'is_active' => true,
            ],
            [
                'id' => '99e393c4-0a5d-6e6b-9743-d5d5a83e3003',
                'name' => 'Centre Médical El Mountazah Tébessa',
                'email' => 'mountazah.tebessa@vitalbook.com',
                'address' => 'Boulevard Houari Boumediene, El Mountazah, Tébessa',
                'phone' => '+213 37 48 55 66',
                'city' => 'Tébessa',
                'wilaya_code' => 12,
                'commune' => 'Tébessa',
                'lat' => 35.4180,
                'lng' => 8.1150,
                'timezone' => 'Africa/Algiers',
                'logo_url' => 'https://vitalsoft.aymenhamel.com/assets/icons/logo-full.svg',
                'is_active' => true,
            ],
        ];

        $clinicModels = [];
        foreach ($clinicsData as $cData) {
            $lat = $cData['lat'];
            $lng = $cData['lng'];
            unset($cData['lat'], $cData['lng']);

            $clinic = Clinic::withoutGlobalScopes()->updateOrCreate(
                ['id' => $cData['id']],
                $cData
            );

            // Set PostGIS Point
            if (DB::getDriverName() === 'pgsql') {
                DB::statement(
                    'UPDATE clinics SET location = ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography WHERE id = ?',
                    [$lng, $lat, $clinic->id]
                );
            } else {
                DB::statement(
                    'UPDATE clinics SET location = ? WHERE id = ?',
                    [Clinic::buildPointHex($lat, $lng), $clinic->id]
                );
            }

            $clinicModels[$clinic->id] = $clinic;
        }

        $defaultClinic = $clinicModels['58b759e3-41f6-47d2-aa1d-35e004849e52'];

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
                'clinic_id' => $defaultClinic->id,
                'name' => 'Dr. Aymen Hamel (Lead Admin)',
                'password' => Hash::make('password123'),
                'role' => 'super_admin',
            ]
        );

        // 4. Create Doctors (Algerian National Physician Roster across Algiers and Tébessa)
        $doctorsData = [
            [
                'clinic_id' => '58b759e3-41f6-47d2-aa1d-35e004849e52', // Alger Centre
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
                'clinic_id' => '58b759e3-41f6-47d2-aa1d-35e004849e52', // Alger Centre
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
                'clinic_id' => '77c191a2-8e3b-4c4f-9521-b3b3e61c1001', // Hydra
                'first_name' => 'Leila',
                'last_name' => 'Khelifi',
                'email' => 'dr.cruz@vitalbook.com',
                'phone' => '+213 550 44 55 66',
                'specialty' => 'Dermatology',
                'fee_cents' => 400000, // 4,000.00 DZD
                'license' => 'DZ-MSPRH-16-40992',
                'bio' => 'Dermatologue vénérologue, prise en charge des affections cutanées chroniques, acné sévère et dépistage cutané.',
            ],
            [
                'clinic_id' => '88d292b3-9f4c-5d5a-8632-c4c4f72d2002', // Tébessa Centre
                'first_name' => 'Sofiane',
                'last_name' => 'Brahimi',
                'email' => 'dr.sharma@vitalbook.com',
                'phone' => '+213 550 33 44 55',
                'specialty' => 'General Medicine',
                'fee_cents' => 300000, // 3,000.00 DZD
                'license' => 'DZ-MSPRH-12-30114',
                'bio' => 'Médecin de famille à Tébessa, médecine générale, prise en charge du diabète, urgences courantes et dépistage.',
            ],
            [
                'clinic_id' => '99e393c4-0a5d-6e6b-9743-d5d5a83e3003', // El Mountazah Tébessa
                'first_name' => 'Walid',
                'last_name' => 'Cherif',
                'email' => 'dr.cherif@vitalbook.com',
                'phone' => '+213 550 66 77 88',
                'specialty' => 'Cardiology',
                'fee_cents' => 420000, // 4,200.00 DZD
                'license' => 'DZ-MSPRH-12-50981',
                'bio' => 'Cardiologue libéral à Tébessa, échocardiographie Doppler et réadaptation cardiaque.',
            ],
        ];

        foreach ($doctorsData as $doc) {
            $doctor = Doctor::withoutGlobalScopes()->updateOrCreate(
                ['email' => $doc['email']],
                [
                    'clinic_id' => $doc['clinic_id'],
                    'specialty_id' => $specialtyModels[$doc['specialty']]->id,
                    'first_name' => $doc['first_name'],
                    'last_name' => $doc['last_name'],
                    'password' => Hash::make('password123'),
                    'phone' => $doc['phone'],
                    'avatar_url' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop',
                    'bio' => $doc['bio'],
                    'consultation_fee_cents' => $doc['fee_cents'],
                    'license_number' => $doc['license'],
                    'is_active' => true,
                ]
            );

            // Add Availabilities for doctor (Sunday to Thursday in DZ or Mon-Fri)
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

        // 5. Create Test Patients
        User::firstOrCreate(
            ['email' => 'patient@vitalbook.com'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Karim Saidi',
                'password' => Hash::make('password123'),
                'phone' => '+213 550 99 88 77',
                'nin' => '198516010023456789',
                'date_of_birth' => '1985-06-15',
                'gender' => 'male',
                'blood_group' => 'O+',
                'role' => 'patient',
                'insurance_provider' => 'CNAS',
                'insurance_policy_number' => 'DZ-CNAS-16049281',
                'emergency_contact_name' => 'Fatima Saidi',
                'emergency_contact_phone' => '+213 550 99 88 78',
            ]
        );
    }
}
