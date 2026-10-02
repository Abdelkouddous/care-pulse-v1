<?php

namespace App\Services;

use App\Repositories\Contracts\IAppointmentRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class AdminService
{
    public function __construct(
        protected IAppointmentRepository $appointmentRepo,
        protected TenantContext $tenantContext
    ) {}

    public function getDashboardStats(): array
    {
        $clinicId = $this->tenantContext->getTenantId();

        return $this->appointmentRepo->getDashboardStats($clinicId);
    }

    public function getAppointments(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->appointmentRepo->getPaginatedForAdmin($filters, $perPage);
    }

    public function updateAppointmentStatus(string $appointmentId, string $status): bool
    {
        return $this->appointmentRepo->updateStatus($appointmentId, $status);
    }
}
