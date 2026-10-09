<?php

namespace App\Services\Contracts;

interface IWhatsAppGateway
{
    /**
     * Send a WhatsApp message to a phone number.
     *
     * @param string $to Recipient phone in E.164 format (e.g. +213555998877)
     * @param string $message Text content
     * @param array $metadata Optional metadata for audit or templating
     * @return array [success => bool, message_id => string, error => ?string]
     */
    public function sendMessage(string $to, string $message, array $metadata = []): array;
}
