"use client";

import { useEffect, useState } from "react";
import { getMyPosts, deletePost } from "@/lib/services/post.service";
import type { Post } from "@/types/post";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Trash2, Edit, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function PostinganSayaPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const data = await getMyPosts();
      setPosts(data);
    } catch (error: any) {
      console.error("Gagal memuat postingan:", error?.message || error);
      // Kita log, tapi tidak tampilkan error mentah agar Next.js tidak crash
    } finally {
      setLoading(false);
    }
  }

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deletePost(deleteId);
      await fetchPosts();
      setDeleteId(null);
      toast.success("Postingan berhasil dihapus!");
    } catch (error) {
      toast.error("Gagal menghapus postingan. Pastikan statusnya masih open.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPosts = posts.filter(p => p.judul.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Postingan Saya</h1>
          <p className="text-gray-500 mt-1">Kelola semua permintaan jasa Anda di sini.</p>
        </div>
        <Link href="/pelanggan/posts/buat">
          <Button className="bg-teal-700 hover:bg-teal-800 gap-2 w-full md:w-auto">
            <PlusCircle size={18} />
            Postingan Baru
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari judul postingan..."
              className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">Memuat data...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500 mb-4">Tidak ada postingan ditemukan.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-4 md:p-6 flex flex-col md:flex-row gap-4 justify-between items-start hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Link href={`/pelanggan/posts/${post.id}`} className="font-semibold text-lg text-gray-900 hover:text-teal-700 hover:underline">
                      {post.judul}
                    </Link>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${post.status === 'open' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                        post.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        post.status === 'done' ? 'bg-green-100 text-green-700 border-green-200' :
                        'bg-red-100 text-red-700 border-red-200'}
                    `}>
                      {post.status.replace("_", " ")}
                    </span>
                    {post.urgensi !== 'biasa' && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        post.urgensi === 'mendesak' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {post.urgensi}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-2">{post.deskripsi}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
                    <span>📍 {post.kecamatan}, {post.kabupaten}</span>
                    <span>🕒 {post.estimasi_waktu}</span>
                    <span className="font-medium text-teal-700">💰 Rp {post.budget.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link href={`/pelanggan/posts/${post.id}`} className="flex-1 md:flex-none">
                    <Button variant="outline" size="sm" className="w-full">
                      Detail
                    </Button>
                  </Link>
                  {post.status === "open" && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => setDeleteId(post.id)}
                      title="Hapus Postingan"
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteId && (
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
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
                onClick={confirmDelete}
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
