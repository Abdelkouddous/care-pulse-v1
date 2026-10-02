<?php

namespace App\Repositories\Contracts;

use App\Models\Admin;

interface IAdminRepository
{
    public function findById(string $id): ?Admin;

    public function findByEmail(string $email): ?Admin;
}
