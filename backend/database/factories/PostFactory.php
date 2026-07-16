<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'judul' => fake()->randomElement([
                'Bantu belikan obat di Apotek Kimia Farma',
                'Antar berkas penting ke Kantor Pos',
                'Bantu bersihkan taman belakang rumah',
                'Belikan makan siang nasi padang 3 porsi',
                'Angkat lemari pakaian ke lantai 2',
                'Temani nenek kontrol ke rumah sakit',
            ]),
            'deskripsi' => fake()->paragraph(),
            'provinsi' => 'DIY Yogyakarta',
            'kabupaten' => fake()->randomElement(['Sleman', 'Bantul', 'Yogyakarta']),
            'kecamatan' => fake()->randomElement(['Depok', 'Gamping', 'Mlati', 'Kasihan']),
            'estimasi_waktu' => fake()->randomElement(['1 jam', '2 jam', 'Hari ini', 'Maksimal sore ini']),
            'budget' => fake()->randomElement([20000, 30000, 50000, 75000, 100000]),
            'urgensi' => fake()->randomElement(['biasa', 'penting', 'mendesak']),
            'status' => 'open',
        ];
    }
}
