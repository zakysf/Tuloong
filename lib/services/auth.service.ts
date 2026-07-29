/**
 * auth.service.ts
 *
 * Service layer untuk autentikasi.
 * Semua fungsi memanggil endpoint API real (Laravel + Sanctum).
 *
 * Endpoints:
 *   POST /api/register  — register pelanggan & mitra
 *   POST /api/login     — login dengan email + password
 *   POST /api/logout    — invalidate Sanctum token
 *   GET  /api/me        — ambil data user yang sedang login
 */

import api, { saveToken, clearToken } from "@/lib/axios";
import type {
  AuthResponse,
  LoginPayload,
  RegisterMitraPayload,
  RegisterPelangganPayload,
  User,
} from "@/types/auth";
import axios, { AxiosError } from "axios";

// ─── Register Pelanggan ───────────────────────────────────────────────────────

export async function registerPelanggan(
  payload: RegisterPelangganPayload
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/register", payload);

  // Simpan token agar langsung bisa akses endpoint authenticated
  if (data.data?.token) {
    saveToken(data.data.token);
  }

  return data;
}

// ─── Register Mitra ───────────────────────────────────────────────────────────

export async function registerMitra(
  payload: RegisterMitraPayload
): Promise<AuthResponse> {
  // Mitra pakai multipart/form-data karena ada upload foto KTP
  const formData = new FormData();
  (Object.keys(payload) as Array<keyof RegisterMitraPayload>).forEach((key) => {
    const value = payload[key];
    if (value !== undefined && value !== null) {
      formData.append(key, value as string | Blob);
    }
  });

  const { data } = await api.post<AuthResponse>("/api/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Simpan token jika ada
  if (data.data?.token) {
    saveToken(data.data.token);
  }

  return data;
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/login", payload);

  // Simpan Sanctum token ke localStorage
  if (data.data?.token) {
    saveToken(data.data.token);
  }

  return data;
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  try {
    await api.post("/api/logout");
  } finally {
    // Selalu hapus token lokal meski request gagal
    clearToken();
  }
}

// ─── Get Current User ─────────────────────────────────────────────────────────

export async function getMe(): Promise<User> {
  const { data } = await api.get<{ success: boolean; message: string; data: User }>(
    "/api/me"
  );
  return data.data;
}

// ─── Error Helper ─────────────────────────────────────────────────────────────

export function parseApiError(error: unknown): {
  message: string;
  fieldErrors: Record<string, string>;
} {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      success: false;
      message: string;
      errors?: Record<string, string[]>;
    }>;
    const message =
      axiosError.response?.data?.message ?? "Terjadi kesalahan. Coba lagi.";
    const fieldErrors: Record<string, string> = {};
    const rawErrors = axiosError.response?.data?.errors ?? {};
    Object.entries(rawErrors).forEach(([field, msgs]) => {
      fieldErrors[field] = msgs[0] ?? "";
    });
    return { message, fieldErrors };
  }
  return { message: "Terjadi kesalahan jaringan.", fieldErrors: {} };
}
