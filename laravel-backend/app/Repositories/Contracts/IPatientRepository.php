<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

interface IPatientRepository
{
    public function findById(string $id): ?User;

    public function findByEmail(string $email): ?User;

    public function findByPhone(string $phone): ?User;

    public function create(array $data): User;

    public function update(string $id, array $data): bool;

    public function getPaginated(int $perPage = 15): LengthAwarePaginator;
}
