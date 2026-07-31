<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\RejectionReason;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    /**
     * Ambil alasan penolakan terakhir (jika ada).
     */
    public function getRejectionReason(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $rejection = RejectionReason::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Alasan penolakan berhasil diambil',
            'data'    => $rejection,
        ]);
    }

    /**
     * Revisi profil mitra yang ditolak.
     */
    public function reviseProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $mitraProfile = $user->mitraProfile;

        if (!$mitraProfile || $mitraProfile->verification_status !== 'ditolak') {
            return response()->json([
                'success' => false,
                'message' => 'Profil Anda tidak dalam status ditolak',
            ], 400);
        }

        $request->validate([
            'nomor_ktp'          => 'nullable|string|size:16|regex:/^[0-9]+$/',
            'deskripsi_keahlian' => 'nullable|string|min:20',
            'foto_ktp'           => 'nullable|image|mimes:jpeg,png,jpg|max:5120', // maks 5MB
        ]);

        DB::transaction(function () use ($request, $mitraProfile) {
            $updateData = [];

            if ($request->filled('nomor_ktp')) {
                $updateData['nomor_ktp'] = $request->nomor_ktp;
            }

            if ($request->filled('deskripsi_keahlian')) {
                $updateData['deskripsi_keahlian'] = $request->deskripsi_keahlian;
            }

            if ($request->hasFile('foto_ktp')) {
                // Hapus foto lama jika ada
                if ($mitraProfile->foto_ktp) {
                    Storage::disk('public')->delete($mitraProfile->foto_ktp);
                }
                
                $path = $request->file('foto_ktp')->store('mitra/ktp', 'public');
                $updateData['foto_ktp'] = $path;
            }

            $updateData['verification_status'] = 'pending_update';

            $mitraProfile->update($updateData);
        });

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui dan sedang menunggu verifikasi ulang',
            'data'    => $user->load('mitraProfile'),
        ]);
    }
}
