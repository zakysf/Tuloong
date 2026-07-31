<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test register pelanggan.
     */
    public function test_register_pelanggan_successfully(): void
    {
        $payload = [
            'role' => 'pelanggan',
            'nama' => 'Budi Pelanggan',
            'email' => 'budi@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'nomor_telepon' => '08123456789',
            'provinsi' => 'DIY Yogyakarta',
            'kabupaten' => 'Sleman',
            'kecamatan' => 'Depok',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => [
                        'id',
                        'nama',
                        'email',
                        'role',
                        'nomor_telepon',
                        'foto_profil',
                        'status',
                    ],
                    'token',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'budi@example.com',
            'role' => 'pelanggan',
        ]);

        $this->assertDatabaseHas('pelanggan_profiles', [
            'provinsi' => 'DIY Yogyakarta',
        ]);
    }

    /**
     * Test login.
     */
    public function test_login_successfully(): void
    {
        $user = User::factory()->create([
            'email' => 'budi@example.com',
            'password' => bcrypt('password123'),
        ]);

        $payload = [
            'email' => 'budi@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/login', $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user',
                    'token',
                ],
            ]);
    }
}
