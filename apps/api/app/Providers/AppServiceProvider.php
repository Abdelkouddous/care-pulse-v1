<?php

namespace App\Providers;

use App\Models\Appointment;
use App\Policies\AppointmentPolicy;
use App\Repositories\Contracts\IAdminRepository;
use App\Repositories\Contracts\IAppointmentRepository;
use App\Repositories\Contracts\IClinicRepository;
use App\Repositories\Contracts\IDoctorRepository;
use App\Repositories\Contracts\IPatientRepository;
use App\Repositories\Contracts\ISpecialtyRepository;
use App\Repositories\Eloquent\EloquentAdminRepository;
use App\Repositories\Eloquent\EloquentAppointmentRepository;
use App\Repositories\Eloquent\EloquentClinicRepository;
use App\Repositories\Eloquent\EloquentDoctorRepository;
use App\Repositories\Eloquent\EloquentPatientRepository;
use App\Repositories\Eloquent\EloquentSpecialtyRepository;
use App\Services\ClinicGeolocationService;
use App\Services\Contracts\IClinicGeolocationService;
use App\Services\Contracts\ISmsGateway;
use App\Services\Contracts\IWhatsAppGateway;
use App\Services\Sms\LogSmsGateway;
use App\Services\Sms\TwilioSmsGateway;
use App\Services\TenantContext;
use App\Services\WhatsApp\LogWhatsAppGateway;
use App\Services\WhatsApp\TwilioWhatsAppGateway;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->scoped(TenantContext::class, fn () => new TenantContext);

        $this->app->bind(
            IAppointmentRepository::class,
            EloquentAppointmentRepository::class
        );
        $this->app->bind(
            IDoctorRepository::class,
            EloquentDoctorRepository::class
        );
        $this->app->bind(
            IPatientRepository::class,
            EloquentPatientRepository::class
        );
        $this->app->bind(
            ISpecialtyRepository::class,
            EloquentSpecialtyRepository::class
        );
        $this->app->bind(
            IAdminRepository::class,
            EloquentAdminRepository::class
        );
        $this->app->bind(
            IClinicRepository::class,
            EloquentClinicRepository::class
        );
        $this->app->bind(
            IClinicGeolocationService::class,
            ClinicGeolocationService::class
        );
        $this->app->bind(IWhatsAppGateway::class, function () {
            $driver = config('services.whatsapp.driver', 'log');
            if ($driver === 'twilio') {
                return new TwilioWhatsAppGateway;
            }

            return new LogWhatsAppGateway;
        });

        $this->app->bind(ISmsGateway::class, function () {
            $driver = config('services.sms.driver', 'log');
            if ($driver === 'twilio') {
                return new TwilioSmsGateway;
            }

            return new LogSmsGateway;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Appointment::class, AppointmentPolicy::class);
    }
}
