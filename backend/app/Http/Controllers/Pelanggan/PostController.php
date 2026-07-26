<?php

namespace App\Http\Controllers\Pelanggan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\CreatePostRequest;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * GET /api/posts — daftar post open (publik).
     * Support filter: search, provinsi, kabupaten, kecamatan, urgensi.
     * Order: urgensi (mendesak dulu), lalu created_at desc.
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
            'message' => 'Daftar postingan berhasil diambil',
            'data'    => $posts,
        ]);
    }

    /**
     * POST /api/posts — buat postingan baru (pelanggan).
     */
    public function store(CreatePostRequest $request): JsonResponse
    {
        $post = Post::create([
            'user_id'        => $request->user()->id,
            'judul'          => $request->judul,
            'deskripsi'      => $request->deskripsi,
            'provinsi'       => $request->provinsi,
            'kabupaten'      => $request->kabupaten,
            'kecamatan'      => $request->kecamatan,
            'estimasi_waktu' => $request->estimasi_waktu,
            'budget'         => $request->budget,
            'urgensi'        => $request->urgensi,
            'status'         => 'open',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Postingan berhasil dibuat',
            'data'    => $post->load('user:id,nama'),
        ], 201);
    }

    /**
     * GET /api/posts/{id} — detail postingan (publik).
     */
    public function show(int $id): JsonResponse
    {
        $post = Post::with([
            'user:id,nama,foto_profil',
            'user.pelangganProfile:id,user_id,provinsi,kabupaten,kecamatan',
            'claim.mitra:id,nama,foto_profil',
            'claim.mitra.mitraProfile:user_id,badge,rating_rata,total_job_selesai',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Detail postingan berhasil diambil',
            'data'    => $post,
        ]);
    }

    /**
     * GET /api/pelanggan/posts — daftar post milik pelanggan yang login.
     */
    public function myPosts(Request $request): JsonResponse
    {
        $posts = Post::where('user_id', $request->user()->id)
            ->with([
                'claim:id,post_id,status,mitra_id',
                'transaction:id,post_id,status,amount',
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Postingan saya berhasil diambil',
            'data'    => $posts,
        ]);
    }

    /**
     * PATCH /api/posts/{id} — edit postingan (hanya jika masih open).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $post = Post::findOrFail($id);

        // Pastikan yang edit adalah pemilik post
        if ($post->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengedit postingan ini',
            ], 403);
        }

        // Hanya bisa edit jika status masih open
        if ($post->status !== 'open') {
            return response()->json([
                'success' => false,
                'message' => 'Postingan tidak dapat diedit karena sudah diklaim atau selesai',
            ], 422);
        }

        $request->validate([
            'judul'          => 'sometimes|string|max:255',
            'deskripsi'      => 'sometimes|string',
            'provinsi'       => 'sometimes|string|max:100',
            'kabupaten'      => 'sometimes|string|max:100',
            'kecamatan'      => 'sometimes|string|max:100',
            'estimasi_waktu' => 'sometimes|nullable|string|max:100',
            'budget'         => 'sometimes|integer|min:1000',
            'urgensi'        => 'sometimes|in:biasa,penting,mendesak',
        ]);

        $post->update($request->only([
            'judul', 'deskripsi', 'provinsi', 'kabupaten',
            'kecamatan', 'estimasi_waktu', 'budget', 'urgensi',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Postingan berhasil diperbarui',
            'data'    => $post->fresh(),
        ]);
    }

    /**
     * DELETE /api/posts/{id} — hapus postingan (hanya jika masih open).
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $post = Post::findOrFail($id);

        // Pastikan yang hapus adalah pemilik post
        if ($post->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk menghapus postingan ini',
            ], 403);
        }

        // Hanya bisa hapus jika status masih open
        if ($post->status !== 'open') {
            return response()->json([
                'success' => false,
                'message' => 'Postingan tidak dapat dihapus karena sudah diklaim atau selesai',
            ], 422);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Postingan berhasil dihapus',
        ]);
    }
}
