<?php

namespace App\Services;

use App\Models\Doctor;
use App\Repositories\Contracts\IDoctorRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class DoctorService
{
    public function __construct(
        protected IDoctorRepository $doctorRepo,
        protected TenantContext $tenantContext
    ) {}

    public function getActiveDoctors(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        return $this->doctorRepo->getActiveDoctors($filters, $perPage);
    }

    public function getDoctorById(string $id): ?Doctor
    {
        return $this->doctorRepo->findById($id);
    }

    public function createDoctor(array $data): Doctor
    {
        if (empty($data['clinic_id']) && $this->tenantContext->hasTenant()) {
            $data['clinic_id'] = $this->tenantContext->getTenantId();
        }

        return $this->doctorRepo->create($data);
    }

    public function updateDoctor(string $id, array $data): bool
    {
        return $this->doctorRepo->update($id, $data);
    }

    public function deleteDoctor(string $id): bool
    {
        return $this->doctorRepo->delete($id);
    }
}
