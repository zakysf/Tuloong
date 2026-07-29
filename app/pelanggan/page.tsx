"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getMyPosts } from "@/lib/services/post.service";
import { getMyTransactions } from "@/lib/services/transaction.service";
import type { Post, Transaction } from "@/types/post";
import Link from "next/link";
import { PlusCircle, FileText, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PelangganDashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [myPosts, myTrans] = await Promise.all([
          getMyPosts(),
          getMyTransactions(),
        ]);
        setPosts(myPosts);
        setTransactions(myTrans);
      } catch (error) {
        console.error("Gagal memuat data dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activePosts = posts.filter((p) => p.status === "open" || p.status === "in_progress");
  const completedJobs = posts.filter((p) => p.status === "done");

  if (loading) {
    return <div className="text-gray-500">Memuat dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Halo, {user?.nama}! 👋</h1>
          <p className="text-gray-500 mt-1">Selamat datang di Dashboard Pelanggan Anda.</p>
        </div>
        <Link href="/pelanggan/posts/buat">
          <Button className="bg-teal-700 hover:bg-teal-800 gap-2 w-full md:w-auto">
            <PlusCircle size={18} />
            Buat Postingan
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Postingan</p>
            <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Postingan Aktif</p>
            <p className="text-2xl font-bold text-gray-900">{activePosts.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Selesai</p>
            <p className="text-2xl font-bold text-gray-900">{completedJobs.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Postingan Terbaru</h2>
          <Link href="/pelanggan/posts" className="text-sm text-teal-700 font-medium hover:underline">
            Lihat Semua
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">Anda belum pernah membuat postingan kebutuhan.</p>
            <Link href="/pelanggan/posts/buat">
              <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                Buat Postingan Pertama
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.slice(0, 3).map((post) => (
              <div key={post.id} className="p-4 border border-gray-100 rounded-xl hover:border-teal-100 hover:bg-teal-50/30 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.judul}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{post.deskripsi}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(post.created_at).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-medium border
                    ${post.status === 'open' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                      post.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      post.status === 'done' ? 'bg-green-100 text-green-700 border-green-200' :
                      'bg-red-100 text-red-700 border-red-200'}
                  `}>
                    {post.status.replace("_", " ")}
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
