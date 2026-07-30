<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    protected CloudinaryService $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    /**
     * Tampilkan profil user yang sedang login beserta profil role-nya.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'mitra') {
            $user->load('mitraProfile');
        } elseif ($user->role === 'pelanggan') {
            $user->load('pelangganProfile');
        }

        $data = [
            'id'            => $user->id,
            'nama'          => $user->nama,
            'email'         => $user->email,
            'role'          => $user->role,
            'nomor_telepon' => $user->nomor_telepon,
            'foto_profil'   => $user->foto_profil,
            'status'        => $user->status,
            'created_at'    => $user->created_at,
        ];

        if ($user->role === 'mitra' && $user->mitraProfile) {
            $data['mitra_profile'] = $user->mitraProfile;
        }

        if ($user->role === 'pelanggan' && $user->pelangganProfile) {
            $data['pelanggan_profile'] = $user->pelangganProfile;
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diambil',
            'data'    => $data,
        ]);
    }

    /**
     * Update profil — data non-sensitif.
     * Semua role bisa update: email, password, nomor_telepon, foto_profil.
     * Pelanggan bisa juga update: provinsi, kabupaten, kecamatan.
     * Mitra hanya bisa update data non-sensitif di sini.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'nama'          => 'sometimes|string|max:255',
            'email'         => 'sometimes|email|unique:users,email,' . $user->id,
            'password'      => 'sometimes|string|min:8|confirmed',
            'nomor_telepon' => 'sometimes|string|max:20',
            'foto_profil'   => 'sometimes|file|mimes:jpg,jpeg,png|max:2048',
            // Pelanggan-specific
            'provinsi'      => 'sometimes|string|max:100',
            'kabupaten'     => 'sometimes|string|max:100',
            'kecamatan'     => 'sometimes|string|max:100',
        ]);

        DB::transaction(function () use ($request, $user) {
            // Update user data
            $userData = [];

            if ($request->has('nama') && $user->role === 'pelanggan') {
                $userData['nama'] = $request->nama;
            }
            if ($request->has('email')) {
                $userData['email'] = $request->email;
            }
            if ($request->has('password')) {
                $userData['password'] = $request->password;
            }
            if ($request->has('nomor_telepon')) {
                $userData['nomor_telepon'] = $request->nomor_telepon;
            }
            if ($request->hasFile('foto_profil')) {
                $userData['foto_profil'] = $this->cloudinaryService->upload(
                    $request->file('foto_profil'),
                    'tuloong/profil'
                );
            }

            if (!empty($userData)) {
                $user->update($userData);
            }

            // Update profil pelanggan jika ada
            if ($user->role === 'pelanggan') {
                $profileData = $request->only(['provinsi', 'kabupaten', 'kecamatan']);
                if (!empty($profileData) && $user->pelangganProfile) {
                    $user->pelangganProfile->update($profileData);
                }
            }
        });

        $user->refresh();

        if ($user->role === 'mitra') {
            $user->load('mitraProfile');
        } elseif ($user->role === 'pelanggan') {
            $user->load('pelangganProfile');
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui',
            'data'    => $user,
        ]);
    }

    /**
     * Request update data sensitif mitra.
     * Mengubah verification_status → pending_update.
     * Data baru disimpan langsung (sesuai PRD: admin akan review).
     */
    public function requestUpdate(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'mitra') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya mitra yang bisa mengajukan perubahan data sensitif',
            ], 403);
        }

        $mitraProfile = $user->mitraProfile;

        if (!$mitraProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Profil mitra tidak ditemukan',
            ], 404);
        }

        if ($mitraProfile->verification_status === 'pending_update') {
            return response()->json([
                'success' => false,
                'message' => 'Sudah ada pengajuan perubahan yang sedang menunggu persetujuan admin',
            ], 400);
        }

        $request->validate([
            'nama'                  => 'sometimes|string|max:255',
            'nomor_ktp'             => 'sometimes|string|size:16',
            'foto_ktp'              => 'sometimes|file|mimes:jpg,jpeg,png|max:2048',
            'deskripsi_keahlian'    => 'sometimes|string',
            'nama_bank'             => 'sometimes|string|max:100',
            'nomor_rekening'        => 'sometimes|string|max:50',
            'nama_pemilik_rekening' => 'sometimes|string|max:255',
        ]);

        DB::transaction(function () use ($request, $user, $mitraProfile) {
            // Update nama di users jika ada
            if ($request->has('nama')) {
                $user->update(['nama' => $request->nama]);
            }

            // Update data sensitif di mitra_profiles
            $profileData = [];

            if ($request->has('nomor_ktp')) {
                $profileData['nomor_ktp'] = $request->nomor_ktp;
            }
            if ($request->hasFile('foto_ktp')) {
                $profileData['foto_ktp'] = $this->cloudinaryService->upload(
                    $request->file('foto_ktp'),
                    'tuloong/ktp'
                );
            }
            if ($request->has('deskripsi_keahlian')) {
                $profileData['deskripsi_keahlian'] = $request->deskripsi_keahlian;
            }
            if ($request->has('nama_bank')) {
                $profileData['nama_bank'] = $request->nama_bank;
            }
            if ($request->has('nomor_rekening')) {
                $profileData['nomor_rekening'] = $request->nomor_rekening;
            }
            if ($request->has('nama_pemilik_rekening')) {
                $profileData['nama_pemilik_rekening'] = $request->nama_pemilik_rekening;
            }

            // Set status ke pending_update
            $profileData['verification_status'] = 'pending_update';

            $mitraProfile->update($profileData);
        });

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan perubahan data berhasil dikirim. Menunggu persetujuan admin.',
            'data'    => $user->load('mitraProfile'),
        ]);
    }
}
