<?php

namespace App\Events;

use App\Models\Appointment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Override;

class AppointmentCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // Fill constructor, broadcastOn(), and broadcastWith()
    public function __construct(public Appointment $appointment) {}

    #[Override]
    public function broadcastOn(): array|Channel
    {
        return new PrivateChannel('doctor.'.$this->appointment->doctor_id);
    }

    public function broadcastAs(): string
    {
        return 'AppointmentCreated';
    }

    public function broadcastWith(): array
    {
        $patient = $this->appointment->patient;
        $patientName = $patient ? trim("{$patient->first_name} {$patient->last_name}") : 'A patient';
        $timeStr = $this->appointment->scheduled_at ? $this->appointment->scheduled_at->format('H:i') : '';
        $dateStr = $this->appointment->scheduled_at ? $this->appointment->scheduled_at->format('M j, Y') : '';

        return [
            'title' => 'New Patient Booking',
            'patient_name' => $patientName,
            'scheduled_time' => $timeStr,
            'scheduled_date' => $dateStr,
            'reason' => $this->appointment->reason,
            'message' => "{$patientName} has booked an appointment for {$dateStr} at {$timeStr}.",
            'appointment' => $this->appointment->toArray(),
        ];
    }
}
