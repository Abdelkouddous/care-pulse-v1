<?php

namespace App\Services\WhatsApp;

use App\Services\Contracts\IWhatsAppGateway;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class LogWhatsAppGateway implements IWhatsAppGateway
{
    public function sendMessage(string $to, string $message, array $metadata = []): array
    {
        $messageId = 'wam_' . (string) Str::uuid();

        Log::info('[WhatsApp Gateway Dispatch]', [
            'to' => $to,
            'message' => $message,
            'message_id' => $messageId,
            'metadata' => $metadata,
        ]);

        return [
            'success' => true,
            'message_id' => $messageId,
            'error' => null,
        ];
    }
}
