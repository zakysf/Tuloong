"use client";

import { useEffect, useState } from "react";
import { getAdminTransactions } from "@/lib/services/admin.service";
import type { AdminTransaction } from "@/types/admin";
import { Search, History } from "lucide-react";

export default function AdminTransaksiPage() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchTrans() {
      try {
        const data = await getAdminTransactions();
        setTransactions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrans();
  }, []);

  const filteredTrans = transactions.filter(t => {
    const matchStatus = statusFilter ? t.status === statusFilter : true;
    const matchSearch = 
      t.id.toString().includes(searchTerm) ||
      (t.post?.judul || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Monitoring Transaksi</h1>
        <p className="text-gray-500 mt-1">Pantau seluruh aliran dana di platform Tuloong.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari ID transaksi atau judul postingan..."
              className="w-full pl-10 pr-4 h-10 border rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              className="w-full h-10 px-3 border rounded-xl text-sm outline-none focus:border-teal-500 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed / Refunded</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">Memuat data transaksi...</div>
        ) : filteredTrans.length === 0 ? (
          <div className="p-10 text-center text-gray-500 flex flex-col items-center">
            <History className="text-gray-300 mb-3" size={40} />
            Tidak ada transaksi ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm">
                  <th className="pb-3 px-4 font-medium">ID / Tanggal</th>
                  <th className="pb-3 px-4 font-medium">Postingan</th>
                  <th className="pb-3 px-4 font-medium">Status</th>
                  <th className="pb-3 px-4 font-medium text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTrans.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-semibold text-gray-900">#{t.id}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </td>
                    <td className="py-4 px-4 min-w-[200px]">
                      <p className="text-sm text-gray-900 line-clamp-1 font-medium">{t.post?.judul || "N/A"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <span className="text-blue-600">Pel: {t.pelanggan?.nama || "N/A"}</span> | 
                        <span className="text-amber-600 ml-1">Mit: {t.mitra?.nama || "N/A"}</span>
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${t.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          t.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                          t.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'}
                      `}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <p className="font-bold text-gray-900">Rp {t.amount.toLocaleString("id-ID")}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
