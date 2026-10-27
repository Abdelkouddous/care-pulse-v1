<?php

namespace App\Services;

use App\Models\Appointment;
use App\Services\Contracts\ISmsGateway;
use Illuminate\Support\Facades\Log;

class SmsNotificationService
{
    public function __construct(
        protected ISmsGateway $smsGateway
    ) {}

    /**
     * Send an appointment booking confirmation or reminder via SMS.
     */
    public function sendAppointmentAlert(Appointment $appointment, string $templateType = 'reminder'): array
    {
        $appointment->loadMissing(['doctor', 'patient']);

        $patient = $appointment->patient;
        $doctor = $appointment->doctor;

        $phone = $patient?->phone ?? $appointment->patient_phone;
        if (! $phone) {
            Log::warning('[SMS Service] Appointment missing patient phone number', [
                'appointment_id' => $appointment->id,
            ]);

            return ['success' => false, 'error' => 'Patient phone number is missing'];
        }

        $doctorName = $doctor ? "Dr. {$doctor->first_name} {$doctor->last_name}" : 'your doctor';
        $time = $appointment->scheduled_at ? $appointment->scheduled_at->format('d/m/Y H:i') : 'upcoming';

        $body = match ($templateType) {
            'confirmed' => "Wateen Book: Votre rendez-vous avec {$doctorName} le {$time} est confirmé.",
            'cancelled' => "Wateen Book: Votre rendez-vous avec {$doctorName} prévu le {$time} a été annulé.",
            default => "Wateen Book: Rappel de votre rendez-vous avec {$doctorName} le {$time}. Merci d'être ponctuel(le).",
        };

        return $this->smsGateway->sendSms($phone, $body, [
            'appointment_id' => $appointment->id,
            'clinic_id' => $appointment->clinic_id,
            'type' => $templateType,
        ]);
    }

    /**
     * Send generic SMS text.
     */
    public function sendRawMessage(string $to, string $message, array $metadata = []): array
    {
        return $this->smsGateway->sendSms($to, $message, $metadata);
    }
}
