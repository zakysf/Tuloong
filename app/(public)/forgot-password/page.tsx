"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import LandingNavbar from "@/components/shared/LandingNavbar";
import AuthSidebar from "@/components/shared/AuthSidebar";
import FormInput from "@/components/shared/FormInput";
import { Button } from "@/components/ui/button";
import { sendPasswordResetLink, parseApiError } from "@/lib/services/auth.service";

// ─── Schema ──────────────────────────────────────────────────────────────────

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordForm) => {
    setServerError(null);
    setSuccessMessage(null);
    try {
      const res = await sendPasswordResetLink(values.email);
      setSuccessMessage(res.message || "Link reset password telah dikirim ke email Anda.");
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
        <AuthSidebar />

        {/* Right Panel */}
        <div className="bg-white px-8 py-10 flex flex-col justify-center md:h-full md:overflow-y-auto">
          <div className="max-w-sm w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-neutral-900 mb-2" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>
                Lupa Kata Sandi
              </h1>
              <p className="text-sm text-neutral-500">
                Masukkan email yang terdaftar untuk menerima link pengaturan ulang kata sandi.
              </p>
            </div>

            {serverError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50/50 border border-red-100 text-red-600 text-sm animate-in fade-in">
                {serverError}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-green-50/50 border border-green-100 text-green-600 text-sm animate-in fade-in">
                {successMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="cth: fulan@example.com"
                  {...register("email")}
                  error={errors.email?.message}
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
                    Mengirim...
                  </>
                ) : (
                  "Kirim Link Reset"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
              <p className="text-sm text-neutral-500">
                Ingat kata sandi Anda?{" "}
                <Link
                  href="/login"
                  className="font-medium hover:underline text-primary"
                >
                  Masuk
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
