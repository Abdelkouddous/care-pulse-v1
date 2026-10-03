<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\SpecialtyController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // -------------------------------------------------------------
    // Public Endpoints
    // -------------------------------------------------------------
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/doctor/login', [AuthController::class, 'doctorLogin']);
        Route::post('/admin/login', [AuthController::class, 'adminLogin']);
        Route::post('/firebase-phone', [AuthController::class, 'firebasePhone']);
        Route::post('/check-phone', [AuthController::class, 'checkPhone']);
        Route::post('/register-wizard', [AuthController::class, 'registerWizard']);
    });

    Route::get('/specialties', [SpecialtyController::class, 'index']);
    Route::get('/doctors', [DoctorController::class, 'index']);
    Route::get('/doctors/{id}', [DoctorController::class, 'show']);
    Route::get('/doctors/{id}/slots', [DoctorController::class, 'slots']);
    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);

    // -------------------------------------------------------------
    // Authenticated Common Routes (Sanctum)
    // -------------------------------------------------------------
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Patient Boundaries
        Route::prefix('patients')->group(function () {
            Route::get('/me', [PatientController::class, 'me']);
            Route::put('/me', [PatientController::class, 'update']);
            Route::get('/me/appointments', [PatientController::class, 'appointments']);
        });

        Route::post('/appointments', [AppointmentController::class, 'store']);
        Route::get('/appointments/history/clinic', [AppointmentController::class, 'history']);
        Route::put('/appointments/{id}/cancel', [AppointmentController::class, 'cancel']);

        // Doctor Boundaries
        Route::prefix('doctor-portal')->group(function () {
            Route::get('/appointments', [DoctorController::class, 'myAppointments']);
            Route::put('/appointments/{id}/status', [DoctorController::class, 'updateAppointmentStatus']);
        });

        // Admin Boundaries
        Route::prefix('admin')->group(function () {
            Route::get('/dashboard', [AdminController::class, 'dashboard']);
            Route::get('/appointments', [AdminController::class, 'appointments']);
            Route::put('/appointments/{id}/status', [AdminController::class, 'updateAppointmentStatus']);
            Route::get('/patients', [AdminController::class, 'patients']);
            Route::get('/doctors', [AdminController::class, 'doctors']);
            Route::post('/doctors', [AdminController::class, 'createDoctor']);
            Route::put('/doctors/{id}', [AdminController::class, 'updateDoctor']);
            Route::delete('/doctors/{id}', [AdminController::class, 'deleteDoctor']);
        });
    });
});
