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

class AppointmentStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Appointment $appointment,
        public ?string $previousStatus = null,
        public ?string $updatedBy = null,
        public ?string $reason = null
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    #[Override]
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('doctor.'.$this->appointment->doctor_id),
            new PrivateChannel('patient.'.$this->appointment->patient_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'AppointmentStatusUpdated';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $timeStr = $this->appointment->scheduled_at ? $this->appointment->scheduled_at->format('H:i') : '';
        $dateStr = $this->appointment->scheduled_at ? $this->appointment->scheduled_at->format('M j, Y') : '';
        $effectiveReason = $this->reason ?? $this->appointment->cancellation_reason ?? $this->appointment->notes;

        return [
            'event' => 'AppointmentStatusUpdated',
            'appointment_id' => $this->appointment->id,
            'doctor_id' => $this->appointment->doctor_id,
            'patient_id' => $this->appointment->patient_id,
            'status' => $this->appointment->status,
            'previous_status' => $this->previousStatus,
            'reason' => $effectiveReason,
            'updated_by' => $this->updatedBy,
            'scheduled_at' => $this->appointment->scheduled_at?->toIso8601String(),
            'scheduled_time' => $timeStr,
            'scheduled_date' => $dateStr,
            'updated_at' => $this->appointment->updated_at?->toIso8601String(),
            'appointment' => $this->appointment->toArray(),
        ];
    }
}
