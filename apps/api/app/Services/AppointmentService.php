<?php

namespace App\Services;

use App\Jobs\SendWhatsAppAppointmentReminderJob;
use App\Models\Appointment;
use App\Repositories\Contracts\IAppointmentRepository;
use App\Repositories\Contracts\IDoctorRepository;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AppointmentService
{
    public function __construct(
        protected IAppointmentRepository $appointmentRepo,
        protected IDoctorRepository $doctorRepo,
        protected SlotAvailabilityService $slotService,
        protected TenantContext $tenantContext
    ) {}

    /**
     * Book an appointment with Redis distributed locking.
     */
    public function bookAppointment(array $dto): Appointment
    {
        $doctorId = $dto['doctor_id'];
        $scheduledAt = Carbon::parse($dto['scheduled_at']);
        $timestamp = $scheduledAt->toIso8601String();

        $lockKey = sprintf('lock:slot:%s:%s', $doctorId, $timestamp);
        $lock = Cache::lock($lockKey, 10);

        // Attempt acquiring distributed lock for optimistic concurrency control
        if (! $lock->get()) {
            throw ValidationException::withMessages([
                'scheduled_at' => ['This appointment slot is currently being processed by another user.'],
            ])->status(409);
        }

        try {
            $appointment = DB::transaction(function () use ($dto, $doctorId, $scheduledAt) {
                // Verify slot is still free
                if ($this->appointmentRepo->isSlotBooked($doctorId, $scheduledAt)) {
                    throw ValidationException::withMessages([
                        'scheduled_at' => ['This slot has already been booked. Please choose another time.'],
                    ])->status(422);
                }

                $doctor = $this->doctorRepo->findById($doctorId);
                if (! $doctor) {
                    throw ValidationException::withMessages([
                        'doctor_id' => ['Doctor not found.'],
                    ]);
                }

                // Attach consultation fee in integer cents
                $dto['consultation_fee_cents'] = $doctor->consultation_fee_cents ?? 0;
                $dto['clinic_id'] = $dto['clinic_id'] ?? $doctor->clinic_id ?? $this->tenantContext->getTenantId();
                $dto['status'] = 'pending';
                $dto['whatsapp_status'] = 'pending';

                return $this->appointmentRepo->create($dto);
            });

            // Asynchronously dispatch interactive WhatsApp confirmation reminder
            SendWhatsAppAppointmentReminderJob::dispatch($appointment->id);

            return $appointment;
        } finally {
            $lock->release();
        }
    }

    /**
     * Manually trigger a WhatsApp reminder ping from the receptionist/admin control center.
     */
    public function dispatchWhatsAppReminder(string $appointmentId): bool
    {
        $appointment = $this->appointmentRepo->findById($appointmentId);
        if (! $appointment) {
            return false;
        }

        SendWhatsAppAppointmentReminderJob::dispatch($appointment->id);
        return true;
    }

    public function cancelAppointment(string $appointmentId, string $reason, string $cancelledBy): bool
    {
        return $this->appointmentRepo->updateStatus($appointmentId, 'cancelled', $reason, $cancelledBy);
    }

    public function updateStatus(string $appointmentId, string $status, ?string $reason = null, ?string $actor = null): bool
    {
        $updated = $this->appointmentRepo->updateStatus($appointmentId, $status, $reason, $actor);
        if ($updated && in_array($status, ['scheduled', 'confirmed'])) {
            $this->dispatchWhatsAppReminder($appointmentId);
        }
        return $updated;
    }

    public function getAppointment(string $id): ?Appointment
    {
        return $this->appointmentRepo->findById($id);
    }

    public function getPatientAppointments(string $patientId): Collection
    {
        return $this->appointmentRepo->getPatientAppointments($patientId);
    }

    /**
     * Clinic rebooking history check: see if patient visited this clinic previously
     */
    public function getPatientClinicHistory(string $patientId, ?string $clinicId = null): Collection
    {
        $targetClinicId = $clinicId ?? $this->tenantContext->getTenantId();
        if (! $targetClinicId) {
            return collect();
        }

        return $this->appointmentRepo->getPatientClinicHistory($patientId, $targetClinicId);
    }
}
