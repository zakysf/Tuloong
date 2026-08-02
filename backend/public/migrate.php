<?php
// =====================================================
// MIGRATE.PHP - Jalankan Laravel Migrations via Browser
// HAPUS FILE INI SETELAH SELESAI DIGUNAKAN!
// =====================================================

define('LARAVEL_START', microtime(true));

$appPath = dirname(__DIR__);

require $appPath . '/vendor/autoload.php';

$app = require_once $appPath . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

echo "<h2>🔧 Laravel Migration Runner</h2>";
echo "<pre>";

$exitCode = $kernel->call('migrate', ['--force' => true]);

echo $kernel->output();

if ($exitCode === 0) {
    echo "\n✅ Migrasi berhasil!\n";
} else {
    echo "\n❌ Migrasi gagal dengan exit code: $exitCode\n";
}

echo "</pre>";
echo "<p style='color:red'><strong>⚠️ HAPUS file migrate.php dari server setelah ini!</strong></p>";
