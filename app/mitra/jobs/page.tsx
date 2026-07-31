"use client";

import { useEffect, useState } from "react";
import { getPosts } from "@/lib/services/post.service";
import type { Post } from "@/types/post";
import Link from "next/link";
import { Search, MapPin, Clock, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CariJobPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts();
        // Hanya tampilkan post yang statusnya "open"
        setPosts(data.filter((p: Post) => p.status === "open"));
      } catch (error: any) {
        console.error("Gagal mengambil daftar pekerjaan:", error?.message || error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(p => {
    const matchSearch = p.judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.kabupaten.toLowerCase().includes(searchTerm.toLowerCase());
    const matchUrgency = urgencyFilter ? p.urgensi === urgencyFilter : true;
    return matchSearch && matchUrgency;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cari Pekerjaan</h1>
        <p className="text-gray-500 mt-1">Temukan pelanggan yang membutuhkan bantuan Anda.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari kata kunci, judul, atau kota..."
              className="w-full pl-10 pr-4 h-11 border rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              className="w-full h-11 px-3 border rounded-xl text-sm outline-none focus:border-teal-500 bg-white"
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
            >
              <option value="">Semua Urgensi</option>
              <option value="biasa">Biasa</option>
              <option value="penting">Penting</option>
              <option value="mendesak">Mendesak</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Mencari pekerjaan...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-medium">Tidak ada pekerjaan terbuka yang sesuai.</p>
          <p className="text-sm text-gray-400 mt-1">Coba ubah kata kunci atau filter Anda.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                    ${post.urgensi === 'mendesak' ? 'bg-red-100 text-red-700' : 
                      post.urgensi === 'penting' ? 'bg-amber-100 text-amber-700' : 
                      'bg-gray-100 text-gray-600'}
                  `}>
                    {post.urgensi}
                  </span>
                  <span className="text-lg font-bold text-teal-700">
                    Rp {post.budget.toLocaleString("id-ID")}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{post.judul}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.deskripsi}</p>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="truncate">{post.kecamatan}, {post.kabupaten}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={14} className="text-gray-400" />
                    <span className="truncate">{post.estimasi_waktu}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                <Link href={`/mitra/jobs/${post.id}`} className="block w-full">
                  <Button className="w-full bg-teal-700 hover:bg-teal-800">
                    Lihat Detail
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
