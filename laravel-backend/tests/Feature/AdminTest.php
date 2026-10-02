<?php

use App\Models\Admin;
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
        'name' => 'CarePulse Algiers',
        'email' => 'algiers@carepulse.com',
    ]);

    $this->admin = Admin::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'name' => 'Admin User',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'role' => 'clinic_admin',
    ]);

    $this->patient = User::create([
        'id' => (string) Str::uuid(),
        'first_name' => 'Patient',
        'last_name' => 'User',
        'email' => 'patient@test.com',
        'password' => bcrypt('password'),
    ]);

    $this->specialty = Specialty::create([
        'id' => (string) Str::uuid(),
        'name' => 'Dermatology',
    ]);

    $this->doctor = Doctor::withoutGlobalScopes()->create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'specialty_id' => $this->specialty->id,
        'first_name' => 'Salim',
        'last_name' => 'Khelil',
        'email' => 'salim@test.com',
        'consultation_fee_cents' => 300000,
        'license_number' => 'DZ-ADMIN-01',
    ]);
});

test('admin can view dashboard stats', function () {
    Appointment::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'doctor_id' => $this->doctor->id,
        'patient_id' => $this->patient->id,
        'scheduled_at' => Carbon::now()->addDays(2),
        'status' => 'pending',
        'reason' => 'Check stats',
        'consultation_fee_cents' => 300000,
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->getJson('/api/v1/admin/dashboard');

    $response->assertStatus(200)
        ->assertJsonPath('data.total', 1)
        ->assertJsonPath('data.pending', 1);
});

test('admin can update appointment status', function () {
    $appointment = Appointment::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'doctor_id' => $this->doctor->id,
        'patient_id' => $this->patient->id,
        'scheduled_at' => Carbon::now()->addDays(2),
        'status' => 'pending',
        'reason' => 'Status update test',
        'consultation_fee_cents' => 300000,
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->putJson("/api/v1/admin/appointments/{$appointment->id}/status", [
            'status' => 'scheduled',
        ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'status' => 'scheduled',
    ]);
});
