<?php

namespace App\Repositories\Eloquent;

use App\Models\Appointment;
use App\Repositories\Contracts\IAppointmentRepository;
use Carbon\CarbonInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentAppointmentRepository implements IAppointmentRepository
{
    public function findById(string $id): ?Appointment
    {
        return Appointment::with(['patient', 'doctor.specialty', 'clinic'])->find($id);
    }

    public function getActiveAppointmentsForDoctor(string $doctorId, CarbonInterface $date): Collection
    {
        $startOfDay = $date->copy()->startOfDay();
        $endOfDay = $date->copy()->endOfDay();

        return Appointment::where('doctor_id', $doctorId)
            ->whereBetween('scheduled_at', [$startOfDay, $endOfDay])
            ->whereNotIn('status', ['cancelled'])
            ->get();
    }

    public function isSlotBooked(string $doctorId, CarbonInterface $dateTime): bool
    {
        return Appointment::where('doctor_id', $doctorId)
            ->where('scheduled_at', $dateTime)
            ->whereNotIn('status', ['cancelled'])
            ->exists();
    }

    public function create(array $data): Appointment
    {
        return Appointment::create($data);
    }

    public function updateStatus(string $appointmentId, string $status, ?string $reason = null, ?string $cancelledBy = null): bool
    {
        $appointment = Appointment::find($appointmentId);
        if (! $appointment) {
            return false;
        }

        $appointment->status = $status;
        if ($status === 'cancelled') {
            $appointment->cancellation_reason = $reason ?? 'Cancelled by ' . ($cancelledBy ?? 'user');
            $appointment->cancelled_by = $cancelledBy ?? 'user';
        } else {
            $appointment->cancellation_reason = null;
            $appointment->cancelled_by = null;
            if ($reason && ! $appointment->notes) {
                $appointment->notes = $reason;
            }
        }

        return $appointment->save();
    }

    public function getPatientAppointments(string $patientId): Collection
    {
        return Appointment::with(['doctor.specialty', 'clinic'])
            ->where('patient_id', $patientId)
            ->orderBy('scheduled_at', 'desc')
            ->get();
    }

    public function getPatientClinicHistory(string $patientId, string $clinicId): Collection
    {
        return Appointment::with(['doctor.specialty', 'medicalRecord'])
            ->where('patient_id', $patientId)
            ->where('clinic_id', $clinicId)
            ->orderBy('scheduled_at', 'desc')
            ->get();
    }

    public function getPaginatedForAdmin(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = Appointment::with(['patient', 'doctor.specialty']);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['doctor_id'])) {
            $query->where('doctor_id', $filters['doctor_id']);
        }

        if (! empty($filters['date'])) {
            $query->whereDate('scheduled_at', $filters['date']);
        }

        return $query->orderBy('scheduled_at', 'desc')->paginate($perPage);
    }

    public function getDashboardStats(?string $clinicId = null): array
    {
        $query = Appointment::query();
        if ($clinicId) {
            $query->where('clinic_id', $clinicId);
        }

        return [
            'total' => (clone $query)->count(),
            'scheduled' => (clone $query)->where('status', 'scheduled')->count(),
            'pending' => (clone $query)->where('status', 'pending')->count(),
            'cancelled' => (clone $query)->where('status', 'cancelled')->count(),
            'completed' => (clone $query)->where('status', 'completed')->count(),
        ];
    }
}
