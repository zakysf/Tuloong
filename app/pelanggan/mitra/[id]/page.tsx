"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPublicMitraProfile } from "@/lib/services/profile.service";
import Link from "next/link";
import { ArrowLeft, Star, Trophy, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MitraBadge } from "@/components/shared/MitraBadge";

export default function ProfilPublikMitraPage() {
  const { id } = useParams();
  const [mitra, setMitra] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfil() {
      try {
        const data = await getPublicMitraProfile(Number(id));
        setMitra(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfil();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat profil mitra...</div>;
  if (!mitra || mitra.role !== 'mitra') return <div className="p-8 text-center text-red-500">Mitra tidak ditemukan.</div>;

  const info = mitra.mitra_profile;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/pelanggan/posts" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-2" />
        Kembali
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-teal-700 w-full relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-sm">
            {mitra.foto_profil ? (
              <img src={mitra.foto_profil} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{mitra.nama}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                  <ShieldCheck size={14} /> Terverifikasi
                </span>
                {info?.badge && <MitraBadge badge={info.badge} />}
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin size={14} /> {info.kabupaten}, {info.provinsi}
                </span>
              </div>
            </div>
            
            <div className="text-center bg-gray-50 p-3 rounded-xl border border-gray-100 min-w-[100px]">
              <Trophy className="mx-auto text-teal-600 mb-1" size={24} />
              <p className="font-bold text-gray-900">{info.badge || 'Newbie'}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Badge</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-gray-100 py-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{info.total_job_selesai || 0}</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Pekerjaan Selesai</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-1">
                {info.rating_rata ? Number(info.rating_rata).toFixed(1) : '-'} <Star size={20} className="fill-amber-400 text-amber-400" />
              </p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Rating</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Keahlian & Layanan</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {info.deskripsi_keahlian}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
