<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentBookedNotification extends Notification implements ShouldQueue
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
        $feeDzd = number_format($this->appointment->consultation_fee_cents / 100, 2);

        return (new MailMessage)
            ->subject('CarePulse: Appointment Confirmed')
            ->greeting("Hello {$notifiable->name},")
            ->line("Your medical appointment with Dr. {$this->appointment->doctor->last_name} is successfully scheduled.")
            ->line("Date & Time: {$timeStr}")
            ->line("Reason: {$this->appointment->reason}")
            ->line("Consultation Fee: {$feeDzd} DZD")
            ->action('View My Appointments', url(config('app.url') . '/dashboard'))
            ->line('Thank you for choosing CarePulse healthcare network.');
    }
}
