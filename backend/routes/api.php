<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Shared\ProfileController;
use App\Http\Controllers\Admin\MitraVerificationController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\TransactionMonitorController;
use App\Http\Controllers\Admin\ReportAdminController;
use App\Http\Controllers\Admin\SettingController;

/*
|--------------------------------------------------------------------------
| API Routes — Dev Backend 1 (User, Auth, Admin)
|--------------------------------------------------------------------------
*/

// =====================================================
// PUBLIC ROUTES (tanpa auth)
// =====================================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Profil publik mitra (bisa diakses tanpa login)
Route::get('/mitra/{id}/profile', function (int $id) {
    $user = \App\Models\User::where('role', 'mitra')
        ->with('mitraProfile')
        ->findOrFail($id);

    return response()->json([
        'success' => true,
        'message' => 'Profil mitra berhasil diambil',
        'data'    => [
            'id'                => $user->id,
            'nama'              => $user->nama,
            'foto_profil'       => $user->foto_profil,
            'mitra_profile'     => $user->mitraProfile ? [
                'deskripsi_keahlian'  => $user->mitraProfile->deskripsi_keahlian,
                'badge'               => $user->mitraProfile->badge,
                'provinsi'            => $user->mitraProfile->provinsi,
                'kabupaten'           => $user->mitraProfile->kabupaten,
                'kecamatan'           => $user->mitraProfile->kecamatan,
                'total_job_selesai'   => $user->mitraProfile->total_job_selesai,
                'rating_rata'         => $user->mitraProfile->rating_rata,
            ] : null,
        ],
    ]);
});

// Ulasan mitra (publik)
Route::get('/mitra/{id}/reviews', function (int $id) {
    $user = \App\Models\User::where('role', 'mitra')->findOrFail($id);

    if (class_exists('App\\Models\\Review')) {
        $reviews = \App\Models\Review::where('mitra_id', $id)
            ->with('pelanggan:id,nama,foto_profil')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    } else {
        $reviews = \Illuminate\Support\Facades\DB::table('reviews')
            ->join('users', 'reviews.pelanggan_id', '=', 'users.id')
            ->where('reviews.mitra_id', $id)
            ->select('reviews.*', 'users.nama as pelanggan_nama', 'users.foto_profil as pelanggan_foto')
            ->orderBy('reviews.created_at', 'desc')
            ->paginate(10);
    }

    return response()->json([
        'success' => true,
        'message' => 'Ulasan mitra berhasil diambil',
        'data'    => $reviews,
    ]);
});

// Settings publik (untuk frontend - qris_url, app_name, dll)
Route::get('/settings/public', function () {
    $settings = \App\Models\Setting::all()->pluck('value', 'key');

    return response()->json([
        'success' => true,
        'message' => 'Settings berhasil diambil',
        'data'    => $settings,
    ]);
});

// =====================================================
// AUTHENTICATED ROUTES (semua role)
// =====================================================
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/request-update', [ProfileController::class, 'requestUpdate']);
});

// =====================================================
// ADMIN ROUTES (role: admin)
// =====================================================
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Verifikasi mitra
    Route::get('/mitra', [MitraVerificationController::class, 'index']);
    Route::patch('/mitra/{id}/verify', [MitraVerificationController::class, 'verify']);

    // Monitoring transaksi
    Route::get('/transactions', [TransactionMonitorController::class, 'index']);

    // Kelola laporan
    Route::get('/reports', [ReportAdminController::class, 'index']);
    Route::patch('/reports/{id}', [ReportAdminController::class, 'update']);

    // User management
    Route::patch('/users/{id}/deactivate', [UserManagementController::class, 'deactivate']);
    Route::patch('/users/{id}/reactivate', [UserManagementController::class, 'reactivate']);

    // Settings
    Route::get('/settings', [SettingController::class, 'index']);
    Route::patch('/settings', [SettingController::class, 'update']);
});
