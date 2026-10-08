<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WhatsAppNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class WhatsAppWebhookController extends Controller
{
    public function __construct(
        protected WhatsAppNotificationService $whatsAppService
    ) {}

    /**
     * Inbound WhatsApp two-way webhook handler.
     */
    public function handle(Request $request): JsonResponse
    {
        $payload = $request->all();

        $result = $this->whatsAppService->handleInboundWebhook($payload);

        return response()->json([
            'success' => true,
            'result' => $result,
        ], Response::HTTP_OK);
    }
}
