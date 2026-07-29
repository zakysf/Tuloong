"use client";

import { useState } from "react";
import { Loader2, X, AlertTriangle } from "lucide-react";
import { createReport } from "@/lib/services/report.service";
import type { ReportAlasan } from "@/types/post";
import { Button } from "@/components/ui/button";

interface ReportModalProps {
  claimId: number;
  reportedName: string;
  onClose: () => void;
}

export default function ReportModal({ claimId, reportedName, onClose }: ReportModalProps) {
  const [alasan, setAlasan] = useState<ReportAlasan | "">("");
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const alasanOptions: { label: string; value: ReportAlasan }[] = [
    { label: "Tidak Responsif", value: "tidak_responsif" },
    { label: "Perilaku Tidak Pantas / Kasar", value: "perilaku_tidak_pantas" },
    { label: "Pekerjaan Tidak Sesuai", value: "deskripsi_tidak_sesuai" },
    { label: "Lainnya", value: "lainnya" }
  ];

  const handleSubmit = async () => {
    if (!alasan) {
      setError("Silakan pilih alasan pelaporan.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createReport({
        claim_id: claimId,
        alasan: alasan as ReportAlasan,
        detail,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengirim laporan.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center animate-in zoom-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-green-600" size={32} />
          </div>
          <h2 className="font-bold text-xl text-gray-900 mb-2">Laporan Diterima</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Terima kasih. Laporan Anda mengenai <strong>{reportedName}</strong> akan segera ditinjau oleh tim Admin kami.
          </p>
          <Button onClick={onClose} className="w-full">Tutup</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-red-50 text-red-800">
          <h2 className="font-bold flex items-center gap-2"><AlertTriangle size={18} /> Laporkan Pengguna</h2>
          <button onClick={onClose} className="hover:text-red-900">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-gray-600">
            Anda melaporkan: <span className="font-bold text-gray-900">{reportedName}</span>
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Alasan</label>
            <div className="space-y-2">
              {alasanOptions.map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="alasan" 
                    value={opt.value} 
                    className="w-4 h-4 text-red-600"
                    onChange={(e) => setAlasan(e.target.value as ReportAlasan)}
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detail Tambahan (Opsional)
            </label>
            <textarea
              className="w-full h-24 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
              placeholder="Ceritakan kronologi singkat..."
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 h-11"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Kirim Laporan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
