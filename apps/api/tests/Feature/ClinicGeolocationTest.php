<?php

use App\Models\Admin;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\Specialty;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

uses(RefreshDatabase::class);

beforeEach(function () {
    /** @var TestCase $this */

    // 1. Specialty
    $this->specialty = Specialty::create([
        'id' => (string) Str::uuid(),
        'name' => 'General Medicine',
    ]);

    // 2. Algiers Clinic 1 (Center)
    $this->algiersCenter = Clinic::create([
        'id' => (string) Str::uuid(),
        'name' => 'Wateen Medical Center - Alger Centre',
        'email' => 'alger.centre@wateensoft.com',
        'address' => '12 Rue Didouche Mourad, Alger',
        'city' => 'Algiers',
        'wilaya_code' => 16,
        'commune' => 'Alger Centre',
        'location' => Clinic::buildPointHex(36.7538, 3.0588),
        'is_active' => true,
    ]);

    // 3. Algiers Clinic 2 (Hydra: ~1.8 km from Center)
    $this->algiersHydra = Clinic::create([
        'id' => (string) Str::uuid(),
        'name' => 'Clinique Médico-Chirurgicale Hydra',
        'email' => 'hydra@wateensoft.com',
        'address' => '24 Boulevard Sidi Yahia, Hydra, Alger',
        'city' => 'Algiers',
        'wilaya_code' => 16,
        'commune' => 'Hydra',
        'location' => Clinic::buildPointHex(36.7441, 3.0420),
        'is_active' => true,
    ]);

    // 4. Tébessa Clinic 1 (Centre: ~480 km from Algiers)
    $this->tebessaCenter = Clinic::create([
        'id' => (string) Str::uuid(),
        'name' => 'Wateen Polyclinique Tébessa Centre',
        'email' => 'tebessa.centre@wateensoft.com',
        'address' => 'Avenue de la Paix, Tébessa Centre',
        'city' => 'Tébessa',
        'wilaya_code' => 12,
        'commune' => 'Tébessa',
        'location' => Clinic::buildPointHex(35.4042, 8.1242),
        'is_active' => true,
    ]);

    // 5. Tébessa Clinic 2 (El Mountazah: ~1.7 km from Tebessa Centre)
    $this->tebessaMountazah = Clinic::create([
        'id' => (string) Str::uuid(),
        'name' => 'Centre Médical El Mountazah Tébessa',
        'email' => 'mountazah.tebessa@vitalbook.com',
        'address' => 'Boulevard Houari Boumediene, El Mountazah, Tébessa',
        'city' => 'Tébessa',
        'wilaya_code' => 12,
        'commune' => 'Tébessa',
        'location' => Clinic::buildPointHex(35.4180, 8.1150),
        'is_active' => true,
    ]);

    // 6. Admin
    $this->admin = Admin::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->algiersCenter->id,
        'name' => 'Dr. Aymen Hamel',
        'email' => 'admin@vitalbook.com',
        'password' => bcrypt('password'),
        'role' => 'super_admin',
    ]);
});

test('public client can retrieve target cities metadata with Algiers and Tébessa clusters', function () {
    /** @var TestCase $this */
    $response = $this->getJson('/api/v1/clinics/cities');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'slug',
                    'name',
                    'arabic_name',
                    'wilaya_code',
                    'latitude',
                    'longitude',
                    'default_radius_km',
                    'clinics_count',
                ],
            ],
        ]);

    $data = $response->json('data');
    expect($data)->toHaveCount(2);

    $algiers = collect($data)->firstWhere('slug', 'algiers');
    expect($algiers['name'])->toBe('Algiers')
        ->and($algiers['wilaya_code'])->toBe(16)
        ->and($algiers['clinics_count'])->toBe(2);

    $tebessa = collect($data)->firstWhere('slug', 'tebessa');
    expect($tebessa['name'])->toBe('Tébessa')
        ->and($tebessa['wilaya_code'])->toBe(12)
        ->and($tebessa['clinics_count'])->toBe(2);
});

test('searching nearby Algiers returns Algiers clinics ordered by distance and excludes Tébessa', function () {
    /** @var TestCase $this */
    // Search coordinates: Didouche Mourad, Algiers (36.7538, 3.0588) with radius 10 km
    $response = $this->getJson('/api/v1/clinics/nearby?latitude=36.7538&longitude=3.0588&radius_km=10');

    $response->assertStatus(200);

    $items = $response->json('data');
    expect($items)->toHaveCount(2);

    // Closest should be Alger Centre (~0 meters)
    expect($items[0]['name'])->toBe('Wateen Medical Center - Alger Centre');
    expect($items[0]['distance_km'])->toBeLessThan(0.1);

    // Second should be Hydra (~1.8 km)
    expect($items[1]['name'])->toBe('Clinique Médico-Chirurgicale Hydra');
    expect($items[1]['distance_km'])->toBeGreaterThan(1.0);
    expect($items[1]['distance_km'])->toBeLessThan(3.0);

    // Ensure Tébessa is nowhere in the 10km Algiers results
    $names = collect($items)->pluck('name');
    expect($names)->not->toContain('Wateen Polyclinique Tébessa Centre');
});

