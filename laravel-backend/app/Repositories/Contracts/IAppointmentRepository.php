<?php

namespace App\Repositories\Contracts;

use App\Models\Appointment;
use Carbon\CarbonInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface IAppointmentRepository
{
    public function findById(string $id): ?Appointment;

    public function getActiveAppointmentsForDoctor(string $doctorId, CarbonInterface $date): Collection;

    public function isSlotBooked(string $doctorId, CarbonInterface $dateTime): bool;

    public function create(array $data): Appointment;

    public function updateStatus(string $appointmentId, string $status, ?string $reason = null, ?string $cancelledBy = null): bool;

    public function getPatientAppointments(string $patientId): Collection;

    public function getPatientClinicHistory(string $patientId, string $clinicId): Collection;

    public function getPaginatedForAdmin(array $filters, int $perPage = 15): LengthAwarePaginator;

    public function getDashboardStats(?string $clinicId = null): array;
}
