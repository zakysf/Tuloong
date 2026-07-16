<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mitra_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('nomor_ktp', 16);
            $table->string('foto_ktp');
            $table->text('deskripsi_keahlian');
            $table->string('nama_bank');
            $table->string('nomor_rekening', 50);
            $table->string('nama_pemilik_rekening');
            $table->string('provinsi', 100);
            $table->string('kabupaten', 100);
            $table->string('kecamatan', 100);
            $table->enum('verification_status', ['pending', 'aktif', 'ditolak', 'pending_update'])->default('pending');
            $table->enum('badge', ['baru', 'terpercaya', 'profesional'])->default('baru');
            $table->integer('total_job_selesai')->default(0);
            $table->decimal('rating_rata', 3, 2)->default(0.00);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mitra_profiles');
    }
};
