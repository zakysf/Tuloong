<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use App\Models\MitraProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PostClaimTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test create post by Pelanggan.
     */
    public function test_pelanggan_can_create_post(): void
    {
        $pelanggan = User::factory()->create([
            'role' => 'pelanggan',
        ]);

        Sanctum::actingAs($pelanggan);

        $payload = [
            'judul' => 'Bantu angkat barang belanjaan',
            'deskripsi' => 'Butuh bantuan mengangkat belanjaan dari mobil ke rumah.',
            'provinsi' => 'DIY Yogyakarta',
            'kabupaten' => 'Sleman',
            'kecamatan' => 'Depok',
            'estimasi_waktu' => '30 menit',
            'budget' => 25000,
            'urgensi' => 'biasa',
        ];

        $response = $this->postJson('/api/posts', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.judul', 'Bantu angkat barang belanjaan');

        $this->assertDatabaseHas('posts', [
            'judul' => 'Bantu angkat barang belanjaan',
            'user_id' => $pelanggan->id,
        ]);
    }

    /**
     * Test active Mitra can claim a post.
     */
    public function test_active_mitra_can_claim_post(): void
    {
        $pelanggan = User::factory()->create([
            'role' => 'pelanggan',
        ]);

        $post = Post::factory()->create([
            'user_id' => $pelanggan->id,
            'status' => 'open',
        ]);

        $mitra = User::factory()->create([
            'role' => 'mitra',
        ]);

        MitraProfile::create([
            'user_id' => $mitra->id,
            'nomor_ktp' => '3404123456789012',
            'foto_ktp' => 'https://via.placeholder.com/600x400.png',
            'deskripsi_keahlian' => 'Keahlian serbaguna',
            'nama_bank' => 'Bank Mandiri',
            'nomor_rekening' => '1234567890',
            'nama_pemilik_rekening' => $mitra->nama,
            'provinsi' => 'DIY Yogyakarta',
            'kabupaten' => 'Sleman',
            'kecamatan' => 'Depok',
            'verification_status' => 'aktif',
            'badge' => 'baru',
            'total_job_selesai' => 0,
            'rating_rata' => 0.00,
        ]);

        Sanctum::actingAs($mitra);

        $response = $this->postJson("/api/posts/{$post->id}/claim");

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('claims', [
            'post_id' => $post->id,
            'mitra_id' => $mitra->id,
            'status' => 'claimed',
        ]);

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'status' => 'in_progress',
        ]);
    }
}
