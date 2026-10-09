<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('whatsapp:send {phone} {--message=}', function (\App\Services\Contracts\IWhatsAppGateway $gateway) {
    $phone = (string) $this->argument('phone');
    $message = $this->option('message') ?: "Bonjour! Ceci est un message test de confirmation VitalBook Algérie envoyé avec succès.";

    $this->info("Dispatching WhatsApp message to {$phone}...");
    $result = $gateway->sendMessage($phone, $message, ['trigger' => 'artisan_test']);

    if ($result['success'] ?? false) {
        $this->info("Success! Message ID: {$result['message_id']}");
    } else {
        $this->error("Failed: " . ($result['error'] ?? 'Unknown error'));
    }
})->purpose('Send a test WhatsApp notification to a specified phone number');
