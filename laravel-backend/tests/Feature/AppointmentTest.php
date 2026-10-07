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

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->clinic = Clinic::create([
        'id' => (string) Str::uuid(),
        'name' => 'VitalBook Algiers',
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
        'first_name' => 'Tarek',
        'last_name' => 'Mansour',
        'email' => 'tarek@vitalbook.com',
        'consultation_fee_cents' => 350000, // 3,500.00 DZD
        'license_number' => 'DZ-TEST-1234',
        'is_active' => true,
    ]);

    // Monday availability: 09:00 - 17:00
    DoctorAvailability::create([
        'id' => (string) Str::uuid(),
        'doctor_id' => $this->doctor->id,
        'day_of_week' => 1, // Monday
        'start_time' => '09:00:00',
        'end_time' => '17:00:00',
        'slot_duration_minutes' => 30,
        'is_active' => true,
    ]);

    $this->patient = User::create([
        'id' => (string) Str::uuid(),
        'first_name' => 'Samia',
        'last_name' => 'Brahimi',
        'email' => 'samia@test.com',
        'password' => bcrypt('password'),
    ]);
});

test('patient can successfully book an appointment', function () {
    $nextMonday = Carbon::now()->next('Monday')->setTime(10, 0, 0);

    $response = $this->actingAs($this->patient, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->postJson('/api/v1/appointments', [
            'doctor_id' => $this->doctor->id,
            'scheduled_at' => $nextMonday->toIso8601String(),
            'reason' => 'Routine heart checkup',
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.reason', 'Routine heart checkup')
        ->assertJsonPath('data.consultation_fee_cents', 350000);

    $this->assertDatabaseHas('appointments', [
        'doctor_id' => $this->doctor->id,
        'patient_id' => $this->patient->id,
        'consultation_fee_cents' => 350000,
    ]);
});

test('double booking the exact same doctor slot returns 422 conflict', function () {
    $nextMonday = Carbon::now()->next('Monday')->setTime(11, 0, 0);

    // Book first appointment
    Appointment::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'doctor_id' => $this->doctor->id,
        'patient_id' => $this->patient->id,
        'scheduled_at' => $nextMonday,
        'status' => 'pending',
        'reason' => 'First booking',
        'consultation_fee_cents' => 350000,
    ]);

    // Second booking attempt by another patient
    $otherPatient = User::create([
        'id' => (string) Str::uuid(),
        'first_name' => 'Yacine',
        'last_name' => 'Larbi',
        'email' => 'yacine@test.com',
        'password' => bcrypt('password'),
    ]);

    $response = $this->actingAs($otherPatient, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->postJson('/api/v1/appointments', [
            'doctor_id' => $this->doctor->id,
            'scheduled_at' => $nextMonday->toIso8601String(),
            'reason' => 'Second booking collision attempt',
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['scheduled_at']);
});

test('patient can cancel an appointment', function () {
    $nextMonday = Carbon::now()->next('Monday')->setTime(14, 0, 0);

    $appointment = Appointment::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'doctor_id' => $this->doctor->id,
        'patient_id' => $this->patient->id,
        'scheduled_at' => $nextMonday,
        'status' => 'scheduled',
        'reason' => 'Cancel test',
        'consultation_fee_cents' => 350000,
    ]);

    $response = $this->actingAs($this->patient, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->putJson("/api/v1/appointments/{$appointment->id}/cancel", [
            'reason' => 'Emergency travel',
        ]);

    $response->assertStatus(200)
        ->assertJsonPath('data.success', true);

    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'status' => 'cancelled',
        'cancellation_reason' => 'Emergency travel',
    ]);
});

test('doctor can transition appointment to completed without cancelling it', function () {
    $nextMonday = Carbon::now()->next('Monday')->setTime(15, 0, 0);

    $appointment = Appointment::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'doctor_id' => $this->doctor->id,
        'patient_id' => $this->patient->id,
        'scheduled_at' => $nextMonday,
        'status' => 'scheduled',
        'reason' => 'Chest discomfort evaluation',
        'consultation_fee_cents' => 350000,
    ]);

    // 1. Doctor starts visit
    $resInConsult = $this->actingAs($this->doctor, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->putJson("/api/v1/doctor-portal/appointments/{$appointment->id}/status", [
            'status' => 'in_consultation',
        ]);

    $resInConsult->assertStatus(200)
        ->assertJsonPath('data.status', 'in_consultation');

    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'status' => 'in_consultation',
        'cancellation_reason' => null,
    ]);

    // 2. Doctor finishes visit
    $resComplete = $this->actingAs($this->doctor, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->putJson("/api/v1/doctor-portal/appointments/{$appointment->id}/status", [
            'status' => 'completed',
        ]);

    $resComplete->assertStatus(200)
        ->assertJsonPath('data.status', 'completed');

    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'status' => 'completed',
        'cancellation_reason' => null,
    ]);
});

