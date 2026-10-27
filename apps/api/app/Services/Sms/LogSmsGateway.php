<?php

namespace App\Services\Sms;

use App\Services\Contracts\ISmsGateway;
use Illuminate\Support\Facades\Log;

class LogSmsGateway implements ISmsGateway
{
    public function sendSms(string $to, string $message, array $metadata = []): array
    {
        $messageId = 'sms_log_'.bin2hex(random_bytes(8));

        Log::info('[SMS Log Gateway Dispatch]', [
            'to' => $to,
            'message' => $message,
            'metadata' => $metadata,
            'message_id' => $messageId,
        ]);

        return [
            'success' => true,
            'message_id' => $messageId,
            'error' => null,
        ];
    }
}
