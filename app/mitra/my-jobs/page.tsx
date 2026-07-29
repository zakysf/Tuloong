"use client";

import { useEffect, useState } from "react";
import { getMyJobs, updateClaimStatus } from "@/lib/services/claim.service";
import Link from "next/link";
import { Briefcase, ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function JobSayaPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const data = await getMyJobs();
      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (claimId: number, nextStatus: string) => {
    setUpdatingId(claimId);
    try {
      await updateClaimStatus(claimId, nextStatus as any);
      await fetchJobs(); // refresh list
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal memperbarui status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Memuat pekerjaan saya...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pekerjaan Saya</h1>
        <p className="text-gray-500 mt-1">Kelola progres pekerjaan yang sedang Anda tangani.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {jobs.length === 0 ? (
          <div className="p-16 text-center">
            <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 mb-4">Anda belum mengklaim pekerjaan apapun.</p>
            <Link href="/mitra/jobs">
              <Button className="bg-teal-700 hover:bg-teal-800">Cari Pekerjaan</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {jobs.map((claim) => (
              <div key={claim.id} className="p-4 md:p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  
                  {/* Info Kiri */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider
                          ${claim.status === 'claimed' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            claim.status === 'on_the_way' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            claim.status === 'working' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            claim.status === 'done_by_mitra' ? 'bg-green-100 text-green-700 border-green-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'}
                      `}>
                        {claim.status.replace(/_/g, " ")}
                      </span>
                      {claim.post.transaction?.status === 'paid' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Lunas</span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{claim.post.judul}</h3>
                    <p className="text-sm text-gray-500 mb-3">📍 {claim.post.kecamatan}, {claim.post.kabupaten}</p>
                    
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 inline-flex">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        {claim.post.user?.foto_profil && (
                          <img src={claim.post.user.foto_profil} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">{claim.post.user?.nama}</p>
                        <p className="text-gray-500 text-xs">Pelanggan</p>
                      </div>
                      
                      <div className="ml-4 pl-4 border-l border-gray-200">
                        <Link href={`/chat/${claim.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 text-teal-700 hover:text-teal-800 hover:bg-teal-50">
                            <MessageCircle size={16} className="mr-2" /> Chat
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Aksi Kanan */}
                  <div className="lg:w-64 flex flex-col justify-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-3 text-center">Update Progres Pekerjaan</p>
                    
                    {claim.status === 'claimed' && (
                      <Button 
                        onClick={() => handleUpdateStatus(claim.id, 'on_the_way')}
                        disabled={updatingId === claim.id}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        {updatingId === claim.id ? <Loader2 className="animate-spin" size={16} /> : "Berangkat ke Lokasi"}
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    )}

                    {claim.status === 'on_the_way' && (
                      <Button 
                        onClick={() => handleUpdateStatus(claim.id, 'working')}
                        disabled={updatingId === claim.id}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {updatingId === claim.id ? <Loader2 className="animate-spin" size={16} /> : "Mulai Kerjakan"}
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    )}

                    {claim.status === 'working' && (
                      <Button 
                        onClick={() => handleUpdateStatus(claim.id, 'done_by_mitra')}
                        disabled={updatingId === claim.id}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {updatingId === claim.id ? <Loader2 className="animate-spin" size={16} /> : "Selesaikan Tugas"}
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    )}

                    {claim.status === 'done_by_mitra' && (
                      <div className="text-center text-green-700 font-medium text-sm flex items-center justify-center gap-2">
                        Pekerjaan Selesai
                      </div>
                    )}

                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
