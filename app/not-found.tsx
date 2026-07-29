import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-center">
      <AlertCircle size={64} className="text-gray-300 mb-6" />
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Link href="/">
        <Button className="bg-teal-700 hover:bg-teal-800 h-12 px-8">
          Kembali ke Beranda
        </Button>
      </Link>
    </div>
  );
}
