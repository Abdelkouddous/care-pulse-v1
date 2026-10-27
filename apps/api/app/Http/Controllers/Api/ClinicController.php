<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Clinic\NearbyClinicsRequest;
use App\Http\Requests\Clinic\UpdateClinicLocationRequest;
use App\Http\Resources\ClinicResource;
use App\Services\Contracts\IClinicGeolocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ClinicController extends Controller
{
    public function __construct(
        protected IClinicGeolocationService $clinicGeolocationService
    ) {}

    /**
     * Search clinics within spatial proximity.
     */
    public function nearby(NearbyClinicsRequest $request): AnonymousResourceCollection
    {
        $validated = $request->validated();

        $latitude = isset($validated['latitude']) ? (float) $validated['latitude'] : null;
        $longitude = isset($validated['longitude']) ? (float) $validated['longitude'] : null;
        $radiusKm = isset($validated['radius_km']) ? (float) $validated['radius_km'] : 10.0;
        $perPage = isset($validated['per_page']) ? (int) $validated['per_page'] : 15;

        // If coordinates omitted but city provided, resolve anchor coordinates
        if (($latitude === null || $longitude === null) && ! empty($validated['city'])) {
            foreach ($this->clinicGeolocationService->getTargetCities() as $city) {
                if (strcasecmp($city['slug'], $validated['city']) === 0 || strcasecmp($city['name'], $validated['city']) === 0) {
                    $latitude = $city['latitude'];
                    $longitude = $city['longitude'];
                    $radiusKm = $validated['radius_km'] ?? $city['default_radius_km'];
                    break;
                }
            }
        }

        if ($latitude === null || $longitude === null) {
            abort(422, 'Latitude and longitude coordinates are required to calculate proximity.');
        }

        $filters = array_filter([
            'city' => $validated['city'] ?? null,
            'wilaya_code' => $validated['wilaya_code'] ?? null,
            'search' => $validated['search'] ?? null,
        ]);

        $paginator = $this->clinicGeolocationService->findClinicsNear(
            $latitude,
            $longitude,
            $radiusKm,
            $filters,
            $perPage
        );

        return ClinicResource::collection($paginator);
    }

    /**
     * List clinics with optional filtering.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = array_filter([
            'city' => $request->query('city'),
            'wilaya_code' => $request->query('wilaya_code'),
            'search' => $request->query('search'),
        ]);

        $perPage = (int) $request->query('per_page', 15);
        $paginator = $this->clinicGeolocationService->listClinics($filters, $perPage);

        return ClinicResource::collection($paginator);
    }

    /**
     * Retrieve target cities metadata (Algiers and Tébessa).
     */
    public function cities(): JsonResponse
    {
        $cities = $this->clinicGeolocationService->getTargetCities();

        return response()->json([
            'data' => $cities,
        ]);
    }

    /**
     * Show single clinic details.
     */
    public function show(string $id): ClinicResource
    {
        $clinic = $this->clinicGeolocationService->getClinic($id);

        if (! $clinic) {
            abort(404, 'Clinic not found.');
        }

        return new ClinicResource($clinic);
    }

    /**
     * Update clinic geolocation coordinates (Admin / Clinic Management).
     */
    public function updateLocation(UpdateClinicLocationRequest $request, string $id): ClinicResource
    {
        $validated = $request->validated();

        $updated = $this->clinicGeolocationService->updateClinicCoordinates(
            clinicId: $id,
            latitude: (float) $validated['latitude'],
            longitude: (float) $validated['longitude'],
            city: $validated['city'] ?? null,
            wilayaCode: isset($validated['wilaya_code']) ? (int) $validated['wilaya_code'] : null,
            commune: $validated['commune'] ?? null,
        );

        return new ClinicResource($updated);
    }
}
