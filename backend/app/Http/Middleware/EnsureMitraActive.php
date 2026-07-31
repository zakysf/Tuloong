<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMitraActive
{
    /**
     * Handle an incoming request.
     * Cek apakah mitra sudah aktif (terverifikasi oleh admin).
     * Mitra dengan status pending, ditolak, atau pending_update tidak bisa mengakses endpoint ini.
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

        if (!$mitraProfile || $mitraProfile->verification_status !== 'aktif') {
            return response()->json([
                'success' => false,
                'message' => 'Akun mitra belum aktif atau sedang dalam proses verifikasi',
            ], 403);
        }

        return $next($request);
    }
}
