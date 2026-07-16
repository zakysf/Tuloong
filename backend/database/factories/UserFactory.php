<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => 'password', // will be hashed automatically by cast or Hash::make
            'role' => 'pelanggan',
            'nomor_telepon' => '08' . fake()->numerify('##########'),
            'foto_profil' => null,
            'status' => 'aktif',
        ];
    }

    /**
     * State for admin user.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }

    /**
     * State for mitra user.
     */
    public function mitra(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'mitra',
        ]);
    }
}
