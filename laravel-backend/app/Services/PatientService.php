<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\IPatientRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class PatientService
{
    public function __construct(
        protected IPatientRepository $patientRepo
    ) {}

    public function getProfile(string $id): ?User
    {
        return $this->patientRepo->findById($id);
    }

    public function updateProfile(string $id, array $data): bool
    {
        return $this->patientRepo->update($id, $data);
    }

    public function getPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->patientRepo->getPaginated($perPage);
    }
}
