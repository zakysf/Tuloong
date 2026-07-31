<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Seed akun admin default.
     * Admin tidak bisa register via halaman publik.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@tuloong.com'],
            [
                'nama'          => 'Admin Tuloong',
                'password'      => 'admin123',
                'role'          => 'admin',
                'nomor_telepon' => '081234567890',
                'status'        => 'aktif',
            ]
        );
    }
}
