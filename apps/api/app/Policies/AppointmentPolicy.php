<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Contracts\Auth\Authenticatable;

class AppointmentPolicy
{
    /**
     * Determine whether the user can view the appointment.
     */
    public function view(Authenticatable $user, Appointment $appointment): bool
    {
        if ($user instanceof Admin) {
            return $user->clinic_id === null || (string) $user->clinic_id === (string) $appointment->clinic_id;
        }

        if ($user instanceof Doctor) {
            return (string) $user->id === (string) $appointment->doctor_id;
        }

        return (string) $user->id === (string) $appointment->patient_id;
    }

    /**
     * Determine whether the user can cancel the appointment.
     */
    public function cancel(Authenticatable $user, Appointment $appointment): bool
    {
        if ($user instanceof Admin) {
            return $user->clinic_id === null || (string) $user->clinic_id === (string) $appointment->clinic_id;
        }

        if ($user instanceof Doctor) {
            return (string) $user->id === (string) $appointment->doctor_id;
        }

        return (string) $user->id === (string) $appointment->patient_id;
    }

    /**
     * Determine whether the user can update the appointment status.
     */
    public function updateStatus(Authenticatable $user, Appointment $appointment): bool
    {
        if ($user instanceof Admin) {
            return $user->clinic_id === null || (string) $user->clinic_id === (string) $appointment->clinic_id;
        }

        if ($user instanceof Doctor) {
            return (string) $user->id === (string) $appointment->doctor_id;
        }

        return false;
    }
}
