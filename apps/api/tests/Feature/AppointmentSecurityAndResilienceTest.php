<?php

use App\Events\AppointmentStatusUpdated;
use App\Models\Admin;
use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\DoctorAvailability;
use App\Models\Specialty;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->clinic = Clinic::create([
        'id' => (string) Str::uuid(),
        'name' => 'Wateen Book Oran',
        'email' => 'oran@vitalbook.com',
        'is_active' => true,
    ]);

    $this->specialty = Specialty::create([
        'id' => (string) Str::uuid(),
        'name' => 'Neurology',
    ]);

    $this->doctor = Doctor::withoutGlobalScopes()->create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'specialty_id' => $this->specialty->id,
        'first_name' => 'Nabil',
        'last_name' => 'Bensaad',
        'email' => 'nabil@vitalbook.com',
        'consultation_fee_cents' => 450000,
        'license_number' => 'DZ-TEST-9988',
        'is_active' => true,
    ]);

    $this->otherDoctor = Doctor::withoutGlobalScopes()->create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'specialty_id' => $this->specialty->id,
        'first_name' => 'Karima',
        'last_name' => 'Haddad',
        'email' => 'karima@vitalbook.com',
        'consultation_fee_cents' => 450000,
        'license_number' => 'DZ-TEST-9989',
        'is_active' => true,
    ]);

    $this->admin = Admin::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'name' => 'Admin Clinic',
        'email' => 'admin.oran@vitalbook.com',
        'password' => bcrypt('password'),
        'role' => 'clinic_admin',
    ]);

    $this->patient = User::create([
        'id' => (string) Str::uuid(),
        'first_name' => 'Ali',
        'last_name' => 'Bouzid',
        'email' => 'ali@test.com',
        'password' => bcrypt('password'),
    ]);

    $this->otherPatient = User::create([
        'id' => (string) Str::uuid(),
        'first_name' => 'Fatima',
        'last_name' => 'Meziane',
        'email' => 'fatima@test.com',
        'password' => bcrypt('password'),
    ]);

    $this->targetDate = Carbon::now()->next(Carbon::TUESDAY)->setTime(10, 0, 0);

    $this->appointment = Appointment::withoutGlobalScopes()->create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'doctor_id' => $this->doctor->id,
        'patient_id' => $this->patient->id,
        'scheduled_at' => $this->targetDate,
        'status' => 'scheduled',
        'reason' => 'Chronic headache consultation',
        'consultation_fee_cents' => 450000,
    ]);
});

test('unauthenticated request to GET /appointments/{id} is rejected with 401', function () {
    $response = $this->getJson("/api/v1/appointments/{$this->appointment->id}");
    $response->assertUnauthorized();
});

