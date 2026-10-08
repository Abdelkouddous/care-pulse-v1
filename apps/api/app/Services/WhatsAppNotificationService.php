<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\User;
use App\Services\Contracts\IWhatsAppGateway;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class WhatsAppNotificationService
{
    public function __construct(
        protected IWhatsAppGateway $gateway
    ) {}

    /**
     * Dispatch an interactive WhatsApp booking confirmation prompt.
     */
    public function sendAppointmentConfirmationRequest(Appointment $appointment): bool
    {
        $appointment->loadMissing(['patient', 'doctor']);

        $patient = $appointment->patient;
        $doctor = $appointment->doctor;

        $phone = $patient?->phone;
        if (! $phone) {
            Log::warning('[WhatsApp] Missing patient phone number', ['appointment_id' => $appointment->id]);
            $appointment->update(['whatsapp_status' => 'failed']);
            return false;
        }

        $patientName = $patient->name ?? 'Patient';
        $doctorName = $doctor->name ?? 'votre médecin';
        $scheduledTime = Carbon::parse($appointment->scheduled_at);
        $dateStr = $scheduledTime->format('d/m/Y');
        $timeStr = $scheduledTime->format('H:i');

        $message = "Bonjour {$patientName}, votre consultation chez VitalBook avec Dr. {$doctorName} est prévue pour le {$dateStr} à {$timeStr}.\n\n"
            . "👉 Répondez 1 (ou OUI) pour CONFIRMER votre présence.\n"
            . "👉 Répondez 2 (ou NON) pour ANNULER la consultation.";

        $result = $this->gateway->sendMessage($phone, $message, [
            'appointment_id' => $appointment->id,
            'clinic_id' => $appointment->clinic_id,
        ]);

        if ($result['success'] ?? false) {
            $appointment->update([
                'whatsapp_status' => 'sent',
                'whatsapp_message_id' => $result['message_id'] ?? null,
                'whatsapp_last_sent_at' => now(),
            ]);
            return true;
        }

        $appointment->update(['whatsapp_status' => 'failed']);
        return false;
    }

    /**
     * Ingest and parse incoming two-way WhatsApp webhooks idempotently.
     */
    public function handleInboundWebhook(array $payload): array
    {
        $rawFrom = $payload['From'] ?? $payload['from'] ?? $payload['phone'] ?? null;
        $rawBody = $payload['Body'] ?? $payload['body'] ?? $payload['text'] ?? $payload['message'] ?? '';
        $messageId = $payload['MessageSid'] ?? $payload['message_id'] ?? null;

        if (! $rawFrom) {
            return ['handled' => false, 'error' => 'Missing sender phone identifier'];
        }

        $normalizedPhone = preg_replace('/[^0-9+]/', '', trim((string) $rawFrom));
        $normalizedBody = strtoupper(trim((string) $rawBody));

        // Locate corresponding appointment
        $appointment = null;

        if ($messageId) {
            $appointment = Appointment::where('whatsapp_message_id', $messageId)->first();
        }

        if (! $appointment) {
            // Find patient by phone variant (e.g. +213555... or 0555...)
            $cleanSuffix = substr($normalizedPhone, -8);
            $patient = User::where('phone', 'LIKE', '%' . $cleanSuffix)->first();

            if ($patient) {
                $appointment = Appointment::where('patient_id', $patient->id)
                    ->whereIn('status', ['pending', 'scheduled'])
                    ->where('scheduled_at', '>=', now()->subHours(2))
                    ->orderBy('scheduled_at', 'asc')
                    ->first();
            }
        }

        if (! $appointment) {
            Log::info('[WhatsApp Webhook] No matching active appointment found', [
                'phone' => $normalizedPhone,
                'body' => $normalizedBody,
            ]);
            return [
                'handled' => false,
                'error' => 'No active appointment found for phone',
                'phone' => $normalizedPhone,
            ];
        }

        // Triage intent: 1/OUI/CONFIRM vs 2/NON/CANCEL
        if (in_array($normalizedBody, ['1', 'OUI', 'CONFIRM', 'CONFIRMER', 'YES', 'O'])) {
            $appointment->update([
                'status' => 'scheduled',
                'whatsapp_status' => 'confirmed',
                'whatsapp_confirmed_at' => now(),
            ]);

            Log::info('[WhatsApp Webhook] Appointment confirmed via WhatsApp', [
                'appointment_id' => $appointment->id,
            ]);

            return [
                'handled' => true,
                'action' => 'confirmed',
                'appointment_id' => $appointment->id,
                'status' => 'scheduled',
            ];
        }

        if (in_array($normalizedBody, ['2', 'NON', 'ANNULER', 'CANCEL', 'NO', 'N'])) {
            $appointment->update([
                'status' => 'cancelled',
                'cancellation_reason' => 'Annulation effectuée par le patient via WhatsApp.',
                'cancelled_by' => 'patient',
                'whatsapp_status' => 'cancelled',
            ]);

            Log::info('[WhatsApp Webhook] Appointment cancelled via WhatsApp', [
                'appointment_id' => $appointment->id,
            ]);

            return [
                'handled' => true,
                'action' => 'cancelled',
                'appointment_id' => $appointment->id,
                'status' => 'cancelled',
            ];
        }

        return [
            'handled' => false,
            'action' => 'unrecognized_intent',
            'appointment_id' => $appointment->id,
            'prompt' => 'Répondez 1 pour Confirmer ou 2 pour Annuler.',
        ];
    }
}
