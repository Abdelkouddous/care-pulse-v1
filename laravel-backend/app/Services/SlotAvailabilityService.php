<?php

namespace App\Services;

use App\Models\Doctor;
use App\Repositories\Contracts\IAppointmentRepository;
use App\Repositories\Contracts\IDoctorRepository;
use Carbon\Carbon;
use Carbon\CarbonInterface;

class SlotAvailabilityService
{
    public function __construct(
        protected IDoctorRepository $doctorRepo,
        protected IAppointmentRepository $appointmentRepo
    ) {}

    /**
     * Generate available time slots for a doctor on a specific date.
     *
     * @return array<string> List of ISO 8601 timestamps
     */
    public function getAvailableSlots(string $doctorId, CarbonInterface $date): array
    {
        $doctor = $this->doctorRepo->findById($doctorId);
        if (! $doctor || ! $doctor->is_active) {
            return [];
        }

        // 0=Sunday, 1=Monday ... 6=Saturday
        $dayOfWeek = $date->dayOfWeek;

        $availability = $doctor->availabilities()
            ->where('day_of_week', $dayOfWeek)
            ->where('is_active', true)
            ->first();

        if (! $availability) {
            return [];
        }

        $durationMinutes = $availability->slot_duration_minutes ?: 30;

        // Parse start and end times on this specific date
        $startTime = Carbon::parse($date->format('Y-m-d') . ' ' . $availability->start_time);
        $endTime = Carbon::parse($date->format('Y-m-d') . ' ' . $availability->end_time);

        // Fetch booked appointments on this day
        $bookedAppointments = $this->appointmentRepo->getActiveAppointmentsForDoctor($doctorId, $date);
        $bookedTimestamps = $bookedAppointments->map(function ($app) {
            return Carbon::parse($app->scheduled_at)->format('Y-m-d H:i');
        })->toArray();

        $slots = [];
        $current = $startTime->copy();

        while ($current->copy()->addMinutes($durationMinutes)->lte($endTime)) {
            $formattedSlot = $current->format('Y-m-d H:i');

            if (! in_array($formattedSlot, $bookedTimestamps, true)) {
                $slots[] = $current->toIso8601String();
            }

            $current->addMinutes($durationMinutes);
        }

        return $slots;
    }

    /**
     * Check if a specific timestamp slot is available.
     */
    public function isSlotAvailable(string $doctorId, CarbonInterface $dateTime): bool
    {
        $slots = $this->getAvailableSlots($doctorId, $dateTime);
        $targetFormatted = $dateTime->format('Y-m-d H:i');

        foreach ($slots as $slot) {
            if (Carbon::parse($slot)->format('Y-m-d H:i') === $targetFormatted) {
                return true;
            }
        }

        return false;
    }
}
