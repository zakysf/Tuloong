<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Http\Requests\Claim\UpdateStatusRequest;
use App\Models\Claim;
use App\Models\MitraProfile;
use App\Models\Post;
use App\Services\BadgeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClaimController extends Controller
{
    protected BadgeService $badgeService;

    public function __construct(BadgeService $badgeService)
    {
        $this->badgeService = $badgeService;
    }

    /**
     * POST /api/posts/{id}/claim — mitra klaim sebuah job.
     */
    public function store(Request $request, int $id): JsonResponse
    {
        $mitra = $request->user();
        $mitraProfile = $mitra->mitraProfile;

        // Validasi 1: harus mitra aktif
        if (!$mitraProfile || $mitraProfile->verification_status !== 'aktif') {
            return response()->json([
                'success' => false,
                'message' => 'Akun mitra belum aktif atau sedang dalam proses verifikasi',
            ], 403);
        }

        $post = Post::findOrFail($id);

        // Validasi 2: post harus berstatus open
        if ($post->status !== 'open') {
            return response()->json([
                'success' => false,
                'message' => 'Postingan ini sudah diklaim oleh mitra lain atau tidak tersedia',
            ], 422);
        }

        // Validasi 3: mitra tidak bisa klaim post milik sendiri
        if ($post->user_id === $mitra->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak dapat mengklaim postingan Anda sendiri',
            ], 422);
        }

        // Validasi 4: belum ada claim untuk post ini
        if ($post->claim) {
            return response()->json([
                'success' => false,
                'message' => 'Postingan ini sudah diklaim',
            ], 422);
        }

        $claim = DB::transaction(function () use ($mitra, $post) {
            $claim = Claim::create([
                'post_id'    => $post->id,
                'mitra_id'   => $mitra->id,
                'status'     => 'claimed',
                'claimed_at' => now(),
            ]);

            $post->update(['status' => 'in_progress']);

            return $claim;
        });

        return response()->json([
            'success' => true,
            'message' => 'Job berhasil diklaim',
            'data'    => [
                'claim' => $claim->load('mitra:id,nama'),
                'post'  => $post->fresh(),
            ],
        ], 201);
    }

    /**
     * PATCH /api/claims/{id}/status — update status claim oleh mitra.
     */
    public function updateStatus(UpdateStatusRequest $request, int $id): JsonResponse
    {
        $mitra = $request->user();
        $claim = Claim::with(['transaction', 'post'])->findOrFail($id);

        // Validasi 1: harus mitra pemilik claim
        if ($claim->mitra_id !== $mitra->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke claim ini',
            ], 403);
        }

        // Validasi 2: transaksi harus berstatus paid
        if (!$claim->transaction || $claim->transaction->status !== 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Pembayaran belum dikonfirmasi. Status hanya bisa diubah setelah pelanggan membayar',
            ], 422);
        }

        $newStatus = $request->status;

        // Validasi 3: transisi status harus berurutan
        if (!Claim::validTransition($claim->status, $newStatus)) {
            return response()->json([
                'success' => false,
                'message' => 'Perubahan status tidak valid. Status saat ini: ' . $claim->status,
            ], 422);
        }

        if ($newStatus === 'done_by_mitra') {
            $fotoBuktiUrl = null;

            if ($request->hasFile('foto_bukti')) {
                $uploaded = cloudinary()->upload($request->file('foto_bukti')->getRealPath());
                $fotoBuktiUrl = $uploaded->getSecurePath();
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Foto bukti pekerjaan wajib diunggah',
                ], 422);
            }

            DB::transaction(function () use ($claim, $mitra, $newStatus, $fotoBuktiUrl) {
                // Update claim status & foto_bukti
                $claim->update([
                    'status' => $newStatus, 
                    'foto_bukti' => $fotoBuktiUrl,
                    'updated_at' => now()
                ]);

                // Update transaksi → completed
                $claim->transaction->update(['status' => 'completed']);

                // Update post → done
                $claim->post->update(['status' => 'done']);

                // Increment total_job_selesai mitra
                MitraProfile::where('user_id', $mitra->id)
                    ->increment('total_job_selesai');

                // Evaluasi badge mitra
                $this->badgeService->evaluate($mitra->id);
            });
        } else {
            $claim->update(['status' => $newStatus, 'updated_at' => now()]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Status pekerjaan berhasil diperbarui menjadi: ' . $newStatus,
            'data'    => $claim->fresh(['transaction', 'post']),
        ]);
    }

    /**
     * GET /api/mitra/jobs — daftar job yang sedang dikerjakan mitra.
     */
    public function myJobs(Request $request): JsonResponse
    {
        $claims = Claim::where('mitra_id', $request->user()->id)
            ->with([
                'post:id,judul,deskripsi,budget,status,provinsi,kabupaten,kecamatan',
                'post.user:id,nama,nomor_telepon,foto_profil',
                'transaction:id,claim_id,status,amount',
            ])
            ->orderBy('claimed_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Daftar job saya berhasil diambil',
            'data'    => $claims,
        ]);
    }
}
