<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentCancelledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Appointment $appointment
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $timeStr = $this->appointment->scheduled_at->format('F j, Y - H:i');

        return (new MailMessage)
            ->subject('VitalBook: Appointment Cancellation Notice')
            ->greeting("Hello {$notifiable->name},")
            ->line("Your appointment scheduled for {$timeStr} has been cancelled.")
            ->line("Reason: {$this->appointment->cancellation_reason}")
            ->action('Schedule Another Slot', url(config('app.url') . '/doctors'))
            ->line('If this was an error, please reach out to our clinic administration.');
    }
}
