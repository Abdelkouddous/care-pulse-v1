<?php

namespace App\Services\Contracts;

interface ISmsGateway
{
    /**
     * Send an SMS message to a mobile number in E.164 format.
     *
     * @param  string  $to  Recipient phone (e.g. +213555998877)
     * @param  string  $message  Text content
     * @param  array  $metadata  Optional tracking metadata
     * @return array [success => bool, message_id => ?string, error => ?string]
     */
    public function sendSms(string $to, string $message, array $metadata = []): array;
}
