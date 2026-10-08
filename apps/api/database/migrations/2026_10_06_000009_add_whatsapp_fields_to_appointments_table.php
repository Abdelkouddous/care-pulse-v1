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
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('whatsapp_status', 30)->default('not_sent')->after('status')->index();
            $table->string('whatsapp_message_id', 100)->nullable()->after('whatsapp_status')->index();
            $table->timestampTz('whatsapp_last_sent_at')->nullable()->after('whatsapp_message_id');
            $table->timestampTz('whatsapp_confirmed_at')->nullable()->after('whatsapp_last_sent_at');

            $table->index(['clinic_id', 'whatsapp_status'], 'idx_clinic_whatsapp_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropIndex('idx_clinic_whatsapp_status');
            $table->dropColumn([
                'whatsapp_status',
                'whatsapp_message_id',
                'whatsapp_last_sent_at',
                'whatsapp_confirmed_at',
            ]);
        });
    }
};
