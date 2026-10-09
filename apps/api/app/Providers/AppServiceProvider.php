<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->scoped(\App\Services\TenantContext::class, fn () => new \App\Services\TenantContext());

        $this->app->bind(
            \App\Repositories\Contracts\IAppointmentRepository::class,
            \App\Repositories\Eloquent\EloquentAppointmentRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\IDoctorRepository::class,
            \App\Repositories\Eloquent\EloquentDoctorRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\IPatientRepository::class,
            \App\Repositories\Eloquent\EloquentPatientRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\ISpecialtyRepository::class,
            \App\Repositories\Eloquent\EloquentSpecialtyRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\IAdminRepository::class,
            \App\Repositories\Eloquent\EloquentAdminRepository::class
        );
        $this->app->bind(\App\Services\Contracts\IWhatsAppGateway::class, function () {
            $driver = config('services.whatsapp.driver', 'log');
            if ($driver === 'twilio') {
                return new \App\Services\WhatsApp\TwilioWhatsAppGateway();
            }
            return new \App\Services\WhatsApp\LogWhatsAppGateway();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
