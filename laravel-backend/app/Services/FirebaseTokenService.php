<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FirebaseTokenService
{
    protected string $projectId;

    public function __construct()
    {
        $this->projectId = config('services.firebase.project_id', 'gen-lang-client-0222855501');
    }

    /**
     * Stateless verification of Google Firebase ID Token (Option A)
     * Verifies cryptographic RS256 signature using Google's public x509 certificates.
     *
     * @return array Decoded claims containing verified 'phone_number' and 'sub' (Firebase UID)
     */
    public function verifyIdToken(string $jwt): array
    {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) {
            throw new Exception('Invalid JWT segment count.');
        }

        [$headerB64, $payloadB64, $signatureB64] = $parts;

        $header = json_decode($this->base64UrlDecode($headerB64), true);
        $payload = json_decode($this->base64UrlDecode($payloadB64), true);
        $signature = $this->base64UrlDecode($signatureB64);

        if (! $header || ! $payload) {
            throw new Exception('Malformed JWT header or payload.');
        }

        // 1. Verify Alg & Key ID
        if (($header['alg'] ?? '') !== 'RS256' || empty($header['kid'])) {
            throw new Exception('Invalid token algorithm or missing kid.');
        }

        // 2. Verify Standard Claims (aud, iss, exp)
        $expectedAud = $this->projectId;
        $expectedIss = 'https://securetoken.google.com/' . $this->projectId;

        if (($payload['aud'] ?? '') !== $expectedAud) {
            throw new Exception("Audience mismatch: expected {$expectedAud}, got " . ($payload['aud'] ?? ''));
        }

        if (($payload['iss'] ?? '') !== $expectedIss) {
            throw new Exception("Issuer mismatch: expected {$expectedIss}, got " . ($payload['iss'] ?? ''));
        }

        if (isset($payload['exp']) && time() > $payload['exp']) {
            throw new Exception('Firebase token has expired.');
        }

        // 3. Retrieve Google Public x509 Certs (Cached for 6 hours)
        $certs = Cache::remember('firebase_public_certs', 21600, function () {
            $res = Http::get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
            if (! $res->successful()) {
                throw new Exception('Failed to fetch Google public certificates.');
            }
            return $res->json();
        });

        $kid = $header['kid'];
        if (! isset($certs[$kid])) {
            // Force refresh cache once if key not found
            $res = Http::get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
            $certs = $res->json();
            Cache::put('firebase_public_certs', $certs, 21600);

            if (! isset($certs[$kid])) {
                throw new Exception("Public key certificate not found for kid: {$kid}");
            }
        }

        $publicKey = $certs[$kid];

        // 4. Verify Cryptographic Signature with OpenSSL
        $dataToVerify = $headerB64 . '.' . $payloadB64;
        $verifyResult = openssl_verify($dataToVerify, $signature, $publicKey, OPENSSL_ALGO_SHA256);

        if ($verifyResult !== 1) {
            throw new Exception('Firebase JWT cryptographic signature verification failed.');
        }

        return $payload;
    }

    /**
     * Decode base64url encoded string
     */
    protected function base64UrlDecode(string $input): string
    {
        $remainder = strlen($input) % 4;
        if ($remainder) {
            $padLen = 4 - $remainder;
            $input .= str_repeat('=', $padLen);
        }
        return base64_decode(strtr($input, '-_', '+/'));
    }
}
