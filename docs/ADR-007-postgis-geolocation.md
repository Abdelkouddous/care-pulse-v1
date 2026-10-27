# Architecture Decision Record (ADR-007): Spatial Proximity Discovery via PostGIS & Inherited Clinic Geolocation

- **Status:** Accepted (Option A: Inherited Spatial Coordinates)
- **Date:** 2026-10-25
- **Context:** CarePulse / VitalBook V1 — Algerian Clinical Telehealth & Outpatient Routing
- **Deciders:** Human Supervisor, Orchestrator, Design Agent
- **Target Components:** `apps/api` (Laravel 11, PostgreSQL 18 / PostGIS), `apps/web` (Next.js 14.2 App Router)

---

## 1. Context & Problem Statement

Patients booking medical appointments in Algerian urban centers (Algiers Wilaya 16) and regional wilayas (Tébessa Wilaya 12) require physical proximity discovery for:
1. **Accredited Clinics / Medical Centers:** Nearest facilities equipped for emergency triage and general outpatient care.
2. **Specialist Doctors:** Specialist practitioners (Cardiologists, Pediatricians, etc.) practicing within an accessible radius.

### Key Architectural Challenges:
- **Spatial Coordinate Representation:** How should spatial coordinates be stored, indexed, and queried on Supabase PostgreSQL 18 to ensure sub-millisecond query latency across thousands of records without projection distortions?
- **Domain Modeling of Doctor Coordinates (Option A vs. Option B):** Should doctors store independent `location` coordinates on the `doctors` table (Option B), or inherit geographic coordinates directly from their affiliated clinic (`clinics.location` via `doctors.clinic_id`, Option A)?
- **Local Testing Sandbox:** How to maintain zero-dependency local test execution (e.g. SQLite `:memory:`) while production relies on native PostgreSQL PostGIS extension functions (`ST_DWithin`, `ST_Distance`)?
- **Client Resilience & Algerian Specifics:** Handling mobile GPS permission denial, coordinate axis inversion (`lat, lon` vs `lon, lat`), coordinate jitter, and Algerian domestic bounding box constraints (18.0°N - 38.0°N, 9.0°W - 12.0°E).

---

## 2. Decision Matrix: Doctor Location Modeling

| Evaluation Dimension | Option A: Inherited via `clinics.clinic_id` (SELECTED) | Option B: Denormalized `doctors.location` |
| :--- | :--- | :--- |
| **Data Normalization & Integrity** | **High (3NF):** Single spatial source of truth on `clinics`. Zero synchronization drift if a clinic updates its address. | **Low:** Redundant coordinates stored across both tables. Risk of doctor coordinates diverging from clinic. |
| **Algerian Regulatory Alignment** | **Strict Compliance:** Algerian health law (Loi de Santé 18-11) mandates private doctors practice within accredited medical facilities (Cabinet, Polyclinique, or Clinique Médico-chirurgicale). | **Loose:** Allows floating coordinates without an accredited physical facility. |
| **Administrative Maintenance** | **Minimal:** Clinic administrative staff set GPS coordinates once. All attached doctors automatically inherit the location. | **High:** Each onboarding doctor must register and maintain individual coordinates. |
| **Index & Storage Overhead** | **Optimized:** Single GiST index on `clinics(location)`. `doctors` table remains lean. | **Heavy:** Requires separate GiST index on `doctors(location)` plus disk storage for spatial points. |
| **Query Performance** | **Fast (< 2ms):** Doctor query performs `INNER JOIN clinics ON clinics.id = doctors.clinic_id` on indexed UUID PK, filtered by clinic GiST index. | **Fast (< 1.5ms):** Direct spatial scan on `doctors` table without join. |

### Decision Outcome
**Adopt Option A:** Doctors inherit spatial coordinates via their foreign key relationship `doctors.clinic_id -> clinics.id`. The single spatial source of truth resides on the `clinics` table.

---

## 3. Spatial Technical Design (PostgreSQL / PostGIS)

### 3.1 Spatial Data Type: `geography(Point, 4326)` vs `geometry`
- **Choice:** `geography(Point, 4326)`.
- **Reasoning:**
  - EPSG:4326 represents spherical coordinates (latitude/longitude on the WGS 84 ellipsoid).
  - The `geography` type computes all metric calculations (`ST_DWithin`, `ST_Distance`) directly in **meters** without requiring coordinate projection to UTM zones.
  - Algeria spans multiple UTM zones (Zone 31N and Zone 32N). Using `geometry` would introduce projection distortions or require multi-zone coordinate transformation pipelines. `geography` eliminates this complexity.

### 3.2 Spatial Indexing: Generalized Search Tree (GiST)
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE INDEX clinics_location_gist ON clinics USING GIST(location);
```
- GiST indexes bounding boxes (R-tree) of geometries/geographies, reducing bounding-radius searches from O(N) full table scans to O(log N) tree traversals.

### 3.3 Two-Phase Spatial Querying Strategy
Spatial discovery executes in two coordinated phases inside a single SQL query:
1. **Phase 1 — Bounding Filter (`ST_DWithin`):**  
   Uses the GiST spatial index to filter records located within a geodesic radius (meters).
2. **Phase 2 — Exact Distance Projection (`ST_Distance`):**  
   Computes exact geodesic distance on the ellipsoid between the origin point and each candidate clinic, aliasing as `distance_meters`, followed by `ORDER BY distance_meters ASC`.

```sql
SELECT 
    clinics.*,
    ST_Distance(
        clinics.location, 
        ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
    ) AS distance_meters
