<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

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
        'wilaya_code',
        'city',
        'commune',
        'location',
    ];

    /**
     * Coordinate and proximity attributes exposed to JSON serializers.
     */
    protected $appends = [
        'latitude',
        'longitude',
        'distance_km',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'wilaya_code' => 'integer',
        ];
    }

    /**
     * Generate EWKB hex for coordinates (useful across drivers / tests).
     */
    public static function buildPointHex(float $latitude, float $longitude): string
    {
        $bin = pack('C', 1).pack('V', 0x20000001).pack('V', 4326).pack('d', $longitude).pack('d', $latitude);

        return strtoupper(bin2hex($bin));
    }

    /**
     * Parse binary EWKB hex geometry into [latitude, longitude].
     *
     * @return array{latitude: float, longitude: float}|null
     */
    public static function parsePointHex(?string $hex): ?array
    {
        if (empty($hex) || ! is_string($hex)) {
            return null;
        }

        $bin = @hex2bin($hex);
        if ($bin === false || strlen($bin) < 25) {
            return null;
        }

        // Standard EWKB 4326: 1-byte endian + 4-byte type + 4-byte SRID = 9-byte header
        $lon = unpack('d', substr($bin, 9, 8))[1] ?? null;
        $lat = unpack('d', substr($bin, 17, 8))[1] ?? null;

        if ($lon === null || $lat === null) {
            return null;
        }

        return [
            'latitude' => round((float) $lat, 7),
            'longitude' => round((float) $lon, 7),
        ];
    }

    /**
     * Extract latitude float from PostGIS geography point or query select alias.
     */
    protected function latitude(): Attribute
    {
        return Attribute::make(
            get: function ($value, array $attributes) {
                if (isset($attributes['latitude']) && is_numeric($attributes['latitude'])) {
                    return (float) $attributes['latitude'];
                }

                $coords = static::parsePointHex($attributes['location'] ?? null);

                return $coords ? $coords['latitude'] : null;
            }
        );
    }

    /**
     * Extract longitude float from PostGIS geography point or query select alias.
     */
    protected function longitude(): Attribute
    {
        return Attribute::make(
            get: function ($value, array $attributes) {
                if (isset($attributes['longitude']) && is_numeric($attributes['longitude'])) {
                    return (float) $attributes['longitude'];
                }

                $coords = static::parsePointHex($attributes['location'] ?? null);

                return $coords ? $coords['longitude'] : null;
            }
        );
    }

    /**
     * Derived distance in kilometers when distance_meters is selected by spatial queries.
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

    /**
     * Register SQLite Haversine and bounding functions for testing fallback.
     */
    public static function registerSqliteFunctions($pdo): void
    {
        if (! method_exists($pdo, 'sqliteCreateFunction')) {
            return;
        }

        static $registered = false;
        if (! $registered) {
            $pdo->sqliteCreateFunction('st_distance_sqlite', function ($locHex, $targetLng, $targetLat) {
                $coords = static::parsePointHex($locHex);
                if (! $coords) {
                    return 99999999.0;
                }
                $earthRadius = 6371000;
                $dLat = deg2rad($targetLat - $coords['latitude']);
                $dLon = deg2rad($targetLng - $coords['longitude']);
                $a = sin($dLat / 2) * sin($dLat / 2) + cos(deg2rad($coords['latitude'])) * cos(deg2rad($targetLat)) * sin($dLon / 2) * sin($dLon / 2);

                return $earthRadius * 2 * atan2(sqrt($a), sqrt(1 - $a));
            });

            $pdo->sqliteCreateFunction('st_dwithin_sqlite', function ($locHex, $targetLng, $targetLat, $radius) {
                $coords = static::parsePointHex($locHex);
                if (! $coords) {
                    return 0;
                }
                $earthRadius = 6371000;
                $dLat = deg2rad($targetLat - $coords['latitude']);
                $dLon = deg2rad($targetLng - $coords['longitude']);
                $a = sin($dLat / 2) * sin($dLat / 2) + cos(deg2rad($coords['latitude'])) * cos(deg2rad($targetLat)) * sin($dLon / 2) * sin($dLon / 2);
                $dist = $earthRadius * 2 * atan2(sqrt($a), sqrt(1 - $a));

                return $dist <= $radius ? 1 : 0;
            });

            $registered = true;
        }
    }

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

        // SQLite in-memory test driver fallback
        static::registerSqliteFunctions($query->getConnection()->getPdo());

        return $query->whereNotNull('location')
            ->whereRaw('st_dwithin_sqlite(location, ?, ?, ?) = 1', [$longitude, $latitude, $radiusInMeters])
            ->selectRaw('clinics.*, st_distance_sqlite(location, ?, ?) as distance_meters', [$longitude, $latitude])
            ->orderBy('distance_meters', 'asc');
    }

    /**
     * Alias for scopeWithinDistance.
     */
    public function scopeNearby(Builder $query, float $latitude, float $longitude, float $radiusInMeters): Builder
    {
        return $this->scopeWithinDistance($query, $latitude, $longitude, $radiusInMeters);
    }

    /**
     * Scope query by city name (case-insensitive).
     */
    public function scopeInCity(Builder $query, string $city): Builder
    {
        return $query->whereRaw('LOWER(city) = ?', [strtolower(trim($city))]);
    }

    /**
     * Scope query by Algerian Wilaya code (e.g. 16 for Algiers, 12 for Tébessa).
     */
    public function scopeInWilaya(Builder $query, int $wilayaCode): Builder
    {
        return $query->where('wilaya_code', $wilayaCode);
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
