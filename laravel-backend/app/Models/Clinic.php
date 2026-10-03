<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Clinic extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'address',
        'phone',
        'email',
        'timezone',
        'logo_url',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function doctors()
    {
        return $this->hasMany(Doctor::class, 'clinic_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'clinic_id');
    }

    public function admins()
    {
        return $this->hasMany(Admin::class, 'clinic_id');
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class, 'clinic_id');
    }
}
