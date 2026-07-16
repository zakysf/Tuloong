<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MitraProfile extends Model
{
    protected $table = 'mitra_profiles';

    protected $fillable = [
        'user_id',
        'nomor_ktp',
        'foto_ktp',
        'deskripsi_keahlian',
        'nama_bank',
        'nomor_rekening',
        'nama_pemilik_rekening',
        'provinsi',
        'kabupaten',
        'kecamatan',
        'verification_status',
        'badge',
        'total_job_selesai',
        'rating_rata',
    ];

    protected function casts(): array
    {
        return [
            'total_job_selesai' => 'integer',
            'rating_rata' => 'decimal:2',
        ];
    }

    /**
     * Relasi ke user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Cek apakah mitra sudah aktif (terverifikasi).
     */
    public function isAktif(): bool
    {
        return $this->verification_status === 'aktif';
    }

    /**
     * Cek apakah mitra sedang pending verifikasi.
     */
    public function isPending(): bool
    {
        return $this->verification_status === 'pending';
    }

    /**
     * Cek apakah mitra sedang pending update (ajukan perubahan data sensitif).
     */
    public function isPendingUpdate(): bool
    {
        return $this->verification_status === 'pending_update';
    }

    /**
     * Evaluasi dan update badge mitra berdasarkan jumlah job selesai dan rating.
     */
    public function evaluateBadge(): void
    {
        if ($this->total_job_selesai >= 30 && $this->rating_rata >= 4.5) {
            $this->badge = 'profesional';
        } elseif ($this->total_job_selesai >= 10 && $this->rating_rata >= 4.0) {
            $this->badge = 'terpercaya';
        } else {
            $this->badge = 'baru';
        }

        $this->saveQuietly();
    }
}
