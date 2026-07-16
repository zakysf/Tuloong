<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Claim extends Model
{
    protected $table = 'claims';

    public $timestamps = false;

    protected $fillable = [
        'post_id',
        'mitra_id',
        'status',
        'claimed_at',
    ];

    protected function casts(): array
    {
        return [
            'claimed_at' => 'datetime',
            'updated_at' => 'datetime',
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
     * Relasi ke mitra (user).
     */
    public function mitra()
    {
        return $this->belongsTo(User::class, 'mitra_id');
    }

    /**
     * Relasi ke transaksi.
     */
    public function transaction()
    {
        return $this->hasOne(Transaction::class);
    }

    /**
     * Relasi ke pesan-pesan dalam claim ini.
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Relasi ke laporan terkait claim ini.
     */
    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    /**
     * Urutan transisi status yang valid.
     */
    public static function validTransition(string $from, string $to): bool
    {
        $transitions = [
            'claimed'     => 'on_the_way',
            'on_the_way'  => 'working',
            'working'     => 'done_by_mitra',
        ];

        return isset($transitions[$from]) && $transitions[$from] === $to;
    }
}
