<?php

use App\Jobs\SendWhatsAppAppointmentReminderJob;
use App\Models\Admin;
use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->clinic = Clinic::create([
        'id' => (string) Str::uuid(),
        'name' => 'VitalBook Algiers',
        'email' => 'algiers@vitalbook.com',
    ]);

    $this->admin = Admin::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'name' => 'Receptionist Admin',
        'email' => 'reception@vitalbook.com',
        'password' => bcrypt('password'),
        'role' => 'clinic_admin',
    ]);

    $this->patient = User::create([
        'id' => (string) Str::uuid(),
        'first_name' => 'Sarah',
        'last_name' => 'Benali',
        'email' => 'sarah.benali@example.com',
        'phone' => '+213555998877',
        'password' => bcrypt('password'),
    ]);

    $this->specialty = Specialty::create([
        'id' => (string) Str::uuid(),
        'name' => 'Cardiology',
    ]);

    $this->doctor = Doctor::withoutGlobalScopes()->create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'specialty_id' => $this->specialty->id,
        'first_name' => 'Alex',
        'last_name' => 'Ramirez',
        'email' => 'dr.ramirez@vitalbook.com',
        'consultation_fee_cents' => 450000,
        'license_number' => 'DZ-MED-10492',
    ]);
});

test('booking appointment dispatches asynchronous WhatsApp reminder job', function () {
    Queue::fake();

    $this->actingAs($this->patient, 'sanctum');

    $response = $this->withHeader('X-Clinic-ID', $this->clinic->id)
        ->postJson('/api/v1/appointments', [
            'doctor_id' => $this->doctor->id,
            'scheduled_at' => Carbon::now()->addDay()->setHour(10)->setMinute(0)->toIso8601String(),
            'reason' => 'Heart checkup',
        ]);

    $response->assertCreated();
    Queue::assertPushed(SendWhatsAppAppointmentReminderJob::class);
});

test('receptionist can manually dispatch WhatsApp ping from admin dashboard', function () {
    Queue::fake();

    $appointment = Appointment::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'patient_id' => $this->patient->id,
        'doctor_id' => $this->doctor->id,
        'scheduled_at' => Carbon::now()->addDay()->setHour(11)->setMinute(0),
        'status' => 'pending',
        'whatsapp_status' => 'not_sent',
        'reason' => 'Consultation',
        'consultation_fee_cents' => 450000,
    ]);

    $this->actingAs($this->admin, 'sanctum');

    $response = $this->withHeader('X-Clinic-ID', $this->clinic->id)
        ->postJson("/api/v1/admin/appointments/{$appointment->id}/whatsapp-ping");

    $response->assertOk()
        ->assertJsonPath('data.success', true);

    Queue::assertPushed(SendWhatsAppAppointmentReminderJob::class, function ($job) use ($appointment) {
        return $job->appointmentId === $appointment->id;
    });
});

test('inbound WhatsApp webhook with 1 confirms and schedules the appointment', function () {
    $appointment = Appointment::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'patient_id' => $this->patient->id,
        'doctor_id' => $this->doctor->id,
        'scheduled_at' => Carbon::now()->addDay()->setHour(14)->setMinute(0),
        'status' => 'pending',
        'whatsapp_status' => 'sent',
        'whatsapp_message_id' => 'wam_test_123',
        'reason' => 'Consultation',
        'consultation_fee_cents' => 450000,
    ]);

    $response = $this->postJson('/api/v1/webhooks/whatsapp', [
        'From' => '+213555998877',
        'Body' => '1',
        'MessageSid' => 'wam_test_123',
    ]);

    $response->assertOk()
        ->assertJsonPath('result.handled', true)
        ->assertJsonPath('result.action', 'confirmed');

    $appointment->refresh();
    expect($appointment->status)->toBe('scheduled')
        ->and($appointment->whatsapp_status)->toBe('confirmed')
        ->and($appointment->whatsapp_confirmed_at)->not->toBeNull();
});

test('inbound WhatsApp webhook with 2 cancels the appointment', function () {
    $appointment = Appointment::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'patient_id' => $this->patient->id,
        'doctor_id' => $this->doctor->id,
        'scheduled_at' => Carbon::now()->addDay()->setHour(15)->setMinute(0),
        'status' => 'pending',
        'whatsapp_status' => 'sent',
        'whatsapp_message_id' => 'wam_test_456',
        'reason' => 'Consultation',
        'consultation_fee_cents' => 450000,
    ]);

    $response = $this->postJson('/api/v1/webhooks/whatsapp', [
        'From' => '+213555998877',
        'Body' => '2',
        'MessageSid' => 'wam_test_456',
    ]);

    $response->assertOk()
        ->assertJsonPath('result.handled', true)
        ->assertJsonPath('result.action', 'cancelled');

    $appointment->refresh();
    expect($appointment->status)->toBe('cancelled')
        ->and($appointment->whatsapp_status)->toBe('cancelled')
        ->and($appointment->cancelled_by)->toBe('patient');
});
