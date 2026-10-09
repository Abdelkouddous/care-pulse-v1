<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\IPatientRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentPatientRepository implements IPatientRepository
{
    public function findById(string $id): ?User
    {
        return User::find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)
            ->orWhere('phone', $email)
            ->first();
    }

    public function findByPhone(string $phone): ?User
    {
        $clean = preg_replace('/[^0-9]/', '', $phone);
        $intl = str_starts_with($clean, '213') ? '+' . $clean : '+213' . ltrim($clean, '0');
        $local = str_starts_with($clean, '213') ? '0' . substr($clean, 3) : (str_starts_with($clean, '0') ? $clean : '0' . $clean);

        return User::where('phone', $phone)
            ->orWhere('phone', $intl)
            ->orWhere('phone', $local)
            ->orWhereRaw("REPLACE(REPLACE(phone, ' ', ''), '-', '') = ?", [$intl])
            ->orWhereRaw("REPLACE(REPLACE(phone, ' ', ''), '-', '') = ?", [$local])
            ->first();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(string $id, array $data): bool
    {
        $user = User::find($id);
        if (! $user) {
            return false;
        }

        return $user->update($data);
    }

    public function getPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return User::withCount('appointments')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
}
