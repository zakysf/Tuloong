<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Ambil semua settings sebagai key-value object.
     * GET /api/admin/settings
     */
    public function index(): JsonResponse
    {
        $settings = Setting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'message' => 'Settings berhasil diambil',
            'data'    => $settings,
        ]);
    }

    /**
     * Update satu atau beberapa setting sekaligus.
     * PATCH /api/admin/settings
     * Body: { "qris_url": "https://new-url.com", "app_name": "Tuloong" }
     */
    public function update(Request $request): JsonResponse
    {
        $data = $request->all();

        foreach ($data as $key => $value) {
            // Hanya update setting yang sudah ada (jangan buat baru)
            $setting = Setting::where('key', $key)->first();
            if ($setting) {
                $setting->update(['value' => $value]);
            }
        }

        // Return settings terbaru
        $settings = Setting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'message' => 'Settings berhasil diperbarui',
            'data'    => $settings,
        ]);
    }
}
