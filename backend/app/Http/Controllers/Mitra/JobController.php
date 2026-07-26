<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobController extends Controller
{
    /**
     * GET /api/posts — daftar job open untuk mitra.
     * (Endpoint sama dengan PostController@index tapi dari perspektif mitra)
     * Filter: search, provinsi, kabupaten, kecamatan, urgensi.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'provinsi', 'kabupaten', 'kecamatan', 'urgensi']);

        $posts = Post::open()
            ->filter($filters)
            ->with([
                'user:id,nama,foto_profil',
                'user.pelangganProfile:id,user_id,provinsi,kabupaten,kecamatan',
            ])
            ->orderByUrgensi()
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Daftar job tersedia berhasil diambil',
            'data'    => $posts,
        ]);
    }

    /**
     * GET /api/posts/{id} — detail job untuk mitra.
     */
    public function show(int $id): JsonResponse
    {
        $post = Post::with([
            'user:id,nama,foto_profil',
            'user.pelangganProfile:id,user_id,provinsi,kabupaten,kecamatan',
            'claim:id,post_id,status,mitra_id',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Detail job berhasil diambil',
            'data'    => $post,
        ]);
    }
}