FROM clinics
WHERE clinics.deleted_at IS NULL
  AND clinics.is_active = true
  AND clinics.location IS NOT NULL
  AND ST_DWithin(
        clinics.location, 
        ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, 
        :radius_meters
  )
ORDER BY distance_meters ASC;
```

---

## 4. Laravel 11 Database Migration Specification

### Migration: `database/migrations/2026_10_20_000011_add_geolocation_to_clinics_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('CREATE EXTENSION IF NOT EXISTS postgis;');

            Schema::table('clinics', function (Blueprint $table) {
                // PostGIS geography point (WGS 84, EPSG:4326)
                $table->geography('location', subtype: 'point', srid: 4326)->nullable();
                $table->unsignedSmallInteger('wilaya_code')->nullable()->index();
                $table->string('city', 100)->nullable()->index();
                $table->string('commune', 100)->nullable();
                $table->spatialIndex('location');
            });
        } else {
            // Testing fallback (SQLite :memory:)
            Schema::table('clinics', function (Blueprint $table) {
                $table->text('location')->nullable();
                $table->unsignedSmallInteger('wilaya_code')->nullable()->index();
                $table->string('city', 100)->nullable()->index();
                $table->string('commune', 100)->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getDriverName();

        Schema::table('clinics', function (Blueprint $table) use ($driver) {
            if ($driver === 'pgsql') {
                $table->dropSpatialIndex(['location']);
            }
            $table->dropColumn(['location', 'wilaya_code', 'city', 'commune']);
        });
    }
};
```

---

## 5. Eloquent Scope Design

### 5.1 `Clinic::scopeWithinDistance()`

```php
/**
 * Scope query to clinics within radiusInMeters using PostGIS ST_DWithin and order by distance.
 */
public function scopeWithinDistance(Builder $query, float $latitude, float $longitude, float $radiusInMeters): Builder
{
    $driver = DB::getDriverName();

    if ($driver === 'pgsql') {
        $pointSql = 'ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography';

        return $query->whereNotNull('location')
            ->whereRaw("ST_DWithin(location, {$pointSql}, ?)", [$longitude, $latitude, $radiusInMeters])
            ->selectRaw("clinics.*, ST_Distance(location, {$pointSql}) as distance_meters", [$longitude, $latitude])
            ->orderBy('distance_meters', 'asc');
    }

    // SQLite Haversine UDF fallback for local Pest/PHPUnit tests
    return $this->scopeSqliteDistanceFallback($query, $latitude, $longitude, $radiusInMeters);
}
```

### 5.2 `Doctor::scopeWithinDistance()` (Inheriting via `clinics`)

```php
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
```

---

## 6. Laravel FormRequest Validation Rules

```php
namespace App\Http\Requests\Clinic;

use Illuminate\Foundation\Http\FormRequest;

class NearbyClinicsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'latitude' => ['required_without:city', 'nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['required_without:city', 'nullable', 'numeric', 'between:-180,180'],
            'radius_km' => ['nullable', 'numeric', 'between:1,100'],
            'city' => ['nullable', 'string', 'max:100'],
            'wilaya_code' => ['nullable', 'integer', 'between:1,58'],
            'specialty_id' => ['nullable', 'uuid', 'exists:specialties,id'],
            'search' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'between:1,50'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $merges = [];

        if ($this->has('radius_km') && is_numeric($this->input('radius_km'))) {
            $merges['radius_km'] = (float) $this->input('radius_km');
        }

        if ($this->filled('latitude') && is_numeric($this->input('latitude'))) {
            $merges['latitude'] = round((float) $this->input('latitude'), 5);
        }

        if ($this->filled('longitude') && is_numeric($this->input('longitude'))) {
            $merges['longitude'] = round((float) $this->input('longitude'), 5);
        }

        if (!empty($merges)) {
            $this->merge($merges);
        }
    }
}
```

Doctor requests extend this with `specialty_slug` (`nullable|string|max:50`) and `date` (`nullable|date_format:Y-m-d`).

---

## 7. Next.js 14 Frontend Integration Architecture

1. **`useGeolocation.ts` Hook:** Wraps `navigator.geolocation.getCurrentPosition()`. Captures GPS state (`granted`, `denied`, `prompt`), catches error code 1 (`PERMISSION_DENIED`) to fallback to Algiers (36.7538, 3.0588), and detects coarse accuracy (`accuracy > 5000m`) to alert users.
2. **TanStack Query Caching:** Keys bucketed to 4 decimal places (`~11m`) to eliminate jitter-induced refetches. `staleTime: 5 min`, `gcTime: 15 min`.
3. **Proximity Badges:** Color-coded distance pills (`< 1 km` emerald in meters, `1-10 km` teal, `> 10 km` neutral).
4. **Emergency Triage Banner:** When no clinics are within 50 km, provides direct Algerian emergency hotlines: Protection Civile (`14`), SAMU (`1021`), Police Secours (`1548`).
