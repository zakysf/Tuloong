"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import LandingNavbar from "@/components/shared/LandingNavbar";
import AuthSidebar from "@/components/shared/AuthSidebar";
import PasswordInput from "@/components/shared/PasswordInput";
import { Button } from "@/components/ui/button";
import { resetPassword, parseApiError } from "@/lib/services/auth.service";

// ─── Schema ──────────────────────────────────────────────────────────────────

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    password_confirmation: z.string().min(8, "Konfirmasi sandi minimal 8 karakter"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Kata sandi tidak cocok",
    path: ["password_confirmation"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (values: ResetPasswordForm) => {
    setServerError(null);

    if (!token || !email) {
      setServerError("Token atau email tidak valid. Silakan minta link reset baru.");
      return;
    }

    try {
      await resetPassword({
        token,
        email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });

      alert("Kata sandi berhasil diatur ulang! Silakan masuk dengan sandi baru Anda.");
      router.push("/login");
    } catch (err) {
      const { message } = parseApiError(err);
      setServerError(message);
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 mb-2">
          Buat Sandi Baru
        </h1>
        <p className="text-sm text-neutral-500">
          Masukkan kata sandi baru untuk akun {email}.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50/50 border border-red-100 text-red-600 text-sm animate-in fade-in">
          {serverError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-5">
          <PasswordInput
            label="Kata Sandi Baru"
            placeholder="Minimal 8 karakter"
            {...register("password")}
            error={errors.password?.message}
          />
          <PasswordInput
            label="Konfirmasi Kata Sandi Baru"
            placeholder="Masukkan ulang kata sandi"
            {...register("password_confirmation")}
            error={errors.password_confirmation?.message}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-full text-white font-semibold transition-all shadow-sm flex items-center justify-center group"
          style={{ background: "#1A5C48" }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Kata Sandi"
          )}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <LandingNavbar />
      <div className="min-h-dvh bg-neutral-50 flex items-center justify-center p-4 pt-24">
      <div
        className="w-full max-w-4xl grid md:grid-cols-[300px_1fr] rounded-3xl overflow-hidden soft-shadow-md md:h-[75vh] md:max-h-[620px] bg-white"
        style={{ minHeight: 480 }}
      >
        {/* Left Panel */}
        <AuthSidebar />

        {/* Right Panel */}
        <div className="bg-white px-8 py-10 flex flex-col justify-center md:h-full md:overflow-y-auto">
          <div className="max-w-sm w-full mx-auto">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />}>
              <ResetPasswordFormContent />
            </Suspense>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
