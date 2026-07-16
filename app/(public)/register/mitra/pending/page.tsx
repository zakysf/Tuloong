import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Menunggu Verifikasi — Tuloong Mitra",
  description: "Akun mitra Anda sedang dalam proses verifikasi oleh tim Tuloong.",
};

export default function MitraPendingPage() {
  return (
    <div
      className="min-h-dvh flex items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #F4F6F5 0%, #C8E6DA 100%)" }}
    >
      <div className="bg-white rounded-3xl soft-shadow-md p-10 max-w-md w-full text-center">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, #1A5C48, #4A9B7F)" }}
        >
          <Clock size={36} className="text-white" />
        </div>

        {/* Heading */}
        <h1
          className="text-2xl font-bold text-neutral-900 mb-2"
          style={{ fontFamily: "var(--font-poppins, Poppins)" }}
        >
          Pendaftaran Berhasil!
        </h1>
        <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
          Akun mitra kamu sedang dalam proses verifikasi oleh tim Tuloong. Biasanya membutuhkan waktu kurang dari{" "}
          <strong className="text-neutral-700">1×24 jam</strong>.
        </p>

        {/* Steps */}
        <div className="flex flex-col gap-3 mb-8 text-left">
          {[
            {
              icon: CheckCircle2,
              color: "#34A853",
              bg: "#E6F7ED",
              label: "Data pendaftaran diterima",
              sub: "Formulir kamu sudah tersimpan di sistem kami.",
            },
            {
              icon: Clock,
              color: "#F59E0B",
              bg: "#FEF3C7",
              label: "Verifikasi KTP sedang diproses",
              sub: "Tim kami sedang memeriksa dokumen identitasmu.",
            },
            {
              icon: Mail,
              color: "#6B7280",
              bg: "#F3F4F6",
              label: "Notifikasi akan dikirim",
              sub: "Kamu akan dihubungi melalui WhatsApp / email.",
            },
          ].map(({ icon: Icon, color, bg, label, sub }) => (
            <div
              key={label}
              className="flex items-start gap-3 p-3.5 rounded-xl"
              style={{ background: bg }}
            >
              <Icon size={18} style={{ color }} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-neutral-800">{label}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Link href="/login">
            <Button
              className="w-full h-11 rounded-xl text-sm font-semibold"
              style={{ background: "#1A5C48" }}
            >
              Masuk ke Akun
            </Button>
          </Link>
          <Link
            href="/"
            className="text-sm text-neutral-400 hover:text-primary transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
