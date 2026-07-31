"use client";


import Link from "next/link";
import Image from "next/image";
import {
  Search, ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle2,
  Users, Compass, Star, MapPin, ChevronRight, Check,
  Briefcase, HandCoins, Play, ArrowUpRight, DollarSign, Clock
} from "lucide-react";
import DonationWidget from "@/components/shared/DonationWidget";
import LandingNavbar from "@/components/shared/LandingNavbar";
import { Button } from "@/components/ui/button";



const SERVICES = [
  { title: "Kebersihan", desc: "Sapu, pel, beresin kamar mandi, hingga bersih-bersih rumah total.", icon: Sparkles, tag: "Paling Laris" },
  { title: "Pertukangan", desc: "AC mati, pipa bocor, pasang rak dinding, servis pompa air.", icon: Zap, tag: "Butuh Ahli" },
  { title: "Kurir", desc: "Kirim barang tertinggal, belikan makanan, atau jemput laundry.", icon: ArrowRight, tag: "Instan" },
  { title: "Kebun", desc: "Potong rumput liar, siram tanaman, rapiin halaman depan.", icon: MapPin, tag: "Mingguan" },
  { title: "Belanja", desc: "Belanja mingguan di pasar, tebus obat, atau titip beli token listrik.", icon: Compass, tag: "Harian" },
  { title: "Custom Jasa", desc: "Punya tugas unik? Tulis saja sendiri budget & deskripsinya.", icon: Briefcase, tag: "Bebas" },
];

