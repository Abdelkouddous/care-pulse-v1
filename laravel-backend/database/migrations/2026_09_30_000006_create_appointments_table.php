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
        Schema::create('appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('patient_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('doctor_id')->constrained('doctors')->cascadeOnDelete();
            $table->foreignUuid('clinic_id')->constrained('clinics')->cascadeOnDelete();
            $table->index('doctor_id');
            $table->index('patient_id');
            $table->index('clinic_id');
            $table->timestampTz('scheduled_at');
            $table->string('status', 30)->default('pending')->index();
            $table->text('reason');
            $table->text('notes')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->string('cancelled_by', 30)->nullable();
            // Strict Integer Money Guardrail
            $table->integer('consultation_fee_cents')->default(0);
            $table->timestampTz('reminder_sent_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            // Anti-double-booking unique index
            $table->unique(['doctor_id', 'scheduled_at'], 'idx_unique_doctor_scheduled_slot');
            // Rebooking and clinic history index
            $table->index(['clinic_id', 'patient_id', 'status'], 'idx_clinic_patient_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
