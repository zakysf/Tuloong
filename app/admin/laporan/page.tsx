"use client";

import { useEffect, useState } from "react";
import { getAdminReports, tindaklanjutiReport, deactivateUser, reactivateUser } from "@/lib/services/admin.service";
import type { AdminReport } from "@/types/admin";
import { AlertTriangle, Loader2, CheckCircle, Ban, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLaporanPage() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getAdminReports({ status: statusFilter as any });
      setReports(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleTindakLanjut = async (id: number) => {
    if (!confirm("Tandai laporan ini sudah ditindaklanjuti?")) return;
    setProcessingId(id);
    try {
      await tindaklanjutiReport(id);
      fetchReports();
    } catch (err: any) {
      alert("Gagal menindaklanjuti laporan.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeactivate = async (userId: number, userName: string) => {
    if (!confirm(`Yakin ingin MENONAKTIFKAN akun ${userName}? Mereka tidak akan bisa login lagi.`)) return;
    try {
      await deactivateUser(userId);
      alert(`Akun ${userName} berhasil dinonaktifkan.`);
    } catch (error) {
      alert("Gagal menonaktifkan akun.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kelola Laporan</h1>
        <p className="text-gray-500 mt-1">Tinjau keluhan pengguna dan ambil tindakan yang diperlukan.</p>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
        {["pending", "ditindaklanjuti"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              statusFilter === status 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Memuat laporan...</div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <CheckCircle className="mx-auto text-green-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">Yeay! Tidak ada laporan bermasalah saat ini.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-red-500" size={20} />
                  <h3 className="font-bold text-red-900">{report.alasan}</h3>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(report.created_at).toLocaleString("id-ID")}
                </span>
              </div>
              
              <div className="bg-red-50/50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed mb-6 border border-red-50">
                {report.detail || "Tidak ada detail tambahan."}
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-gray-500 mb-1">Dilaporkan Oleh (Pelapor):</p>
                  <p className="font-semibold text-gray-900">{report.reporter?.nama || "User " + report.reporter_id}</p>
                  <p className="text-xs text-gray-500 capitalize">{report.reporter?.role}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Dilaporkan Terhadap (Terlapor):</p>
                  <p className="font-semibold text-gray-900">{report.reported?.nama || "User " + report.reported_id}</p>
                  <p className="text-xs text-gray-500 capitalize">{report.reported?.role}</p>
                </div>
              </div>

              {report.status === "pending" && (
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <Button 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 gap-2"
                      onClick={() => handleDeactivate(report.reported_id, report.reported?.nama || "")}
                    >
                      <Ban size={16} /> Suspend Terlapor
                    </Button>
                  </div>
                  <Button 
                    className="bg-teal-700 hover:bg-teal-800"
                    onClick={() => handleTindakLanjut(report.id)}
                    disabled={processingId === report.id}
                  >
                    {processingId === report.id ? <Loader2 size={16} className="animate-spin mr-2" /> : <CheckCircle size={16} className="mr-2" />}
                    Tandai Selesai / Ditindaklanjuti
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
