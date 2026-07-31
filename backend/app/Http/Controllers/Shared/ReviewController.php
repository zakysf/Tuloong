<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\CreateReviewRequest;
use App\Models\Review;
use App\Models\Transaction;
use App\Services\BadgeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    protected BadgeService $badgeService;

    public function __construct(BadgeService $badgeService)
    {
        $this->badgeService = $badgeService;
    }

    /**
     * GET /api/mitra/{id}/reviews — daftar review mitra (publik).
     */
    public function index(int $id): JsonResponse
    {
        $reviews = Review::where('mitra_id', $id)
            ->with('pelanggan:id,nama,foto_profil')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Ulasan mitra berhasil diambil',
            'data'    => $reviews,
        ]);
    }

    /**
     * POST /api/transactions/{id}/review — pelanggan beri review setelah pekerjaan selesai.
     */
    public function store(CreateReviewRequest $request, int $id): JsonResponse
    {
        $pelanggan   = $request->user();
        $transaction = Transaction::with('claim')->findOrFail($id);

        // Validasi 1: transaksi harus milik pelanggan yang login
        if ($transaction->pelanggan_id !== $pelanggan->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke transaksi ini',
            ], 403);
        }

        // Validasi 2: transaksi harus berstatus completed
        if ($transaction->status !== 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Ulasan hanya dapat diberikan setelah pekerjaan selesai',
            ], 422);
        }

        // Validasi 3: belum pernah direview
        if ($transaction->review) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah memberikan ulasan untuk pekerjaan ini',
            ], 400);
        }

        $review = Review::create([
            'transaction_id' => $transaction->id,
            'pelanggan_id'   => $pelanggan->id,
            'mitra_id'       => $transaction->mitra_id,
            'rating'         => $request->rating,
            'review'         => $request->review,
            'created_at'     => now(),
        ]);

        // Update rating_rata dan evaluasi badge mitra
        $this->badgeService->recalculateAndEvaluate($transaction->mitra_id);

        return response()->json([
            'success' => true,
            'message' => 'Ulasan berhasil diberikan',
            'data'    => $review->load('pelanggan:id,nama,foto_profil'),
        ], 201);
    }
}
