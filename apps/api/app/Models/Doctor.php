<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

class Doctor extends Authenticatable
{
    use BelongsToTenant, HasApiTokens, HasFactory, HasUuids, Notifiable, SoftDeletes;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'clinic_id',
        'specialty_id',
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'avatar_url',
        'bio',
        'consultation_fee_cents',
        'license_number',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Coordinate and proximity attributes exposed to JSON serializers.
     */
    protected $appends = [
        'name',
        'distance_km',
    ];

    protected function casts(): array
    {
        return [
            'consultation_fee_cents' => 'integer',
            'is_active' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function specialty()
    {
        return $this->belongsTo(Specialty::class, 'specialty_id');
    }

    public function availabilities()
    {
        return $this->hasMany(DoctorAvailability::class, 'doctor_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    public function getNameAttribute(): string
    {
        return 'Dr. '.trim("{$this->first_name} {$this->last_name}");
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class, 'doctor_id');
    }

    /**
     * Scope query to doctors practicing at clinics within radiusInMeters.
     * Inherits spatial coordinates from clinics.location (Option A).
     */
    public function scopeWithinDistance(Builder $query, float $latitude, float $longitude, float $radiusInMeters): Builder
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            $pointSql = 'ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography';

            return $query->join('clinics', 'clinics.id', '=', 'doctors.clinic_id')
                ->whereNull('clinics.deleted_at')
                ->where('clinics.is_active', true)
                ->whereNotNull('clinics.location')
                ->whereRaw("ST_DWithin(clinics.location, {$pointSql}, ?)", [$longitude, $latitude, $radiusInMeters])
                ->select('doctors.*')
                ->selectRaw("ST_Distance(clinics.location, {$pointSql}) as distance_meters", [$longitude, $latitude])
                ->orderBy('distance_meters', 'asc');
        }

        // SQLite fallback joins clinics and invokes st_dwithin_sqlite
        Clinic::registerSqliteFunctions($query->getConnection()->getPdo());

        return $query->join('clinics', 'clinics.id', '=', 'doctors.clinic_id')
            ->whereNull('clinics.deleted_at')
            ->where('clinics.is_active', true)
            ->whereNotNull('clinics.location')
            ->whereRaw('st_dwithin_sqlite(clinics.location, ?, ?, ?) = 1', [$longitude, $latitude, $radiusInMeters])
            ->select('doctors.*')
            ->selectRaw('st_distance_sqlite(clinics.location, ?, ?) as distance_meters', [$longitude, $latitude])
            ->orderBy('distance_meters', 'asc');
    }

    /**
     * Distance accessor for API serializers.
     */
    protected function distanceKm(): Attribute
    {
        return Attribute::make(
            get: function ($value, array $attributes) {
                if (isset($attributes['distance_meters']) && is_numeric($attributes['distance_meters'])) {
                    return round((float) $attributes['distance_meters'] / 1000.0, 2);
                }

                return null;
            }
        );
    }
}
