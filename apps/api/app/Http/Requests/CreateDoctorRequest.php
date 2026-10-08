<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateDoctorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:doctors,email'],
            'password' => ['nullable', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:30'],
            'specialty_id' => ['required', 'uuid', 'exists:specialties,id'],
            'clinic_id' => ['nullable', 'uuid', 'exists:clinics,id'],
            'bio' => ['nullable', 'string'],
            'avatar_url' => ['nullable', 'string', 'max:500'],
            'license_number' => ['required', 'string', 'max:100', 'unique:doctors,license_number'],
            // Strict Integer Money Guardrail
            'consultation_fee_cents' => ['required', 'integer', 'min:0'],
        ];
    }
}
