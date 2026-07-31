"use client";

import LandingNavbar from "@/components/shared/LandingNavbar";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SyaratKetentuanPage() {
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
              Syarat dan Ketentuan
            </h1>
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Pendahuluan</h2>
                <p>
                  Selamat datang di Tuloong. Dengan mengakses dan menggunakan layanan kami, Anda menyetujui untuk terikat dengan Syarat dan Ketentuan ini. Harap baca dengan saksama sebelum menggunakan platform Tuloong.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Pendaftaran Akun</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Pengguna harus berusia minimal 17 tahun untuk mendaftar sebagai Pelanggan atau Mitra.</li>
                  <li>Pengguna bertanggung jawab untuk menjaga kerahasiaan informasi akun dan kata sandi.</li>
                  <li>Data yang diberikan pada saat pendaftaran, termasuk nomor KTP dan foto untuk Mitra, harus valid dan asli.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Ketentuan Layanan</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Tuloong berfungsi sebagai platform penghubung antara Pelanggan yang membutuhkan bantuan dan Mitra yang menyediakan jasa.</li>
                  <li>Tuloong tidak bertanggung jawab langsung atas kualitas layanan spesifik yang diberikan oleh Mitra, namun kami menyediakan sistem ulasan dan pelaporan untuk menjaga kualitas.</li>
                  <li>Transaksi pembayaran harus dilakukan sesuai dengan prosedur yang ditetapkan dalam aplikasi untuk keamanan bersama.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Kebijakan Privasi</h2>
                <p>
                  Informasi pribadi Anda akan dilindungi dan digunakan sesuai dengan Kebijakan Privasi kami. Kami tidak akan menjual atau membagikan data pribadi Anda ke pihak ketiga tanpa izin, kecuali diwajibkan oleh hukum.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Pelaporan dan Penyelesaian Sengketa</h2>
                <p>
                  Jika terjadi perselisihan antara Pelanggan dan Mitra, salah satu pihak dapat mengajukan pelaporan (report) melalui sistem kami. Admin Tuloong akan meninjau dan dapat mengambil tindakan penangguhan akun jika terbukti melanggar ketentuan.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Perubahan Syarat dan Ketentuan</h2>
                <p>
                  Tuloong berhak memperbarui Syarat dan Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Penggunaan berkelanjutan Anda atas layanan ini merupakan persetujuan terhadap perubahan tersebut.
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
