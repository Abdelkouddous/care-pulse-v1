<?php

namespace App\Http\Requests\Clinic;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateClinicLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'city' => ['nullable', 'string', 'max:100'],
            'wilaya_code' => ['nullable', 'integer', 'between:1,58'],
            'commune' => ['nullable', 'string', 'max:100'],
        ];
    }
}
