<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAppointmentStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:pending,scheduled,in_consultation,completed,cancelled,no_show'],
            'reason' => ['nullable', 'string', 'max:500'],
        ];
    }
}
