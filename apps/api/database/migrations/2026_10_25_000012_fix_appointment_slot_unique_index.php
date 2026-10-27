<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE appointments DROP CONSTRAINT IF EXISTS idx_unique_doctor_scheduled_slot');
            DB::statement('DROP INDEX IF EXISTS idx_unique_doctor_scheduled_slot');
            DB::statement("CREATE UNIQUE INDEX idx_unique_doctor_scheduled_slot ON appointments (doctor_id, scheduled_at) WHERE status != 'cancelled' AND deleted_at IS NULL");
        } elseif ($driver === 'sqlite') {
            DB::statement('DROP INDEX IF EXISTS idx_unique_doctor_scheduled_slot');
            DB::statement("CREATE UNIQUE INDEX idx_unique_doctor_scheduled_slot ON appointments (doctor_id, scheduled_at) WHERE status != 'cancelled' AND deleted_at IS NULL");
        } else {
            Schema::table('appointments', function (Blueprint $table) {
                $table->dropUnique('idx_unique_doctor_scheduled_slot');
            });
            DB::statement("CREATE UNIQUE INDEX idx_unique_doctor_scheduled_slot ON appointments (doctor_id, scheduled_at) WHERE status != 'cancelled' AND deleted_at IS NULL");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('DROP INDEX IF EXISTS idx_unique_doctor_scheduled_slot');
            Schema::table('appointments', function (Blueprint $table) {
                $table->unique(['doctor_id', 'scheduled_at'], 'idx_unique_doctor_scheduled_slot');
            });
        } elseif ($driver === 'sqlite') {
            DB::statement('DROP INDEX IF EXISTS idx_unique_doctor_scheduled_slot');
            DB::statement('CREATE UNIQUE INDEX idx_unique_doctor_scheduled_slot ON appointments (doctor_id, scheduled_at)');
        } else {
            DB::statement('DROP INDEX IF EXISTS idx_unique_doctor_scheduled_slot');
            Schema::table('appointments', function (Blueprint $table) {
                $table->unique(['doctor_id', 'scheduled_at'], 'idx_unique_doctor_scheduled_slot');
            });
        }
    }
};
