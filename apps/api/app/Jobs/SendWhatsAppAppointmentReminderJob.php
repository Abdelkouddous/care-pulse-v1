<?php

namespace App\Jobs;

use App\Models\Appointment;
use App\Services\WhatsAppNotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendWhatsAppAppointmentReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public array $backoff = [10, 30, 90];

    public function __construct(
        public string $appointmentId
    ) {
        $this->onQueue('notifications');
    }

    public function handle(WhatsAppNotificationService $whatsAppService): void
    {
        $appointment = Appointment::find($this->appointmentId);

        if (! $appointment) {
            Log::warning('[WhatsApp Job] Appointment not found for dispatch', [
                'appointment_id' => $this->appointmentId,
            ]);

            return;
        }

        $result = $whatsAppService->sendAppointmentConfirmationRequest($appointment);

        if (! ($result['success'] ?? false)) {
            Log::warning('[WhatsApp Job] Gateway dispatch unsuccessful', [
                'appointment_id' => $this->appointmentId,
                'error' => $result['error'] ?? 'unknown',
            ]);
        }
    }

    public function failed(?\Throwable $exception): void
    {
        Log::error('[WhatsApp Job] All retry attempts exhausted', [
            'appointment_id' => $this->appointmentId,
            'exception' => $exception?->getMessage(),
        ]);

        $appointment = Appointment::find($this->appointmentId);
        if ($appointment) {
            $appointment->update(['whatsapp_status' => 'failed']);
        }
    }
}
