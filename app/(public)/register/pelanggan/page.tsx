"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, User, MapPin } from "lucide-react";
import { toast } from "sonner";

import LandingNavbar from "@/components/shared/LandingNavbar";
import AuthSidebar from "@/components/shared/AuthSidebar";
import FormInput from "@/components/shared/FormInput";
import PasswordInput from "@/components/shared/PasswordInput";
import FormSelect from "@/components/shared/FormSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { registerPelanggan, parseApiError } from "@/lib/services/auth.service";
import { useAuth } from "@/components/providers/AuthProvider";
import { PROVINSI_LIST, getKabupatenList, getKecamatanList } from "@/lib/data/wilayah";

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
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    password_confirmation: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
    provinsi: z.string().min(1, "Pilih provinsi"),
    kabupaten: z.string().min(1, "Pilih kabupaten/kota"),
    kecamatan: z.string().min(1, "Pilih kecamatan"),
    agree: z.literal(true, { message: "Kamu harus menyetujui syarat & ketentuan" }),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Kata sandi tidak cocok",
    path: ["password_confirmation"],
  });

type FormData = z.infer<typeof schema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterPelangganPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    try {
      await registerPelanggan({
        nama: data.nama,
        email: data.email,
        nomor_telepon: data.nomor_telepon,
        password: data.password,
        password_confirmation: data.password_confirmation,
        provinsi: data.provinsi,
        kabupaten: data.kabupaten,
        kecamatan: data.kecamatan,
        role: "pelanggan",
      });
      await refreshUser();
      toast.success("Registrasi berhasil!", {
        description: "Silakan cek kotak masuk email Anda untuk verifikasi.",
        duration: 5000,
      });
      router.push("/login");
    } catch (err) {
      const { message, fieldErrors: fe } = parseApiError(err);
      setServerError(message);
      setFieldErrors(fe);
    }
  };

  return (
    <>
      <LandingNavbar />
      <div className="min-h-dvh bg-neutral-50 flex items-center justify-center p-4 pt-24 pb-10">
      <div className="w-full max-w-5xl grid md:grid-cols-[300px_1fr] rounded-3xl overflow-hidden soft-shadow-md md:h-[85vh] md:max-h-[800px] bg-white">
        {/* Left Panel */}
        <AuthSidebar variant="pelanggan" />

        {/* Right Panel */}
        <div className="bg-white px-8 py-10 md:h-full md:overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-5 md:hidden">
              <img src="/loger.png" alt="Tuloong Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg" style={{ fontFamily: "var(--font-poppins, Poppins)", color: "#1A5C48" }}>Tuloong</span>
            </div>

            <h2 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>
              Buat akun
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mb-5 p-3 rounded-xl bg-danger-light border border-danger/20 text-sm text-danger font-medium">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
            {/* ── Section: Informasi Pribadi ─────────────────────────────────── */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <User size={16} className="text-neutral-500" />
                <h3 className="text-base font-semibold text-neutral-800" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>
                  Informasi Pribadi
                </h3>
              </div>

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

                <FormInput
                  label="Nomor Telepon"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  error={errors.nomor_telepon?.message ?? fieldErrors.nomor_telepon}
                  {...register("nomor_telepon")}
                />

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

            {/* ── Section: Wilayah Operasional ──────────────────────────────── */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-neutral-500" />
                <h3 className="text-base font-semibold text-neutral-800" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>
                  Wilayah Operasional
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

            {/* ── Agreement ─────────────────────────────────────────────────── */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="agree"
                checked={agreeValue === true}
                onCheckedChange={(checked) => {
                  setValue("agree", checked === true ? true : (undefined as unknown as true), {
                    shouldValidate: true,
                  });
                }}
                className="mt-0.5 rounded border-neutral-300 data-[state=checked]:bg-brand-teal data-[state=checked]:border-brand-teal"
              />
              <Label
                htmlFor="agree"
                className="text-sm text-neutral-600 leading-relaxed cursor-pointer"
              >
                Saya setuju dengan{" "}
                <Link href="/syarat-ketentuan" className="text-primary font-medium hover:underline">
                  Syarat & Ketentuan
                </Link>{" "}
                dan{" "}
                <Link href="/kebijakan-privasi" className="text-primary font-medium hover:underline">
                  Kebijakan Privasi
                </Link>{" "}
                Tuloong.
              </Label>
            </div>
            {errors.agree && (
              <p className="text-xs text-danger font-medium -mt-4">{errors.agree.message}</p>
            )}

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
                "Daftar"
              )}
            </Button>
          </form>


        </div>
      </div>
      </div>
    </>
  );
}
