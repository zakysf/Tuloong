<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $table = 'posts';

    protected $fillable = [
        'user_id',
        'judul',
        'deskripsi',
        'provinsi',
        'kabupaten',
        'kecamatan',
        'estimasi_waktu',
        'budget',
        'urgensi',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'budget' => 'integer',
        ];
    }

    /**
     * Relasi ke user (pelanggan pemilik post).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke claim (satu post hanya punya satu claim).
     */
    public function claim()
    {
        return $this->hasOne(Claim::class);
    }

    /**
     * Relasi ke transaksi (satu post hanya punya satu transaksi).
     */
    public function transaction()
    {
        return $this->hasOne(Transaction::class);
    }

    /**
     * Scope: hanya post yang statusnya open.
     */
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    /**
     * Scope: filter berdasarkan search, kabupaten, dan urgensi.
     */
    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'ILIKE', "%{$search}%")
                  ->orWhere('deskripsi', 'ILIKE', "%{$search}%");
            });
        }

        if (!empty($filters['kabupaten'])) {
            $query->where('kabupaten', $filters['kabupaten']);
        }

        if (!empty($filters['urgensi'])) {
            $query->where('urgensi', $filters['urgensi']);
        }

        return $query;
    }

    /**
     * Order by urgensi: mendesak dulu, lalu penting, lalu biasa.
     */
    public function scopeOrderByUrgensi($query)
    {
        return $query->orderByRaw("CASE urgensi WHEN 'mendesak' THEN 1 WHEN 'penting' THEN 2 ELSE 3 END");
    }
}
