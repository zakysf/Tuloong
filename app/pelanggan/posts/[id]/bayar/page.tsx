"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPost } from "@/lib/services/post.service";
import { createTransaction } from "@/lib/services/transaction.service";
import type { Post } from "@/types/post";
import Link from "next/link";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Extend window object for Midtrans Snap
declare global {
  interface Window {
    snap: {
      pay: (token: string, options?: any) => void;
    };
  }
}

export default function BayarPostinganPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Inject Midtrans Snap Script
    const midtransUrl = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL || "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    const script = document.createElement("script");
    script.src = midtransUrl;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    async function fetchPost() {
      try {
        const data = await getPost(Number(id));
        setPost(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();

    return () => {
      document.body.removeChild(script);
    };
  }, [id]);

  const handlePay = async () => {
    if (!post?.claim) return;
    setProcessing(true);
    setErrorMsg("");

    try {
      const response = await createTransaction(post.claim.id);
      
      if (response.snap_token) {
        if (response.snap_token === 'dummy-snap-token' && process.env.NODE_ENV === 'development') {
          // Bypass popup Midtrans jika server key tidak di-set (menggunakan token dummy)
          try {
            const api = (await import("@/lib/axios")).default;
            await api.post(`/api/dev/transactions/${response.transaction_id}/force-paid`);
          } catch (e) {
            console.error("Local dev auto-pay failed", e);
          }
          router.push(`/pelanggan/posts/${id}?payment=success`);
          return;
        }

        window.snap.pay(response.snap_token, {
          onSuccess: async function (result: any) {
            router.push(`/pelanggan/posts/${id}?payment=success`);
          },
          onPending: function (result: any) {
            router.push(`/pelanggan/posts/${id}?payment=pending`);
          },
          onError: function (result: any) {
            setErrorMsg("Pembayaran gagal. Silakan coba lagi.");
            setProcessing(false);
          },
          onClose: function () {
            setProcessing(false);
          },
        });
      } else {
        setErrorMsg("Gagal mendapatkan token pembayaran dari server.");
        setProcessing(false);
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Terjadi kesalahan sistem.");
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat data pembayaran...</div>;
  }

  if (!post || !post.claim) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Transaksi Tidak Valid</h2>
        <Link href="/pelanggan/posts">
          <Button variant="outline">Kembali ke Daftar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link href={`/pelanggan/posts/${id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-2" />
        Kembali ke Detail
      </Link>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
          <CreditCard size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Konfirmasi Pembayaran</h1>
        <p className="text-gray-500 mb-8">Selesaikan pembayaran agar mitra dapat segera berangkat.</p>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-left mb-8 space-y-4">
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <span className="text-gray-500">Postingan</span>
            <span className="font-semibold text-gray-900 text-right max-w-[60%]">{post.judul}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <span className="text-gray-500">Mitra</span>
            <span className="font-semibold text-gray-900">{post.claim?.mitra?.nama}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-500 font-medium">Total Pembayaran</span>
            <span className="text-xl font-extrabold text-teal-700">Rp {post.budget.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium text-left">
            {errorMsg}
          </div>
        )}

        <Button 
          onClick={handlePay} 
          disabled={processing}
          className="w-full h-12 text-base font-semibold bg-teal-700 hover:bg-teal-800"
        >
          {processing ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Memproses...
            </>
          ) : (
            "Bayar Sekarang dengan Midtrans"
          )}
        </Button>
        <p className="text-xs text-gray-400 mt-4">
          Pembayaran diproses secara aman oleh Midtrans.
        </p>
      </div>
    </div>
  );
}
