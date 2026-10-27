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
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('CREATE EXTENSION IF NOT EXISTS postgis;');

            Schema::table('clinics', function (Blueprint $table) {
                $table->geography('location', subtype: 'point', srid: 4326)->nullable();
                $table->unsignedSmallInteger('wilaya_code')->nullable()->index();
                $table->string('city', 100)->nullable()->index();
                $table->string('commune', 100)->nullable();
                $table->spatialIndex('location');
            });
        } else {
            // Testing / fallback driver compatibility (e.g. SQLite :memory:)
            Schema::table('clinics', function (Blueprint $table) {
                $table->text('location')->nullable();
                $table->unsignedSmallInteger('wilaya_code')->nullable()->index();
                $table->string('city', 100)->nullable()->index();
                $table->string('commune', 100)->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getDriverName();

        Schema::table('clinics', function (Blueprint $table) use ($driver) {
            if ($driver === 'pgsql') {
                $table->dropSpatialIndex(['location']);
            }
            $table->dropColumn(['location', 'wilaya_code', 'city', 'commune']);
        });
    }
};
