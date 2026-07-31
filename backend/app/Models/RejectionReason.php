<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RejectionReason extends Model
{
    protected $table = 'rejection_reasons';

    /**
     * Tabel ini tidak memiliki updated_at.
     */
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'reason',
    ];

    /**
     * Relasi ke user (mitra yang ditolak).
     * RejectionReason dibuat oleh admin untuk mitra yang gagal verifikasi.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
