<?php

namespace App\Models\Concerns;

use App\Services\TenantContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $tenantContext = app(TenantContext::class);

        if ($tenantContext->hasTenant()) {
            $builder->where($model->getTable() . '.clinic_id', $tenantContext->getTenantId());
        }
    }
}

trait BelongsToTenant
{
    public static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope);

        static::creating(function (Model $model) {
            $tenantContext = app(TenantContext::class);
            if ($tenantContext->hasTenant() && empty($model->clinic_id)) {
                $model->clinic_id = $tenantContext->getTenantId();
            }
        });
    }

    public function clinic()
    {
        return $this->belongsTo(\App\Models\Clinic::class, 'clinic_id');
    }
}
