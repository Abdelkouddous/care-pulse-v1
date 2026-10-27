<?php

namespace App\Jobs;

use App\Models\Appointment;
use App\Services\SmsNotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendSmsNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public array $backoff = [10, 30, 90];

    public function __construct(
        public string $appointmentId,
        public string $templateType = 'reminder'
    ) {
        $this->onQueue('notifications');
    }

    public function handle(SmsNotificationService $smsService): void
    {
        $appointment = Appointment::find($this->appointmentId);

        if (! $appointment) {
            Log::warning('[SMS Job] Appointment not found for dispatch', [
                'appointment_id' => $this->appointmentId,
            ]);

            return;
        }

        $result = $smsService->sendAppointmentAlert($appointment, $this->templateType);

        if (! ($result['success'] ?? false)) {
            Log::warning('[SMS Job] Gateway dispatch unsuccessful', [
                'appointment_id' => $this->appointmentId,
                'error' => $result['error'] ?? 'unknown',
            ]);
        }
    }

    public function failed(?\Throwable $exception): void
    {
        Log::error('[SMS Job] All retry attempts exhausted', [
            'appointment_id' => $this->appointmentId,
            'template' => $this->templateType,
            'exception' => $exception?->getMessage(),
        ]);
    }
}