test('patient can view their own appointment', function () {
    $response = $this->actingAs($this->patient, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->getJson("/api/v1/appointments/{$this->appointment->id}");

    $response->assertOk()
        ->assertJsonPath('data.id', $this->appointment->id)
        ->assertJsonPath('data.reason', 'Chronic headache consultation');
});

test('other patient cannot view someone else appointment (IDOR protection: 403 Forbidden)', function () {
    $response = $this->actingAs($this->otherPatient, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->getJson("/api/v1/appointments/{$this->appointment->id}");

    $response->assertForbidden();
});

test('assigned doctor can view appointment', function () {
    $response = $this->actingAs($this->doctor, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->getJson("/api/v1/appointments/{$this->appointment->id}");

    $response->assertOk()
        ->assertJsonPath('data.id', $this->appointment->id);
});

test('unassigned doctor cannot view another doctor appointment (403 Forbidden)', function () {
    $response = $this->actingAs($this->otherDoctor, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->getJson("/api/v1/appointments/{$this->appointment->id}");

    $response->assertForbidden();
});

test('clinic admin can view appointments in their clinic', function () {
    $response = $this->actingAs($this->admin, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->getJson("/api/v1/appointments/{$this->appointment->id}");

    $response->assertOk()
        ->assertJsonPath('data.id', $this->appointment->id);
});

test('other patient cannot cancel someone else appointment (403 Forbidden)', function () {
    $response = $this->actingAs($this->otherPatient, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->putJson("/api/v1/appointments/{$this->appointment->id}/cancel", [
            'reason' => 'Unauthorized cancellation attempt',
        ]);

    $response->assertForbidden();
});

test('other doctor cannot update status of an appointment assigned to another doctor (403 Forbidden)', function () {
    $response = $this->actingAs($this->otherDoctor, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->putJson("/api/v1/doctor-portal/appointments/{$this->appointment->id}/status", [
            'status' => 'in_consultation',
        ]);

    $response->assertForbidden();
});

test('patient cannot transition appointment status directly via doctor-portal (403 Forbidden)', function () {
    $response = $this->actingAs($this->patient, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->putJson("/api/v1/doctor-portal/appointments/{$this->appointment->id}/status", [
            'status' => 'completed',
        ]);

    $response->assertForbidden();
});

test('cancelling appointment dispatches AppointmentStatusUpdated ShouldBroadcastNow event', function () {
    Event::fake([AppointmentStatusUpdated::class]);

    $response = $this->actingAs($this->patient, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->putJson("/api/v1/appointments/{$this->appointment->id}/cancel", [
            'reason' => 'Unable to attend',
        ]);

    $response->assertOk();

    Event::assertDispatched(AppointmentStatusUpdated::class, function (AppointmentStatusUpdated $event) {
        $channels = $event->broadcastOn();
        $channelNames = array_map(fn ($c) => $c->name, $channels);

        return $event->appointment->id === $this->appointment->id
            && $event->appointment->status === 'cancelled'
            && in_array('private-doctor.'.$this->doctor->id, $channelNames)
            && in_array('private-patient.'.$this->patient->id, $channelNames)
            && $event->broadcastAs() === 'AppointmentStatusUpdated';
    });
});

test('updating status by doctor dispatches AppointmentStatusUpdated ShouldBroadcastNow event', function () {
    Event::fake([AppointmentStatusUpdated::class]);

    $response = $this->actingAs($this->doctor, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->putJson("/api/v1/doctor-portal/appointments/{$this->appointment->id}/status", [
            'status' => 'in_consultation',
        ]);

    $response->assertOk();

    Event::assertDispatched(AppointmentStatusUpdated::class, function (AppointmentStatusUpdated $event) {
        expect($event)->toBeInstanceOf(ShouldBroadcastNow::class);
        $payload = $event->broadcastWith();

        expect($payload['status'])->toBe('in_consultation');
        expect($payload['doctor_id'])->toBe($this->doctor->id);
        expect($payload['patient_id'])->toBe($this->patient->id);
        expect($payload)->toHaveKeys(['event', 'appointment_id', 'doctor_id', 'patient_id', 'status', 'previous_status', 'reason', 'updated_by']);

        return true;
    });
});

test('partial unique index allows rebooking a slot after cancellation without 500 collision', function () {
    // Add availability for Tuesday 10:00
    DoctorAvailability::create([
        'id' => (string) Str::uuid(),
        'doctor_id' => $this->doctor->id,
        'day_of_week' => $this->targetDate->dayOfWeekIso,
        'start_time' => '09:00:00',
        'end_time' => '17:00:00',
        'slot_duration_minutes' => 30,
        'is_active' => true,
    ]);

    // 1. Cancel the initial appointment
    $this->actingAs($this->patient, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->putJson("/api/v1/appointments/{$this->appointment->id}/cancel", [
            'reason' => 'Cancelled for rebooking test',
        ])
        ->assertOk();

    $this->assertDatabaseHas('appointments', [
        'id' => $this->appointment->id,
        'status' => 'cancelled',
    ]);

    // 2. Rebook the exact same doctor and slot by another patient
    $rebookResponse = $this->actingAs($this->otherPatient, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->postJson('/api/v1/appointments', [
            'doctor_id' => $this->doctor->id,
            'clinic_id' => $this->clinic->id,
            'scheduled_at' => $this->targetDate->toIso8601String(),
            'reason' => 'Taking over the freed slot',
        ]);

    $rebookResponse->assertCreated()
        ->assertJsonPath('data.doctor_id', $this->doctor->id)
        ->assertJsonPath('data.status', 'pending');

    // Both appointments exist in DB with same slot, first cancelled and second pending
    $this->assertEquals(
        2,
        Appointment::where('doctor_id', $this->doctor->id)
            ->where('scheduled_at', $this->targetDate)
            ->count()
    );
});

test('broadcasting channel authorization strictly verifies doctor and patient identity', function () {
    $channels = app('Illuminate\Broadcasting\BroadcastManager')->getChannels();
    $docCallback = $channels->get('doctor.{doctorId}');
    $patientCallback = $channels->get('patient.{patientId}');

    // 1. Doctor channel allows assigned doctor
    expect($docCallback($this->doctor, $this->doctor->id))->toBeTrue();

    // 2. Doctor channel denies another doctor
    expect($docCallback($this->otherDoctor, $this->doctor->id))->toBeFalse();

    // 3. Doctor channel denies a patient
    expect($docCallback($this->patient, $this->doctor->id))->toBeFalse();

    // 4. Patient channel allows matching patient
    expect($patientCallback($this->patient, $this->patient->id))->toBeTrue();

    // 5. Patient channel denies another patient
    expect($patientCallback($this->otherPatient, $this->patient->id))->toBeFalse();
});

test('booking appointment endpoint enforces rate limiting of 10 requests per minute', function () {
    for ($i = 0; $i < 10; $i++) {
        $this->actingAs($this->patient, 'sanctum')
            ->withHeader('X-Clinic-ID', $this->clinic->id)
            ->postJson('/api/v1/appointments', []);
    }

    $response = $this->actingAs($this->patient, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->postJson('/api/v1/appointments', []);

    $response->assertStatus(429);
});
