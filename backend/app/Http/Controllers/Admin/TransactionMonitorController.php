<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionMonitorController extends Controller
{
    /**
     * List semua transaksi (read-only) dengan filter.
     * GET /api/admin/transactions?status=paid&tanggal_dari=2026-01-01&tanggal_sampai=2026-12-31
     *
     * Controller ini bergantung pada model Transaction dari Dev Backend 2.
     * Menggunakan DB query builder sebagai fallback jika model belum tersedia.
     */
    public function index(Request $request): JsonResponse
    {
        // Gunakan model Transaction jika tersedia, fallback ke query builder
        if (class_exists('App\\Models\\Transaction')) {
            $query = \App\Models\Transaction::with(['pelanggan:id,nama,email', 'mitra:id,nama,email', 'post:id,judul']);
        } else {
            // Fallback: gunakan DB query builder
            $query = \Illuminate\Support\Facades\DB::table('transactions')
                ->join('users as pelanggan', 'transactions.pelanggan_id', '=', 'pelanggan.id')
                ->join('users as mitra', 'transactions.mitra_id', '=', 'mitra.id')
                ->join('posts', 'transactions.post_id', '=', 'posts.id')
                ->select(
                    'transactions.*',
                    'pelanggan.nama as pelanggan_nama',
                    'pelanggan.email as pelanggan_email',
                    'mitra.nama as mitra_nama',
                    'mitra.email as mitra_email',
                    'posts.judul as post_judul'
                );
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('transactions.status', $request->query('status'));
        }

        // Filter by tanggal
        if ($request->has('tanggal_dari')) {
            $query->where('transactions.created_at', '>=', $request->query('tanggal_dari'));
        }
        if ($request->has('tanggal_sampai')) {
            $query->where('transactions.created_at', '<=', $request->query('tanggal_sampai') . ' 23:59:59');
        }

        $transactions = $query->orderBy('transactions.created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Daftar transaksi berhasil diambil',
            'data'    => $transactions,
        ]);
    }
}
