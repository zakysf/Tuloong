<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Shared\ProfileController;
use App\Http\Controllers\Admin\MitraVerificationController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\TransactionMonitorController;
use App\Http\Controllers\Admin\ReportAdminController;
use App\Http\Controllers\Admin\SettingController;
// BE2 Controllers
use App\Http\Controllers\Pelanggan\PostController;
use App\Http\Controllers\Pelanggan\TransactionController;
use App\Http\Controllers\Mitra\JobController;
use App\Http\Controllers\Mitra\ClaimController;
use App\Http\Controllers\Mitra\ProfileController as MitraProfileController;
use App\Http\Controllers\Shared\ChatController;
use App\Http\Controllers\Shared\ReviewController;
use App\Http\Controllers\Shared\ReportController;
use App\Http\Controllers\WebhookController;

/*
|--------------------------------------------------------------------------
| API Routes â€” Dev Backend 1 (User, Auth, Admin)
|           + Dev Backend 2 (Post, Claim, Transaksi, Chat, Review, Report)
|--------------------------------------------------------------------------
*/

// =====================================================
// PUBLIC ROUTES (tanpa auth)
// =====================================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Password Reset Routes
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail'])->name('password.email');
Route::post('/reset-password', [PasswordResetController::class, 'reset'])->name('password.update');

// Daftar postingan open (publik)
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

// Ulasan mitra (publik)
Route::get('/mitra/{id}/reviews', [ReviewController::class, 'index']);

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

// Settings publik (untuk frontend - qris_url, app_name, dll)
Route::get('/settings/public', function () {
    $settings = \App\Models\Setting::all()->pluck('value', 'key');

    return response()->json([
        'success' => true,
        'message' => 'Settings berhasil diambil',
        'data'    => $settings,
    ]);
});

// Webhook Midtrans (tanpa Sanctum â€” dipanggil oleh Midtrans server)
Route::post('/webhook/midtrans', [WebhookController::class, 'handle']);

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

    // =====================================================
    // SHARED ROUTES (pelanggan + mitra)
    // =====================================================
    // Chat per claim
    Route::get('/claims/{id}/messages', [ChatController::class, 'index']);
    Route::post('/claims/{id}/messages', [ChatController::class, 'store']);

    // Review & Report
    Route::post('/transactions/{id}/review', [ReviewController::class, 'store']);
    Route::post('/reports', [ReportController::class, 'store']);
});

// =====================================================
// PELANGGAN ROUTES (role: pelanggan)
// =====================================================
Route::middleware(['auth:sanctum', 'role:pelanggan'])->group(function () {
    // Posts CRUD
    Route::post('/posts', [PostController::class, 'store']);
    Route::patch('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
    Route::get('/pelanggan/posts', [PostController::class, 'myPosts']);

    // Transaksi
    Route::get('/pelanggan/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
});

// =====================================================
// MITRA ROUTES (role: mitra + mitra aktif/terverifikasi)
// =====================================================
Route::middleware(['auth:sanctum', 'role:mitra'])->group(function () {
    // Profil / Revisi
    Route::get('/mitra/rejection', [MitraProfileController::class, 'getRejectionReason']);
    Route::post('/mitra/revise', [MitraProfileController::class, 'reviseProfile']);
});

Route::middleware(['auth:sanctum', 'role:mitra', 'mitra.active'])->group(function () {
    // Browse jobs
    Route::get('/mitra/jobs', [ClaimController::class, 'myJobs']);
    Route::get('/mitra/transactions', [TransactionController::class, 'mitraIndex']);

    // Klaim & update status
    Route::post('/posts/{id}/claim', [ClaimController::class, 'store']);
    Route::patch('/claims/{id}/status', [ClaimController::class, 'updateStatus']);
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

Route::get('/test-headers', function (Illuminate\Http\Request $request) { return response()->json(['headers' => $request->headers->all()]); });

Route::get('/email/verify/{id}/{hash}', function ($id, $hash, Illuminate\Http\Request $request) {
    $user = App\Models\User::findOrFail($id);
    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => 'Invalid link'], 400);
    }
    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new Illuminate\Auth\Events\Verified($user));
    }
    return redirect('http://localhost:3000/login?verified=1');
})->middleware(['signed'])->name('verification.verify');

if (app()->environment('local')) {
    Route::post('/dev/transactions/{id}/force-paid', function ($id) {
        $transaction = \App\Models\Transaction::findOrFail($id);
        $transaction->update(['status' => 'paid']);
        return response()->json(['success' => true]);
    });
}



