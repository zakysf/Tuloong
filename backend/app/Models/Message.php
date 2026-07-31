<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'messages';

    public $timestamps = false;

    protected $fillable = [
        'claim_id',
        'sender_id',
        'body',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    /**
     * Relasi ke claim.
     */
    public function claim()
    {
        return $this->belongsTo(Claim::class);
    }

    /**
     * Relasi ke pengirim (user).
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
