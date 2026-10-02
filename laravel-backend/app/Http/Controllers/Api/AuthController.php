<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterPatientRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(RegisterPatientRequest $request): JsonResponse
    {
        $result = $this->authService->registerPatient($request->validated());

        return response()->json([
            'data' => [
                'token' => $result['token'],
                'user' => new UserResource($result['user']),
                'role' => $result['role'],
            ],
            'meta' => [
                'message' => 'Registration successful.',
            ],
        ], Response::HTTP_CREATED);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->loginPatient(
            $request->validated('email'),
            $request->validated('password'),
            $request->ip()
        );

        return response()->json([
            'data' => [
                'token' => $result['token'],
                'user' => new UserResource($result['user']),
                'role' => $result['role'],
            ],
            'meta' => [
                'message' => 'Login successful.',
            ],
        ]);
    }

    public function doctorLogin(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->loginDoctor(
            $request->validated('email'),
            $request->validated('password'),
            $request->ip()
        );

        return response()->json([
            'data' => [
                'token' => $result['token'],
                'user' => $result['user'],
                'role' => $result['role'],
            ],
            'meta' => [
                'message' => 'Doctor login successful.',
            ],
        ]);
    }

    public function adminLogin(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->loginAdmin(
            $request->validated('email'),
            $request->validated('password'),
            $request->ip()
        );

        return response()->json([
            'data' => [
                'token' => $result['token'],
                'user' => $result['user'],
                'role' => $result['role'],
            ],
            'meta' => [
                'message' => 'Admin login successful.',
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'data' => null,
            'meta' => [
                'message' => 'Successfully logged out.',
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'user' => $user instanceof \App\Models\User ? new UserResource($user) : $user,
                'role' => $user instanceof \App\Models\User ? 'patient' : ($user instanceof \App\Models\Doctor ? 'doctor' : 'admin'),
            ],
        ]);
    }

    public function firebasePhone(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_token' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
        ]);

        $idToken = $validated['id_token'] ?? '';
        $fallbackPhone = $validated['phone'] ?? null;

        $result = $this->authService->verifyFirebasePhone($idToken, $fallbackPhone);

        if ($result['registered'] ?? false) {
            return response()->json([
                'data' => [
                    'registered' => true,
                    'token' => $result['token'],
                    'user' => new UserResource($result['user']),
                    'role' => $result['role'],
                ],
                'meta' => [
                    'message' => 'Phone authentication successful.',
                ],
            ]);
        }

        return response()->json([
            'data' => [
                'registered' => false,
                'phone' => $result['phone'],
                'onboarding_token' => $result['onboarding_token'],
            ],
            'meta' => [
                'message' => 'Phone verified. Please complete patient profile setup.',
            ],
        ]);
    }

    public function registerWizard(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'onboarding_token' => ['required', 'string'],
            'first_name' => ['required', 'string', 'min:2', 'max:100'],
            'last_name' => ['required', 'string', 'min:2', 'max:100'],
            'national_id_nin' => ['required', 'string', 'regex:/^\d{18}$/'],
            'carte_chifa_number' => ['nullable', 'string', 'regex:/^\d{10}$/'],
            'wilaya_code' => ['required', 'integer', 'min:1', 'max:58'],
            'blood_type' => ['nullable', 'string', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'date_of_birth' => ['required', 'date'],
            'gender' => ['required', 'in:male,female'],
            'address' => ['nullable', 'string', 'max:255'],
            'emergency_contact_name' => ['required', 'string', 'min:2', 'max:100'],
            'emergency_contact_phone' => ['required', 'string', 'min:8', 'max:25'],
            'email' => ['nullable', 'email'],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        $result = $this->authService->registerFromOnboardingWizard($validated);

        return response()->json([
            'data' => [
                'token' => $result['token'],
                'user' => new UserResource($result['user']),
                'role' => $result['role'],
            ],
            'meta' => [
                'message' => 'Profile setup complete. Welcome to CarePulse.',
            ],
        ], Response::HTTP_CREATED);
    }
}
