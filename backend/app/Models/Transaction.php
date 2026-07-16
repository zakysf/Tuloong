<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transactions';

    protected $fillable = [
        'post_id',
        'claim_id',
        'pelanggan_id',
        'mitra_id',
        'amount',
        'status',
        'midtrans_order_id',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
        ];
    }

    /**
     * Relasi ke post.
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Relasi ke claim.
     */
    public function claim()
    {
        return $this->belongsTo(Claim::class);
    }

    /**
     * Relasi ke pelanggan.
     */
    public function pelanggan()
    {
        return $this->belongsTo(User::class, 'pelanggan_id');
    }

    /**
     * Relasi ke mitra.
     */
    public function mitra()
    {
        return $this->belongsTo(User::class, 'mitra_id');
    }

    /**
     * Relasi ke review.
     */
    public function review()
    {
        return $this->hasOne(Review::class);
    }
}
