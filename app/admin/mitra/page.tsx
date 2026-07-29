"use client";

import { useEffect, useState } from "react";
import { getAdminMitra, verifyMitra } from "@/lib/services/admin.service";
import type { AdminMitra } from "@/types/admin";
import { Search, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminVerifikasiMitraPage() {
  const [mitras, setMitras] = useState<AdminMitra[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Modal Detail State
  const [selectedMitra, setSelectedMitra] = useState<AdminMitra | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchMitras = async () => {
    setLoading(true);
    try {
      const data = await getAdminMitra({ status: statusFilter as any });
      setMitras(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMitras();
  }, [statusFilter]);

  const handleAction = async (id: number, status: "aktif" | "ditolak") => {
    if (status === "ditolak" && !rejectReason.trim()) {
      alert("Alasan penolakan harus diisi.");
      return;
    }
    
    setProcessingId(id);
    try {
      await verifyMitra(id, { status, reason: rejectReason });
      setSelectedMitra(null);
      setRejectReason("");
      fetchMitras();
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal memverifikasi mitra.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredMitras = mitras.filter(m => 
    m.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.mitra_profile.nomor_ktp.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verifikasi Mitra</h1>
        <p className="text-gray-500 mt-1">Tinjau dan setujui pendaftaran mitra baru.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {["pending", "aktif", "ditolak"].map((status) => (
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
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama atau NIK KTP..."
              className="w-full pl-10 pr-4 h-10 border rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">Memuat data...</div>
        ) : filteredMitras.length === 0 ? (
          <div className="p-10 text-center text-gray-500">Tidak ada mitra dengan status ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm">
                  <th className="pb-3 px-4 font-medium">Nama Mitra</th>
                  <th className="pb-3 px-4 font-medium">Lokasi</th>
                  <th className="pb-3 px-4 font-medium">Tgl Daftar</th>
                  <th className="pb-3 px-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMitras.map((mitra) => (
                  <tr key={mitra.id} className="hover:bg-gray-50/50">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">{mitra.nama}</p>
                      <p className="text-xs text-gray-500">{mitra.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900">{mitra.mitra_profile.kabupaten}</p>
                      <p className="text-xs text-gray-500">{mitra.mitra_profile.provinsi}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(mitra.mitra_profile.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedMitra(mitra)}>
                        Lihat Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMitra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">Detail Verifikasi Mitra</h2>
              <button onClick={() => setSelectedMitra(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-6 flex-1">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Informasi Akun</h3>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="text-gray-500 w-24 inline-block">Nama</span> : <span className="font-medium">{selectedMitra.nama}</span></p>
                    <p className="text-sm"><span className="text-gray-500 w-24 inline-block">Email</span> : <span className="font-medium">{selectedMitra.email}</span></p>
                    <p className="text-sm"><span className="text-gray-500 w-24 inline-block">Telepon</span> : <span className="font-medium">{selectedMitra.nomor_telepon}</span></p>
                  </div>
                  
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3">Informasi Bank</h3>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="text-gray-500 w-24 inline-block">Bank</span> : <span className="font-medium">{selectedMitra.mitra_profile.nama_bank}</span></p>
                    <p className="text-sm"><span className="text-gray-500 w-24 inline-block">No Rek</span> : <span className="font-medium">{selectedMitra.mitra_profile.nomor_rekening}</span></p>
                    <p className="text-sm"><span className="text-gray-500 w-24 inline-block">A.n</span> : <span className="font-medium">{selectedMitra.mitra_profile.nama_pemilik_rekening}</span></p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Dokumen KTP</h3>
                  <p className="text-sm mb-2"><span className="text-gray-500">NIK</span> : <span className="font-medium">{selectedMitra.mitra_profile.nomor_ktp}</span></p>
                  <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <a href={selectedMitra.mitra_profile.foto_ktp} target="_blank" rel="noopener noreferrer">
                      <img src={selectedMitra.mitra_profile.foto_ktp} className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" alt="KTP" />
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-center">Klik gambar untuk memperbesar</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Deskripsi Keahlian</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed">
                  {selectedMitra.mitra_profile.deskripsi_keahlian}
                </p>
              </div>

              {selectedMitra.mitra_profile.verification_status === "pending" && (
                <div className="pt-6 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alasan Penolakan (Hanya jika menolak)</label>
                  <textarea
                    className="w-full h-20 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-500 resize-none"
                    placeholder="Contoh: Foto KTP buram / Nama tidak sesuai dengan KTP..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
              )}
            </div>

            {selectedMitra.mitra_profile.verification_status === "pending" && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                <Button 
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => handleAction(selectedMitra.id, "ditolak")}
                  disabled={processingId === selectedMitra.id}
                >
                  {processingId === selectedMitra.id ? <Loader2 size={16} className="animate-spin mr-2" /> : <X size={16} className="mr-2" />}
                  Tolak Mitra
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleAction(selectedMitra.id, "aktif")}
                  disabled={processingId === selectedMitra.id}
                >
                  {processingId === selectedMitra.id ? <Loader2 size={16} className="animate-spin mr-2" /> : <Check size={16} className="mr-2" />}
                  Setujui Mitra
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
