<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Http\Requests\Report\CreateReportRequest;
use App\Models\Claim;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * POST /api/reports — buat laporan terkait claim.
     * Hanya pihak yang terlibat dalam claim (pelanggan atau mitra) yang bisa melapor.
     */
    public function store(CreateReportRequest $request): JsonResponse
    {
        $user  = $request->user();
        $claim = Claim::with('post')->findOrFail($request->claim_id);

        // Validasi bisnis 1: user harus terlibat dalam claim
        $isPelangganTerlibat = $user->role === 'pelanggan' && $claim->post->user_id === $user->id;
        $isMitraTerlibat     = $user->role === 'mitra' && $claim->mitra_id === $user->id;

        if (!$isPelangganTerlibat && !$isMitraTerlibat) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak terlibat dalam pekerjaan ini',
            ], 403);
        }

        // Validasi bisnis 2: claim harus masih aktif (bukan done/cancelled)
        $claimAktif = ['on_the_way', 'working', 'done_by_mitra'];
        if (!in_array($claim->status, $claimAktif)) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat melapor pada transaksi yang sudah selesai atau belum dimulai',
            ], 422);
        }

        // Tentukan siapa yang dilaporkan
        if ($isMitraTerlibat) {
            // Mitra melaporkan pelanggan
            $reportedId = $claim->post->user_id;
        } else {
            // Pelanggan melaporkan mitra
            $reportedId = $claim->mitra_id;
        }

        $report = Report::create([
            'reporter_id' => $user->id,
            'reported_id' => $reportedId,
            'claim_id'    => $claim->id,
            'alasan'      => $request->alasan,
            'detail'      => $request->detail,
            'status'      => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Laporan berhasil dikirim dan akan segera ditinjau oleh admin',
            'data'    => $report,
        ], 201);
    }
}
