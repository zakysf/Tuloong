"use client";

import { useEffect, useState } from "react";
import { getMyTransactions } from "@/lib/services/transaction.service";
import type { Transaction } from "@/types/post";
import Link from "next/link";
import { History, Receipt } from "lucide-react";

export default function RiwayatTransaksiPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMyTransactions();
        setTransactions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <History className="text-gray-400" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
          <p className="text-gray-500 mt-1">Daftar semua pembayaran yang telah Anda lakukan.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Memuat data...</div>
        ) : transactions.length === 0 ? (
          <div className="p-10 text-center">
            <Receipt className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500">Belum ada riwayat transaksi.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map((t) => (
              <div key={t.id} className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {new Date(t.created_at).toLocaleString("id-ID", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {t.post?.judul || `Pembayaran Jasa (ID: ${t.id})`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Jumlah: <span className="font-medium text-gray-900">Rp {t.amount.toLocaleString("id-ID")}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                      ${t.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        t.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                        t.status === 'completed' ? 'bg-green-100 text-green-700' :
                        t.status === 'failed' || t.status === 'refunded' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'}
                  `}>
                    {t.status}
                  </span>
                  
                  {/* Note: In real app, we might want to link to a specific receipt page, 
                      but for now we link to the post detail if we can retrieve post id (we don't have it directly here unless joined by BE)
                      Since BE didn't include post in transaction response directly unless requested, we just show the transaction info. 
                      Update: BE PRD says it belongs to claim. */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
