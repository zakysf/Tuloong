<?php

namespace App\Http\Controllers\Pelanggan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\InitiateTransactionRequest;
use App\Models\Claim;
use App\Models\Transaction;
use App\Services\MidtransService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    protected MidtransService $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    /**
     * GET /api/pelanggan/transactions — daftar transaksi pelanggan yang login.
     */
    public function index(Request $request): JsonResponse
    {
        $transactions = Transaction::where('pelanggan_id', $request->user()->id)
            ->with([
                'post:id,judul,status',
                'mitra:id,nama,foto_profil',
                'claim:id,status',
                'review:id,transaction_id,rating',
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Daftar transaksi berhasil diambil',
            'data'    => $transactions,
        ]);
    }

    /**
     * POST /api/transactions — inisiasi pembayaran via Midtrans Snap.
     */
    public function store(InitiateTransactionRequest $request): JsonResponse
    {
        $pelanggan = $request->user();
        $claim = Claim::with('post')->findOrFail($request->claim_id);

        // Validasi: claim harus milik pelanggan ini
        if ($claim->post->user_id !== $pelanggan->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke claim ini',
            ], 403);
        }

        // Validasi: belum ada transaksi untuk claim ini
        if ($claim->transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi untuk pekerjaan ini sudah ada',
            ], 400);
        }

        // Validasi: claim harus sudah dalam status claimed
        if (!in_array($claim->status, ['claimed', 'on_the_way', 'working'])) {
            return response()->json([
                'success' => false,
                'message' => 'Pekerjaan belum diklaim oleh mitra',
            ], 422);
        }

        $transaction = DB::transaction(function () use ($pelanggan, $claim) {
            return Transaction::create([
                'post_id'      => $claim->post_id,
                'claim_id'     => $claim->id,
                'pelanggan_id' => $pelanggan->id,
                'mitra_id'     => $claim->mitra_id,
                'amount'       => $claim->post->budget,
                'status'       => 'pending',
            ]);
        });

        try {
            if (empty(config('midtrans.server_key'))) {
                $snapToken = 'dummy-snap-token';
                $transaction->update(['midtrans_order_id' => 'DUMMY-' . $transaction->id]);
            } else {
                $snapToken = $this->midtransService->createSnapToken($transaction);
            }
        } catch (\Exception $e) {
            // Jika Midtrans gagal, kembalikan transaksi tanpa snap_token
            return response()->json([
                'success' => true,
                'message' => 'Transaksi dibuat namun gagal mendapatkan token pembayaran. Coba lagi.',
                'data'    => [
                    'transaction_id'   => $transaction->id,
                    'amount'           => $transaction->amount,
                    'midtrans_order_id' => $transaction->midtrans_order_id,
                    'snap_token'        => null,
                ],
            ], 201);
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dibuat',
            'data'    => [
                'transaction_id'   => $transaction->id,
                'amount'           => $transaction->amount,
                'midtrans_order_id' => $transaction->fresh()->midtrans_order_id,
                'snap_token'        => $snapToken,
            ],
        ], 201);
    }

    /**
     * GET /api/mitra/transactions — daftar transaksi mitra yang login.
     */
    public function mitraIndex(Request $request): JsonResponse
    {
        $transactions = Transaction::where('mitra_id', $request->user()->id)
            ->with([
                'post:id,judul,status',
                'pelanggan:id,nama,foto_profil',
                'claim:id,status',
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Daftar transaksi berhasil diambil',
            'data'    => $transactions,
        ]);
    }
}
