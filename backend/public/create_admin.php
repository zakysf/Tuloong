<?php
// =====================================================
// CREATE_ADMIN.PHP - Buat akun admin dengan password Bcrypt
// HAPUS FILE INI SETELAH SELESAI DIGUNAKAN!
// =====================================================

define('LARAVEL_START', microtime(true));

$appPath = dirname(__DIR__);

require $appPath . '/vendor/autoload.php';

$app = require_once $appPath . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

// =====================================================
// KONFIGURASI ADMIN — Ubah sesuai kebutuhan
// =====================================================
$adminEmail    = 'admin@tuloong.com';
$adminPassword = 'Admin123!';
$adminNama     = 'Administrator';
// =====================================================

echo "<h2>👤 Tuloong Admin Creator</h2>";
echo "<pre>";

try {
    // Cek apakah admin sudah ada
    $existing = DB::table('users')->where('email', $adminEmail)->first();

    if ($existing) {
        // Update password jika sudah ada
        DB::table('users')->where('email', $adminEmail)->update([
            'password' => Hash::make($adminPassword),
            'role'     => 'admin',
            'status'   => 'aktif',
            'email_verified_at' => now(),
        ]);
        echo "✅ Password admin berhasil direset!\n";
        echo "   Email    : $adminEmail\n";
        echo "   Password : $adminPassword\n";
    } else {
        // Buat admin baru
        DB::table('users')->insert([
            'nama'              => $adminNama,
            'email'             => $adminEmail,
            'password'          => Hash::make($adminPassword),
            'role'              => 'admin',
            'status'            => 'aktif',
            'email_verified_at' => now(),
            'created_at'        => now(),
            'updated_at'        => now(),
        ]);
        echo "✅ Akun admin berhasil dibuat!\n";
        echo "   Email    : $adminEmail\n";
        echo "   Password : $adminPassword\n";
    }

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "</pre>";
echo "<p style='color:red'><strong>⚠️ HAPUS file create_admin.php dari server setelah ini!</strong></p>";
