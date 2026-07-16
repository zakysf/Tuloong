<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterPelangganRequest;
use App\Http\Requests\Auth\RegisterMitraRequest;
use App\Models\User;
use App\Models\MitraProfile;
use App\Models\PelangganProfile;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    protected CloudinaryService $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    /**
     * Register pelanggan atau mitra.
     * Deteksi role dari request body.
     */
    public function register(Request $request): JsonResponse
    {
        $role = $request->input('role', 'pelanggan');

        if ($role === 'mitra') {
            return $this->registerMitra(app(RegisterMitraRequest::class));
        }

        return $this->registerPelanggan(app(RegisterPelangganRequest::class));
    }

    /**
     * Register pelanggan — akun langsung aktif.
     */
    private function registerPelanggan(RegisterPelangganRequest $request): JsonResponse
    {
        $user = DB::transaction(function () use ($request) {
            $user = User::create([
                'nama'          => $request->nama,
                'email'         => $request->email,
                'password'      => $request->password,
                'role'          => 'pelanggan',
                'nomor_telepon' => $request->nomor_telepon,
                'status'        => 'aktif',
            ]);

            PelangganProfile::create([
                'user_id'   => $user->id,
                'provinsi'  => $request->provinsi,
                'kabupaten' => $request->kabupaten,
                'kecamatan' => $request->kecamatan,
            ]);

            return $user;
        });

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi pelanggan berhasil',
            'data'    => [
                'user'  => $this->formatUser($user),
                'token' => $token,
            ],
        ], 201);
    }

    /**
     * Register mitra — status pending, butuh verifikasi admin.
     */
    private function registerMitra(RegisterMitraRequest $request): JsonResponse
    {
        $user = DB::transaction(function () use ($request) {
            // Upload foto KTP ke Cloudinary
            $fotoKtpUrl = $this->cloudinaryService->upload(
                $request->file('foto_ktp'),
                'tuloong/ktp'
            );

            $user = User::create([
                'nama'          => $request->nama,
                'email'         => $request->email,
                'password'      => $request->password,
                'role'          => 'mitra',
                'nomor_telepon' => $request->nomor_telepon,
                'status'        => 'aktif',
            ]);

            MitraProfile::create([
                'user_id'               => $user->id,
                'nomor_ktp'             => $request->nomor_ktp,
                'foto_ktp'              => $fotoKtpUrl,
                'deskripsi_keahlian'    => $request->deskripsi_keahlian,
                'nama_bank'             => $request->nama_bank,
                'nomor_rekening'        => $request->nomor_rekening,
                'nama_pemilik_rekening' => $request->nama_pemilik_rekening,
                'provinsi'              => $request->provinsi,
                'kabupaten'             => $request->kabupaten,
                'kecamatan'             => $request->kecamatan,
                'verification_status'   => 'pending',
            ]);

            return $user;
        });

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi mitra berhasil. Menunggu verifikasi admin.',
            'data'    => [
                'user'  => $this->formatUser($user->load('mitraProfile')),
                'token' => $token,
            ],
        ], 201);
    }

    /**
     * Login — email + password, return Sanctum token.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah',
            ], 401);
        }

        $user = Auth::user();

        // Cek apakah akun nonaktif
        if ($user->status === 'nonaktif') {
            Auth::logout();
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda telah dinonaktifkan. Hubungi admin untuk informasi lebih lanjut.',
            ], 403);
        }

        // Hapus token lama, buat baru
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        // Load profile sesuai role
        if ($user->role === 'mitra') {
            $user->load('mitraProfile');
        } elseif ($user->role === 'pelanggan') {
            $user->load('pelangganProfile');
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil login',
            'data'    => [
                'user'  => $this->formatUser($user),
                'token' => $token,
            ],
        ]);
    }

    /**
     * Logout — revoke current token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil logout',
        ]);
    }

    /**
     * Me — return data user yang sedang login.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'mitra') {
            $user->load('mitraProfile');
        } elseif ($user->role === 'pelanggan') {
            $user->load('pelangganProfile');
        }

        return response()->json([
            'success' => true,
            'message' => 'Data user berhasil diambil',
            'data'    => $this->formatUser($user),
        ]);
    }

    /**
     * Format user data untuk response.
     */
    private function formatUser(User $user): array
    {
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

        if ($user->role === 'mitra' && $user->relationLoaded('mitraProfile') && $user->mitraProfile) {
            $data['mitra_profile'] = [
                'verification_status'   => $user->mitraProfile->verification_status,
                'badge'                 => $user->mitraProfile->badge,
                'deskripsi_keahlian'    => $user->mitraProfile->deskripsi_keahlian,
                'provinsi'              => $user->mitraProfile->provinsi,
                'kabupaten'             => $user->mitraProfile->kabupaten,
                'kecamatan'             => $user->mitraProfile->kecamatan,
                'total_job_selesai'     => $user->mitraProfile->total_job_selesai,
                'rating_rata'           => $user->mitraProfile->rating_rata,
            ];
        }

        if ($user->role === 'pelanggan' && $user->relationLoaded('pelangganProfile') && $user->pelangganProfile) {
            $data['pelanggan_profile'] = [
                'provinsi'  => $user->pelangganProfile->provinsi,
                'kabupaten' => $user->pelangganProfile->kabupaten,
                'kecamatan' => $user->pelangganProfile->kecamatan,
            ];
        }

        return $data;
    }
}
