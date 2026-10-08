<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookAppointmentRequest;
use App\Http\Requests\CancelAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AppointmentController extends Controller
{
    public function __construct(
        protected AppointmentService $appointmentService
    ) {}

    public function store(BookAppointmentRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $payload['patient_id'] = $request->user()->id;

        $appointment = $this->appointmentService->bookAppointment($payload);

        return response()->json([
            'data' => new AppointmentResource($appointment->load(['doctor.specialty', 'patient'])),
            'meta' => [
                'message' => 'Appointment booked successfully.',
            ],
        ], Response::HTTP_CREATED);
    }

    public function show(string $id): JsonResponse
    {
        $appointment = $this->appointmentService->getAppointment($id);
        if (! $appointment) {
            return response()->json([
                'errors' => [
                    [
                        'status' => '404',
                        'title' => 'Not Found',
                        'detail' => 'Appointment not found.',
                    ],
                ],
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'data' => new AppointmentResource($appointment),
        ]);
    }

    public function cancel(string $id, CancelAppointmentRequest $request): JsonResponse
    {
        $user = $request->user();
        $cancelledBy = 'patient';

        if ($user instanceof \App\Models\Doctor) {
            $cancelledBy = 'doctor';
        } elseif ($user instanceof \App\Models\Admin) {
            $cancelledBy = 'admin';
        }

        $success = $this->appointmentService->cancelAppointment(
            $id,
            $request->validated('reason'),
            $cancelledBy
        );

        if (! $success) {
            return response()->json([
                'errors' => [
                    [
                        'status' => '404',
                        'title' => 'Not Found',
                        'detail' => 'Appointment not found or could not be cancelled.',
                    ],
                ],
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'data' => [
                'success' => true,
            ],
            'meta' => [
                'message' => 'Appointment cancelled successfully.',
            ],
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $patientId = $request->user()->id;
        $history = $this->appointmentService->getPatientClinicHistory($patientId);

        return response()->json([
            'data' => AppointmentResource::collection($history),
            'meta' => [
                'has_visited_before' => $history->isNotEmpty(),
                'total_past_visits' => $history->count(),
            ],
        ]);
    }
}
