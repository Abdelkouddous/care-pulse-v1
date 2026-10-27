<?php

use App\Jobs\SendSmsNotificationJob;
use App\Jobs\SendWhatsAppAppointmentReminderJob;
use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\User;
use App\Services\Contracts\ISmsGateway;
use App\Services\Contracts\IWhatsAppGateway;
use App\Services\SmsNotificationService;
use App\Services\WhatsAppNotificationService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;
use Tests\TestCase;

uses(RefreshDatabase::class);

beforeEach(function () {
    /** @var TestCase $this */
    $this->clinic = Clinic::create([
        'id' => (string) Str::uuid(),
        'name' => 'Wateen Book Queue Test Clinic',
        'email' => 'queue@vitalbook.com',
    ]);

    $this->patient = User::create([
        'id' => (string) Str::uuid(),
        'first_name' => 'Lina',
        'last_name' => 'Kaci',
        'email' => 'lina.kaci@example.com',
        'phone' => '+213550112233',
        'password' => bcrypt('password'),
    ]);

    $this->specialty = Specialty::create([
        'id' => (string) Str::uuid(),
        'name' => 'Pediatrics',
    ]);

    $this->doctor = Doctor::withoutGlobalScopes()->create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'specialty_id' => $this->specialty->id,
        'first_name' => 'Yacine',
        'last_name' => 'Meziani',
        'email' => 'dr.meziani@vitalbook.com',
        'consultation_fee_cents' => 300000,
        'license_number' => 'DZ-MED-99441',
    ]);

    $this->appointment = Appointment::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->clinic->id,
        'doctor_id' => $this->doctor->id,
        'patient_id' => $this->patient->id,
        'scheduled_at' => Carbon::now()->addDays(3)->setTime(10, 0),
        'status' => 'pending',
        'whatsapp_status' => 'pending',
        'reason' => 'Consultation',
        'consultation_fee_cents' => 300000,
    ]);
});

test('whatsapp reminder job is configured for notifications queue with backoff retry', function () {
    $job = new SendWhatsAppAppointmentReminderJob($this->appointment->id);

    expect($job->queue)->toBe('notifications');
    expect($job->tries)->toBe(3);
    expect($job->backoff)->toBe([10, 30, 90]);
});

test('sms notification job is configured for notifications queue with backoff retry', function () {
    $job = new SendSmsNotificationJob($this->appointment->id, 'reminder');

    expect($job->queue)->toBe('notifications');
    expect($job->tries)->toBe(3);
    expect($job->backoff)->toBe([10, 30, 90]);
});

test('dispatching whatsapp and sms jobs pushes them onto notifications queue', function () {
    Queue::fake();

    SendWhatsAppAppointmentReminderJob::dispatch($this->appointment->id);
    SendSmsNotificationJob::dispatch($this->appointment->id, 'confirmed');

    Queue::assertPushedOn('notifications', SendWhatsAppAppointmentReminderJob::class, function ($job) {
        return $job->appointmentId === $this->appointment->id;
    });

    Queue::assertPushedOn('notifications', SendSmsNotificationJob::class, function ($job) {
        return $job->appointmentId === $this->appointment->id && $job->templateType === 'confirmed';
    });
});

test('whatsapp reminder job executes through notification service and dispatches message', function () {
    $mockGateway = Mockery::mock(IWhatsAppGateway::class);
    $mockGateway->shouldReceive('sendMessage')
        ->once()
        ->withArgs(function ($to, $body, $meta) {
            return str_contains($to, '550112233') &&
                   str_contains($body, 'Meziani') &&
                   $meta['appointment_id'] === $this->appointment->id;
        })
        ->andReturn(['success' => true, 'message_id' => 'wam_test_queue_456', 'error' => null]);

    $service = new WhatsAppNotificationService($mockGateway);
    $job = new SendWhatsAppAppointmentReminderJob($this->appointment->id);
    $job->handle($service);

    $refreshed = Appointment::find($this->appointment->id);
    expect($refreshed->whatsapp_status)->toBe('sent');
});

test('sms notification job executes through sms service and dispatches message', function () {
    $mockGateway = Mockery::mock(ISmsGateway::class);
    $mockGateway->shouldReceive('sendSms')
        ->once()
        ->withArgs(function ($to, $body, $meta) {
            return str_contains($to, '550112233') &&
                   str_contains($body, 'Wateen Book') &&
                   $meta['appointment_id'] === $this->appointment->id;
        })
        ->andReturn(['success' => true, 'message_id' => 'sms_mock_123', 'error' => null]);

    $service = new SmsNotificationService($mockGateway);
    $job = new SendSmsNotificationJob($this->appointment->id, 'reminder');
    $job->handle($service);
});

test('permanent failure of whatsapp reminder marks appointment status failed', function () {
    $job = new SendWhatsAppAppointmentReminderJob($this->appointment->id);
    $job->failed(new RuntimeException('Connection timed out'));

    $refreshed = Appointment::find($this->appointment->id);
    expect($refreshed->whatsapp_status)->toBe('failed');
});
