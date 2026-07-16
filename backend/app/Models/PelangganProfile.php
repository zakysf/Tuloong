<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PelangganProfile extends Model
{
    protected $table = 'pelanggan_profiles';

    protected $fillable = [
        'user_id',
        'provinsi',
        'kabupaten',
        'kecamatan',
    ];

    /**
     * Relasi ke user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
