<?php
// =====================================================
// FIXPERM.PHP - Fix file permissions for Laravel
// HAPUS FILE INI SETELAH SELESAI DIGUNAKAN!
// =====================================================

$basePath = dirname(__DIR__); // root Laravel

$dirs = [
    $basePath . '/app',
    $basePath . '/config',
    $basePath . '/routes',
    $basePath . '/database',
    $basePath . '/resources',
    $basePath . '/vendor',
    $basePath . '/storage',
    $basePath . '/bootstrap/cache',
];

function fixPermissions($path, &$count = 0) {
    if (!file_exists($path)) {
        echo "❌ Path tidak ditemukan: $path<br>";
        return;
    }

    if (is_dir($path)) {
        chmod($path, 0755);
        $count++;
        $items = @scandir($path);
        if ($items) {
            foreach ($items as $item) {
                if ($item === '.' || $item === '..') continue;
                fixPermissions($path . DIRECTORY_SEPARATOR . $item, $count);
            }
        }
    } else {
        chmod($path, 0644);
        $count++;
    }
}

echo "<h2>🔧 Laravel Permission Fixer</h2>";
echo "<pre>";

foreach ($dirs as $dir) {
    $count = 0;
    echo "📁 Fixing: $dir\n";
    fixPermissions($dir, $count);
    echo "   ✅ Fixed $count items\n\n";
}

echo "</pre>";
echo "<h3>✅ Selesai! Silakan hapus file ini dari server.</h3>";
echo "<p style='color:red'><strong>⚠️ PENTING: Hapus file fixperm.php dari server setelah ini!</strong></p>";
