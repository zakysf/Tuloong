"use client";

import { useEffect, useState } from "react";
import { getMitraTransactions } from "@/lib/services/transaction.service";
import type { Transaction } from "@/types/post";
import { History, Receipt, ArrowDownToLine, CheckCircle2, Wallet } from "lucide-react";

export default function MitraTransaksiPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMitraTransactions();
        setTransactions(data);
      } catch (error: any) {
        console.error("Gagal memuat transaksi:", error?.message || error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalIncome = transactions
    .filter(t => t.status === "paid" || t.status === "completed")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDisbursed = transactions
    .filter(t => t.status === "completed")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="text-gray-400" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Pendapatan</h1>
          <p className="text-gray-500 mt-1">Daftar pembayaran yang telah masuk dari pekerjaan Anda.</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-700 to-teal-900 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
        <div>
          <p className="text-teal-100 font-medium mb-1">Total Pendapatan</p>
          <p className="text-3xl font-bold">Rp {totalIncome.toLocaleString("id-ID")}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <ArrowDownToLine size={24} className="text-white" />
        </div>
      </div>

      {/* Disbursement info banner */}
      {totalDisbursed > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
            <Wallet size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-emerald-800 text-sm">Pencairan Dana</p>
            <p className="text-emerald-700 text-sm mt-0.5">
              Dana sebesar <span className="font-bold">Rp {totalDisbursed.toLocaleString("id-ID")}</span> telah dicairkan ke rekening Anda.
            </p>
            <p className="text-emerald-500 text-xs mt-1">Pencairan otomatis setelah pelanggan mengkonfirmasi pekerjaan selesai.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Memuat data...</div>
        ) : transactions.length === 0 ? (
          <div className="p-10 text-center">
            <Receipt className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500">Belum ada riwayat transaksi pendapatan.</p>
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
                    {t.post?.judul || `Pendapatan Jasa (ID: ${t.id})`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Masuk: <span className="font-medium text-teal-700">+ Rp {t.amount.toLocaleString("id-ID")}</span>
                  </p>
                  {t.status === "completed" && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-600">
                        Dana sebesar Rp {t.amount.toLocaleString("id-ID")} telah dicairkan ke rekening Anda
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                      ${t.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        t.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        t.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                        t.status === 'failed' || t.status === 'refunded' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'}
                  `}>
                    {t.status === 'completed' ? 'Dicairkan' : t.status === 'paid' ? 'Dibayar' : t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
