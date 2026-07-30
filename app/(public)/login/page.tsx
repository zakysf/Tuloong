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
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#1A5C48" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
                    <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/>
                    <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/>
                    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
                  </svg>
                </div>
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

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-xs text-neutral-400">atau masuk dengan</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            {/* Google */}
            <Button
              type="button"
              variant="outline"
              disabled
              title="Fitur belum tersedia"
              className="w-full h-11 rounded-full border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <svg className="mr-2" width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Google
            </Button>

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
