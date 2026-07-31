"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, User, MapPin, Shield, Landmark, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";

import LandingNavbar from "@/components/shared/LandingNavbar";
import AuthSidebar from "@/components/shared/AuthSidebar";
import FormInput from "@/components/shared/FormInput";
import PasswordInput from "@/components/shared/PasswordInput";
import FormSelect from "@/components/shared/FormSelect";
import FormTextarea from "@/components/shared/FormTextarea";
import FileUpload from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { registerMitra, parseApiError } from "@/lib/services/auth.service";
import { useAuth } from "@/components/providers/AuthProvider";
import { PROVINSI_LIST, getKabupatenList, getKecamatanList, BANK_LIST } from "@/lib/data/wilayah";

// ─── Schema ──────────────────────────────────────────────────────────────────
// Field names match BE (Laravel) naming convention

const schema = z
  .object({
    nama: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    nomor_telepon: z
      .string()
      .min(1, "Nomor telepon wajib diisi")
      .regex(/^08[0-9]{8,11}$/, "Format: 08xxxxxxxxxx (10–13 digit)"),
    nomor_ktp: z
      .string()
      .length(16, "NIK harus 16 digit")
      .regex(/^[0-9]+$/, "NIK hanya boleh angka"),
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    password_confirmation: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
    deskripsi_keahlian: z.string().min(20, "Deskripsi keahlian minimal 20 karakter"),
    provinsi: z.string().min(1, "Pilih provinsi"),
    kabupaten: z.string().min(1, "Pilih kabupaten/kota"),
    kecamatan: z.string().min(1, "Pilih kecamatan"),
    nama_bank: z.string().min(1, "Pilih nama bank"),
    nomor_rekening: z
      .string()
      .min(6, "Nomor rekening minimal 6 digit")
      .regex(/^[0-9]+$/, "Nomor rekening hanya angka"),
    nama_pemilik_rekening: z.string().min(3, "Nama pemilik rekening minimal 3 karakter"),
    agree: z.literal(true, { message: "Kamu harus menyetujui syarat & ketentuan" }),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Kata sandi tidak cocok",
    path: ["password_confirmation"],
  });

