<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAppointmentStatusRequest;
use App\Http\Resources\AppointmentResource;
use App\Http\Resources\DoctorResource;
use App\Services\AppointmentService;
use App\Services\DoctorService;
use App\Services\SlotAvailabilityService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DoctorController extends Controller
{
    public function __construct(
        protected DoctorService $doctorService,
        protected SlotAvailabilityService $slotService,
        protected AppointmentService $appointmentService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['specialty_id', 'search']);
        $perPage = (int) $request->input('per_page', 12);

        $doctors = $this->doctorService->getActiveDoctors($filters, $perPage);

        return response()->json([
            'data' => DoctorResource::collection($doctors->items()),
            'meta' => [
                'current_page' => $doctors->currentPage(),
                'last_page' => $doctors->lastPage(),
                'total' => $doctors->total(),
                'per_page' => $doctors->perPage(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $doctor = $this->doctorService->getDoctorById($id);
        if (! $doctor) {
            return response()->json([
                'errors' => [
                    [
                        'status' => '404',
                        'title' => 'Not Found',
                        'detail' => 'Doctor not found.',
                    ],
                ],
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'data' => new DoctorResource($doctor),
        ]);
    }

    public function slots(string $id, Request $request): JsonResponse
    {
        $dateStr = $request->input('date', Carbon::today()->toDateString());
        $date = Carbon::parse($dateStr);

        $slots = $this->slotService->getAvailableSlots($id, $date);

        return response()->json([
            'data' => [
                'doctor_id' => $id,
                'date' => $date->toDateString(),
                'slots' => $slots,
            ],
        ]);
    }

    public function myAppointments(Request $request): JsonResponse
    {
        $doctor = $request->user();
        $appointments = $doctor->appointments()->with(['patient'])->orderBy('scheduled_at', 'asc')->get();

        return response()->json([
            'data' => AppointmentResource::collection($appointments),
        ]);
    }

    public function updateAppointmentStatus(string $id, UpdateAppointmentStatusRequest $request): JsonResponse
    {
        $updated = $this->appointmentService->cancelAppointment(
            $id,
            $request->validated('reason') ?? 'Status updated by doctor',
            'doctor'
        );

        return response()->json([
            'data' => [
                'success' => $updated,
            ],
            'meta' => [
                'message' => 'Appointment status updated.',
            ],
        ]);
    }
}
