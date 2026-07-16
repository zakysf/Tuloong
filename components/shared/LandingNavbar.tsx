import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 pt-5">
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-md rounded-2xl px-5 py-3 border border-neutral-200/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1A5C48] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
              </svg>
            </div>
            <span className="font-extrabold text-lg text-neutral-900" style={{ fontFamily: "var(--font-poppins)" }}>Tuloong</span>
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