type FormData = z.infer<typeof schema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterMitraPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [ktpError, setKtpError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      provinsi: "",
      kabupaten: "",
      kecamatan: "",
      nama_bank: "",
    },
  });

  const provinsi = watch("provinsi");
  const kabupaten = watch("kabupaten");
  const agreeValue = watch("agree");

  const kabupatenList = getKabupatenList(provinsi);
  const kecamatanList = getKecamatanList(provinsi, kabupaten);

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setFieldErrors({});

    if (!ktpFile) {
      setKtpError("Foto KTP wajib diunggah");
      return;
    }
    setKtpError(null);

    try {
      await registerMitra({
        nama: data.nama,
        email: data.email,
        nomor_telepon: data.nomor_telepon,
        password: data.password,
        password_confirmation: data.password_confirmation,
        nomor_ktp: data.nomor_ktp,
        foto_ktp: ktpFile,
        deskripsi_keahlian: data.deskripsi_keahlian,
        provinsi: data.provinsi,
        kabupaten: data.kabupaten,
        kecamatan: data.kecamatan,
        nama_bank: data.nama_bank,
        nomor_rekening: data.nomor_rekening,
        nama_pemilik_rekening: data.nama_pemilik_rekening,
        role: "mitra",
      });
      await refreshUser();
      toast.success("Registrasi Mitra berhasil!", {
        description: "Silakan cek kotak masuk email Anda untuk verifikasi.",
        duration: 5000,
      });
      router.push("/register/mitra/pending");
    } catch (err) {
      const { message, fieldErrors: fe } = parseApiError(err);
      setServerError(message);
      setFieldErrors(fe);
    }
  };

  const SectionHeading = ({
    icon: Icon,
    title,
  }: {
    icon: React.ElementType;
    title: string;
  }) => (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={16} className="text-neutral-500" />
      <h3
        className="text-base font-semibold text-neutral-800"
        style={{ fontFamily: "var(--font-poppins, Poppins)" }}
      >
        {title}
      </h3>
    </div>
  );

  return (
    <>
      <LandingNavbar />
      <div className="min-h-dvh bg-neutral-50 flex items-center justify-center p-4 pt-24 pb-10">
      <div className="w-full max-w-5xl grid md:grid-cols-[300px_1fr] rounded-3xl overflow-hidden soft-shadow-md md:h-[85vh] md:max-h-[800px] bg-white">
        {/* Left Panel */}
        <AuthSidebar variant="mitra" />

        {/* Right Panel */}
        <div className="bg-white px-8 py-10 md:h-full md:overflow-y-auto">
          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-5 md:hidden">
              <img src="/loger.png" alt="Tuloong Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg" style={{ fontFamily: "var(--font-poppins, Poppins)", color: "#1A5C48" }}>Tuloong <span className="text-xs font-semibold bg-neutral-100 px-2 py-0.5 rounded-full">Mitra</span></span>
            </div>

            <h2 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>
              Buat akun Mitra
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Pending info banner */}
          <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-warning-light border border-warning/20">
            <AlertCircle size={15} className="text-warning mt-0.5 shrink-0" />
            <p className="text-xs text-warning font-medium leading-relaxed">
              Akun mitra berstatus pending sampai tim kami verifikasi KTP-mu, biasanya kurang dari 1×24 jam.
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mb-5 p-3 rounded-xl bg-danger-light border border-danger/20 text-sm text-danger font-medium">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
            {/* ── Informasi Pribadi ──────────────────────────────────────────── */}
            <section>
              <SectionHeading icon={User} title="Informasi Pribadi" />

              <div className="flex flex-col gap-3">
                <FormInput
                  label="Nama lengkap"
                  placeholder="Sesuai KTP"
                  error={errors.nama?.message ?? fieldErrors.nama}
                  {...register("nama")}
                />

                <FormInput
                  label="Email"
                  type="email"
                  placeholder="contoh: budi@gmail.com"
                  error={errors.email?.message ?? fieldErrors.email}
                  {...register("email")}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    label="Nomor Telepon"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    error={errors.nomor_telepon?.message ?? fieldErrors.nomor_telepon}
                    {...register("nomor_telepon")}
                  />
                  <FormInput
                    label="No KTP"
                    placeholder="16 Digit NIK"
                    maxLength={16}
                    error={errors.nomor_ktp?.message ?? fieldErrors.nomor_ktp}
                    {...register("nomor_ktp")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <PasswordInput
                    label="Kata Sandi"
                    placeholder="Minimal 8 Karakter"
                    error={errors.password?.message ?? fieldErrors.password}
                    {...register("password")}
                  />
                  <PasswordInput
                    label="Konfirmasi Kata Sandi"
                    placeholder="Minimal 8 karakter"
                    error={errors.password_confirmation?.message}
                    {...register("password_confirmation")}
                  />
                </div>
              </div>
            </section>

            {/* ── Verifikasi Identitas ───────────────────────────────────────── */}
            <section>
              <SectionHeading icon={Shield} title="Verifikasi Identitas" />

              <div className="flex flex-col gap-3">
                <p className="text-xs text-neutral-500 -mt-1">
                  Foto KTP — disimpan aman, hanya untuk verifikasi admin
                </p>

                <FileUpload
                  label="Unggah foto KTP"
                  onChange={setKtpFile}
                  error={ktpError ?? undefined}
                />

                {/* KTP hint */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-warning-light border border-warning/20">
                  <Info size={14} className="text-warning mt-0.5 shrink-0" />
                  <p className="text-xs text-warning font-medium leading-relaxed">
                    Pastikan foto KTP terlihat jelas, tidak blur, dan tidak terpotong untuk mempercepat proses verifikasi.
                  </p>
                </div>
              </div>
            </section>

            {/* ── Wilayah + Keahlian (2 kolom pada md+) ────────────────────── */}
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              {/* Wilayah */}
              <section className="flex flex-col">
                <SectionHeading icon={MapPin} title="Wilayah Operasional" />

                <div className="flex flex-col gap-3">
                  <FormSelect
                    label="Provinsi"
                    placeholder="Pilih Provinsi"
                    options={PROVINSI_LIST}
                    value={provinsi}
                    onChange={(v) => {
                      setValue("provinsi", v, { shouldValidate: true });
                      setValue("kabupaten", "");
                      setValue("kecamatan", "");
                    }}
                    error={errors.provinsi?.message ?? fieldErrors.provinsi}
                  />
                  <FormSelect
                    label="Kabupaten"
                    placeholder="Pilih Kabupaten"
                    options={kabupatenList}
                    value={kabupaten}
                    onChange={(v) => {
                      setValue("kabupaten", v, { shouldValidate: true });
                      setValue("kecamatan", "");
                    }}
                    error={errors.kabupaten?.message ?? fieldErrors.kabupaten}
                    disabled={!provinsi}
                  />
                  <FormSelect
                    label="Kecamatan"
                    placeholder="Pilih Kecamatan"
                    options={kecamatanList}
                    value={watch("kecamatan")}
                    onChange={(v) => setValue("kecamatan", v, { shouldValidate: true })}
                    error={errors.kecamatan?.message ?? fieldErrors.kecamatan}
                    disabled={!kabupaten}
                  />
                </div>
              </section>

              {/* Keahlian */}
              <section className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                  <h3 className="text-base font-semibold text-neutral-800" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>
                    Keahlian & Pengalaman
                  </h3>
                </div>
                <FormTextarea
                  label="Deskripsi keahlian"
                  placeholder="Contoh: bisa perbaikan ringan rumah tangga, antar-jemput barang, bersih-bersih..."
                  wrapperClassName="flex-grow flex flex-col justify-between"
                  className="flex-grow h-full min-h-[146px]"
                  error={errors.deskripsi_keahlian?.message ?? fieldErrors.deskripsi_keahlian}
                  {...register("deskripsi_keahlian")}
                />
              </section>
            </div>

            {/* ── Informasi Rekening Bank ────────────────────────────────────── */}
            <section>
              <SectionHeading icon={Landmark} title="Informasi Rekening Bank" />

              <div className="grid grid-cols-3 gap-3">
                <FormSelect
                  label="Nama Bank"
                  placeholder="Pilih Bank"
                  options={BANK_LIST}
                  value={watch("nama_bank")}
                  onChange={(v) => setValue("nama_bank", v, { shouldValidate: true })}
                  error={errors.nama_bank?.message ?? fieldErrors.nama_bank}
                />
                <FormInput
                  label="Nomor Rekening"
                  placeholder="Nomor Rekening"
                  error={errors.nomor_rekening?.message ?? fieldErrors.nomor_rekening}
                  {...register("nomor_rekening")}
                />
                <FormInput
                  label="Nama Pemilik Rekening"
                  placeholder="Nama sesuai buku tabungan"
                  error={errors.nama_pemilik_rekening?.message ?? fieldErrors.nama_pemilik_rekening}
                  {...register("nama_pemilik_rekening")}
                />
              </div>

              {/* Bank hint */}
              <div className="mt-3 flex items-start gap-2.5 p-3 rounded-xl bg-warning-light border border-warning/20">
                <Info size={14} className="text-warning mt-0.5 shrink-0" />
                <p className="text-xs text-warning font-medium">
                  Data rekening digunakan untuk pencairan penghasilan Anda.
                </p>
              </div>
            </section>

            {/* ── Agreement ─────────────────────────────────────────────────── */}
            <div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="agree-mitra"
                  checked={agreeValue === true}
                  onCheckedChange={(checked) => {
                    setValue("agree", checked === true ? true : (undefined as unknown as true), {
                      shouldValidate: true,
                    });
                  }}
                  className="mt-0.5 rounded border-neutral-300 data-[state=checked]:bg-brand-teal data-[state=checked]:border-brand-teal"
                />
                <Label
                  htmlFor="agree-mitra"
                  className="text-sm text-neutral-600 leading-relaxed cursor-pointer"
                >
                  Saya setuju dengan{" "}
                  <Link href="/syarat-ketentuan" className="text-primary font-medium hover:underline">
                    Syarat & Ketentuan Mitra
                  </Link>{" "}
                  dan{" "}
                  <Link href="/kebijakan-privasi" className="text-primary font-medium hover:underline">
                    Kebijakan Privasi
                  </Link>{" "}
                  Tuloong.
                </Label>
              </div>
              {errors.agree && (
                <p className="text-xs text-danger font-medium mt-1.5">{errors.agree.message}</p>
              )}
            </div>

            {/* ── Submit ────────────────────────────────────────────────────── */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-xl text-sm font-semibold w-full"
              style={{ background: "#1A5C48" }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Mendaftarkan...
                </>
              ) : (
                "Daftar sebagai Mitra"
              )}
            </Button>
          </form>


        </div>
      </div>
      </div>
    </>
  );
}
