<?php

namespace App\Repositories\Eloquent;

use App\Models\Clinic;
use App\Repositories\Contracts\IClinicRepository;
use App\Services\ClinicGeolocationService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class EloquentClinicRepository implements IClinicRepository
{
    /**
     * Find a clinic by its UUID.
     */
    public function findById(string $id): ?Clinic
    {
        return Clinic::with(['doctors.specialty'])->find($id);
    }

    /**
     * Retrieve active clinics within a specified radius (in meters) ordered by distance.
     */
    public function getNearby(
        float $latitude,
        float $longitude,
        float $radiusInMeters,
        array $filters = [],
        int $perPage = 15
    ): LengthAwarePaginator {
        $query = Clinic::query()
            ->where('is_active', true)
            ->nearby($latitude, $longitude, $radiusInMeters);

        $this->applyFilters($query, $filters);

        return $query->paginate($perPage);
    }

    /**
     * Retrieve clinics matching filters (city, wilaya_code, search, is_active).
     */
    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Clinic::query()->where('is_active', true);

        $this->applyFilters($query, $filters);

        return $query->orderBy('name', 'asc')->paginate($perPage);
    }

    /**
     * Common filter application logic (Clean Code / DRY).
     */
    protected function applyFilters($query, array $filters): void
    {
        $like = DB::getDriverName() === 'pgsql' ? 'ilike' : 'like';

        if (! empty($filters['city'])) {
            $cityInput = trim($filters['city']);
            $matchedTarget = collect(ClinicGeolocationService::TARGET_CITIES)->first(function ($c) use ($cityInput) {
                return strcasecmp($c['slug'], $cityInput) === 0 || strcasecmp($c['name'], $cityInput) === 0;
            });

            if ($matchedTarget) {
                $query->where(function ($q) use ($matchedTarget, $like) {
                    $q->where('wilaya_code', $matchedTarget['wilaya_code'])
                        ->orWhere('city', $like, '%'.$matchedTarget['name'].'%')
                        ->orWhere('city', $like, '%'.$matchedTarget['slug'].'%');
                });
            } else {
                $query->where('city', $like, '%'.$cityInput.'%');
            }
        }

        if (! empty($filters['wilaya_code'])) {
            $query->inWilaya((int) $filters['wilaya_code']);
        }

        if (! empty($filters['search'])) {
            $term = '%'.trim($filters['search']).'%';
            $query->where(function ($q) use ($term, $like) {
                $q->where('name', $like, $term)
                    ->orWhere('address', $like, $term)
                    ->orWhere('city', $like, $term)
                    ->orWhere('commune', $like, $term);
            });
        }
    }

    /**
     * Update clinic geographic coordinates using PostGIS Point geography.
     */
    public function updateLocation(
        string $id,
        float $latitude,
        float $longitude,
        ?string $city = null,
        ?int $wilayaCode = null,
        ?string $commune = null
    ): bool {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            $locationExpr = DB::raw(sprintf('ST_SetSRID(ST_MakePoint(%F, %F), 4326)::geography', $longitude, $latitude));
        } else {
            $locationExpr = Clinic::buildPointHex($latitude, $longitude);
        }

        $updateData = [
            'location' => $locationExpr,
            'updated_at' => now(),
        ];

        if ($city !== null) {
            $updateData['city'] = $city;
        }

        if ($wilayaCode !== null) {
            $updateData['wilaya_code'] = $wilayaCode;
        }

        if ($commune !== null) {
            $updateData['commune'] = $commune;
        }

        return (bool) DB::table('clinics')->where('id', $id)->update($updateData);
    }

    /**
     * Create a new clinic record.
     */
    public function create(array $data): Clinic
    {
        $lat = $data['latitude'] ?? null;
        $lng = $data['longitude'] ?? null;

        unset($data['latitude'], $data['longitude']);

        if ($lat !== null && $lng !== null) {
            $driver = DB::getDriverName();
            if ($driver === 'pgsql') {
                $data['location'] = DB::raw(sprintf('ST_SetSRID(ST_MakePoint(%F, %F), 4326)::geography', (float) $lng, (float) $lat));
            } else {
                $data['location'] = Clinic::buildPointHex((float) $lat, (float) $lng);
            }
        }

        return Clinic::create($data);
    }
}