test('searching nearby Tébessa returns Tébessa clinics ordered by distance and excludes Algiers', function () {
    /** @var TestCase $this */
    // Search coordinates: Tébessa Centre (35.4042, 8.1242) with radius 10 km
    $response = $this->getJson('/api/v1/clinics/nearby?latitude=35.4042&longitude=8.1242&radius_km=10');

    $response->assertStatus(200);

    $items = $response->json('data');
    expect($items)->toHaveCount(2);

    // Closest is Tébessa Centre
    expect($items[0]['name'])->toBe('Wateen Polyclinique Tébessa Centre');
    expect($items[0]['distance_km'])->toBeLessThan(0.1);

    // Second is El Mountazah
    expect($items[1]['name'])->toBe('Centre Médical El Mountazah Tébessa');
    expect($items[1]['distance_km'])->toBeGreaterThan(1.0);

    // Ensure Algiers is excluded
    $names = collect($items)->pluck('name');
    expect($names)->not->toContain('Wateen Medical Center - Alger Centre');
});

test('searching nearby with city anchor fallback resolves coordinates automatically', function () {
    /** @var TestCase $this */
    $response = $this->getJson('/api/v1/clinics/nearby?city=tebessa');

    $response->assertStatus(200);
    $items = $response->json('data');

    expect($items)->toHaveCount(2);
    expect($items[0]['city'])->toBe('Tébessa');
});

test('public client can view a specific clinic with coordinates', function () {
    /** @var TestCase $this */
    $response = $this->getJson("/api/v1/clinics/{$this->algiersCenter->id}");

    $response->assertStatus(200)
        ->assertJsonPath('data.name', 'Wateen Medical Center - Alger Centre')
        ->assertJsonPath('data.city', 'Algiers')
        ->assertJsonPath('data.wilaya_code', 16)
        ->assertJsonPath('data.latitude', 36.7538)
        ->assertJsonPath('data.longitude', 3.0588);
});

test('admin can update clinic geographic coordinates and metadata', function () {
    /** @var TestCase $this */
    Sanctum::actingAs($this->admin);

    $newCoords = [
        'latitude' => 36.7600,
        'longitude' => 3.0600,
        'city' => 'Algiers',
        'wilaya_code' => 16,
        'commune' => 'Bab El Oued',
    ];

    $response = $this->putJson("/api/v1/admin/clinics/{$this->algiersCenter->id}/location", $newCoords);

    $response->assertStatus(200)
        ->assertJsonPath('data.latitude', 36.7600)
        ->assertJsonPath('data.longitude', 3.0600)
        ->assertJsonPath('data.commune', 'Bab El Oued');
});

test('validation rejects invalid geographic coordinates out of range', function () {
    /** @var TestCase $this */
    $response = $this->getJson('/api/v1/clinics/nearby?latitude=150.0&longitude=250.0');

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['latitude', 'longitude']);
});

test('Clinic withinDistance scope filters and orders clinics by distance', function () {
    $results = Clinic::withinDistance(36.7538, 3.0588, 5000)->get();

    expect($results)->toHaveCount(2)
        ->and($results[0]->name)->toBe('Wateen Medical Center - Alger Centre')
        ->and($results[1]->name)->toBe('Clinique Médico-Chirurgicale Hydra');
});

test('Doctor withinDistance scope inherits clinic geolocation and filters accurately', function () {
    $docAlgiers = Doctor::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->algiersCenter->id,
        'specialty_id' => $this->specialty->id,
        'first_name' => 'Amine',
        'last_name' => 'Mansouri',
        'email' => 'amine.test@vitalbook.com',
        'password' => bcrypt('password'),
        'phone' => '+213 550 11 22 33',
        'license_number' => 'DZ-MSPRH-16-10492',
        'is_active' => true,
    ]);

    $docTebessa = Doctor::create([
        'id' => (string) Str::uuid(),
        'clinic_id' => $this->tebessaCenter->id,
        'specialty_id' => $this->specialty->id,
        'first_name' => 'Sofiane',
        'last_name' => 'Brahimi',
        'email' => 'sofiane.test@vitalbook.com',
        'password' => bcrypt('password'),
        'phone' => '+213 550 33 44 55',
        'license_number' => 'DZ-MSPRH-12-30114',
        'is_active' => true,
    ]);

    // Query within 10 km of Algiers Centre
    $results = Doctor::withoutGlobalScopes()->withinDistance(36.7538, 3.0588, 10000)->get();

    expect($results)->toHaveCount(1)
        ->and($results[0]->id)->toBe($docAlgiers->id)
        ->and($results[0]->first_name)->toBe('Amine')
        ->and($results[0]->distance_km)->toBeLessThan(0.1);

    // Query within 10 km of Tébessa Centre
    $resultsTebessa = Doctor::withoutGlobalScopes()->withinDistance(35.4042, 8.1242, 10000)->get();

    expect($resultsTebessa)->toHaveCount(1)
        ->and($resultsTebessa[0]->id)->toBe($docTebessa->id)
        ->and($resultsTebessa[0]->first_name)->toBe('Sofiane')
        ->and($resultsTebessa[0]->distance_km)->toBeLessThan(0.1);
});
