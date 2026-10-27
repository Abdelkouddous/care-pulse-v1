<?php

namespace App\Services;

use App\Models\Doctor;
use Illuminate\Support\Collection;

/**
 * Domain Service: DoctorActivityFeedService
 *
 * Adheres to SRP & DDD principles.
 * Encapsulates the domain logic for transforming clinical transactions
 * (bookings, triage changes, WhatsApp notifications, cancellations)
 * into a consolidated, immutable clinical audit timeline.
 */
class DoctorActivityFeedService
{
    /**
     * Generate chronological activity timeline for the given doctor.
     */
    public function getFeedForDoctor(Doctor $doctor, int $limit = 50): array
    {
        $appointments = $doctor->appointments()
            ->with(['patient'])
            ->latest('created_at')
            ->limit($limit)
            ->get();

        $events = new Collection;

        foreach ($appointments as $appointment) {
            $patient = $appointment->patient;
            $patientName = $patient ? trim("{$patient->first_name} {$patient->last_name}") : 'Unknown Patient';
            $patientPhone = $patient?->phone ?? 'N/A';
            $scheduledTime = $appointment->scheduled_at ? $appointment->scheduled_at->format('M j, Y \a\t H:i') : 'Unscheduled';
            $feeDzd = number_format(($appointment->consultation_fee_cents ?? 0) / 100, 2).' DZD';

            $basePatient = [
                'id' => $patient?->id,
                'name' => $patientName,
                'phone' => $patientPhone,
                'avatar_url' => $patient?->avatar_url ?? null,
            ];

            // 1. Booking Creation Event
            if ($appointment->created_at) {
                $events->push([
                    'id' => "evt-booked-{$appointment->id}",
                    'appointment_id' => $appointment->id,
                    'event_type' => 'appointment_booked',
                    'category' => 'booking',
                    'severity' => 'info',
                    'title' => 'New Patient Booking',
                    'description' => "{$patientName} reserved a consultation slot for {$scheduledTime}.",
                    'timestamp' => $appointment->created_at->toIso8601String(),
                    'patient' => $basePatient,
                    'metadata' => [
                        'status' => $appointment->status,
                        'reason' => $appointment->reason,
                        'fee' => $feeDzd,
                        'scheduled_at' => $appointment->scheduled_at?->toIso8601String(),
                    ],
                ]);
            }

            // 2. WhatsApp Notification Dispatch Event
            if ($appointment->whatsapp_last_sent_at) {
                $isFailed = $appointment->whatsapp_status === 'failed';
                $events->push([
                    'id' => "evt-wa-sent-{$appointment->id}",
                    'appointment_id' => $appointment->id,
                    'event_type' => $isFailed ? 'whatsapp_delivery_failed' : 'whatsapp_dispatched',
                    'category' => 'communication',
                    'severity' => $isFailed ? 'warning' : 'info',
                    'title' => $isFailed ? 'WhatsApp Dispatch Notice' : 'Interactive WhatsApp Dispatched',
                    'description' => $isFailed
                        ? "Interactive confirmation ping simulated (gateway offline) for {$patientName}."
                        : "Automated booking confirmation sent to {$patientPhone}.",
                    'timestamp' => $appointment->whatsapp_last_sent_at->toIso8601String(),
                    'patient' => $basePatient,
                    'metadata' => [
                        'whatsapp_status' => $appointment->whatsapp_status,
                        'phone' => $patientPhone,
                    ],
                ]);
            }

            // 3. WhatsApp Patient Confirmation Event
            if ($appointment->whatsapp_confirmed_at) {
                $events->push([
                    'id' => "evt-wa-confirmed-{$appointment->id}",
                    'appointment_id' => $appointment->id,
                    'event_type' => 'whatsapp_confirmed',
                    'category' => 'communication',
                    'severity' => 'success',
                    'title' => 'Patient Confirmed via WhatsApp',
                    'description' => "{$patientName} confirmed attendance for {$scheduledTime} via interactive SMS/WhatsApp.",
                    'timestamp' => $appointment->whatsapp_confirmed_at->toIso8601String(),
                    'patient' => $basePatient,
                    'metadata' => [
                        'status' => $appointment->status,
                    ],
                ]);
            }

            // 4. Clinical Triage Transition Event (when status evolved beyond initial pending)
            if ($appointment->status !== 'pending' && $appointment->updated_at) {
                $isCompleted = $appointment->status === 'completed';
                $isCancelled = $appointment->status === 'cancelled';
                $isInConsult = $appointment->status === 'in_consultation';

                $title = match ($appointment->status) {
                    'in_consultation' => 'Consultation In Progress',
                    'completed' => 'Consultation Completed',
                    'cancelled' => 'Consultation Cancelled',
                    'confirmed' => 'Consultation Confirmed',
                    default => 'Triage Status Updated',
                };

                $severity = match ($appointment->status) {
                    'completed' => 'success',
                    'cancelled' => 'alert',
                    'in_consultation' => 'info',
                    default => 'info',
                };

                $description = match ($appointment->status) {
                    'in_consultation' => "Doctor initiated active clinical examination for {$patientName}.",
                    'completed' => "Clinical examination finished and dossier saved for {$patientName}.",
                    'cancelled' => 'Appointment cancelled. Reason: '.($appointment->cancellation_reason ?? 'Not specified'),
                    default => "Appointment status transitioned to {$appointment->status}.",
                };

                $events->push([
                    'id' => "evt-status-{$appointment->id}-{$appointment->status}",
                    'appointment_id' => $appointment->id,
                    'event_type' => 'status_updated',
                    'category' => $isCancelled ? 'triage' : 'clinical',
                    'severity' => $severity,
                    'title' => $title,
                    'description' => $description,
                    'timestamp' => $appointment->updated_at->toIso8601String(),
                    'patient' => $basePatient,
                    'metadata' => [
                        'status' => $appointment->status,
                        'cancellation_reason' => $appointment->cancellation_reason,
                        'cancelled_by' => $appointment->cancelled_by,
                    ],
                ]);
            }
        }

        // Sort chronological descending (newest activity first)
        return $events->sortByDesc('timestamp')->values()->take($limit)->all();
    }
}
