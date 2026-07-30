"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getPost, deletePost } from "@/lib/services/post.service";
import type { Post } from "@/types/post";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Wallet, Info, MessageCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewForm from "@/components/shared/ReviewForm";
import ReportModal from "@/components/shared/ReportModal";
import DonationPopup from "@/components/shared/DonationPopup";

export default function DetailPostinganPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showReview, setShowReview] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (paymentStatus === 'success') {
      setShowPaymentSuccess(true);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [paymentStatus]);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getPost(Number(id));
        setPost(data);
      } catch (error: any) {
        toast.error("Gagal mengambil detail postingan.");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat detail...</div>;
  }

  if (!post) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Postingan Tidak Ditemukan</h2>
        <Link href="/pelanggan/posts">
          <Button variant="outline">Kembali ke Daftar</Button>
        </Link>
      </div>
    );
  }

  const statusLabel = post.status.replace("_", " ");
  const claimStatus = post.claim?.status;
  const transStatus = post.transaction?.status;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/pelanggan/posts" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Daftar Postingan
        </Link>
        {post.status === "open" && (
          <Button 
            variant="outline" 
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Hapus Postingan
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Kolom Utama */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider
                  ${post.status === 'open' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                    post.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    post.status === 'done' ? 'bg-green-100 text-green-700 border-green-200' :
                    'bg-red-100 text-red-700 border-red-200'}
              `}>
                STATUS: {statusLabel}
              </span>
              {post.urgensi !== 'biasa' && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                  ${post.urgensi === 'mendesak' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}
                `}>
                  {post.urgensi}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.judul}</h1>
            
            <div className="prose prose-sm text-gray-600 mb-8 whitespace-pre-wrap">
              {post.deskripsi}
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
              <div className="flex gap-3 text-sm">
                <MapPin className="text-gray-400 shrink-0" size={18} />
                <div>
                  <p className="font-medium text-gray-900">Lokasi</p>
                  <p className="text-gray-500">{post.kecamatan}, {post.kabupaten}, {post.provinsi}</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <Clock className="text-gray-400 shrink-0" size={18} />
                <div>
                  <p className="font-medium text-gray-900">Estimasi Waktu</p>
                  <p className="text-gray-500">{post.estimasi_waktu}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Pengerjaan */}
          {post.claim && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Status Pengerjaan</h2>
              
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                
                {/* Step 1: Claimed */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-teal-500 ring-4 ring-white" />
                  <p className="font-medium text-gray-900">Pekerjaan Diklaim</p>
                  <p className="text-sm text-gray-500">Menunggu pembayaran Anda</p>
                </div>

                {/* Step 2: Paid & On the way */}
                <div className={`relative pl-6 ${transStatus === 'paid' || transStatus === 'completed' ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 ring-white ${transStatus === 'paid' || transStatus === 'completed' ? 'bg-teal-500' : 'bg-gray-200'}`} />
                  <p className="font-medium text-gray-900">Dalam Perjalanan</p>
                  <p className="text-sm text-gray-500">Mitra sedang menuju lokasi</p>
                </div>

                {/* Step 3: Working */}
                <div className={`relative pl-6 ${claimStatus === 'working' || claimStatus === 'done_by_mitra' ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 ring-white ${claimStatus === 'working' || claimStatus === 'done_by_mitra' ? 'bg-teal-500' : 'bg-gray-200'}`} />
                  <p className="font-medium text-gray-900">Sedang Dikerjakan</p>
                  <p className="text-sm text-gray-500">Mitra mulai mengerjakan tugas</p>
                </div>

                {/* Step 4: Done */}
                <div className={`relative pl-6 ${claimStatus === 'done_by_mitra' ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 ring-white ${claimStatus === 'done_by_mitra' ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <p className="font-medium text-gray-900">Selesai</p>
                  <p className="text-sm text-gray-500">Pekerjaan telah diselesaikan mitra</p>
                </div>

              </div>
            </div>
          )}

          {/* Bukti Pekerjaan */}
          {post.claim?.foto_bukti && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                Bukti Pekerjaan Selesai
              </h3>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <img src={post.claim.foto_bukti} alt="Bukti Pekerjaan" className="w-full h-auto object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Kolom Sidebar Kanan */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Wallet size={18} className="text-teal-700" />
              Budget Jasa
            </h3>
            <p className="text-3xl font-extrabold text-teal-700 mb-2">
              Rp {post.budget.toLocaleString("id-ID")}
            </p>
            
            {!post.claim ? (
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-2">
                <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Menunggu Mitra mengklaim pekerjaan ini. Setelah diklaim, Anda dapat melakukan pembayaran.
                </p>
              </div>
            ) : !post.transaction || post.transaction.status === 'pending' ? (
              <div className="mt-6 space-y-3">
                <p className="text-sm font-medium text-red-600 mb-2">Menunggu Pembayaran</p>
                <Link href={`/pelanggan/posts/${post.id}/bayar`} className="block">
                  <Button className="w-full bg-teal-700 hover:bg-teal-800">
                    Bayar Sekarang
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
                <p className="text-sm font-semibold text-green-700 text-center">Lunas (Paid)</p>
              </div>
            )}
          </div>

          {post.claim && post.claim.mitra && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Mitra Bertugas</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  {post.claim.mitra.foto_profil ? (
                    <img src={post.claim.mitra.foto_profil} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{post.claim.mitra.nama}</p>
                  <Link href={`/pelanggan/mitra/${post.claim.mitra.id}`} className="text-xs text-teal-600 hover:underline">
                    Lihat Profil
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                <Link href={`/chat/${post.claim.id}`} className="block">
                  <Button variant="outline" className="w-full justify-center gap-2">
                    <MessageCircle size={16} /> Chat Mitra
                  </Button>
                </Link>
                
                {post.status === 'done' && !post.review && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-center gap-2 border-teal-200 text-teal-700 hover:bg-teal-50"
                    onClick={() => setShowReview(true)}
                  >
                    Beri Ulasan
                  </Button>
                )}

                <Button 
                  variant="ghost" 
                  className="w-full justify-center gap-2 text-xs text-gray-500 hover:text-red-600"
                  onClick={() => setShowReport(true)}
                >
                  <AlertTriangle size={14} /> Lapor Masalah
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showReview && post.claim && (
        <ReviewForm
          transactionId={post.transaction?.id || 0}
          mitraName={post.claim?.mitra?.nama || "Mitra"}
          onClose={() => setShowReview(false)}
          onSuccess={() => {
            setShowReview(false);
            setShowDonation(true);
            setPost({ ...post, review: { id: 0, transaction_id: 0, pelanggan_id: 0, mitra_id: 0, rating: 5, review: null, created_at: "" } }); // dummy update
          }}
        />
      )}

      {showDonation && (
        <DonationPopup onClose={() => setShowDonation(false)} />
      )}

      {showReport && post.claim && (
        <ReportModal
          claimId={post.claim?.id || 0}
          reportedName={post.claim?.mitra?.nama || "Mitra"}
          onClose={() => setShowReport(false)}
        />
      )}

      {showPaymentSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-xl text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-2">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Pembayaran Berhasil!</h3>
            <p className="text-gray-500 text-sm">
              Transaksi Anda telah lunas. Mitra akan segera berangkat ke lokasi Anda.
            </p>
            <Button 
              className="w-full bg-teal-700 hover:bg-teal-800 mt-4"
              onClick={() => setShowPaymentSuccess(false)}
            >
              Tutup
            </Button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-xl text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 mb-2">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Hapus Postingan?</h3>
            <p className="text-gray-500 text-sm">
              Apakah Anda yakin ingin menghapus postingan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await deletePost(post.id);
                    router.push("/pelanggan/posts");
                  } catch (error: any) {
                    toast.error(error.response?.data?.message || "Gagal menghapus postingan. Pastikan statusnya masih open.");
                  } finally {
                    setIsDeleting(false);
                    setShowDeleteConfirm(false);
                  }
                }}
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
