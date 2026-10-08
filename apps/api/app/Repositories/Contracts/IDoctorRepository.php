<?php

namespace App\Repositories\Contracts;

use App\Models\Doctor;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface IDoctorRepository
{
    public function findById(string $id): ?Doctor;

    public function findByEmail(string $email): ?Doctor;

    public function getActiveDoctors(array $filters = [], int $perPage = 12): LengthAwarePaginator;

    public function create(array $data): Doctor;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;

    public function getAvailabilities(string $doctorId): Collection;
}
