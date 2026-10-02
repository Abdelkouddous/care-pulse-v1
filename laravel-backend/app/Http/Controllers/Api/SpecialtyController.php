<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SpecialtyResource;
use App\Repositories\Contracts\ISpecialtyRepository;
use Illuminate\Http\JsonResponse;

class SpecialtyController extends Controller
{
    public function __construct(
        protected ISpecialtyRepository $specialtyRepo
    ) {}

    public function index(): JsonResponse
    {
        $specialties = $this->specialtyRepo->getAll();

        return response()->json([
            'data' => SpecialtyResource::collection($specialties),
        ]);
    }
}
