<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MitraProfile;
use App\Models\RejectionReason;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MitraVerificationController extends Controller
{
    /**
     * List semua mitra dengan filter berdasarkan verification_status.
     * GET /api/admin/mitra?status=pending
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'mitra')
            ->with('mitraProfile');

        // Filter berdasarkan verification_status
        if ($request->has('status')) {
            $status = $request->query('status');
            $query->whereHas('mitraProfile', function ($q) use ($status) {
                $q->where('verification_status', $status);
            });
        }

        $mitras = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Daftar mitra berhasil diambil',
            'data'    => $mitras,
        ]);
    }

    /**
     * Verifikasi mitra: approve (aktif) atau tolak (ditolak).
     * PATCH /api/admin/mitra/{id}/verify
     * Body: { status: 'aktif'|'ditolak', reason?: string }
     */
    public function verify(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:aktif,ditolak',
            'reason' => 'required_if:status,ditolak|nullable|string',
        ]);

        $user = User::where('role', 'mitra')->findOrFail($id);
        $mitraProfile = $user->mitraProfile;

        if (!$mitraProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Profil mitra tidak ditemukan',
            ], 404);
        }

        // Validasi: hanya bisa verifikasi mitra yang pending atau pending_update
        if (!in_array($mitraProfile->verification_status, ['pending', 'pending_update'])) {
            return response()->json([
                'success' => false,
                'message' => 'Mitra ini tidak dalam status menunggu verifikasi',
            ], 400);
        }

        $wasPendingUpdate = $mitraProfile->verification_status === 'pending_update';

        DB::transaction(function () use ($request, $user, $mitraProfile, $wasPendingUpdate) {
            $newStatus = $request->status;

            if ($newStatus === 'aktif') {
                $mitraProfile->update([
                    'verification_status' => 'aktif',
                ]);
            } elseif ($wasPendingUpdate) {
                // Tolak perubahan data sensitif: mitra tetap aktif, job berjalan tidak terganggu.
                // Catatan: rollback nilai lama butuh tabel draft (belum ada di schema).
                $mitraProfile->update([
                    'verification_status' => 'aktif',
                ]);

                RejectionReason::create([
                    'user_id' => $user->id,
                    'reason'  => $request->reason,
                ]);
            } else {
                // Tolak pendaftaran mitra baru
                $mitraProfile->update([
                    'verification_status' => 'ditolak',
                ]);

                RejectionReason::create([
                    'user_id' => $user->id,
                    'reason'  => $request->reason,
                ]);
            }
        });

        $statusText = $request->status === 'aktif'
            ? 'disetujui'
            : ($wasPendingUpdate ? 'ditolak (status mitra tetap aktif)' : 'ditolak');

        return response()->json([
            'success' => true,
            'message' => "Mitra berhasil {$statusText}",
            'data'    => $user->load('mitraProfile'),
        ]);
    }
}
