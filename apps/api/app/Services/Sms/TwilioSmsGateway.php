<?php

namespace App\Services\Sms;

use App\Services\Contracts\ISmsGateway;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TwilioSmsGateway implements ISmsGateway
{
    protected string $accountSid;

    protected string $authToken;

    protected string $fromNumber;

    public function __construct()
    {
        $this->accountSid = (string) config('services.sms.twilio.sid', env('TWILIO_ACCOUNT_SID', ''));
        $this->authToken = (string) config('services.sms.twilio.token', env('TWILIO_AUTH_TOKEN', ''));
        $this->fromNumber = (string) config('services.sms.twilio.from', env('TWILIO_SMS_FROM', config('services.whatsapp.twilio.from', '+14155238886')));
    }

    public function sendSms(string $to, string $message, array $metadata = []): array
    {
        $cleanPhone = preg_replace('/[^0-9+]/', '', trim($to));
        if (! str_starts_with($cleanPhone, '+')) {
            $cleanPhone = '+'.$cleanPhone;
        }

        if (empty($this->accountSid) || empty($this->authToken)) {
            Log::warning('[Twilio SMS] Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN. Falling back to log simulation.');

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
                    'To' => $cleanPhone,
                    'Body' => $message,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $messageSid = $data['sid'] ?? ('sms_'.uniqid());

                Log::info('[Twilio SMS Dispatch Success]', [
                    'to' => $cleanPhone,
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
            Log::error('[Twilio SMS Dispatch Failed]', [
                'status' => $response->status(),
                'error' => $errorMsg,
                'to' => $cleanPhone,
            ]);

            return [
                'success' => false,
                'message_id' => null,
                'error' => $errorMsg,
            ];
        } catch (\Throwable $e) {
            Log::error('[Twilio SMS Exception]', ['exception' => $e->getMessage()]);

            return [
                'success' => false,
                'message_id' => null,
                'error' => $e->getMessage(),
            ];
        }
    }
}
