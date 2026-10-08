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
    public int $backoff = 30;

    public function __construct(
        public string $appointmentId
    ) {}

    public function handle(WhatsAppNotificationService $whatsAppService): void
    {
        $appointment = Appointment::find($this->appointmentId);

        if (! $appointment) {
            Log::warning('[WhatsApp Job] Appointment not found for dispatch', [
                'appointment_id' => $this->appointmentId,
            ]);
            return;
        }

        $whatsAppService->sendAppointmentConfirmationRequest($appointment);
    }
}
