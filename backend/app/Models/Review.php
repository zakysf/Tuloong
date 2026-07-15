<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'reviews';

    public $timestamps = false;

    protected $fillable = [
        'transaction_id',
        'pelanggan_id',
        'mitra_id',
        'rating',
        'review',
    ];

    protected function casts(): array
    {
        return [
            'rating'     => 'integer',
            'created_at' => 'datetime',
        ];
    }

    /**
     * Relasi ke transaksi.
     */
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Relasi ke pelanggan (user yang memberi review).
     */
    public function pelanggan()
    {
        return $this->belongsTo(User::class, 'pelanggan_id');
    }

    /**
     * Relasi ke mitra (user yang menerima review).
     */
    public function mitra()
    {
        return $this->belongsTo(User::class, 'mitra_id');
    }
}
