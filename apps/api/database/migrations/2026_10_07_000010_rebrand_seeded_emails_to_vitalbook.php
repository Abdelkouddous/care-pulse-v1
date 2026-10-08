<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Rebrand: move seeded/demo accounts from @carepulse.com to @vitalbook.com
 * in place, so existing IDs, relations and passwords are preserved.
 */
return new class extends Migration
{
    private const TABLES = ['admins', 'doctors', 'users'];

    public function up(): void
    {
        $this->swapDomain('@carepulse.com', '@vitalbook.com');
    }

    public function down(): void
    {
        $this->swapDomain('@vitalbook.com', '@carepulse.com');
    }

    private function swapDomain(string $from, string $to): void
    {
        foreach (self::TABLES as $table) {
            if (! Schema::hasTable($table)) {
                continue;
            }

            DB::table($table)
                ->where('email', 'like', '%'.$from)
                ->update(['email' => DB::raw('REPLACE(email, '.DB::getPdo()->quote($from).', '.DB::getPdo()->quote($to).')')]);
        }
    }
};
