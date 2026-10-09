<?php

namespace App\Services\WhatsApp;

use App\Services\Contracts\IWhatsAppGateway;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TwilioWhatsAppGateway implements IWhatsAppGateway
{
    protected string $accountSid;
    protected string $authToken;
    protected string $fromNumber;

    public function __construct()
    {
        $this->accountSid = (string) config('services.whatsapp.twilio.sid', env('TWILIO_ACCOUNT_SID', ''));
        $this->authToken = (string) config('services.whatsapp.twilio.token', env('TWILIO_AUTH_TOKEN', ''));
        $from = (string) config('services.whatsapp.twilio.from', env('TWILIO_WHATSAPP_FROM', '+14155238886'));
        
        // Ensure "whatsapp:" prefix
        $this->fromNumber = str_starts_with($from, 'whatsapp:') ? $from : "whatsapp:{$from}";
    }

    public function sendMessage(string $to, string $message, array $metadata = []): array
    {
        // Normalize recipient phone to E.164 and prepend whatsapp:
        $cleanPhone = preg_replace('/[^0-9+]/', '', trim($to));
        if (! str_starts_with($cleanPhone, '+')) {
            $cleanPhone = '+' . $cleanPhone;
        }
        $toWhatsApp = "whatsapp:{$cleanPhone}";

        if (empty($this->accountSid) || empty($this->authToken)) {
            Log::warning('[Twilio WhatsApp] Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN. Falling back to log.');
            return [
                'success' => false,
                'message_id' => null,
                'error' => 'Twilio credentials not configured in .env',
            ];
        }

        try {
            $url = "https://api.twilio.com/2010-04-01/Accounts/{$this->accountSid}/Messages.json";

            $response = Http::withBasicAuth($this->accountSid, $this->authToken)
                ->asForm()
                ->post($url, [
                    'From' => $this->fromNumber,
                    'To' => $toWhatsApp,
                    'Body' => $message,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $messageSid = $data['sid'] ?? ('wam_' . uniqid());

                Log::info('[Twilio WhatsApp Dispatch Success]', [
                    'to' => $toWhatsApp,
                    'sid' => $messageSid,
                    'metadata' => $metadata,
                ]);

                return [
                    'success' => true,
                    'message_id' => $messageSid,
                    'error' => null,
                ];
            }

            $errorMsg = $response->json('message') ?? $response->body();
            Log::error('[Twilio WhatsApp Dispatch Failed]', [
                'status' => $response->status(),
                'error' => $errorMsg,
                'to' => $toWhatsApp,
            ]);

            return [
                'success' => false,
                'message_id' => null,
                'error' => $errorMsg,
            ];
        } catch (\Throwable $e) {
            Log::error('[Twilio WhatsApp Exception]', ['exception' => $e->getMessage()]);
            return [
                'success' => false,
                'message_id' => null,
                'error' => $e->getMessage(),
            ];
        }
    }
}
