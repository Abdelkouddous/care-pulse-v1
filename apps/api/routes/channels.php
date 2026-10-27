<?php

use App\Models\Admin;
use App\Models\Doctor;
use Illuminate\Support\Facades\Broadcast;

Broadcast::routes(['middleware' => ['auth:sanctum'], 'prefix' => 'api']);

Broadcast::channel('doctor.{doctorId}', function ($user, string $doctorId): bool {
    return ($user instanceof Doctor) && (string) $user->id === (string) $doctorId;
});

Broadcast::channel('patient.{patientId}', function ($user, string $patientId): bool {
    return (string) $user->id === (string) $patientId;
});

Broadcast::channel('clinic.{clinicId}', function ($user, string $clinicId): bool {
    if ($user instanceof Admin) {
        return (string) $user->clinic_id === (string) $clinicId || $user->clinic_id === null;
    }
    if ($user instanceof Doctor) {
        return (string) $user->clinic_id === (string) $clinicId;
    }

    return false;
});
