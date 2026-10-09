<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateDoctorRequest;
use App\Http\Requests\UpdateAppointmentStatusRequest;
use App\Http\Resources\AppointmentResource;
use App\Http\Resources\DoctorResource;
use App\Http\Resources\UserResource;
use App\Services\AdminService;
use App\Services\AppointmentService;
use App\Services\DoctorService;
use App\Services\PatientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminController extends Controller
{
    public function __construct(
        protected AdminService $adminService,
        protected DoctorService $doctorService,
        protected PatientService $patientService,
        protected AppointmentService $appointmentService
    ) {}

    public function dashboard(): JsonResponse
    {
        $stats = $this->adminService->getDashboardStats();

        return response()->json([
            'data' => $stats,
        ]);
    }

    public function appointments(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'doctor_id', 'date']);
        $perPage = (int) $request->input('per_page', 15);

        $paginator = $this->adminService->getAppointments($filters, $perPage);

        return response()->json([
            'data' => AppointmentResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function updateAppointmentStatus(string $id, UpdateAppointmentStatusRequest $request): JsonResponse
    {
        $updated = $this->adminService->updateAppointmentStatus(
            $id,
            $request->validated('status')
        );

        return response()->json([
            'data' => [
                'success' => $updated,
            ],
            'meta' => [
                'message' => 'Status updated successfully.',
            ],
        ]);
    }

    public function patients(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $paginator = $this->patientService->getPaginated($perPage);

        return response()->json([
            'data' => UserResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function doctors(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $paginator = $this->doctorService->getActiveDoctors($request->all(), $perPage);

        return response()->json([
            'data' => DoctorResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function createDoctor(CreateDoctorRequest $request): JsonResponse
    {
        $doctor = $this->doctorService->createDoctor($request->validated());

        return response()->json([
            'data' => new DoctorResource($doctor),
            'meta' => [
                'message' => 'Doctor account created successfully.',
            ],
        ], Response::HTTP_CREATED);
    }

    public function updateDoctor(string $id, Request $request): JsonResponse
    {
        $updated = $this->doctorService->updateDoctor($id, $request->all());

        return response()->json([
            'data' => [
                'success' => $updated,
            ],
            'meta' => [
                'message' => 'Doctor updated successfully.',
            ],
        ]);
    }

    public function deleteDoctor(string $id): JsonResponse
    {
        $deleted = $this->doctorService->deleteDoctor($id);

        return response()->json([
            'data' => [
                'success' => $deleted,
            ],
            'meta' => [
                'message' => 'Doctor deactivated successfully.',
            ],
        ]);
    }

    /**
     * Receptionist manual WhatsApp interactive ping dispatch.
     */
    public function triggerWhatsAppPing(string $id): JsonResponse
    {
        $dispatched = $this->appointmentService->dispatchWhatsAppReminder($id);

        if (! $dispatched) {
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
            'data' => [
                'success' => true,
            ],
            'meta' => [
                'message' => 'WhatsApp interactive confirmation prompt dispatched to patient.',
            ],
        ]);
    }
}
