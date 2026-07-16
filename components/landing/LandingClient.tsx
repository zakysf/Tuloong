"use client";

import { useState, useEffect, useRef } from "react";
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

/* ─── Tipe Data Simulasi ──────────────────────────────────────── */
interface MockRequest {
  id: number;
  task: string;
  category: string;
  budget: number;
  time: string;
  status: "matching" | "bids_received" | "hired" | "completed";
  bidsCount: number;
}

interface MockMitraBid {
  name: string;
  role: string;
  rating: number;
  bidPrice: number;
  message: string;
  time: string;
}

const INITIAL_REQUESTS: MockRequest[] = [
  { id: 1, task: "Bantu angkat lemari kayu ke lantai 2", category: "Pertukangan", budget: 60000, time: "2 mnt lalu", status: "bids_received", bidsCount: 4 },
  { id: 2, task: "Bersihkan sisa banjir di garasi", category: "Kebersihan", budget: 85000, time: "5 mnt lalu", status: "hired", bidsCount: 3 },
  { id: 3, task: "Beli & antar obat asma dari Apotek Kimia Farma", category: "Kurir", budget: 25000, time: "10 mnt lalu", status: "completed", bidsCount: 2 },
  { id: 4, task: "Potong dahan pohon mangga rimbun", category: "Kebun", budget: 50000, time: "15 mnt lalu", status: "bids_received", bidsCount: 3 },
];

const NEW_REQUEST_POOL: Omit<MockRequest, "id">[] = [
  { task: "Beli martabak manis & kirim ke Jalan Dago", category: "Kurir", budget: 20000, time: "Baru saja", status: "matching", bidsCount: 0 },
  { task: "Pasang kabel internet & rapikan colokan", category: "Pertukangan", budget: 45000, time: "Baru saja", status: "matching", bidsCount: 0 },
  { task: "Sapu & pel seluruh rumah tipe 36", category: "Kebersihan", budget: 70000, time: "Baru saja", status: "matching", bidsCount: 0 },
  { task: "Bantu belanja sayur mingguan di pasar", category: "Belanja", budget: 35000, time: "Baru saja", status: "matching", bidsCount: 0 },
];

const DEMO_MITRA_OPTIONS: Record<string, MockMitraBid[]> = {
  Kebersihan: [
    { name: "Siti Aminah", role: "Cleaning Specialist", rating: 4.9, bidPrice: 65000, message: "Peralatan lengkap dari saya. Siap datang 15 menit lagi!", time: "1 mnt lalu" },
    { name: "Budi Santoso", role: "Home Cleaner", rating: 4.7, bidPrice: 70000, message: "Biasa ngerapihin kosan & rumah. Dijamin wangi dan kinclong.", time: "Baru saja" }
  ],
  Pertukangan: [
    { name: "Hendra Wijaya", role: "Handyman Profesional", rating: 4.8, bidPrice: 40000, message: "Bawa toolkit lengkap. Biasa benerin listrik dan pompa air.", time: "2 mnt lalu" },
    { name: "Joko Susilo", role: "Spesialis AC & Listrik", rating: 4.9, bidPrice: 45000, message: "Siap bantu beresin kabel atau colokan. Pekerjaan bergaransi.", time: "Baru saja" }
  ],
  Kurir: [
    { name: "Rian Hidayat", role: "Kurir Motor Cepat", rating: 4.9, bidPrice: 18000, message: "Posisi dekat lokasi apotek. Langsung jalan begitu dicall.", time: "Baru saja" },
    { name: "Adi Saputra", role: "Kurir Sameday", rating: 4.6, bidPrice: 20000, message: "Siap meluncur, motor ada box pelindung biar belanjaan aman.", time: "Baru saja" }
  ],
  Default: [
    { name: "Agus Pratama", role: "Mitra Serbabisa", rating: 4.8, bidPrice: 30000, message: "Siap bantu apa saja kebutuhan Anda. Fast response.", time: "Baru saja" }
  ]
};

const SERVICES = [
  { title: "Kebersihan", desc: "Sapu, pel, beresin kamar mandi, hingga bersih-bersih rumah total.", icon: Sparkles, tag: "Paling Laris" },
  { title: "Pertukangan", desc: "AC mati, pipa bocor, pasang rak dinding, servis pompa air.", icon: Zap, tag: "Butuh Ahli" },
  { title: "Kurir", desc: "Kirim barang tertinggal, belikan makanan, atau jemput laundry.", icon: ArrowRight, tag: "Instan" },
  { title: "Kebun", desc: "Potong rumput liar, siram tanaman, rapiin halaman depan.", icon: MapPin, tag: "Mingguan" },
  { title: "Belanja", desc: "Belanja mingguan di pasar, tebus obat, atau titip beli token listrik.", icon: Compass, tag: "Harian" },
  { title: "Custom Jasa", desc: "Punya tugas unik? Tulis saja sendiri budget & deskripsinya.", icon: Briefcase, tag: "Bebas" },
];

