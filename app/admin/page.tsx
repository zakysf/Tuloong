"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getAdminMitra, getAdminTransactions, getAdminReports } from "@/lib/services/admin.service";
import Link from "next/link";
import { Users, History, AlertTriangle, Activity } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    mitraPending: 0,
    transaksiHariIni: 0,
    laporanPending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [mitra, trans, reports] = await Promise.all([
          getAdminMitra({ status: "pending" }),
          getAdminTransactions(),
          getAdminReports({ status: "pending" })
        ]);

        const today = new Date().toISOString().split("T")[0];
        const transToday = trans.filter(t => t.created_at.startsWith(today)).length;

        setStats({
          mitraPending: mitra.length,
          transaksiHariIni: transToday,
          laporanPending: reports.length,
        });
      } catch (error) {
        console.error("Gagal memuat stats admin", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Memuat dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Selamat datang kembali, {user?.nama}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/mitra" className="block">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-teal-500 hover:shadow-md transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Verifikasi Mitra Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.mitraPending}</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/transaksi" className="block">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-teal-500 hover:shadow-md transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <History size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Transaksi Hari Ini</p>
              <p className="text-2xl font-bold text-gray-900">{stats.transaksiHariIni}</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/laporan" className="block">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-teal-500 hover:shadow-md transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Laporan Masalah (Pending)</p>
              <p className="text-2xl font-bold text-gray-900">{stats.laporanPending}</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center mt-6">
        <Activity size={48} className="mx-auto text-teal-600 mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Pantau Aktivitas Platform</h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Pastikan semua transaksi berjalan lancar dan semua keluhan pelanggan ditangani dengan cepat.
        </p>
      </div>
    </div>
  );
}
