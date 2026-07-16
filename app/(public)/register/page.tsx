import Link from "next/link";
import { ArrowRight, User, Briefcase } from "lucide-react";
import LandingNavbar from "@/components/shared/LandingNavbar";

export const metadata = {
  title: "Pilih Peran Pendaftaran — Tuloong",
};

export default function SelectRolePage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] selection:bg-[#F2632A]/15 selection:text-[#F2632A] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#1A5C48]/5 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#F2632A]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-60 -left-40 w-[500px] h-[500px] bg-[#1A5C48]/5 rounded-full blur-[100px] pointer-events-none" />

      <LandingNavbar />

      <div className="pt-32 pb-20 px-6 flex items-center justify-center min-h-screen relative z-10">
        <div className="w-full max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-neutral-100 shadow-sm mb-6">
              <span className="text-[#1A5C48] font-black text-xl" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>T</span>
            </div>
            <h2 
              className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-5 tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Mendaftar Sebagai Apa?
            </h2>
            <p className="text-neutral-500 text-lg max-w-xl mx-auto">
              Satu ekosistem, dua peran berbeda. Pilih bagaimana Anda ingin bergabung dengan komunitas Tuloong.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            
            {/* Pelanggan Card */}
            <Link 
              href="/register/pelanggan"
              className="group relative block p-8 lg:p-10 rounded-[2.5rem] bg-white border border-neutral-200/60 overflow-hidden hover:border-[#1A5C48]/30 hover:shadow-2xl hover:shadow-[#1A5C48]/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A5C48]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#1A5C48] text-white flex items-center justify-center shadow-lg shadow-[#1A5C48]/20 group-hover:scale-110 transition-transform duration-500">
                    <User size={32} />
                  </div>
                  <div className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 group-hover:bg-[#1A5C48] group-hover:text-white group-hover:border-[#1A5C48] transition-all duration-500">
                    <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                  </div>
                </div>
                
                <h3 className="font-extrabold text-neutral-900 text-2xl lg:text-3xl mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  Pelanggan
                </h3>
                
                <p className="text-neutral-500 text-base leading-relaxed flex-1">
                  Pesan jasa harian, dari bersih-bersih, kurir barang, hingga tukang reparasi. Cari bantuan dengan tarif yang Anda tentukan sendiri.
                </p>
                
                <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1A5C48] uppercase tracking-wider bg-[#1A5C48]/10 px-3 py-1.5 rounded-lg">Cari Bantuan</span>
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-3 py-1.5 rounded-lg">Pasang Tarif</span>
                </div>
              </div>
            </Link>

            {/* Mitra Card */}
            <Link 
              href="/register/mitra"
              className="group relative block p-8 lg:p-10 rounded-[2.5rem] bg-neutral-950 border border-neutral-800 overflow-hidden hover:border-[#F2632A]/50 hover:shadow-2xl hover:shadow-[#F2632A]/20 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#F2632A]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#F2632A]/20 rounded-full blur-[60px] group-hover:bg-[#F2632A]/30 transition-colors duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#F2632A] text-white flex items-center justify-center shadow-lg shadow-[#F2632A]/20 group-hover:scale-110 transition-transform duration-500">
                    <Briefcase size={32} />
                  </div>
                  <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-500 group-hover:bg-[#F2632A] group-hover:text-white group-hover:border-[#F2632A] transition-all duration-500">
                    <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                  </div>
                </div>
                
                <h3 className="font-extrabold text-white text-2xl lg:text-3xl mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  Mitra Tuloong
                </h3>
                
                <p className="text-neutral-400 text-base leading-relaxed flex-1">
                  Tawarkan jasa, atur waktu kerja Anda secara bebas, dan bawa pulang 100% penghasilan tanpa potongan komisi yang merugikan.
                </p>
                
                <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center gap-2">
                  <span className="text-xs font-bold text-[#F2632A] uppercase tracking-wider bg-[#F2632A]/15 px-3 py-1.5 rounded-lg">Cari Uang</span>
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider bg-neutral-800 px-3 py-1.5 rounded-lg">Bebas Atur Waktu</span>
                </div>
              </div>
            </Link>

          </div>

          <div className="mt-16 text-center text-base text-neutral-500 font-medium bg-white/50 backdrop-blur-sm border border-neutral-200/50 py-4 px-6 rounded-2xl inline-block mx-auto max-w-fit shadow-sm">
            Sudah punya akun Tuloong?{" "}
            <Link href="/login" className="font-bold text-[#1A5C48] hover:text-[#F2632A] transition-colors">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
