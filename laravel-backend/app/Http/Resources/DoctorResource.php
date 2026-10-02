<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'clinic_id' => $this->clinic_id,
            'specialty_id' => $this->specialty_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'name' => 'Dr. ' . $this->first_name . ' ' . $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar_url' => $this->avatar_url,
            'bio' => $this->bio,
            // Strict Integer Money Guardrail: fee in cents
            'consultation_fee_cents' => (int) $this->consultation_fee_cents,
            'license_number' => $this->license_number,
            'is_active' => (bool) $this->is_active,
            'specialty' => new SpecialtyResource($this->whenLoaded('specialty')),
            'availabilities' => $this->whenLoaded('availabilities'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
