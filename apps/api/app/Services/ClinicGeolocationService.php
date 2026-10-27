<?php

namespace App\Services;

use App\Models\Clinic;
use App\Repositories\Contracts\IClinicRepository;
use App\Services\Contracts\IClinicGeolocationService;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ClinicGeolocationService implements IClinicGeolocationService
{
    /**
     * Canonical coordinates for core target metropolitan clusters.
     */
    public const TARGET_CITIES = [
        [
            'slug' => 'algiers',
            'name' => 'Algiers',
            'arabic_name' => 'الجزائر',
            'wilaya_code' => 16,
            'latitude' => 36.7538,
            'longitude' => 3.0588,
            'default_radius_km' => 15.0,
        ],
        [
            'slug' => 'tebessa',
            'name' => 'Tébessa',
            'arabic_name' => 'تبسة',
            'wilaya_code' => 12,
            'latitude' => 35.4042,
            'longitude' => 8.1242,
            'default_radius_km' => 20.0,
        ],
    ];

    public function __construct(
        protected IClinicRepository $clinicRepository
    ) {}

    /**
     * Search clinics near coordinates converting radius from km to meters.
     */
    public function findClinicsNear(
        float $latitude,
        float $longitude,
        float $radiusKm = 10.0,
        array $filters = [],
        int $perPage = 15
    ): LengthAwarePaginator {
        $radiusInMeters = max(100.0, $radiusKm * 1000.0);

        return $this->clinicRepository->getNearby(
            $latitude,
            $longitude,
            $radiusInMeters,
            $filters,
            $perPage
        );
    }

    /**
     * Retrieve clinics matching filters.
     */
    public function listClinics(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->clinicRepository->list($filters, $perPage);
    }

    /**
     * Find clinic by UUID.
     */
    public function getClinic(string $id): ?Clinic
    {
        return $this->clinicRepository->findById($id);
    }

    /**
     * Update clinic coordinates and return updated model instance.
     */
    public function updateClinicCoordinates(
        string $clinicId,
        float $latitude,
        float $longitude,
        ?string $city = null,
        ?int $wilayaCode = null,
        ?string $commune = null
    ): Clinic {
        $clinic = $this->clinicRepository->findById($clinicId);
        if (! $clinic) {
            throw new NotFoundHttpException("Clinic not found: {$clinicId}");
        }

        $this->clinicRepository->updateLocation(
            $clinicId,
            $latitude,
            $longitude,
            $city,
            $wilayaCode,
            $commune
        );

        return $clinic->fresh(['doctors.specialty']);
    }

    /**
     * Return target city cluster anchors with live clinic counts.
     */
    public function getTargetCities(): array
    {
        return array_map(function ($city) {
            $clinicsCount = Clinic::query()
                ->where('is_active', true)
                ->where(function ($q) use ($city) {
                    $q->where('wilaya_code', $city['wilaya_code'])
                        ->orWhereRaw('LOWER(city) = ?', [strtolower($city['name'])]);
                })
                ->count();

            return array_merge($city, [
                'clinics_count' => $clinicsCount,
            ]);
        }, self::TARGET_CITIES);
    }
}
