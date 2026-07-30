<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nama',
        'email',
        'password',
        'role',
        'nomor_telepon',
        'foto_profil',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /**
     * Relasi ke profil mitra.
     */
    public function mitraProfile()
    {
        return $this->hasOne(MitraProfile::class);
    }

    /**
     * Relasi ke profil pelanggan.
     */
    public function pelangganProfile()
    {
        return $this->hasOne(PelangganProfile::class);
    }

    /**
     * Relasi ke rejection reasons (alasan penolakan oleh admin).
     */
    public function rejectionReasons()
    {
        return $this->hasMany(RejectionReason::class);
    }

    /**
     * Cek apakah user adalah pelanggan.
     */
    public function isPelanggan(): bool
    {
        return $this->role === 'pelanggan';
    }

    /**
     * Cek apakah user adalah mitra.
     */
    public function isMitra(): bool
    {
        return $this->role === 'mitra';
    }

    /**
     * Cek apakah user adalah admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Cek apakah akun aktif.
     */
    public function isAktif(): bool
    {
        return $this->status === 'aktif';
    }
}
