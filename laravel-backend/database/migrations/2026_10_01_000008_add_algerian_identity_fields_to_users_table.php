<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Appends Algerian Civic Identifiers: National ID (NIN), Carte Chifa, Wilaya, and Blood Group.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Algerian Biometric National ID (NIN) - 18 digits
            $table->string('national_id_nin', 18)->nullable()->unique()->after('email');

            // CNAS/CASNOS Carte Chifa Identifier - 10 digits
            $table->string('carte_chifa_number', 10)->nullable()->unique()->after('national_id_nin');

            // Wilaya Code (01 to 58)
            $table->unsignedSmallInteger('wilaya_code')->nullable()->after('address');

            // Blood Group Classification
            $table->enum('blood_type', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])->nullable()->after('gender');

            // High-speed E.164 phone lookup index
            $table->index('phone', 'idx_users_e164_phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('idx_users_e164_phone');
            $table->dropColumn(['national_id_nin', 'carte_chifa_number', 'wilaya_code', 'blood_type']);
        });
    }
};
