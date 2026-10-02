<?php

namespace App\Repositories\Eloquent;

use App\Models\Admin;
use App\Repositories\Contracts\IAdminRepository;

class EloquentAdminRepository implements IAdminRepository
{
    public function findById(string $id): ?Admin
    {
        return Admin::with('clinic')->find($id);
    }

    public function findByEmail(string $email): ?Admin
    {
        return Admin::where('email', $email)->first();
    }
}
