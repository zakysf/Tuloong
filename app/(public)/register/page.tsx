import Link from "next/link";
import { ArrowRight, User, Briefcase } from "lucide-react";
import LandingNavbar from "@/components/shared/LandingNavbar";

export const metadata = {
  title: "Pilih Peran Pendaftaran — Tuloong",
};

export default function SelectRolePage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] selection:bg-[#F2632A]/15 selection:text-[#F2632A] relative overflow-hidden">
      {/* Subtle Background Pattern matching Landing Page */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <LandingNavbar />

      <div className="pt-36 pb-20 px-6 flex items-center justify-center min-h-screen relative z-10">
        <div className="w-full max-w-4xl text-center">
          
          <div className="mb-14">
            <span className="text-xs font-bold text-[#1A5C48] tracking-widest uppercase bg-[#1A5C48]/5 px-4 py-1.5 rounded-full mb-6 inline-block">
              Langkah Pertama
            </span>
            <h2 
              className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-5 tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Bagaimana Anda ingin menggunakan Tuloong?
            </h2>
            <p className="text-neutral-500 text-lg max-w-xl mx-auto leading-relaxed">
              Pilih peran Anda untuk memulai. Anda selalu bisa mendaftar untuk peran lainnya nanti jika diperlukan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            
            {/* Pelanggan Card */}
            <Link 
              href="/register/pelanggan"
              className="group block p-8 rounded-3xl bg-white border border-neutral-200/60 shadow-sm hover:shadow-xl hover:border-[#1A5C48]/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1A5C48]/5 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#1A5C48]/10 text-[#1A5C48] flex items-center justify-center mb-6 group-hover:bg-[#1A5C48] group-hover:text-white transition-colors duration-300">
                  <User size={28} />
                </div>
                
                <h3 className="font-extrabold text-neutral-900 text-2xl mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                  Saya butuh jasa
                </h3>
                
                <p className="text-neutral-500 text-sm leading-relaxed mb-8">
                  Daftar sebagai <strong>Pelanggan</strong>. Buat tugas, tentukan budget Anda sendiri, dan temukan Mitra terbaik di sekitar Anda dengan cepat.
                </p>
                
                <div className="flex items-center gap-2 text-[#1A5C48] font-bold text-sm">
                  Lanjutkan <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Mitra Card */}
            <Link 
              href="/register/mitra"
              className="group block p-8 rounded-3xl bg-white border border-neutral-200/60 shadow-sm hover:shadow-xl hover:border-[#F2632A]/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2632A]/5 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#F2632A]/10 text-[#F2632A] flex items-center justify-center mb-6 group-hover:bg-[#F2632A] group-hover:text-white transition-colors duration-300">
                  <Briefcase size={28} />
                </div>
                
                <h3 className="font-extrabold text-neutral-900 text-2xl mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                  Saya ingin bekerja
                </h3>
                
                <p className="text-neutral-500 text-sm leading-relaxed mb-8">
                  Daftar sebagai <strong>Mitra</strong>. Temukan pekerjaan paruh waktu, tawarkan keahlian Anda, dan dapatkan penghasilan 100% tanpa potongan komisi.
                </p>
                
                <div className="flex items-center gap-2 text-[#F2632A] font-bold text-sm">
                  Lanjutkan <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

          </div>

          <div className="mt-12 text-center text-sm text-neutral-500 font-medium">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="font-bold text-[#1A5C48] hover:text-[#124233] transition-colors underline decoration-2 underline-offset-4 decoration-[#1A5C48]/30">
              Masuk sekarang
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
