"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function LandingNavbar() {
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      // Get the scroll position plus a little offset for when the header is sticky
      const scrollPos = window.scrollY + 100;
      
      const sections = [
        { id: "donasi", element: document.getElementById("donasi") },
        { id: "keamanan", element: document.getElementById("keamanan") },
        { id: "mitra", element: document.getElementById("mitra") },
        { id: "cara-kerja", element: document.getElementById("cara-kerja") },
      ];

      // Sort sections by their position from top to bottom
      const validSections = sections
        .filter((s) => s.element !== null)
        .map((s) => ({ id: s.id, offsetTop: s.element!.offsetTop }))
        .sort((a, b) => b.offsetTop - a.offsetTop);

      let current = "";
      for (const section of validSections) {
        if (scrollPos >= section.offsetTop) {
          current = section.id;
          break;
        }
      }
      
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 pt-5">
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-md rounded-2xl px-5 py-3 border border-neutral-200/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <Link href="/" className="flex items-center gap-2">
            <img src="/loger.png" alt="Tuloong Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl text-teal-800" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>Tuloong</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {["Beranda", "Cara Kerja", "Mitra", "Keamanan", "Donasi"].map((l) => {
              const id = l.toLowerCase().replace(" ", "-");
              const isBeranda = l === "Beranda";
              
              let isActive = false;
              if (pathname === "/") {
                if (isBeranda && activeSection === "") isActive = true;
                if (!isBeranda && activeSection === id) isActive = true;
              } else if (isBeranda) {
                // If on another page, no section is active, Beranda might just act as home link
                isActive = false;
              }

              return (
                <Link 
                  key={l} 
                  href={isBeranda ? "/" : `/#${id}`} 
                  className={`text-[13px] font-medium transition-all ${
                    isActive 
                      ? "text-[#1A5C48] font-bold scale-105" 
                      : "text-neutral-400 hover:text-neutral-900"
                  }`}
                >
                  {l}
                </Link>
              );
            })}
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
