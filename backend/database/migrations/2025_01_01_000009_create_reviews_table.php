<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->unique()->constrained('transactions')->cascadeOnDelete();
            $table->foreignId('pelanggan_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('mitra_id')->constrained('users')->cascadeOnDelete();
            $table->tinyInteger('rating'); // 1-5
            $table->text('review')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
