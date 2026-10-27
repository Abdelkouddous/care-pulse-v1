<?php

namespace App\Repositories\Contracts;

use App\Models\Clinic;
use Illuminate\Pagination\LengthAwarePaginator;

interface IClinicRepository
{
    /**
     * Find a clinic by its UUID.
     */
    public function findById(string $id): ?Clinic;

    /**
     * Retrieve active clinics within a specified radius (in meters) ordered by distance.
     *
     * @param  float  $latitude  WGS 84 latitude (-90 to 90)
     * @param  float  $longitude  WGS 84 longitude (-180 to 180)
     * @param  float  $radiusInMeters  Proximity threshold in meters
     * @param  array  $filters  Additional filters (e.g. ['is_active' => true, 'search' => '...'])
     */
    public function getNearby(
        float $latitude,
        float $longitude,
        float $radiusInMeters,
        array $filters = [],
        int $perPage = 15
    ): LengthAwarePaginator;

    /**
     * Retrieve clinics matching filters (city, wilaya_code, search, is_active).
     */
    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    /**
     * Update clinic geographic coordinates using PostGIS Point geography and optional locality metadata.
     *
     * @param  string  $id  Clinic UUID
     */
    public function updateLocation(
        string $id,
        float $latitude,
        float $longitude,
        ?string $city = null,
        ?int $wilayaCode = null,
        ?string $commune = null
    ): bool;

    /**
     * Create a new clinic record.
     */
    public function create(array $data): Clinic;
}
