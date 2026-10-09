<?php

namespace App\Services;

use App\Models\Clinic;

class TenantContext
{
    protected ?Clinic $clinic = null;

    /**
     * Set active clinic tenant for this request.
     */
    public function setTenant(Clinic $clinic): void
    {
        $this->clinic = $clinic;
    }

    /**
     * Get active clinic model.
     */
    public function getTenant(): ?Clinic
    {
        return $this->clinic;
    }

    /**
     * Get active clinic UUID.
     */
    public function getTenantId(): ?string
    {
        return $this->clinic?->id;
    }

    /**
     * Check if tenant is resolved.
     */
    public function hasTenant(): bool
    {
        return $this->clinic !== null;
    }
}
