<?php

namespace App\Http\Middleware;

use App\Models\Clinic;
use App\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenantFromHeader
{
    public function __construct(
        protected TenantContext $tenantContext
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $clinicId = $request->header('X-Clinic-ID');

        // Check if user is authenticated and has an assigned clinic_id (staff)
        $user = $request->user();
        if ($user && isset($user->clinic_id) && $user->clinic_id) {
            if ($clinicId && $clinicId !== $user->clinic_id) {
                return response()->json([
                    'errors' => [
                        [
                            'status' => '403',
                            'title' => 'Forbidden',
                            'detail' => 'Cross-tenant access forbidden. Header does not match authenticated user clinic.',
                        ],
                    ],
                ], Response::HTTP_FORBIDDEN);
            }
            $clinicId = $user->clinic_id;
        }

        if ($clinicId) {
            if (! Str::isUuid($clinicId)) {
                return response()->json([
                    'errors' => [
                        [
                            'status' => '422',
                            'title' => 'Unprocessable Entity',
                            'detail' => 'Invalid X-Clinic-ID header: must be a valid UUIDv4.',
                        ],
                    ],
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $clinic = Clinic::find($clinicId);
            if (! $clinic || ! $clinic->is_active) {
                $fallback = Clinic::where('is_active', true)->first();
                if ($fallback) {
                    $clinic = $fallback;
                } else {
                    return response()->json([
                        'errors' => [
                            [
                                'status' => '404',
                                'title' => 'Not Found',
                                'detail' => 'Clinic not found or deactivated.',
                            ],
                        ],
                    ], Response::HTTP_NOT_FOUND);
                }
            }

            $this->tenantContext->setTenant($clinic);
        }

        return $next($request);
    }
}
