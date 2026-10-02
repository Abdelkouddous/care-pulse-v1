<?php

use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\DoctorAvailability;
use App\Models\Specialty;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

test('available slots are generated correctly and exclude booked appointments', function () {
    $clinic = Clinic::create([
        'id' => (string) Str::uuid(),
        'name' => 'Clinic 1',
        'email' => 'c1@test.com',
    ]);

    $specialty = Specialty::create([
        'id' => (string) Str::uuid(),
        'name' => 'General Medicine',
    ]);

    $doctor = Doctor::withoutGlobalScopes()->create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $clinic->id,
        'specialty_id' => $specialty->id,
        'first_name' => 'Dr. Slot',
        'last_name' => 'Tester',
        'email' => 'slot@test.com',
        'consultation_fee_cents' => 200000,
        'license_number' => 'DZ-SLOT-001',
    ]);

    // Monday: 09:00 to 11:00 (4 x 30min slots: 09:00, 09:30, 10:00, 10:30)
    DoctorAvailability::create([
        'id' => (string) Str::uuid(),
        'doctor_id' => $doctor->id,
        'day_of_week' => 1, // Monday
        'start_time' => '09:00:00',
        'end_time' => '11:00:00',
        'slot_duration_minutes' => 30,
        'is_active' => true,
    ]);

    $patient = User::create([
        'id' => (string) Str::uuid(),
        'first_name' => 'Patient',
        'last_name' => 'One',
        'email' => 'p1@test.com',
        'password' => bcrypt('password'),
    ]);

    $nextMonday = Carbon::now()->next(Carbon::MONDAY)->setTime(9, 30, 0);

    // Book 09:30
    Appointment::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $clinic->id,
        'doctor_id' => $doctor->id,
        'patient_id' => $patient->id,
        'scheduled_at' => $nextMonday,
        'status' => 'scheduled',
        'reason' => 'Existing booking',
        'consultation_fee_cents' => 200000,
    ]);

    $response = $this->getJson("/api/v1/doctors/{$doctor->id}/slots?date={$nextMonday->toDateString()}");

    $response->assertStatus(200);
    $slots = $response->json('data.slots');

    // Should have 3 slots remaining (09:00, 10:00, 10:30), 09:30 excluded
    expect($slots)->toHaveCount(3);
    foreach ($slots as $slot) {
        expect(Carbon::parse($slot)->format('H:i'))->not->toBe('09:30');
    }
});
