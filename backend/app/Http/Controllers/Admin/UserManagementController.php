<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    /**
     * Nonaktifkan akun user (pelanggan atau mitra).
     * PATCH /api/admin/users/{id}/deactivate
     */
    public function deactivate(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Admin tidak bisa menonaktifkan dirinya sendiri
        if ($user->role === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menonaktifkan akun admin',
            ], 400);
        }

        if ($user->status === 'nonaktif') {
            return response()->json([
                'success' => false,
                'message' => 'Akun sudah nonaktif',
            ], 400);
        }

        $user->update(['status' => 'nonaktif']);

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil dinonaktifkan',
            'data'    => $user,
        ]);
    }

    /**
     * Reaktifkan akun user.
     * PATCH /api/admin/users/{id}/reactivate
     */
    public function reactivate(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->status === 'aktif') {
            return response()->json([
                'success' => false,
                'message' => 'Akun sudah aktif',
            ], 400);
        }

        $user->update(['status' => 'aktif']);

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil diaktifkan kembali',
            'data'    => $user,
        ]);
    }
}
