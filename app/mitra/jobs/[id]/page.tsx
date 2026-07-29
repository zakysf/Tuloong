"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPost } from "@/lib/services/post.service";
import { claimJob } from "@/lib/services/claim.service";
import type { Post } from "@/types/post";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Wallet, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";

export default function DetailJobMitraPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getPost(Number(id));
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  const handleClaim = async () => {
    // Basic frontend check if mitra is verified
    if (user?.mitra_profile?.verification_status !== "aktif") {
      setError("Akun Anda belum diverifikasi aktif oleh Admin. Anda tidak dapat mengklaim pekerjaan.");
      return;
    }

    if (!confirm("Apakah Anda yakin sanggup mengerjakan pekerjaan ini sesuai budget dan estimasi waktu?")) return;

    setClaiming(true);
    setError("");
    
    try {
      await claimJob(Number(id));
      router.push("/mitra/my-jobs");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengklaim pekerjaan. Mungkin sudah diambil mitra lain.");
      setClaiming(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat detail pekerjaan...</div>;
  }

  if (!post) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Pekerjaan Tidak Ditemukan</h2>
        <Link href="/mitra/jobs">
          <Button variant="outline">Kembali ke Daftar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/mitra/jobs" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-2" />
        Kembali ke Daftar Pekerjaan
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider
                  ${post.status === 'open' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}
              `}>
                {post.status === 'open' ? 'Tersedia' : 'Sudah Diambil'}
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
                  <p className="text-gray-500">{post.kecamatan}, {post.kabupaten}</p>
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
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Detail Pelanggan</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                {post.user?.foto_profil ? (
                  <img src={post.user.foto_profil} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.user?.nama}</p>
                <p className="text-sm text-gray-500">Mendaftar sebagai Pelanggan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <Wallet size={18} className="text-teal-700" />
              Bayaran Jasa
            </h3>
            <p className="text-3xl font-extrabold text-teal-700 mb-6">
              Rp {post.budget.toLocaleString("id-ID")}
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm text-left font-medium">
                {error}
              </div>
            )}

            {post.status === "open" ? (
              <Button 
                onClick={handleClaim}
                disabled={claiming}
                className="w-full h-12 text-base font-semibold bg-teal-700 hover:bg-teal-800"
              >
                {claiming ? <Loader2 className="animate-spin mr-2" size={20} /> : <CheckCircle className="mr-2" size={20} />}
                Klaim Pekerjaan Ini
              </Button>
            ) : (
              <div className="p-3 bg-gray-100 text-gray-600 rounded-xl font-medium text-sm">
                Pekerjaan ini sudah tidak tersedia.
              </div>
            )}
            
            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              Dengan mengklaim pekerjaan, Anda berkomitmen untuk menyelesaikannya sesuai deskripsi pelanggan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
