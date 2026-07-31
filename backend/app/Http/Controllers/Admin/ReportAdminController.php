<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportAdminController extends Controller
{
    /**
     * List semua laporan dengan filter.
     * GET /api/admin/reports?status=pending
     *
     * Controller ini bergantung pada model Report dari Dev Backend 2.
     * Menggunakan DB query builder sebagai fallback.
     */
    public function index(Request $request): JsonResponse
    {
        if (class_exists('App\\Models\\Report')) {
            $query = \App\Models\Report::with([
                'reporter:id,nama,email,role',
                'reported:id,nama,email,role',
            ]);

            if ($request->has('status')) {
                $query->where('status', $request->query('status'));
            }

            $reports = $query->orderBy('created_at', 'desc')->paginate(15);
        } else {
            // Fallback: gunakan DB query builder
            $query = DB::table('reports')
                ->join('users as reporter', 'reports.reporter_id', '=', 'reporter.id')
                ->join('users as reported', 'reports.reported_id', '=', 'reported.id')
                ->select(
                    'reports.*',
                    'reporter.nama as reporter_nama',
                    'reporter.email as reporter_email',
                    'reporter.role as reporter_role',
                    'reported.nama as reported_nama',
                    'reported.email as reported_email',
                    'reported.role as reported_role'
                );

            if ($request->has('status')) {
                $query->where('reports.status', $request->query('status'));
            }

            $reports = $query->orderBy('reports.created_at', 'desc')->paginate(15);
        }

        return response()->json([
            'success' => true,
            'message' => 'Daftar laporan berhasil diambil',
            'data'    => $reports,
        ]);
    }

    /**
     * Update status laporan → ditindaklanjuti.
     * PATCH /api/admin/reports/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        if (class_exists('App\\Models\\Report')) {
            $report = \App\Models\Report::findOrFail($id);

            if ($report->status === 'ditindaklanjuti') {
                return response()->json([
                    'success' => false,
                    'message' => 'Laporan sudah ditindaklanjuti',
                ], 400);
            }

            $report->update(['status' => 'ditindaklanjuti']);

            return response()->json([
                'success' => true,
                'message' => 'Laporan berhasil ditindaklanjuti',
                'data'    => $report,
            ]);
        } else {
            // Fallback: gunakan DB query builder
            $report = DB::table('reports')->where('id', $id)->first();

            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'Laporan tidak ditemukan',
                ], 404);
            }

            if ($report->status === 'ditindaklanjuti') {
                return response()->json([
                    'success' => false,
                    'message' => 'Laporan sudah ditindaklanjuti',
                ], 400);
            }

            DB::table('reports')->where('id', $id)->update([
                'status'     => 'ditindaklanjuti',
                'updated_at' => now(),
            ]);

            $report = DB::table('reports')->where('id', $id)->first();

            return response()->json([
                'success' => true,
                'message' => 'Laporan berhasil ditindaklanjuti',
                'data'    => $report,
            ]);
        }
    }
}
