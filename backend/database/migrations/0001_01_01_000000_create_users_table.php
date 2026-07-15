<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Menggunakan hasTable() agar aman jika tabel sudah ada di Supabase.
     */
    public function up(): void
    {
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('nama');
                $table->string('email')->unique();
                $table->string('password');
                $table->enum('role', ['pelanggan', 'mitra', 'admin'])->default('pelanggan');
                $table->string('nomor_telepon', 20)->nullable();
                $table->string('foto_profil')->nullable();
                $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
