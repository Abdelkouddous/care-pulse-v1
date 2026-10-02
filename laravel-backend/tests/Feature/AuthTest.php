<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

test('patient can self register with valid data', function () {
    $payload = [
        'first_name' => 'Amine',
        'last_name' => 'Kaci',
        'email' => 'amine@test.com',
        'password' => 'secret1234',
        'phone' => '+213550123456',
        'gender' => 'male',
    ];

    $response = $this->postJson('/api/v1/auth/register', $payload);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'data' => [
                'token',
                'user' => ['id', 'email', 'name'],
                'role',
            ],
            'meta',
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'amine@test.com',
    ]);
});

test('patient can login with correct credentials and receives token', function () {
    $user = User::create([
        'id' => (string) Str::uuid(),
        'first_name' => 'Karim',
        'last_name' => 'Bensaad',
        'email' => 'karim@test.com',
        'password' => Hash::make('secret1234'),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'karim@test.com',
        'password' => 'secret1234',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => ['token', 'user', 'role'],
        ]);
});

test('login fails with 422 when invalid credentials provided', function () {
    User::create([
        'id' => (string) Str::uuid(),
        'first_name' => 'Karim',
        'last_name' => 'Bensaad',
        'email' => 'karim@test.com',
        'password' => Hash::make('secret1234'),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'karim@test.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});
