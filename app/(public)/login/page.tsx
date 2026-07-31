"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import LandingNavbar from "@/components/shared/LandingNavbar";
import AuthSidebar from "@/components/shared/AuthSidebar";
import FormInput from "@/components/shared/FormInput";
import PasswordInput from "@/components/shared/PasswordInput";
import { Button } from "@/components/ui/button";
import { login, parseApiError } from "@/lib/services/auth.service";
import { useAuth } from "@/components/providers/AuthProvider";

// ─── Schema ──────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Kata sandi minimal 8 karakter"),
});

type LoginForm = z.infer<typeof loginSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    try {
      const res = await login(data);
      await refreshUser(); // Update AuthContext state
      // Redirect berdasarkan role user
      const redirectMap: Record<string, string> = {
        pelanggan: "/pelanggan",
        mitra: "/mitra",
        admin: "/admin",
      };
      router.push(redirectMap[res.data.user.role] ?? "/");
    } catch (err) {
      const { message } = parseApiError(err);
      setServerError(message);
    }
  };

  return (
    <>
      <LandingNavbar />
      <div className="min-h-dvh bg-neutral-50 flex items-center justify-center p-4 pt-24">
      <div
        className="w-full max-w-4xl grid md:grid-cols-[300px_1fr] rounded-3xl overflow-hidden soft-shadow-md md:h-[75vh] md:max-h-[620px] bg-white"
        style={{ minHeight: 480 }}
      >
        {/* Left Panel */}
        <AuthSidebar variant="pelanggan" />

        {/* Right Panel */}
        <div className="bg-white px-8 py-10 flex flex-col justify-center md:h-full md:overflow-y-auto">
          <div className="max-w-sm w-full mx-auto">
            {/* Header */}
            <div className="mb-8">
              {/* Mobile logo */}
              <div className="flex items-center gap-2 mb-6 md:hidden">
                <img src="/loger.png" alt="Tuloong Logo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-lg" style={{ fontFamily: "var(--font-poppins, Poppins)", color: "#1A5C48" }}>
                  Tuloong
                </span>
              </div>

              <h2 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>
                Masuk
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Belum punya akun?{" "}
                <Link href="/register/pelanggan" className="text-primary font-medium hover:underline">
                  Daftar sekarang
                </Link>
              </p>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="mb-4 p-3 rounded-xl bg-danger-light border border-danger/20 text-sm text-danger font-medium">
                {serverError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
              <FormInput
                label="Email"
                type="email"
                placeholder="contoh: budi@gmail.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <PasswordInput
                label="Kata Sandi"
                placeholder="Minimal 8 karakter"
                error={errors.password?.message}
                {...register("password")}
              />

              <div className="flex justify-end -mt-1">
                <Link
                  href="/forgot-password"
                  className="text-xs text-neutral-400 hover:text-primary transition-colors"
                >
                  Lupa kata sandi?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 rounded-full text-sm font-semibold mt-1 w-full"
                style={{ background: "#1A5C48" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>



            {/* Register links */}
            <p className="text-center text-xs text-neutral-400 mt-6">
              Daftar sebagai{" "}
              <Link href="/register/mitra" className="text-primary font-medium hover:underline">
                Mitra
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
