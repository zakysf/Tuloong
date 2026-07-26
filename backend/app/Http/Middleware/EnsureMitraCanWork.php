<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMitraCanWork
{
    /**
     * Izinkan mitra yang sudah pernah aktif mengakses job berjalan.
     * Status verification: aktif ATAU pending_update (PRD: job berjalan tidak terganggu).
     * Klaim job baru tetap diproteksi oleh EnsureMitraActive.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || $user->role !== 'mitra') {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak',
            ], 403);
        }

        $mitraProfile = $user->mitraProfile;
        $allowed = ['aktif', 'pending_update'];

        if (!$mitraProfile || !in_array($mitraProfile->verification_status, $allowed, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Akun mitra belum aktif atau sedang dalam proses verifikasi',
            ], 403);
        }

        return $next($request);
    }
}
