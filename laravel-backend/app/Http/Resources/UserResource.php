<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'name' => $this->first_name . ' ' . $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'gender' => $this->gender,
            'address' => $this->address,
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_phone' => $this->emergency_contact_phone,
            'insurance_provider' => $this->insurance_provider,
            'insurance_policy_number' => $this->insurance_policy_number,
            'national_id_nin' => $this->national_id_nin,
            'carte_chifa_number' => $this->carte_chifa_number,
            'wilaya_code' => $this->wilaya_code,
            'blood_type' => $this->blood_type,
            'allergies' => $this->allergies,
            'current_medications' => $this->current_medications,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
