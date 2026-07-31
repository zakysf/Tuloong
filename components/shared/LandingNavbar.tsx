import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 pt-5">
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-md rounded-2xl px-5 py-3 border border-neutral-200/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <Link href="/" className="flex items-center gap-2">
            <img src="/loger.png" alt="Tuloong Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl text-teal-800" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>Tuloong</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {["Beranda", "Cara Kerja", "Mitra", "Keamanan"].map((l, i) => (
              <Link key={l} href={i === 0 ? "/" : `/#${l.toLowerCase().replace(" ", "-")}`} className={`text-[13px] font-medium ${i === 0 ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-900"} transition-colors`}>
                {l}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors hidden sm:block">
              Masuk
            </Link>
            <Link href="/register">
              <Button className="h-8 px-4 rounded-lg text-xs font-semibold bg-[#1A5C48] hover:bg-[#164E3C] text-white cursor-pointer">
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
