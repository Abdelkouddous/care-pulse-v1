<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClinicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'phone' => $this->phone,
            'email' => $this->email,
            'timezone' => $this->timezone,
            'logo_url' => $this->logo_url,
            'is_active' => (bool) $this->is_active,
            'city' => $this->city,
            'wilaya_code' => $this->wilaya_code,
            'commune' => $this->commune,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'distance_meters' => isset($this->distance_meters) ? round((float) $this->distance_meters, 1) : null,
            'distance_km' => $this->distance_km,
            'doctors_count' => $this->whenCounted('doctors'),
            'doctors' => $this->whenLoaded('doctors', fn () => $this->doctors->map(fn ($doc) => [
                'id' => $doc->id,
                'name' => "Dr. {$doc->first_name} {$doc->last_name}",
                'specialty' => $doc->specialty?->name,
                'phone' => $doc->phone,
                'avatar_url' => $doc->avatar_url,
                'consultation_fee_cents' => $doc->consultation_fee_cents,
            ])),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
