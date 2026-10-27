<?php

use App\Events\AppointmentCreated;
use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\DoctorAvailability;
use App\Models\Specialty;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
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
        'email' => 'mansouri@vitalbook.com',
        'consultation_fee_cents' => 400000,
        'license_number' => 'DZ-DOC-1234',
        'is_active' => true,
    ]);

    DoctorAvailability::create([
        'id' => (string) Str::uuid(),
        'doctor_id' => $this->doctor->id,
        'day_of_week' => Carbon::now()->next(Carbon::MONDAY)->dayOfWeekIso,
        'start_time' => '09:00:00',
        'end_time' => '17:00:00',
        'slot_duration_minutes' => 30,
        'is_active' => true,
    ]);

    $this->patient = User::create([
        'id' => (string) Str::uuid(),
        'first_name' => 'Karim',
        'last_name' => 'Zitouni',
        'email' => 'karim@test.com',
        'password' => bcrypt('password'),
    ]);
});

test('booking an appointment dispatches AppointmentCreated broadcast event', function () {
    Event::fake([AppointmentCreated::class]);

    $targetDate = Carbon::now()->next(Carbon::MONDAY)->setTime(10, 0, 0);

    $response = $this->actingAs($this->patient, 'sanctum')
        ->withHeader('X-Clinic-ID', $this->clinic->id)
        ->postJson('/api/v1/appointments', [
            'doctor_id' => $this->doctor->id,
            'clinic_id' => $this->clinic->id,
            'scheduled_at' => $targetDate->toIso8601String(),
            'reason' => 'Routine cardiology checkup',
        ]);

    $response->assertCreated();

    Event::assertDispatched(AppointmentCreated::class, function (AppointmentCreated $event) {
        return $event->appointment->doctor_id === $this->doctor->id
            && $event->appointment->patient_id === $this->patient->id;
    });
});

test('AppointmentCreated event fulfills ShouldBroadcast contract with private channel and payload', function () {
    $targetDate = Carbon::now()->next(Carbon::MONDAY)->setTime(14, 30, 0);

    $appointment = Appointment::withoutGlobalScopes()->create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'doctor_id' => $this->doctor->id,
        'patient_id' => $this->patient->id,
        'scheduled_at' => $targetDate,
        'status' => 'pending',
        'reason' => 'Hypertension follow-up',
    ]);

    $event = new AppointmentCreated($appointment);

    // Assert broadcasting contract
    expect($event)->toBeInstanceOf(ShouldBroadcast::class);

    // Assert broadcast channel is a private doctor channel
    $channel = $event->broadcastOn();
    expect($channel)->toBeInstanceOf(PrivateChannel::class);
    expect($channel->name)->toBe('private-doctor.'.$this->doctor->id);

    // Assert broadcast payload structure
    $payload = $event->broadcastWith();
    expect($payload)->toHaveKeys(['title', 'patient_name', 'scheduled_time', 'scheduled_date', 'message', 'appointment']);
    expect($payload['patient_name'])->toBe('Karim Zitouni');
    expect($payload['message'])->toContain('Karim Zitouni has booked an appointment');
    expect($payload['appointment']['id'])->toBe($appointment->id);
});
