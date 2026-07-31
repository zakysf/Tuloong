"use client";

import LandingNavbar from "@/components/shared/LandingNavbar";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function KebijakanPrivasiPage() {
  const router = useRouter();

  return (
    <>
      <LandingNavbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 relative">
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors mb-6 group"
            >
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Kembali
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>
              Kebijakan Privasi
            </h1>
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Pendahuluan</h2>
                <p>
                  Kami di Tuloong sangat menjaga privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, melindungi, dan membagikan informasi pribadi Anda saat Anda menggunakan aplikasi dan layanan kami.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Informasi yang Kami Kumpulkan</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Informasi Pendaftaran:</strong> Nama lengkap, alamat email, nomor telepon, dan kata sandi saat Anda mendaftar.</li>
                  <li><strong>Data Verifikasi Mitra:</strong> Untuk Mitra, kami mengumpulkan foto identitas (KTP) dan informasi rekening bank untuk tujuan verifikasi dan pencairan dana.</li>
                  <li><strong>Informasi Transaksi:</strong> Data riwayat pekerjaan, layanan yang diberikan, dan informasi pembayaran.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Penggunaan Informasi Anda</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Untuk memfasilitasi komunikasi antara Pelanggan dan Mitra.</li>
                  <li>Untuk memproses verifikasi akun demi menjaga keamanan komunitas Tuloong.</li>
                  <li>Untuk memproses pembayaran dan pencairan dana.</li>
                  <li>Untuk meningkatkan kualitas layanan dan menyelesaikan masalah yang mungkin timbul.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Berbagi Informasi</h2>
                <p>
                  Kami tidak menjual, menyewakan, atau menukar data pribadi Anda dengan pihak ketiga. Informasi hanya dibagikan secara terbatas dalam aplikasi (misalnya, menampilkan nama dan profil keahlian Mitra kepada Pelanggan) dan jika diwajibkan oleh aparat penegak hukum yang berwenang.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Keamanan Data</h2>
                <p>
                  Kami mengimplementasikan langkah-langkah keamanan teknis untuk melindungi data Anda dari akses, pengubahan, atau penghancuran yang tidak sah. Dokumen sensitif seperti KTP dienkripsi atau disimpan dalam server yang aman.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Hubungi Kami</h2>
                <p>
                  Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini atau ingin menghapus data akun Anda, Anda dapat menghubungi tim dukungan kami melalui layanan pelanggan Tuloong.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
