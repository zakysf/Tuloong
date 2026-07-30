"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getMyJobs } from "@/lib/services/claim.service";
import Link from "next/link";
import { Search, Briefcase, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MitraDashboard() {
  const { user } = useAuth();
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const jobs = await getMyJobs();
        const active = jobs.filter((c: any) => c.status !== "done_by_mitra" && c.status !== "cancelled");
        setActiveJobsCount(active.length);
      } catch (error: any) {
        console.error("Gagal memuat data dashboard:", error?.message || error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Memuat dashboard...</div>;
  }

  const mitraInfo = user?.mitra_profile;

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
