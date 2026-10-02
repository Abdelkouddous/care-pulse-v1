<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patient_id' => $this->patient_id,
            'doctor_id' => $this->doctor_id,
            'clinic_id' => $this->clinic_id,
            'scheduled_at' => $this->scheduled_at?->toIso8601String(),
            'status' => $this->status,
            'reason' => $this->reason,
            'notes' => $this->notes,
            'cancellation_reason' => $this->cancellation_reason,
            'cancelled_by' => $this->cancelled_by,
            'consultation_fee_cents' => (int) $this->consultation_fee_cents,
            'patient' => new UserResource($this->whenLoaded('patient')),
            'doctor' => new DoctorResource($this->whenLoaded('doctor')),
            'clinic' => $this->whenLoaded('clinic'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
