"use client";

import Image from "next/image";
import Link from "next/link";

interface AuthSidebarProps {
  variant?: "pelanggan" | "mitra";
}

export default function AuthSidebar({ variant = "pelanggan" }: AuthSidebarProps) {
  const tagline =
    variant === "mitra"
      ? "Gabung, dan mulai saling bantu hari ini."
      : "Gabung, dan cari bantuanmu di sini.";

  return (
    <div
      className="relative hidden md:flex flex-col justify-between p-8 overflow-hidden"
      style={{ backgroundColor: "#2e745c" }} // A bit lighter green based on image
    >
      {/* Logo */}
      <div>
        <div className="flex items-center gap-2 mb-10">
          <img src="/loger.png" alt="Tuloong Logo" className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-xl" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>
            Tuloong
            {variant === "mitra" && (
              <span className="ml-1.5 text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full align-middle">
                Mitra
              </span>
            )}
          </span>
        </div>

        {/* Tagline */}
        <h1
          className="text-white font-extrabold text-3xl leading-tight mb-4"
          style={{ fontFamily: "var(--font-poppins, Poppins)" }}
        >
          {tagline}
        </h1>

        <p className="text-white/75 text-sm leading-relaxed max-w-xs">
          Ribuan warga dan mitra sudah pakai Tuloong buat urusan sehari-hari.
        </p>
      </div>

      {/* Decorative mountain triangles */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none">
        {/* Back mountain */}
        <svg
          viewBox="0 0 400 160"
          className="absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
        >
          <polygon points="0,160 200,30 400,160" fill="rgba(255,255,255,0.07)" />
        </svg>
        {/* Front mountain left */}
        <svg
          viewBox="0 0 400 160"
          className="absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
        >
          <polygon points="-20,160 130,60 260,160" fill="rgba(255,255,255,0.10)" />
        </svg>
        {/* Front mountain right */}
        <svg
          viewBox="0 0 400 160"
          className="absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
        >
          <polygon points="140,160 280,70 420,160" fill="rgba(255,255,255,0.08)" />
        </svg>
      </div>

      {/* Decorative blob */}
      <div
        className="absolute top-1/2 -right-16 w-48 h-48 rounded-full opacity-10 pointer-events-none"
        style={{ background: "rgba(255,255,255,0.3)", filter: "blur(32px)" }}
      />
    </div>
  );
}
