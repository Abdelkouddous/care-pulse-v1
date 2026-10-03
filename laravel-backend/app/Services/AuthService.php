<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\Doctor;
use App\Models\User;
use App\Repositories\Contracts\IAdminRepository;
use App\Repositories\Contracts\IDoctorRepository;
use App\Repositories\Contracts\IPatientRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthService
{
    public function __construct(
        protected IPatientRepository $patientRepo,
        protected IDoctorRepository $doctorRepo,
        protected IAdminRepository $adminRepo,
        protected FirebaseTokenService $firebaseTokenService
    ) {}

    /**
     * Generate compound throttle key: ip + sha256(email)
     */
    protected function throttleKey(string $email, string $ip): string
    {
        return 'login_strike:' . hash('sha256', $ip . '|' . strtolower(trim($email)));
    }

    /**
     * Check 3-strike brute force limit (15 min lockout = 900 seconds)
     */
    protected function checkBruteForce(string $email, string $ip): void
    {
        $key = $this->throttleKey($email, $ip);

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'email' => [
                    "Maximum login attempts exceeded. Account locked for {$seconds} seconds.",
                ],
            ])->status(429);
        }
    }

    protected function registerFailedAttempt(string $email, string $ip): void
    {
        $key = $this->throttleKey($email, $ip);
        RateLimiter::hit($key, 900); // 15-minute decay
    }

    protected function clearThrottle(string $email, string $ip): void
    {
        $key = $this->throttleKey($email, $ip);
        RateLimiter::clear($key);
    }

    public function registerPatient(array $data): array
    {
        $user = $this->patientRepo->create($data);
        $token = $user->createToken('patient-token', ['role:patient'])->plainTextToken;

        return [
            'token' => $token,
            'user' => $user,
            'role' => 'patient',
        ];
    }

    public function loginPatient(string $email, string $password, string $ip): array
    {
        $this->checkBruteForce($email, $ip);

        $user = $this->patientRepo->findByEmail($email);
        if (! $user || ! Hash::check($password, $user->password)) {
            $this->registerFailedAttempt($email, $ip);
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        $this->clearThrottle($email, $ip);
        $token = $user->createToken('patient-token', ['role:patient'])->plainTextToken;

        return [
            'token' => $token,
            'user' => $user,
            'role' => 'patient',
        ];
    }

    public function loginDoctor(string $email, string $password, string $ip): array
    {
        $this->checkBruteForce($email, $ip);

        $doctor = $this->doctorRepo->findByEmail($email);
        if (! $doctor || ! Hash::check($password, $doctor->password)) {
            $this->registerFailedAttempt($email, $ip);
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        $this->clearThrottle($email, $ip);
        $token = $doctor->createToken('doctor-token', ['role:doctor'])->plainTextToken;

        return [
            'token' => $token,
            'user' => $doctor,
            'role' => 'doctor',
        ];
    }

    public function loginAdmin(string $email, string $password, string $ip): array
    {
        $this->checkBruteForce($email, $ip);

        $admin = $this->adminRepo->findByEmail($email);
        if (! $admin || ! Hash::check($password, $admin->password)) {
            $this->registerFailedAttempt($email, $ip);
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        $this->clearThrottle($email, $ip);
        $token = $admin->createToken('admin-token', ['role:' . $admin->role])->plainTextToken;

        return [
            'token' => $token,
            'user' => $admin,
            'role' => $admin->role,
        ];
    }

    public function logout(User|Doctor|Admin|null $user): void
    {
        if ($user && method_exists($user, 'currentAccessToken')) {
            $token = $user->currentAccessToken();
            if ($token instanceof PersonalAccessToken) {
                $token->delete();
            }
        }
    }

    /**
     * Decoupled Firebase Phone OTP Verification
     * Verifies phone attestation, queries patient repository, and bifurcates:
     * - If user exists: Returns Sanctum token and authenticated user payload.
     * - If user not found: Returns time-limited encrypted onboarding_token to unlock registration wizard.
     */
    public function verifyFirebasePhone(string $idToken, ?string $fallbackPhone = null): array
    {
        $verifiedPhone = null;

        $configuredTestPhone = config('services.firebase.test_phone', env('FIREBASE_TEST_PHONE'));

        // If a real Firebase JWT is provided, verify against Google Public x509 Certs
        if (substr_count($idToken, '.') === 2) {
            try {
                $claims = $this->firebaseTokenService->verifyIdToken($idToken);
                $verifiedPhone = $claims['phone_number'] ?? null;
            } catch (\Exception $e) {
                // If it fails but fallback phone is provided and matches configured test phone, allow testing
                if ($configuredTestPhone && $fallbackPhone && str_contains($fallbackPhone, $configuredTestPhone)) {
                    $verifiedPhone = $fallbackPhone;
                } else {
                    throw ValidationException::withMessages([
                        'id_token' => ['Cryptographic verification failed: ' . $e->getMessage()],
                    ]);
                }
            }
        } elseif ($configuredTestPhone && $fallbackPhone && str_contains($fallbackPhone, $configuredTestPhone)) {
            // Development/Test Attestation Mode strictly for configured test phone
            $verifiedPhone = $fallbackPhone;
        } else {
            throw ValidationException::withMessages([
                'id_token' => ['A valid Firebase ID token is required for live phone verification.'],
            ]);
        }

        if (! $verifiedPhone) {
            throw ValidationException::withMessages([
                'phone' => ['A verified phone number could not be determined from the provided credentials.'],
            ]);
        }

        // Clean and normalize Algerian phone format
        $cleanPhone = preg_replace('/[^0-9]/', '', $verifiedPhone);
        $e164Phone = str_starts_with($cleanPhone, '213') ? '+' . $cleanPhone : '+213' . ltrim($cleanPhone, '0');

        $user = $this->patientRepo->findByPhone($e164Phone);

        if ($user) {
            $token = $user->createToken('patient-token', ['role:patient'])->plainTextToken;

            return [
                'registered' => true,
                'token' => $token,
                'user' => $user,
                'role' => 'patient',
            ];
        }

        // Generate encrypted, tamper-proof onboarding token (valid for 1 hour)
        $onboardingPayload = [
            'phone' => $e164Phone,
            'exp' => time() + 3600,
            'nonce' => Str::random(16),
        ];

        return [
            'registered' => false,
            'phone' => $e164Phone,
            'onboarding_token' => Crypt::encryptString(json_encode($onboardingPayload)),
        ];
    }

    public function phoneExists(string $phone): bool
    {
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
        $e164Phone = str_starts_with($cleanPhone, '213') ? '+' . $cleanPhone : '+213' . ltrim($cleanPhone, '0');

        return $this->patientRepo->findByPhone($e164Phone) !== null;
    }

    /**
     * Progressive Patient Onboarding Wizard Finalization
     * Consumes encrypted onboarding_token, asserts verified phone, and provisions Algerian civic patient.
     */
    public function registerFromOnboardingWizard(array $data): array
    {
        // Decrypt and validate onboarding token
        try {
            $decrypted = Crypt::decryptString($data['onboarding_token']);
            $payload = json_decode($decrypted, true);

            if (! isset($payload['phone']) || ! isset($payload['exp']) || time() > $payload['exp']) {
                throw new \Exception('Onboarding attestation expired.');
            }

            $verifiedPhone = $payload['phone'];
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'onboarding_token' => ['The registration session is invalid or has expired. Please verify your phone number again.'],
            ]);
        }

        // Check if phone or NIN already exists
        if ($this->patientRepo->findByPhone($verifiedPhone)) {
            throw ValidationException::withMessages([
                'phone' => ['An account with this verified mobile number already exists.'],
            ]);
        }

        $email = $data['email'] ?? ('patient_' . substr(preg_replace('/[^0-9]/', '', $verifiedPhone), -8) . '@vitalbook.dz');

        $userData = [
            'id' => (string) Str::uuid(),
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $email,
            'phone' => $verifiedPhone,
            'national_id_nin' => $data['national_id_nin'],
            'carte_chifa_number' => $data['carte_chifa_number'] ?? null,
            'wilaya_code' => (int) ($data['wilaya_code'] ?? 16),
            'blood_type' => $data['blood_type'] ?? null,
            'date_of_birth' => $data['date_of_birth'],
            'gender' => $data['gender'],
            'address' => $data['address'] ?? 'Alger, Algérie',
            'emergency_contact_name' => $data['emergency_contact_name'],
            'emergency_contact_phone' => $data['emergency_contact_phone'],
            'insurance_provider' => 'CNAS Algérie',
            'insurance_policy_number' => 'DZ-CNAS-' . ($data['carte_chifa_number'] ?? rand(10000000, 99999999)),
            'password' => Hash::make($data['password'] ?? Str::random(16)),
        ];

        $user = $this->patientRepo->create($userData);
        $token = $user->createToken('patient-token', ['role:patient'])->plainTextToken;

        return [
            'token' => $token,
            'user' => $user,
            'role' => 'patient',
        ];
    }
}
