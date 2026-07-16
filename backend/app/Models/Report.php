<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $table = 'reports';

    protected $fillable = [
        'reporter_id',
        'reported_id',
        'claim_id',
        'alasan',
        'detail',
        'status',
    ];

    /**
     * Relasi ke pelapor (user).
     */
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    /**
     * Relasi ke terlapor (user).
     */
    public function reported()
    {
        return $this->belongsTo(User::class, 'reported_id');
    }

    /**
     * Relasi ke claim terkait.
     */
    public function claim()
    {
        return $this->belongsTo(Claim::class);
    }
}
