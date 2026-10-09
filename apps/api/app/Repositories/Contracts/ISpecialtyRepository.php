<?php

namespace App\Repositories\Contracts;

use App\Models\Specialty;
use Illuminate\Support\Collection;

interface ISpecialtyRepository
{
    public function getAll(): Collection;

    public function findById(string $id): ?Specialty;
}
