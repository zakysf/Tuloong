<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed settings and admin
        $this->call([
            SettingSeeder::class,
            AdminSeeder::class,
        ]);

        // Seed sample Pelanggan users and profiles
        $pelanggans = \App\Models\User::factory(3)->create([
            'role' => 'pelanggan',
        ]);

        foreach ($pelanggans as $pelanggan) {
            \App\Models\PelangganProfile::create([
                'user_id' => $pelanggan->id,
                'provinsi' => 'DIY Yogyakarta',
                'kabupaten' => 'Sleman',
                'kecamatan' => 'Depok',
            ]);

            // Create 2 posts for each pelanggan
            \App\Models\Post::factory(2)->create([
                'user_id' => $pelanggan->id,
            ]);
        }

        // Seed sample Mitra users and profiles
        $mitras = \App\Models\User::factory(3)->create([
            'role' => 'mitra',
        ]);

        foreach ($mitras as $index => $mitra) {
            \App\Models\MitraProfile::create([
                'user_id' => $mitra->id,
                'nomor_ktp' => '3404' . fake()->numerify('############'),
                'foto_ktp' => 'https://via.placeholder.com/600x400.png?text=KTP+' . urlencode($mitra->nama),
                'deskripsi_keahlian' => fake()->randomElement(['Kelistrikan, pipa bocor', 'Angkat barang berat, kurir motor', 'Asisten rumah tangga harian']),
                'nama_bank' => 'Bank Mandiri',
                'nomor_rekening' => fake()->numerify('13700##########'),
                'nama_pemilik_rekening' => $mitra->nama,
                'provinsi' => 'DIY Yogyakarta',
                'kabupaten' => 'Sleman',
                'kecamatan' => 'Depok',
                'verification_status' => $index === 0 ? 'pending' : 'aktif', // first one pending verification
                'badge' => 'baru',
                'total_job_selesai' => 0,
                'rating_rata' => 0.00,
            ]);
        }
    }
}
