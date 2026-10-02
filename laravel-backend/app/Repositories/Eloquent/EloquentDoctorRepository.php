<?php

namespace App\Repositories\Eloquent;

use App\Models\Doctor;
use App\Repositories\Contracts\IDoctorRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentDoctorRepository implements IDoctorRepository
{
    public function findById(string $id): ?Doctor
    {
        return Doctor::with(['specialty', 'availabilities'])->find($id);
    }

    public function findByEmail(string $email): ?Doctor
    {
        return Doctor::where('email', $email)->first();
    }

    public function getActiveDoctors(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Doctor::with('specialty')->where('is_active', true);

        if (! empty($filters['specialty_id'])) {
            $query->where('specialty_id', $filters['specialty_id']);
        }

        if (! empty($filters['search'])) {
            $term = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($term) {
                $q->where('first_name', 'like', $term)
                    ->orWhere('last_name', 'like', $term)
                    ->orWhereHas('specialty', function ($sq) use ($term) {
                        $sq->where('name', 'like', $term);
                    });
            });
        }

        return $query->paginate($perPage);
    }

    public function create(array $data): Doctor
    {
        return Doctor::create($data);
    }

    public function update(string $id, array $data): bool
    {
        $doctor = Doctor::find($id);
        if (! $doctor) {
            return false;
        }

        return $doctor->update($data);
    }

    public function delete(string $id): bool
    {
        $doctor = Doctor::find($id);
        if (! $doctor) {
            return false;
        }

        $doctor->is_active = false;
        $doctor->save();

        return $doctor->delete();
    }

    public function getAvailabilities(string $doctorId): Collection
    {
        $doctor = Doctor::find($doctorId);
        if (! $doctor) {
            return collect();
        }

        return $doctor->availabilities()->where('is_active', true)->get();
    }
}
