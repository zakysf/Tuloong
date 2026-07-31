"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getMyJobs } from "@/lib/services/claim.service";
import { getRejectionReason, reviseMitraProfile, RejectionReasonResponse } from "@/lib/services/profile.service";
import Link from "next/link";
import { Search, Briefcase, Star, Trophy, Clock, XCircle, FileEdit, UploadCloud, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/FormInput";
import FormTextarea from "@/components/shared/FormTextarea";
import FileUpload from "@/components/shared/FileUpload";
import { toast } from "sonner";
import { parseApiError } from "@/lib/services/auth.service";

export default function MitraDashboard() {
  const { user, refreshUser } = useAuth();
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Revision State
  const [rejection, setRejection] = useState<RejectionReasonResponse | null>(null);
  const [nomorKtp, setNomorKtp] = useState("");
  const [deskripsiKeahlian, setDeskripsiKeahlian] = useState("");
  const [fotoKtp, setFotoKtp] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        if (user?.mitra_profile?.verification_status === "aktif") {
          const jobs = await getMyJobs();
          const active = jobs.filter((c: any) => c.status !== "done_by_mitra" && c.status !== "cancelled");
          setActiveJobsCount(active.length);
        } else if (user?.mitra_profile?.verification_status === "ditolak") {
          const reason = await getRejectionReason();
          setRejection(reason);
          setNomorKtp(user?.mitra_profile?.nomor_ktp || "");
          setDeskripsiKeahlian(user?.mitra_profile?.deskripsi_keahlian || "");
        }
      } catch (error: any) {
        console.error("Gagal memuat data dashboard:", error?.message || error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleRevise = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await reviseMitraProfile({
        nomor_ktp: nomorKtp,
        deskripsi_keahlian: deskripsiKeahlian,
        foto_ktp: fotoKtp || undefined,
      });
      await refreshUser();
      toast.success("Profil berhasil diperbarui", { description: "Menunggu verifikasi admin." });
    } catch (err: any) {
      toast.error("Gagal memperbarui profil", { description: parseApiError(err).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Memuat dashboard...</div>;
  }

  const mitraInfo = user?.mitra_profile;
  const status = mitraInfo?.verification_status;

  if (status === "pending" || status === "pending_update") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center">
          <Clock size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Menunggu Verifikasi Admin</h2>
        <p className="text-gray-500 max-w-md">
          Terima kasih telah mendaftar. Tim kami sedang memverifikasi profil Anda. 
          Proses ini biasanya memakan waktu maksimal 1x24 jam.
        </p>
      </div>
    );
  }

  if (status === "ditolak") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
          <div className="flex items-start gap-4">
            <XCircle className="text-red-500 shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-xl font-bold text-red-700">Pendaftaran Perlu Perbaikan</h2>
              <p className="text-red-600 mt-1">
                Maaf, pendaftaran Anda belum dapat kami setujui karena:
              </p>
              <div className="mt-3 p-3 bg-white/60 rounded-xl border border-red-100 text-red-900 font-medium">
                "{rejection?.reason || 'Tidak ada alasan spesifik.'}"
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <FileEdit className="text-teal-600" />
            <h3 className="text-lg font-semibold">Perbaiki Data Anda</h3>
          </div>
          <form onSubmit={handleRevise} className="space-y-5">
            <FormInput
              label="Nomor KTP (16 Digit)"
              value={nomorKtp}
              onChange={(e) => setNomorKtp(e.target.value)}
              maxLength={16}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Upload Ulang Foto KTP (Opsional)
              </label>
              <FileUpload
                onChange={setFotoKtp}
                label="Pilih atau tarik foto KTP baru ke sini"
              />
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> Kosongkan jika foto sebelumnya sudah benar
              </p>
            </div>

            <FormTextarea
              label="Deskripsi Keahlian"
              value={deskripsiKeahlian}
              onChange={(e) => setDeskripsiKeahlian(e.target.value)}
              required
              rows={4}
            />

            <Button 
              type="submit" 
              className="w-full bg-teal-700 hover:bg-teal-800" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim Ulang..." : "Kirim Ulang Pendaftaran"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Halo, {user?.nama}! 👋</h1>
          <p className="text-gray-500 mt-1">Siap membantu orang hari ini?</p>
        </div>
        <Link href="/mitra/jobs">
          <Button className="bg-teal-700 hover:bg-teal-800 gap-2 w-full md:w-auto">
            <Search size={18} />
            Cari Pekerjaan
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Job Aktif</p>
            <p className="text-2xl font-bold text-gray-900">{activeJobsCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Selesai</p>
            <p className="text-2xl font-bold text-gray-900">{mitraInfo?.total_job_selesai || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Star size={24} className="fill-amber-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Rating Rata-rata</p>
            <p className="text-2xl font-bold text-gray-900">{mitraInfo?.rating_rata ? Number(mitraInfo.rating_rata).toFixed(1) : '-'}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            mitraInfo?.badge === 'baru' ? 'bg-gray-100 text-gray-500' :
            mitraInfo?.badge === 'terpercaya' ? 'bg-blue-100 text-blue-500' :
            mitraInfo?.badge === 'profesional' ? 'bg-yellow-100 text-yellow-600' :
            'bg-teal-50 text-teal-600'
           }`}>
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Badge Saat Ini</p>
            <p className="text-lg font-bold text-gray-900">{mitraInfo?.badge || 'Newbie'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Mulai Cari Pekerjaan</h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Lihat daftar pekerjaan yang tersedia di sekitar Anda dan mulai bantu pelanggan yang membutuhkan jasa Anda.
        </p>
        <Link href="/mitra/jobs">
          <Button size="lg" className="bg-teal-700 hover:bg-teal-800">
            Jelajahi Job Sekarang
          </Button>
        </Link>
      </div>
    </div>
  );
}