export default function LandingClient() {
  // Live Request Ticker State
  const [requests, setRequests] = useState<MockRequest[]>(INITIAL_REQUESTS);
  const nextId = useRef(5);
  const poolIndex = useRef(0);

  // Bidding Simulator State
  const [simCategory, setSimCategory] = useState<string>("Kebersihan");
  const [simBudget, setSimBudget] = useState<number>(75000);
  const [simState, setSimState] = useState<"idle" | "searching" | "showing_bids">("idle");
  const [simBids, setSimBids] = useState<MockMitraBid[]>([]);

  // Ticker Effect (Simulates real-time posts from users)
  useEffect(() => {
    const interval = setInterval(() => {
      const template = NEW_REQUEST_POOL[poolIndex.current];
      const newReq: MockRequest = {
        ...template,
        id: nextId.current,
        budget: template.budget + (Math.random() > 0.5 ? 5000 : -5000),
      };

      setRequests(prev => [newReq, ...prev.slice(0, 3)]);

      // Update internal counters
      nextId.current += 1;
      poolIndex.current = (poolIndex.current + 1) % NEW_REQUEST_POOL.length;

      // Randomly change statuses of older requests after a delay to simulate action
      setTimeout(() => {
        setRequests(current =>
          current.map(r =>
            r.id === newReq.id
              ? { ...r, status: "bids_received", bidsCount: Math.floor(Math.random() * 3) + 1 }
              : r
          )
        );
      }, 2000);

    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Run Simulation Handler
  const startSimulation = () => {
    setSimState("searching");
    setSimBids([]);
    setTimeout(() => {
      const bids = DEMO_MITRA_OPTIONS[simCategory] || DEMO_MITRA_OPTIONS.Default;
      // Adjust prices slightly based on input budget
      const adjustedBids = bids.map(bid => ({
        ...bid,
        bidPrice: Math.round((simBudget * (0.85 + Math.random() * 0.2)) / 1000) * 1000
      }));
      setSimBids(adjustedBids);
      setSimState("showing_bids");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-900 antialiased selection:bg-[#F2632A]/10 selection:text-[#F2632A]">

      {/* BACKGROUND PATTERN */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* NAVBAR */}
      <LandingNavbar />

      {/* ══ HERO SECTION ════════════════════════════════════════════════════ */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative">
        {/* Decorative ambient blobs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#1A5C48]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-60 left-10 w-80 h-80 bg-[#F2632A]/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Creative Title & Intro */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-100 bg-white text-xs font-semibold text-neutral-500 mb-6 shadow-sm w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Beda dari yang lain: Anda yang tentukan budget jasanya
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] text-neutral-950">
              Butuh bantuan?
              <br />
              <span className="bg-gradient-to-r from-[#F2632A] via-amber-600 to-[#1A5C48] bg-clip-text text-transparent">
                Tuloong
              </span>{" "}
              aja langsung.
            </h1>

            <p className="text-neutral-500 text-lg md:text-xl mt-6 leading-relaxed max-w-xl">
              Platform jasa dengan sistem terbalik (*reverse marketplace*). Cukup post tugas Anda, pasang tarif yang Anda mau, lalu pilih Mitra terbaik yang mengajukan penawaran.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/register">
                <Button className="h-13 px-8 rounded-2xl text-sm font-bold bg-[#1A5C48] hover:bg-[#124233] text-white shadow-lg shadow-emerald-950/20 transition-all hover:-translate-y-0.5 cursor-pointer">
                  Mulai Pesan Jasa
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="#cara-kerja">
                <Button variant="ghost" className="h-13 px-6 rounded-2xl text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors">
                  Lihat Cara Kerja
                </Button>
              </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-14 border-t border-neutral-100 pt-8 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="text-3xl font-extrabold text-[#1A5C48]" style={{ fontFamily: "var(--font-heading)" }}>12K+</p>
                <p className="text-xs font-medium text-neutral-400 mt-1">Mitra Aktif</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#F2632A]" style={{ fontFamily: "var(--font-heading)" }}>50K+</p>
                <p className="text-xs font-medium text-neutral-400 mt-1">Tugas Selesai</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-neutral-800" style={{ fontFamily: "var(--font-heading)" }}>4.9</p>
                <p className="text-xs font-medium text-neutral-400 mt-1">Rating Rata-rata</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Request Board Widget */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-5 border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-neutral-950 text-base">Papan Tugas Aktif</h3>
                  <p className="text-xs text-neutral-400">Simulasi postingan pelanggan secara real-time</p>
                </div>
                <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold tracking-wider uppercase animate-pulse">
                  Live Ticker
                </div>
              </div>

              {/* Request List */}
              <div className="space-y-3.5 min-h-[300px]">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl border border-neutral-100/80 bg-neutral-50/50 hover:bg-neutral-50 transition-all duration-300 transform translate-y-0"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-md border border-neutral-200 text-neutral-500 uppercase tracking-wide">
                        {req.category}
                      </span>
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                        <Clock size={12} />
                        {req.time}
                      </span>
                    </div>

                    <p className="text-neutral-800 text-sm font-semibold mt-2 leading-snug">
                      {req.task}
                    </p>

                    <div className="mt-3.5 flex items-center justify-between border-t border-neutral-100/50 pt-2.5">
                      <div>
                        <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">Budget</span>
                        <span className="text-sm font-bold text-[#F2632A]">
                          Rp {req.budget.toLocaleString("id-ID")}
                        </span>
                      </div>

                      <div className="text-right">
                        {req.status === "matching" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                            Mencari Mitra
                          </span>
                        )}
                        {req.status === "bids_received" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg">
                            {req.bidsCount} Bid Masuk
                          </span>
                        )}
                        {req.status === "hired" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                            Mitra Terpilih
                          </span>
                        )}
                        {req.status === "completed" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2 py-1 rounded-lg">
                            <Check size={11} /> Selesai
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Banner */}
              <div className="mt-6 bg-[#1A5C48] rounded-2xl p-4 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-75">Butuh bantuan secepatnya?</p>
                  <p className="text-sm font-bold">Posting tugas Anda sekarang</p>
                </div>
                <Link href="/register">
                  <button className="p-2.5 rounded-xl bg-white text-[#1A5C48] hover:bg-neutral-100 transition-colors">
                    <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CORE VALUE PROPOSITIONS ═════════════════════════════════════════ */}
      <section id="cara-kerja" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-xs font-bold text-[#1A5C48] tracking-widest uppercase mb-2">3 Langkah Cepat</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Bagaimana Tuloong Bekerja?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.n}
                className="bg-white rounded-3xl border border-neutral-200/60 p-8 hover:shadow-lg transition-all duration-300"
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
                className="group bg-white rounded-3xl p-6 border border-neutral-200/60 hover:border-[#1A5C48]/30 transition-all duration-300 cursor-pointer hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-50 group-hover:bg-[#1A5C48]/5 flex items-center justify-center text-neutral-500 group-hover:text-[#1A5C48] transition-all">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 group-hover:bg-amber-100 group-hover:text-amber-800 px-2 py-1 rounded-md transition-all">
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-950 mt-5 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  {s.title}
                </h3>
                <p className="text-neutral-500 text-xs leading-relaxed">
                  {s.desc}
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-[#1A5C48] opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                  Coba Order Jasa <ArrowRight size={13} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ WHY SECURITY & TRANSPARENCY MATTERS ════════════════════════════ */}
      <section id="keamanan" className="py-24 px-6 bg-gradient-to-b from-white to-neutral-50 border-t border-neutral-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold text-[#1A5C48] tracking-widest uppercase bg-[#1A5C48]/5 px-3 py-1 rounded-full">
                Keamanan & Integritas
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                Kepercayaan Adalah Prioritas Utama Kami
              </h2>
              <p className="text-neutral-500 text-sm md:text-base leading-relaxed">
                Tuloong menjamin kenyamanan Anda dalam bertransaksi maupun mempekerjakan Mitra lewat sistem pengawasan ganda yang terintegrasi.
              </p>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200/60 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm">100% Mitra Lolos Verifikasi KTP</h4>
                  <p className="text-neutral-400 text-xs mt-0.5">Semua data identitas dicocokkan secara manual demi menghindari tindak kejahatan.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  title: "Sistem Rekening Bersama (Escrow)",
                  desc: "Dana yang Anda bayar akan ditampung sementara oleh pihak Tuloong. Dana baru akan diteruskan ke rekening Mitra setelah Anda mengonfirmasi pekerjaan telah diselesaikan dengan memuaskan.",
                  icon: DollarSign,
                  badge: "Aman Finansial"
                },
                {
                  title: "Sistem Chat Terenkripsi",
                  desc: "Diskusikan detail tugas secara privat langsung di dalam aplikasi. Chat Anda terlindungi demi kerahasiaan alamat, nomor telepon, dan instruksi pribadi.",
                  icon: Users,
                  badge: "Privasi Terjaga"
                },
                {
                  title: "Sistem Rating Dua Arah",
                  desc: "Baik Pelanggan maupun Mitra saling memberikan review jujur setelah pekerjaan selesai. Ini menjaga ekosistem tetap bersih dari pengguna yang bermasalah.",
                  icon: Star,
                  badge: "Kualitas Ekosistem"
                }
              ].map((point, index) => {
                const Icon = point.icon;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-3xl border border-neutral-200/50 bg-white hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-600 shrink-0">
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-neutral-900 text-sm">{point.title}</h4>
                          <span className="text-[9px] font-bold text-[#1A5C48] bg-[#1A5C48]/5 px-2 py-0.5 rounded-md">
                            {point.badge}
                          </span>
                        </div>
                        <p className="text-neutral-500 text-xs mt-2 leading-relaxed">
                          {point.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ══ MITRA CALL TO ACTION ════════════════════════════════════════════ */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="relative bg-[#1A5C48] rounded-[36px] overflow-hidden p-8 md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,99,42,0.15),transparent_60%)] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold text-emerald-300 tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full">
              Peluang Penghasilan
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-6 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Ingin Menjadi Mitra & Menawarkan Jasa Anda?
            </h2>
            <p className="text-emerald-100/70 text-sm md:text-base mt-4 leading-relaxed">
              Dapatkan akses langsung ke ratusan orderan harian di sekitar tempat tinggal Anda. Tanpa komisi potongan harga yang mencekik. Daftar hari ini, mulai terima uang hari ini juga.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register/mitra">
                <Button className="h-12 px-7 rounded-xl text-xs font-bold bg-white text-[#1A5C48] hover:bg-neutral-100 transition-all cursor-pointer">
                  Daftar Sebagai Mitra
                  <ArrowRight size={14} className="ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="h-12 px-6 rounded-xl text-xs font-bold text-white hover:bg-white/10">
                  Sudah Terdaftar? Masuk
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DONATION & COMMUNITY SUPPORT ════════════════════════════════════ */}
      <section className="py-20 px-6 bg-neutral-50/50 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#F2632A] tracking-widest uppercase bg-[#F2632A]/5 px-3 py-1 rounded-full">
              Dukungan Komunitas
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mt-4 tracking-tight">
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
      <footer className="bg-white border-t border-neutral-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-12 gap-10">

            <div className="md:col-span-4 space-y-4">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1A5C48] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" /><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                  </svg>
                </div>
                <span className="font-extrabold text-lg text-neutral-900" style={{ fontFamily: "var(--font-heading)" }}>Tuloong</span>
              </Link>
              <p className="text-neutral-400 text-xs leading-relaxed max-w-[280px]">
                Reverse marketplace untuk segala jenis jasa suruh-suruh. Adil, aman, dan memprioritaskan kesejahteraan pekerja lokal.
              </p>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-neutral-800 text-xs uppercase tracking-wider mb-4">Layanan</h4>
              <ul className="space-y-2">
                {["Kebersihan", "Pertukangan", "Kurir", "Kebun", "Custom Jasa"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-xs text-neutral-400 hover:text-[#1A5C48] transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="font-bold text-neutral-800 text-xs uppercase tracking-wider mb-4">Tautan</h4>
              <ul className="space-y-2">
                {["Tentang Kami", "Syarat & Ketentuan", "Kebijakan Privasi", "Hubungi Kami"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-xs text-neutral-400 hover:text-[#1A5C48] transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="font-bold text-neutral-800 text-xs uppercase tracking-wider mb-4">Lokasi Aktif</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                DKI Jakarta, Bandung, Surabaya, Yogyakarta, dan Semarang. Segera hadir di kota-kota besar lainnya!
              </p>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-neutral-300 text-xs">
              © {new Date().getFullYear()} Tuloong. Hak cipta dilindungi.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-xs text-neutral-300 hover:text-neutral-500 transition-colors">Privasi</Link>
              <Link href="#" className="text-xs text-neutral-300 hover:text-neutral-500 transition-colors">Syarat Penggunaan</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
