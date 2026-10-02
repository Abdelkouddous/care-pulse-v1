<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('clinic_id')->constrained('clinics')->cascadeOnDelete();
            $table->foreignUuid('specialty_id')->constrained('specialties')->cascadeOnDelete();
            $table->index('specialty_id');
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('email', 255)->unique();
            $table->string('password', 255)->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('avatar_url', 500)->nullable();
            $table->text('bio')->nullable();
            // Strict Integer Money Guardrail: fee stored in cents
            $table->integer('consultation_fee_cents')->default(0);
            $table->string('license_number', 100)->unique();
            $table->boolean('is_active')->default(true)->index();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['clinic_id', 'is_active'], 'idx_doctors_clinic_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
