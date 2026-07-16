<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('judul');
            $table->text('deskripsi');
            $table->string('provinsi', 100);
            $table->string('kabupaten', 100);
            $table->string('kecamatan', 100);
            $table->string('estimasi_waktu', 100)->nullable();
            $table->integer('budget');
            $table->enum('urgensi', ['biasa', 'penting', 'mendesak'])->default('biasa');
            $table->enum('status', ['open', 'in_progress', 'done', 'cancelled'])->default('open');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
