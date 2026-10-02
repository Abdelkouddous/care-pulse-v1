<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePatientProfileRequest;
use App\Http\Resources\AppointmentResource;
use App\Http\Resources\UserResource;
use App\Services\AppointmentService;
use App\Services\PatientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function __construct(
        protected PatientService $patientService,
        protected AppointmentService $appointmentService
    ) {}

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new UserResource($request->user()),
        ]);
    }

    public function update(UpdatePatientProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $this->patientService->updateProfile($user->id, $request->validated());

        return response()->json([
            'data' => new UserResource($this->patientService->getProfile($user->id)),
            'meta' => [
                'message' => 'Profile updated successfully.',
            ],
        ]);
    }

    public function appointments(Request $request): JsonResponse
    {
        $appointments = $this->appointmentService->getPatientAppointments($request->user()->id);

        return response()->json([
            'data' => AppointmentResource::collection($appointments),
        ]);
    }
}
