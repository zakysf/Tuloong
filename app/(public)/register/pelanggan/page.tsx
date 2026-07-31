"use client";

import { useState, useEffect } from "react";
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
import {
  getProvinces,
  getRegencies,
  getDistricts,
  type WilayahOption,
} from "@/lib/services/wilayah.service";

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

  const [provinces, setProvinces] = useState<WilayahOption[]>([]);
  const [regencies, setRegencies] = useState<WilayahOption[]>([]);
  const [districts, setDistricts] = useState<WilayahOption[]>([]);

  const [provId, setProvId] = useState("");
  const [regId, setRegId] = useState("");
  const [distId, setDistId] = useState("");

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

  const agreeValue = watch("agree");

  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  const handleProvChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex]?.text || "";
    setProvId(id);
    setRegId("");
    setDistId("");
    setDistricts([]);
    setValue("provinsi", name, { shouldValidate: true });
    setValue("kabupaten", "");
    setValue("kecamatan", "");
    if (id) {
      const data = await getRegencies(id);
      setRegencies(data);
    } else {
      setRegencies([]);
    }
  };

  const handleRegChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex]?.text || "";
    setRegId(id);
    setDistId("");
    setValue("kabupaten", name, { shouldValidate: true });
    setValue("kecamatan", "");
    if (id) {
      const data = await getDistricts(id);
      setDistricts(data);
    } else {
      setDistricts([]);
    }
  };

  const handleDistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex]?.text || "";
    setDistId(id);
    setValue("kecamatan", name, { shouldValidate: true });
  };

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
                    placeholder="contoh: justin@gmail.com"
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
                  <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-neutral-700">Provinsi</label>
                  <select
                    value={provId}
                    onChange={handleProvChange}
                    className="h-11 rounded-xl border border-neutral-200 bg-white px-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-150"
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {errors.provinsi?.message && <p className="text-xs text-danger font-medium">{errors.provinsi.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-neutral-700">Kabupaten</label>
                  <select
                    value={regId}
                    onChange={handleRegChange}
                    disabled={!provId}
                    className="h-11 rounded-xl border border-neutral-200 bg-white px-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Pilih Kabupaten</option>
                    {regencies.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                  {errors.kabupaten?.message && <p className="text-xs text-danger font-medium">{errors.kabupaten.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-neutral-700">Kecamatan</label>
                  <select
                    value={distId}
                    onChange={handleDistChange}
                    disabled={!regId}
                    className="h-11 rounded-xl border border-neutral-200 bg-white px-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Pilih Kecamatan</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  {errors.kecamatan?.message && <p className="text-xs text-danger font-medium">{errors.kecamatan.message}</p>}
                </div>
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
