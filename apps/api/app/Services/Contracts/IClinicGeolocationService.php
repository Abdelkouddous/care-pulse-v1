<?php

namespace App\Services\Contracts;

use App\Models\Clinic;
use Illuminate\Pagination\LengthAwarePaginator;

interface IClinicGeolocationService
{
    /**
     * Search clinics within a radius given in kilometers.
     *
     * @param  float  $radiusKm  Default radius in kilometers
     * @param  array  $filters  Additional filtering criteria
     */
    public function findClinicsNear(
        float $latitude,
        float $longitude,
        float $radiusKm = 10.0,
        array $filters = [],
        int $perPage = 15
    ): LengthAwarePaginator;

    /**
     * Retrieve clinics matching filters.
     */
    public function listClinics(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    /**
     * Find clinic by UUID.
     */
    public function getClinic(string $id): ?Clinic;

    /**
     * Validate and persist new coordinates for a clinic.
     */
    public function updateClinicCoordinates(
        string $clinicId,
        float $latitude,
        float $longitude,
        ?string $city = null,
        ?int $wilayaCode = null,
        ?string $commune = null
    ): Clinic;

    /**
     * Target cities metadata (Algiers and Tébessa) with center coordinates and stats.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getTargetCities(): array;
}
