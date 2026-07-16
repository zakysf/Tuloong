import Link from "next/link";
import { ArrowRight, User, Briefcase } from "lucide-react";
import LandingNavbar from "@/components/shared/LandingNavbar";

export const metadata = {
  title: "Pilih Peran Pendaftaran — Tuloong",
};

export default function SelectRolePage() {
  return (
    <main className="min-h-screen bg-[#FAFAF9] selection:bg-[#F2632A]/15 selection:text-[#F2632A]">
      <LandingNavbar />

      <div className="pt-40 pb-20 px-6 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-lg text-center">
          <div className="mb-12">
            <h2 
              className="text-3xl md:text-4xl font-black text-neutral-900 mb-4 tracking-tight"
              style={{ fontFamily: "var(--font-poppins, Poppins)" }}
            >
              Mendaftar Sebagai Apa?
            </h2>
            <p className="text-neutral-500 text-base max-w-md mx-auto">
              Pilih salah satu peran di bawah ini untuk melanjutkan pendaftaran ke dalam ekosistem Tuloong.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 text-left">
            <Link 
              href="/register/pelanggan"
              className="group block p-8 rounded-3xl border border-neutral-200 bg-white hover:border-[#1A5C48]/50 hover:shadow-[0_8px_30px_rgba(26,92,72,0.12)] hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div className="flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#1A5C48] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <User size={28} />
                </div>
                <h3 className="font-bold text-neutral-900 text-xl mb-2" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>
                  Pelanggan
                </h3>
                <p className="text-neutral-500 text-sm flex-1 leading-relaxed">
                  Saya butuh bantuan untuk mengerjakan tugas harian atau pekerjaan spesifik.
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-[#1A5C48] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  Daftar Pelanggan <ArrowRight size={16} />
                </div>
              </div>
            </Link>

            <Link 
              href="/register/mitra"
              className="group block p-8 rounded-3xl border border-neutral-200 bg-white hover:border-[#F2632A]/50 hover:shadow-[0_8px_30px_rgba(242,99,42,0.12)] hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div className="flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#F2632A] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase size={28} />
                </div>
                <h3 className="font-bold text-neutral-900 text-xl mb-2" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>
                  Mitra Tuloong
                </h3>
                <p className="text-neutral-500 text-sm flex-1 leading-relaxed">
                  Saya ingin menawarkan jasa keahlian saya dan mendapat penghasilan.
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-[#F2632A] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  Daftar Mitra <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-12 text-sm text-neutral-500 font-medium">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-bold text-neutral-900 hover:text-[#F2632A] transition-colors">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
