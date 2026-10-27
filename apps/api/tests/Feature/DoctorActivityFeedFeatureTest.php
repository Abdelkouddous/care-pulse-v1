<?php

use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->clinic = Clinic::create([
        'id' => (string) Str::uuid(),
        'name' => 'Wateen Book Algiers',
        'email' => 'algiers@vitalbook.com',
        'is_active' => true,
    ]);

    $this->specialty = Specialty::create([
        'id' => (string) Str::uuid(),
        'name' => 'Cardiology',
    ]);

    $this->doctor = Doctor::withoutGlobalScopes()->create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'specialty_id' => $this->specialty->id,
        'first_name' => 'Amine',
        'last_name' => 'Mansouri',
        'email' => 'dr.mansouri@vitalbook.com',
        'consultation_fee_cents' => 450000,
        'license_number' => 'DZ-MSPRH-16-10492',
        'is_active' => true,
    ]);

    $this->patient = User::create([
        'id' => (string) Str::uuid(),
        'first_name' => 'Yacine',
        'last_name' => 'Belkacem',
        'email' => 'yacine@test.com',
        'phone' => '+213550998877',
        'password' => bcrypt('password123'),
    ]);
});

test('unauthenticated users cannot access doctor activity feed', function () {
    $response = $this->getJson('/api/v1/doctor-portal/activities');
    $response->assertUnauthorized();
});

test('authenticated doctor can retrieve chronological clinical activities', function () {
    // 1. Create a historical appointment with WhatsApp dispatched and in_consultation status
    $appointment1 = Appointment::withoutGlobalScopes()->create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'doctor_id' => $this->doctor->id,
        'patient_id' => $this->patient->id,
        'scheduled_at' => Carbon::now()->addDays(1)->setTime(10, 0),
        'status' => 'in_consultation',
        'whatsapp_status' => 'delivered',
        'whatsapp_last_sent_at' => Carbon::now()->subMinutes(15),
        'reason' => 'Cardiac arrhythmia assessment',
        'consultation_fee_cents' => 450000,
        'created_at' => Carbon::now()->subHours(2),
        'updated_at' => Carbon::now()->subMinutes(5),
    ]);

    // 2. Create a recent appointment that is newly pending
    $appointment2 = Appointment::withoutGlobalScopes()->create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'doctor_id' => $this->doctor->id,
        'patient_id' => $this->patient->id,
        'scheduled_at' => Carbon::now()->addDays(2)->setTime(14, 30),
        'status' => 'pending',
        'whatsapp_status' => 'pending',
        'reason' => 'Routine cardiology followup',
        'consultation_fee_cents' => 450000,
        'created_at' => Carbon::now()->subMinutes(2),
        'updated_at' => Carbon::now()->subMinutes(2),
    ]);

    $response = $this->actingAs($this->doctor, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->getJson('/api/v1/doctor-portal/activities');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'appointment_id',
                    'event_type',
                    'category',
                    'severity',
                    'title',
                    'description',
                    'timestamp',
                    'patient' => [
                        'id',
                        'name',
                        'phone',
                    ],
                    'metadata',
                ],
            ],
            'meta' => [
                'total',
                'doctor_id',
            ],
        ]);

    $data = $response->json('data');
    expect(count($data))->toBeGreaterThanOrEqual(3);

    // Verify events are sorted newest first
    for ($i = 0; $i < count($data) - 1; $i++) {
        $currentTime = Carbon::parse($data[$i]['timestamp'])->timestamp;
        $nextTime = Carbon::parse($data[$i + 1]['timestamp'])->timestamp;
        expect($currentTime)->toBeGreaterThanOrEqual($nextTime);
    }

    // Verify patient information is properly serialized
    expect($data[0]['patient']['name'])->toBe('Yacine Belkacem');
});