export default function LandingClient() {


  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-900 antialiased selection:bg-[#F2632A]/10 selection:text-[#F2632A]">

      {/* ══ HERO & NAVBAR WRAPPER (WAVY BOTTOM) ════════════════════════════ */}
      <div className="relative bg-[#1A5C48] pb-40 md:pb-64 overflow-hidden">
        {/* BACKGROUND PATTERN */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* NAVBAR */}
        <LandingNavbar />

        {/* ══ HERO SECTION ════════════════════════════════════════════════════ */}
        <section className="pt-24 md:pt-32 pb-10 px-6 max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Decorative ambient blobs */}
          <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-[#F2632A]/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-4xl w-full flex flex-col items-center justify-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/10 backdrop-blur-md text-xs font-bold text-white mb-8 shadow-xl w-fit">
              <span className="w-2 h-2 rounded-full bg-[#F2632A] animate-pulse" />
              Beda dari yang lain: Anda yang tentukan budget jasanya
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] md:leading-[1.05] text-white">
              Butuh bantuan? minta{" "}
              <span className="bg-gradient-to-r from-[#F2632A] via-amber-400 to-emerald-300 bg-clip-text text-transparent relative inline-block pb-2">
                Tuloong
              </span>{" "}
              aja.
            </h1>

            <p className="text-emerald-50/80 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl font-medium">
              Platform jasa dengan sistem terbalik (reverse marketplace). Cukup post tugas Anda, pasang tarif yang Anda mau, lalu pilih Mitra terbaik yang mengajukan penawaran.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button className="h-14 px-8 rounded-full text-sm font-semibold bg-[#F2632A] hover:bg-[#d9511d] text-white shadow-xl shadow-[#F2632A]/20 transition-all hover:-translate-y-1 cursor-pointer">
                  Mulai Pesan Jasa
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link href="#cara-kerja">
                <Button variant="ghost" className="h-14 px-6 rounded-full text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                  Lihat Cara Kerja
                </Button>
              </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-16 border-t border-white/10 pt-8 grid grid-cols-3 gap-8 md:gap-16 max-w-2xl w-full">
              <div>
                <p className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>12K+</p>
                <p className="text-xs font-bold text-emerald-200 mt-1 uppercase tracking-wider">Mitra Aktif</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#F2632A]" style={{ fontFamily: "var(--font-heading)" }}>50K+</p>
                <p className="text-xs font-bold text-emerald-200 mt-1 uppercase tracking-wider">Tugas Selesai</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>4.9</p>
                <p className="text-xs font-bold text-emerald-200 mt-1 uppercase tracking-wider">Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Multi-layered Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none">
          <svg className="relative block w-full h-[80px] md:h-[180px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z" className="fill-[#FDFDFD]" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-23.44V120H0Z" className="fill-[#FDFDFD]" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V120H0Z" className="fill-[#FDFDFD]"></path>
          </svg>
        </div>
      </div>

      {/* ══ CORE VALUE PROPOSITIONS ═════════════════════════════════════════ */}
      <section id="cara-kerja" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-semibold text-[#F2632A] tracking-[0.2em] uppercase mb-4 block">
            3 Langkah Cepat
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-tight">
            Bagaimana Tuloong Bekerja?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 items-start">
          {[
            {
              n: "01",
              title: "Tulis Tugas & Pasang Budget",
              desc: "Ceritakan apa yang Anda butuhkan (misal: kurir belanjaan, pasang lampu, bersih-bersih). Pasang harga jasa yang sesuai dengan kantong Anda.",
              icon: Briefcase,
              color: "text-[#F2632A] bg-[#F2632A]/5"
            },
            {
              n: "02",
              title: "Terima & Bandingkan Bid",
              desc: "Mitra-mitra terdekat akan melihat postingan Anda dan menawarkan jasanya. Anda bebas membandingkan harga bid, estimasi waktu, dan reputasi mereka.",
              icon: HandCoins,
              color: "text-[#1A5C48] bg-[#1A5C48]/5"
            },
            {
              n: "03",
              title: "Konfirmasi & Bayar",
              desc: "Mitra datang mengerjakan tugas. Pembayaran Anda ditahan dengan aman oleh sistem Tuloong, dan baru diteruskan ke Mitra saat pekerjaan dikonfirmasi beres.",
              icon: CheckCircle2,
              color: "text-amber-600 bg-amber-50"
            }
          ].map((step, idx) => {
            const Icon = step.icon;
            const isMiddle = idx === 1;
            return (
              <div
                key={step.n}
                className={`bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 ${isMiddle ? 'md:mt-16' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step.color}`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-4xl font-extrabold text-neutral-200 tracking-tighter">
                    {step.n}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  {step.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ DETAILED SERVICES SECTION ═══════════════════════════════════════ */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold text-[#F2632A] tracking-widest uppercase mb-2">Layanan Jasa</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900">
              Apa yang Bisa Kami Bantu?
            </h2>
          </div>
          <Link href="/register/pelanggan" className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-semibold text-neutral-500 hover:text-[#1A5C48] transition-colors">
            Coba buat tugas sekarang <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className={`group bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-neutral-100/50 hover:border-[#1A5C48]/20 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-[1.2rem] bg-neutral-50 group-hover:bg-[#1A5C48]/5 flex items-center justify-center text-neutral-400 group-hover:text-[#1A5C48] transition-all transform group-hover:scale-110 group-hover:rotate-[-5deg] duration-300">
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 group-hover:bg-[#F2632A]/10 group-hover:text-[#F2632A] px-3 py-1.5 rounded-full transition-all tracking-wider uppercase">
                      {s.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-neutral-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    {s.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ MITRA CALL TO ACTION (MODERN MINIMALIST WITH CARDS) ════════════════ */}
      <section id="mitra" className="py-32 px-6 max-w-7xl mx-auto scroll-mt-20 overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-12 items-center">

          {/* Left Content */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-xs font-semibold text-[#F2632A] tracking-[0.2em] uppercase mb-4 block">
              Peluang Baru
            </span>

            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-[1.1] mb-6">
              Punya keahlian? <br />
              <span className="text-[#1A5C48]">Jadikan penghasilan.</span>
            </h2>

            <p className="text-neutral-500 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
              Terima orderan jasa di sekitar Anda, atur jadwal kerja sesuka hati, dan simpan 100% uang Anda tanpa potongan komisi.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link href="/register/mitra">
                <Button className="h-14 px-8 rounded-full text-sm font-semibold bg-neutral-950 hover:bg-neutral-800 text-white transition-all">
                  Daftar Sebagai Mitra
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="h-14 px-6 rounded-full text-sm font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
                  Pelajari Lebih Lanjut
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Area (Staggered Grid Cards) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {[
                { icon: DollarSign, title: "Cair Kapan Saja", desc: "Tarik dana pendapatan instan tanpa tunggu lama.", color: "bg-emerald-50", textCol: "text-emerald-700" },
                { icon: Clock, title: "Waktu Fleksibel", desc: "Atur jam kerja sendiri sesuai ketersediaan Anda.", color: "bg-amber-50", textCol: "text-amber-700" },
                { icon: Users, title: "Bebas Menawar", desc: "Tentukan sendiri harga jasa dan negosiasi.", color: "bg-blue-50", textCol: "text-blue-700" },
                { icon: ShieldCheck, title: "Aman Terpercaya", desc: "Sistem pengawasan memastikan transaksi aman.", color: "bg-purple-50", textCol: "text-purple-700" },
              ].map((item, i) => {
                const Icon = item.icon;
                // Offset the right column for a staggered masonry look on desktop
                const isRightColumn = i % 2 !== 0;
                return (
                  <div
                    key={i}
                    className={`bg-white border border-neutral-100 p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group cursor-default ${isRightColumn ? 'sm:translate-y-8 lg:translate-y-12' : ''}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon size={20} className={item.textCol} />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">{item.title}</h3>
                    <p className="text-neutral-500 leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>


      {/* ══ WHY SECURITY & TRANSPARENCY MATTERS (MODERN MINIMALIST) ════════════ */}
      <section id="keamanan" className="py-32 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left Text Block */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-xs font-semibold text-[#F2632A] tracking-[0.2em] uppercase mb-4 block">
              Keamanan Terpadu
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-[1.15] mb-6">
              Kepercayaan <br />
              <span className="text-neutral-400">Prioritas Utama Kami.</span>
            </h2>
            <p className="text-neutral-500 text-lg leading-relaxed mb-8 max-w-md">
              Tuloong menjamin kenyamanan Anda dalam bertransaksi maupun mempekerjakan Mitra lewat sistem pengawasan ganda yang terintegrasi.
            </p>

            <div className="p-6 rounded-[2rem] bg-neutral-50 border border-neutral-100 flex items-start gap-5">
              <div className="w-12 h-12 bg-emerald-100/50 rounded-2xl flex items-center justify-center text-emerald-700 shrink-0 mt-1">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-neutral-900 mb-1">100% Lolos Verifikasi KTP</h4>
                <p className="text-neutral-500 text-sm leading-relaxed">Semua identitas dicocokkan secara manual demi menghindari tindak kejahatan.</p>
              </div>
            </div>
          </div>

          {/* Right Features List (Clean Minimalist List) */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-8 md:gap-12">
            {[
              {
                title: "Sistem Rekening Bersama (Escrow)",
                desc: "Dana yang Anda bayar akan ditampung sementara oleh pihak Tuloong. Dana baru akan diteruskan ke rekening Mitra setelah Anda mengonfirmasi pekerjaan selesai.",
                icon: DollarSign,
              },
              {
                title: "Sistem Chat Terenkripsi",
                desc: "Diskusikan detail tugas secara privat langsung di dalam aplikasi. Chat Anda terlindungi demi kerahasiaan alamat, nomor telepon, dan instruksi pribadi.",
                icon: Users,
              },
              {
                title: "Sistem Rating Dua Arah",
                desc: "Baik Pelanggan maupun Mitra saling memberikan review jujur setelah pekerjaan selesai. Ini menjaga ekosistem tetap bersih dari pengguna yang bermasalah.",
                icon: Star,
              }
            ].map((point, index) => {
              const Icon = point.icon;
              return (
                <div key={index} className="flex gap-6 md:gap-8 group">
                  <div className="w-16 h-16 rounded-[2rem] bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-900 shrink-0 group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-300">
                    <Icon size={24} />
                  </div>
                  <div className="pt-2">
                    <h4 className="text-xl font-bold text-neutral-900 mb-2">{point.title}</h4>
                    <p className="text-neutral-500 text-base leading-relaxed max-w-lg">
                      {point.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ DONATION & COMMUNITY SUPPORT ════════════════════════════════════ */}
      <section id="donasi" className="py-32 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold text-[#F2632A] tracking-[0.2em] uppercase mb-4 block">
              Dukungan Komunitas
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-950 mt-4 tracking-tight">
              Bantu Tuloong Terus Berkembang
            </h2>
            <p className="text-neutral-500 text-sm mt-2 leading-relaxed">
              Tuloong berkomitmen membantu memperdayakan ekonomi pekerja informal. Kontribusi sukarela Anda membantu operasional tim kami untuk memvalidasi keamanan & mempromosikan Mitra.
            </p>
          </div>

          <DonationWidget />
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-400 text-xs">
            © {new Date().getFullYear()} Tuloong. Hak cipta dilindungi.
          </p>
          <div className="flex gap-6">
            <Link href="/kebijakan-privasi" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">Privasi</Link>
            <Link href="/syarat-ketentuan" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">Syarat Penggunaan</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
