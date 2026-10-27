<?php

namespace App\Http\Requests\Clinic;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class NearbyClinicsRequest extends FormRequest
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
            'latitude' => ['required_without:city', 'nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['required_without:city', 'nullable', 'numeric', 'between:-180,180'],
            'radius_km' => ['nullable', 'numeric', 'min:0.1', 'max:500'],
            'city' => ['nullable', 'string', 'max:100'],
            'wilaya_code' => ['nullable', 'integer', 'between:1,58'],
            'search' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }

    /**
     * Prepare inputs with defaults.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('radius_km') && is_numeric($this->input('radius_km'))) {
            $this->merge([
                'radius_km' => (float) $this->input('radius_km'),
            ]);
        }
    }
}
