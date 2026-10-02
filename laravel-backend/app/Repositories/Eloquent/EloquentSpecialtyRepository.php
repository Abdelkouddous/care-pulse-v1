<?php

namespace App\Repositories\Eloquent;

use App\Models\Specialty;
use App\Repositories\Contracts\ISpecialtyRepository;
use Illuminate\Support\Collection;

class EloquentSpecialtyRepository implements ISpecialtyRepository
{
    public function getAll(): Collection
    {
        return Specialty::withCount('doctors')->get();
    }

    public function findById(string $id): ?Specialty
    {
        return Specialty::find($id);
    }
}
